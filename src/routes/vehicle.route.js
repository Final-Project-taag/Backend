/* import {Router} from "express"
import jwt from 'jsonwebtoken';

import Car from "../model/vehicle.route";



function verifyToken(req, res, next) {
  // Wenn Authorization im Header nicht gesetzt, breche ab und sende Fehler
  if (!req.headers.authorization) return res.status(401).send({success: false, message: 'Token missing'});
  // if (!req.cookies.access_token) return res.status(401).send({success: false, message: 'Token missing'});

  // Extrahiere Token aus dem authorization Feld im HTTP Request Header
  let token = req.headers.authorization.split(' ')[1];
  // let token = req.cookies.access_token.split(' ')[1];

  // Verifiziere extrahierten Token mittels Signaturpruefung
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      // Wenn Verifizierung fehlgeschlagen, brich ab und sende Fehler
      if (err) return res.status(401).send({success: false, message: 'Invalid token'});

      // Alles gut, speichere payload im req-Objekt
      req.tokenPayload = payload;

      // Fahre mit Anfrage fort
      next();
  });
}


const protectedRouter = Router();
protectedRouter.use(verifyToken);

protectedRouter.route('/vehicles')
.get(async (req, res) => {
    try {
      const cars = await Car.find({user: req.tokenPayload.userId});
      res.status(200).json({cars})
      
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  })

 */