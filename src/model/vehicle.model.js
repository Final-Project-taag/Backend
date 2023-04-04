


import mongoose from 'mongoose';


const vehicleSchema = mongoose.Schema({
  make: {type: String,required: true},
  model: {type: String,required: true,},
  year: {type: Number,required: true,},
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  rentedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default vehicleSchema;
