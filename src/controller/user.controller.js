import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import md5 from 'md5';
import * as UserModel from "../model/user.model.js";
import { rolesEnum } from '../model/role.model.js';
import * as MailService from '../service/mail.service.js';


  
// Funktion, um die Gültigkeit der E-Mail-Adresse zu überprüfen
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function registerNewUser(req, res) {
  try {
    let body = req.body;
    // Überprüfe, ob das Passwort mindestens 8 Zeichen lang ist
    if (body.password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Passwort mind. 8 Charakter",
      });
      return;
    }
    // Überprüfe, ob die E-Mail-Adresse gültig ist
    if (!isValidEmail(body.email)) {
      res.status(400).json({
        success: false,
        message: "Ungültige E-Mail-Adresse",
      });
      return;
    }
    // Überschreibe password-Property im body mit dem Hash des Passworts
    body.password = bcrypt.hashSync(body.password, 10);
    // Führe Model-Funktion zum Einfügen eines neuen Users aus und fange mögliche Fehler auf
    try {
      await UserModel.insertNewUser(body);
    } catch (err) {
      console.log(err.code);
      if (err.code === 409) {
        res.status(400).json({
          success: false,
          message: "Benutzername bereits registriert",
        });
        return;
      }
      throw err;
    }
    // Sende Erfolgsmeldung zurück
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
      message: "Incorrect username or password",
    });
    // early return
    return;
  }
  // Vergleiche uebermitteltes password mit dem gehashten password aus der DB
  if (bcrypt.compareSync(password, user.password)) {
    // Erstelle neuen JWT Token mit payload und Verfall nach einer Stunde (60 Minuten * 60 Sekunden)
    let token = jwt.sign(
      { userId: user._id, fullname: user.fullname, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 600 }
    );
    // Token als httpOnly cookie
    //res.cookie('access_token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true })
    // Sende Erfolgsnachricht sowie neuen Token zurueck
    res.send({
      success: true,
      message: `User ${user.username} logged in successfully!`,
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      token: token,
      role: user.role
    });
  } else {
    // Passwort falsch -> Sende Fehlermeldung zurueck
    res.status(401).send({
      success: false,
      message: "Incorrect username or password",
    });
  }
}

export default async  function loadUser(req, res) {
  let username = req.tokenPayload.username;
  let user = await  UserModel.findUserByUsername(username);


   // Wenn user nicht gefunden wurde
   if (user === null) {
    // Sende 401 (UNAUTHORIZED) mit Nachricht
    res.status(401).send({
      success: false,
      message: "Incorrect username or password",
    });
    // early return
    return;
  }

  let token = req.headers.authorization.split(" ")[1];

  // Sende Erfolgsnachricht sowie neuen Token zurueck
  res.send({
    success: true,
    message: `User ${user.username} logged in successfully!`,
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    token: token,
    role: user.role
  });



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
        redirectTo: 'http://localhost:5173/login',
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

export async function addNewAdmin (req, res) {
  let body = req.body;

  // TODO: Validierungen hier...

  body.password = bcrypt.hashSync(body.password, 10);
  try {
    await UserModel.insertNewAdmin(body);
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
