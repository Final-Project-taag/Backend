import { Router } from "express";
import Booking from "../model/booking.model.js";
import Reservation from  "../model/reservation.model.js";
import Vehicle from  "../model/vehicle.model.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();


// Route zum Abrufen aller Buchungen für den aktuellen Benutzer
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.tokenPayload.userId;

    if(req.tokenPayload.role && req.tokenPayload.role.name === "admin") {
      const bookings = await Booking.find().populate("vehicle").populate("user");
    res.json(bookings);
    }else{
      const bookings = await Booking.find({ user: userId }).populate("vehicle");;
      res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route zum Erstellen einer neuen Buchung
router.post("/", verifyToken, async (req, res) => {
  const { reservationId } = req.body;

  const reservation = await Reservation.findById(reservationId)
  // Validierung der eingehenden Daten hinzufügen

  if(!reservation._id) {
    res.status(400).json({ message: "reservation not found"});
  }
  const booking = new Booking({
    vehicle: reservation.vehicle,
    startDate:reservation.startDate,
    endDate: reservation.endDate,
    user: req.tokenPayload.userId, // Benutzerdaten aus dem Token verwenden, falls nicht in req.body vorhanden
    totalPrice: reservation.totalPrice,
  });
  const vehicleId = reservation.vehicle
  try {
    const newBooking = await booking.save();
    if(newBooking._id) {
     await Vehicle.updateQuantity(vehicleId, 1);
      await  Reservation.findByIdAndDelete(
        reservationId
      );
    }
    res.status(201).json(newBooking);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
});
 
// Route zum Abrufen von Informationen zu einer bestimmten Buchung
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.tokenPayload.id,
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      res.json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
});

// Route zum Aktualisieren der Buchungsinformationen
router.put("/:id", verifyToken, async (req, res) => {
  const { reservationId } = req.body;

  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.tokenPayload.id },
      { reservation: reservationId },
      { new: true }
    );

    if (!updatedBooking) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      res.json(updatedBooking);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route zum Stornieren einer Buchung
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log("delete", req.params.id)
    const deletedBooking = await Booking.findOneAndDelete({
      _id: req.params.id
    });

    if (!deletedBooking) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      res.json({ message: "Booking successfully deleted" });
      await Vehicle.updateQuantity(deletedBooking.vehicle, -1);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
