 import {Router} from "express"
import jwt from 'jsonwebtoken';

import Vehicle from '../model/vehicle.model.js';


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

function isAdmin(req, res, next) {
  const { role } = req.tokenPayload;
  if (role !== "admin") {
    return res
      .status(403)
      .send({ success: false, message: "Access forbidden, not an admin" });
  }
  next();
}
//-------------------------------------------------F A H R Z E U G E-----------------------------------------//

// Route für alle vehicles auf der Homepage anzuzeigen
const router = Router()

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  

//Diese Route verwendet die findById-Methode, um ein Fahrzeug anhand der angegebenen ID zu suchen.
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found with the given ID" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Route zum Hinzufügen eines Fahrzeugs
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { type, name, driveRange, weight, price, chargingTime } = req.body;

  const vehicle = new Vehicle({
    type,
    name,
    driveRange,
    weight,
    price,
    chargingTime,
  });

  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Jetzt haben Sie eine API-Route /vehicles (mit der HTTP-Methode POST), die ein neues Fahrzeug (Auto) in Ihrer Datenbank speichert.

//In Ihrer Frontend-Anwendung können Sie nun ein Formular erstellen, um die Fahrzeugdaten einzugeben und diese Route aufrufen, um das Fahrzeug zur Datenbank hinzuzufügen.

// Route zum Updaten
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { type, name, driveRange, weight, price, chargingTime } = req.body;
  
  try {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
  req.params.id,
  {
  type,
  name,
  driveRange,
  weight,
  price,
  chargingTime,
  },
  { new: true }
  );
  if (!updatedVehicle) {
    return res
      .status(404)
      .json({ message: "Vehicle not found with the given ID" });
  }
  
  res.json(updatedVehicle);
} catch (error) {
  res.status(400).json({ message: error.message });
  }
  });


//Diese Route stellt sicher, dass nur ein Admin ein Fahrzeug löschen kann, indem sie die verifyToken und isAdmin Middleware verwendet. 
  router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
      const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
  
      if (!deletedVehicle) {
        return res
          .status(404)
          .json({ message: "Vehicle not found with the given ID" });
      }
  
      res.json({ message: "Vehicle successfully deleted", vehicle: deletedVehicle });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
//-------------------------------------------------R E S E R V I E R U N G-----------------------------------------//

export default router