
import mongoose from 'mongoose';



const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  type: {
    type: String,
    enum: ['scooter', 'bike', 'car'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  driveRange: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: [{
    type: String,
  }],


  chargingTime: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedUntil: {
    type: Date,
  }


});



const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

