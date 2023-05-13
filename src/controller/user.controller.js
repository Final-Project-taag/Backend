import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import md5 from 'md5';

import * as UserModel from "../model/user.model.js";
import { rolesEnum } from '../model/role.model.js';
import * as MailService from '../service/mail.service.js';


// Controller Funktion zum Anlegen neuer User
export async function registerNewUser(req, res) {
    let body = req.body;

    // Ueberschreibe password-Property im body mit dem Hash des Passworts
    body.password = bcrypt.hashSync(body.password, 10);

    // Erstelle MD5 Hash der Email Adresse mit Salt und fuege sie dem Body hinzu
    const salt = await bcrypt.genSalt(10);
    body.emailHash = md5(body.email + salt);

    try {
        // Fuehre Model-Funktion zum Einfuegen eines neuen Users aus
        const user = await UserModel.insertNewUser(body);

        // Versende Verifikations Mail
        try {
            MailService.sendVerificationMail(user.email, user.emailHash);

        } catch (error) {
            console.log(error);
        }

        // Sende Erfolgsmeldung zurueck
        res.send({success: true});

    } catch (error) {
        console.log(error);
        // TODO verfeinern, weil es unterschiedliche Fehler geben kann: 400 & 409
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}

// Controller Funktion zum Einloggen bestehender User
export async function login(req, res) {
    // extrahiere Properties aus dem body
    let { username, password } = req.body;

    // Hole entsprechenden User per username aus der DB
    let user = await UserModel.findUserByUsername(username);

    // Wenn user nicht gefunden wurde
    if (user === null) {
        // Sende 401 (UNAUTHORIZED) mit Nachricht
        res.status(401).send({
            success: false,
            message: 'Incorrect username or password'
        });
        // early return
        return;
    }

    // Vergleiche uebermitteltes password mit dem gehashten password aus der DB
    if (bcrypt.compareSync(password, user.password)) {
        // Pruefe, ob User noch als unverifiziert gilt und schmeisse ggf. Fehler (Kein Login)
        if (user.role.name === rolesEnum.unverified) {
            res.status(403).send({
                success: false,
                message: 'Please verify your email first'
            });
            // early return
            return;
        }

        // Erstelle neuen JWT Token mit payload und Verfall nach einer Stunde (60 Minuten * 60 Sekunden)
        let token = jwt.sign({ userId: user._id, username: user.username, email: user.email, role: user.role.name }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        // Sende Erfolgsnachricht sowie neuen Token zurueck
        res.send({
            success: true,
            message: `User ${user.username} logged in successfully!`,
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role.name,
            token: token
        });

    } else {
        // Passwort falsch -> Sende Fehlermeldung zurueck
        res.status(401).send({
            success: false,
            message: 'Incorrect username or password'
        });
    }
}

// Controller Funktion zum Verifizieren der Email-Adresse des Users
export async function verifyEmail(req, res) {
    // Extrahiere Email-Token aus query Parametern
    const emailToken = req.body.token;

    // Finde User Eintrag anhand des Email-Tokens
    const user = await UserModel.getByEmailHash(emailToken);

    // Datumsobjekt fuer JETZT
    const now = new Date();

    // Wenn kein User gefunden ODER letztes Update des Eintrags laenger als 10 Minuten her
    if (user === null || (now - user.updatedAt > (10 * 30 * 1000))) {
        
        // Redirect auf entsprechende Frontend-Page
        // res.redirect('https://bing.com');
        res.status(401).send({
            redirectTo: 'http://localhost:5173/login', // ?????
            message: 'E-Mail verification token invalid'
        });
        // Early return
        return;
    }

    // Alles ok

    // Setze User-Rolle auf "user" (also ist verifiziert)
    const verifiedUser = await UserModel.setVerified(user._id);
    
    // Redirect auf entsprechende Frontend-Page
    // res.redirect('https://google.de');
    res.send({
        redirectTo: 'http://localhost:5173/auth/login',
        message: 'Thank you for verifying your e-mail address'
    });
}

// Controller Funktion zum Erneuern des Verifikations Token und versenden einer neuen Email
export async function refreshNewVerification(req, res) {
    // Extrahiere Email aus dem Request-Body
    const { email } = req.body;

    // Erstelle MD5 Hash der Email Adresse mit Salt und fuege sie dem Body hinzu
    const salt = await bcrypt.genSalt(10);
    const newHash = md5(email + salt);

    try {
        // Erneuere den Email-Hash im Eintrag des Users
        await UserModel.updateEmailHash(email, newHash);

        // Versende Verifikations Mail
        MailService.sendVerificationMail(email, newHash);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: error.message
        });
        return;
    }

    // Sende Erfolgsnachricht, egal ob User gefunden wurde oder nicht
    res.send({
        success: true,
        message: 'Verification E-Mail has been sent'
    });
}

export async function getAllUsers(req, res) {
    res.send(await UserModel.getAll());
}