import { Router } from "express";
import Booking from "../model/booking.model.js";
import verifyToken from "../middleware/verifyToken.js";

/* import mollieClient from '../mollieClient';
 */
const router = Router();


// Route zum Abrufen aller Buchungen für den aktuellen Benutzer
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.tokenPayload.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route zum Erstellen einer neuen Buchung
router.post("/", verifyToken, async (req, res) => {
  const { bookingId, vehicle, startDate, endDate, user, totalPrice } = req.body;

  // Validierung der eingehenden Daten hinzufügen

  const booking = new Booking({
    bookingId,
    vehicle,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    user: req.tokenPayload.id, // Benutzerdaten aus dem Token verwenden, falls nicht in req.body vorhanden
    totalPrice,
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
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
    const deletedBooking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.tokenPayload.id,
    });

    if (!deletedBooking) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      res.json({ message: "Booking successfully deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;