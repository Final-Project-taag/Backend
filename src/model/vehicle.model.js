
import mongoose from 'mongoose';



const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  type: {
    type: String,
    enum: ['scooter', 'bike', 'car', 'transporter'],
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
  },
  updateQuantity: {
    type: Number
  }

});


vehicleSchema.statics.updateQuantity = async function (vehicleId, quantity) {
  const vehicle = await this.findById(vehicleId);
  vehicle.quantity -= quantity;
  await vehicle.save();
  return vehicle;
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

