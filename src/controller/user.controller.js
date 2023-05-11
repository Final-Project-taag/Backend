import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../model/user.model.js";

// Funktion, um die Gültigkeit der E-Mail-Adresse zu überprüfen
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export async function registerNewUser(req, res) {
  try {
    let body = req.body;
    console.log(body.password);

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
      { userId: user._id, username: user.username, email: user.email },
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
    });
  } else {
    // Passwort falsch -> Sende Fehlermeldung zurueck
    res.status(401).send({
      success: false,
      message: "Incorrect username or password",
    });
  }
}
export default function loadUser(req, res) {
  res.send(req.tokenPayload);
}
