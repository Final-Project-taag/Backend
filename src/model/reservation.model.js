import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
 /*  anZahl:{
    type: Number,
    required: true,
  }, */
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedUntil: {
    type: Date,
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
