/* import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
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

const Car = mongoose.model('Car', carSchema);

export default Car;
 */