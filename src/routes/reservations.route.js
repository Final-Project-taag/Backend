import { Router } from "express";
import Reservation from "../model/reservation.model.js";
import Vehicle from "../model/vehicle.model.js";
import verifyToken from "../middleware/verifyToken.js";
import { calculatePrice  } from "../backgroundtasks/ backgroundTasks.js";

const reservationsRouter = Router();

// ---------------------------------Get active reservations-------------------------------//
reservationsRouter.get("/active", verifyToken, async (req, res) => {
  try {
    const activeReservations = await getActiveReservations();
    if (!activeReservations || activeReservations.length === 0) {
      throw new Error("Keine aktive Reservierung gefunden");
    }
    const bookingId = activeReservations[0]._id;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Definition von getActiveReservations
const getActiveReservations = async () => {
  const reservations = await Reservation.find({ reserved: true });
  return reservations;
};


// Get all reservations
reservationsRouter.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.tokenPayload.userId;
    if (req.tokenPayload.role && req.tokenPayload.role.name === "admin") {
      const reservations = await Reservation.find().populate("vehicle");
      // reservations.map(reservation=> cleanUpReservations(reservation))
      // console.log(reservations)
      res.json(reservations);
    } else {
      const reservations = await Reservation.find({ user: userId }).populate("vehicle");
      // console.log(reservations)
      // reservations.map(reservation=> cleanUpReservations(reservation))
      res.json(reservations);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reservierungsanfrage schicken

reservationsRouter.post("/", verifyToken, async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body;
  console.log(vehicleId)
  const userId = req.tokenPayload.userId;

  // Set the reservation duration to 60 minutes (in milliseconds)

  // Calculate the reservedUntil date
  /*   const reservedUntil = new Date(Date.now() + reservationDuration);
   */
  const vehicle =  await Vehicle.findById(vehicleId)


  const reservation = new Reservation({
    vehicle: vehicleId,
    user: userId,
    startDate,
    endDate,
    totalPrice: calculatePrice(startDate,endDate, vehicle.price)
  });

  try {
    const newReservation = await reservation.save();
    if (!newReservation) {
      return res
        .status(500)
        .json({ message: "Fehler beim Speichern der Reservierung." });
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Ungültige Eingabedaten.", details: error.errors });
    } else {
      res.status(500).json({
        message: "Ein unerwarteter Fehler ist aufgetreten.",
        error: error.message,
      });
    }
  }
});
//-----------------------------------------------------------------------------------------------------------------//

// In dieser überarbeiteten Version der Funktion werden bei Fehlern spezifischere Meldungen zurückgegeben,
// abhängig von der Art des aufgetretenen Fehlers. Außerdem wird bei der Fehlerbehandlung der Name des Fehlers geprüft, um festzustellen, ob es sich um einen Validierungsfehler handelt.
// In diesem Fall wird eine detaillierte Fehlermeldung zurückgegeben, die Informationen über die ungültigen Eingabedaten enthält.

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
  const { startDate, endDate, isBooked } = req.body;

  try {
    let reservation = await Reservation.findById(req.params.id).populate(
      "vehicle"
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    // Calculate the total price

    // Update the reservation
    if (!!startDate && !!endDate) {
      reservation.startDate = startTime;
      reservation.endDate = endTime;
      reservation.totalPrice =  calculatePrice(startDate,endDate, reservation.vehicle.price);
    }

    if (isBooked != null) {
      reservation.isBooked = isBooked;
    }

    const updatedReservation = await reservation.save();

    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// reservationsRouter.put("/book/:id", verifyToken, async (req, res) => {
//   console.log("HOHOOOOOOO");
//   try {
//     let reservation = await Reservation.findById(req.params.id).populate(
//       "user"
//     );
//     console.log({ reservation });
//     if (!reservation) {
//       return res
//         .status(404)
//         .json({ message: "Reservation not found with the given ID" });
//     }
//     // Update isBooked
//     reservation.isBooked = true;
//     //save booking
//     const updatedReservation = await reservation.save();
//     res.json(updatedReservation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Delete a reservation
reservationsRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );

    if (!deletedReservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    // Increase the quantity by 1 for the vehicle associated with the deleted reservation
    const vehicle = await Vehicle.findById(deletedReservation.vehicle);
    vehicle.quantity += 1;
    await vehicle.save();
    res.json({
      message: "Reservation successfully deleted",
      reservation: deletedReservation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default reservationsRouter;
