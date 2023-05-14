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
    required: Date.now,
  },
  endDate:{
    type: Date,
    
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedUntil: {
    type: Date,
  },
  isBooked: {
    type: Boolean,
    default: false,
  }

});



const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;