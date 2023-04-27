<<<<<<<<< Temporary merge branch 1



import mongoose from 'mongoose';


const vehicleSchema = mongoose.Schema({
  make: {type: String,required: true},
  model: {type: String,required: true,},
  year: {type: Number,required: true,},
  color: {
    type: String,
=========
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
<<<<<<<<< Temporary merge branch 1
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

const vehicleSchema = mongoose.model('vehicle', vehicleSchema);

export default vehicleSchema;
=========
 
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
>>>>>>>>> Temporary merge branch 2
