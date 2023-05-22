
import { Router } from "express";
import Reservation from "../model/reservation.model.js";
import Vehicle from "../model/vehicle.model.js";
import verifyToken from "../middleware/verifyToken.js";

const reservationsRouter = Router();

// ---------------------------------Get active reservations-------------------------------//
reservationsRouter.get("/active", verifyToken, async (req, res) => {
  try {
    const activeReservations = await getActiveReservations();
    if (!activeReservations || activeReservations.length === 0) {
        throw new Error('Keine aktive Reservierung gefunden');
    }
    const bookingId = activeReservations[0]._id;
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Definition von getActiveReservations
const getActiveReservations = async () => {
  const now = new Date();
  now.setHours(now.getHours() + 2); // Adjust for timezone difference
  const reservations = await Reservation.find({ 
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  return reservations;
};
const findReservationsWithinRange = async (startDate, endDate) => {
  const reservations = await Reservation.find({
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Reservations that overlap the start or the end
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } }, // Reservations that are within the start and end
    ]
  });
  return reservations;
};




// Get all reservations
reservationsRouter.get("/", verifyToken, async (req, res) => {
  try {   
    const userId = req.tokenPayload.userId;
    const reservations = await Reservation.find({ user: userId }).populate("vehicle");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reservierungsanfrage schicken

reservationsRouter.post("/", verifyToken, async (req, res) => {
  const { vehicleId } = req.body;
  const userId = req.tokenPayload.userId;

 // Check for active reservations
/*  const activeReservations = await getActiveReservations();
 if (activeReservations && activeReservations.length > 0) {
   return res.status(400).json({ message: "Es gibt bereits eine aktive Reservierung." });
 }
 */  // Set the reservation duration to 60 minutes (in milliseconds)
  const reservationDuration = 60 * 60 * 1000;

  // Get the current time and adjust for timezone difference
  const startDate = new Date();
  startDate.setHours(startDate.getHours() + 2);

  // Calculate the endDate
  const endDate = new Date(startDate.getTime() + reservationDuration);

  const reservation = new Reservation({
    vehicle: vehicleId,
    user: userId,
    startDate: startDate,
    endDate: endDate,
    reserved: true,
  });

  try {
    const newReservation = await reservation.save();
    
   
    if (!newReservation) {
      return res.status(500).json({ message: "Fehler beim Speichern der Reservierung." });
    }

    const updateResult = await Vehicle.updateQuantity(vehicleId, 1);

    if (!updateResult) {
      return res.status(500).json({ message: "Fehler beim Aktualisieren der Fahrzeugmenge." });
    }

    res.status(201).json(newReservation);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Ungültige Eingabedaten.", details: error.errors });
    } else {
      res.status(500).json({ message: "Ein unerwarteter Fehler ist aufgetreten.", error: error.message });
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
  const { startDate, endDate, totalPrice } = req.body;

  try {
    let reservation = await Reservation.findById(req.params.id).populate("vehicle");

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Reservation not found with the given ID" });
    }

    // Check for conflicting reservations
    const conflictingReservations = await findReservationsWithinRange(new Date(startDate), new Date(endDate));
    if (conflictingReservations.length > 0) {
      return res.status(400).json({ message: `Es gibt bereits eine Reservierung in diesem Zeitraum. ID der konflikthaften Reservierung: ${conflictingReservations[0]._id}` });
    }

    // Calculate the total price
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const durationHours = Math.abs(endTime - startTime) / 36e5; // convert duration from milliseconds to hours
    const totalPrice = durationHours * reservation.vehicle.price;

    // Update the reservation
    reservation.startDate = startTime;
    reservation.endDate = endTime;
    reservation.totalPrice = totalPrice;
    reservation.reserved = false;
    reservation.isBooked = true;
   
    const updatedReservation = await reservation.save();

    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
/* In dieser überarbeiteten Version der Funktion wird die findReservationsWithinRange-Funktion verwendet,
 um nach Reservierungen zu suchen, die sich mit dem neuen Start- und Enddatum der zu aktualisierenden Reservierung überschneiden. Wenn konfliktierende Reservierungen gefunden werden, wird eine Fehlermeldung zurückgegeben, die die ID der ersten gefundenen konfliktierenden Reservierung enthält. */



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



export default reservationsRouter;
