import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    //der Name des Benutzers, der das E-Mobility-Gerät bucht
 
  startDate: {
    type: Date,
    required: true,
  },// das Datum, an dem die Buchung endet
  endDate: {
    type: Date,
    required: true,
  },// ein Array von Referenzen auf die E-Mobility-Geräte, die der Benutzer bucht
  vehicle: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  }],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
