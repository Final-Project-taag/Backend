import { Router } from "express";
import jwt from "jsonwebtoken";
import Reservation from "../model/reservation.model.js";

function verifyToken(req, res, next) {
    if (!req.headers.authorization)
      return res.status(401).send({ success: false, message: "Token missing" });
  
    let token = req.headers.authorization.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err)
        return res.status(401).send({ success: false, message: "Invalid token" });
  
      req.tokenPayload = payload;
      next();
    });
  }
  

  const router = Router();

// alle Reservierungen 
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.tokenPayload.userId;
    const reservations = await Reservation.find({ user: userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body;
  const userId = req.tokenPayload.userId;

  const reservation = new Reservation({
    vehicle: vehicleId,
    user: userId,
    startDate,
    endDate,
  });

  try {
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
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

router.put("/:id", verifyToken, async (req, res) => {
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

router.delete("/:id", verifyToken, async (req, res) => {
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
});

export default router;
