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
  endDate:{
    type: Date,
    required: true,
  },

  isBooked: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
    
  },
  expireAt: {
    type: Date,
    default: ()=>new Date(),
    expires: 3600
  }
});



const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;