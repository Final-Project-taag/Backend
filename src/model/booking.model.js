import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  //der Name des Benutzers, der das E-Mobility-Gerät bucht

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    require: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalPrice: {
    type: Number,
    required: true,
  },


});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

