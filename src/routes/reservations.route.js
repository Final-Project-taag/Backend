// import { Router } from "express";
// import Reservation from "../model/reservation.model.js";
// import Vehicle from "../model/vehicle.model.js";
// import jwt from 'jsonwebtoken';

// // Middleware zum Verifizieren von Token
// function verifyToken(req, res, next) {
//   if (!req.headers.authorization)
//     return res.status(401).send({ success: false, message: "Token missing" });

//   let token = req.headers.authorization.split(" ")[1];

//   // Verifiziere extrahierten Token mittels Signaturpruefung
//   jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//     if (err)
//       return res.status(401).send({ success: false, message: "Invalid token" });

//     req.tokenPayload = payload;
//     next();
//   });
// }
// const reservationsRouter = Router();

// // Get all reservations
// reservationsRouter.get("/", verifyToken, async (req, res) => {
//   try {
//     const userId = req.tokenPayload.userId;
//     const reservations = await Reservation.find({ user: userId });
//     res.json(reservations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create a reservation
// reservationsRouter.post("/", verifyToken, async (req, res) => {
//   const { vehicleId, startDate, endDate, createdAt, reserved, reservedUntil } = req.body;
//   const userId = req.tokenPayload.userId;

//   const reservation = new Reservation({
//     vehicle: vehicleId,
//     user: userId,
//     startDate,
//     endDate,
//     createdAt,
//     reserved, 
//     reservedUntil
//   });

//   try {
//     const newReservation = await reservation.save();

//     await Vehicle.findByIdAndUpdate(vehicleId, {
//       reserved: true,
//       reservedUntil: new Date(Date.now() + 72 * 60 * 60 * 1000),
//     });

//     res.status(201).json(newReservation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get a specific reservation
// reservationsRouter.get("/:id", verifyToken, async (req, res) => {
//   try {
//     const reservation = await Reservation.findById(req.params.id);

//     if (!reservation) {
//       return res
//         .status(404)
//         .json({ message: "Reservation not found with the given ID" });
//     }

//     res.json(reservation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update a reservation
// reservationsRouter.put("/:id", verifyToken, async (req, res) => {
//   const { startDate, endDate } = req.body;

//   try {
//     const updatedReservation = await Reservation.findByIdAndUpdate(
//       req.params.id,
//       {
//         startDate,
//         endDate,
//       },
//       { new: true }
//     );

//     if (!updatedReservation) {
//       return res
//         .status(404)
//         .json({ message: "Reservation not found with the given ID" });
//     }

//     res.json(updatedReservation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete a reservation
// reservationsRouter.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

//     if (!deletedReservation) {
//       return res
//         .status(404)
//         .json({ message: "Reservation not found with the given ID" });
//     }

//     res.json({ message: "Reservation successfully deleted", reservation: deletedReservation });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default reservationsRouter;


import { Router } from "express";
import Reservation from "../model/reservation.model.js";
import Vehicle from "../model/vehicle.model.js";
import jwt from 'jsonwebtoken';

// Middleware zum Verifizieren von Token
function verifyToken(req, res, next) {
  if (!req.headers.authorization)
    return res.status(401).send({ success: false, message: "Token missing" });

  let token = req.headers.authorization.split(" ")[1];

  // Verifiziere extrahierten Token mittels Signaturpruefung
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
      return res.status(401).send({ success: false, message: "Invalid token" });

    req.tokenPayload = payload;
    next();
  });
}
const reservationsRouter = Router();

// Get all reservations
reservationsRouter.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.tokenPayload.userId;
    const reservations = await Reservation.find({ user: userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

reservationsRouter.post("/", verifyToken, async (req, res) => {
  const { vehicleId } = req.body;
  const userId = req.tokenPayload.userId;

  // Set the reservation duration to 60 minutes (in milliseconds)
  const reservationDuration = 60 * 60 * 1000;

  // Calculate the reservedUntil date
  const reservedUntil = new Date(Date.now() + reservationDuration);

  const reservation = new Reservation({
    vehicle: vehicleId,
    user: userId,
    startDate: new Date(),
    reserved: true,
    reservedUntil,
  });

  try {
    const newReservation = await reservation.save();

    await Vehicle.updateQuantity(vehicleId, 1);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/* reservationsRouter.post("/", verifyToken, async (req, res) => {
  const { vehicleId, startDate,  createdAt, reserved } = req.body;
  const userId = req.tokenPayload.userId;
  // Set the reservation duration to 60 minutes (in milliseconds)
  const reservationDuration = 60 * 60 * 1000;
  // Calculate the reservedUntil date
  const reservedUntil = new Date(Date.now() + reservationDuration);
  const reservation = new Reservation({
    vehicle: vehicleId,
    user: userId,
    startDate,
    
    createdAt,
    reserved, 
    reservedUntil
  });
  try {
    const newReservation = await reservation.save();
    await Vehicle.findByIdAndUpdate(vehicleId, {
      reserved: true,
      reservedUntil: reservedUntil,
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 */
// Get a specific reservation
reservationsRouter.get("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a reservation
reservationsRouter.put("/:id", verifyToken, async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!updatedReservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reservation

// Delete a reservation
reservationsRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!deletedReservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    // Increase the quantity by 1 for the vehicle associated with the deleted reservation
    const vehicle = await Vehicle.findById(deletedReservation.vehicle);
    vehicle.quantity += 1;
    await vehicle.save();
console.log(vehicle);
    res.json({ message: "Reservation successfully deleted", reservation: deletedReservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* reservationsRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }
    res.json({ message: "Reservation successfully deleted", reservation: deletedReservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); */

export default reservationsRouter;