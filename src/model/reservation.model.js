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
<<<<<<< HEAD
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
=======
    required: Date.now,
>>>>>>> gaby
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
