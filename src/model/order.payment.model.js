<<<<<<< HEAD
=======
import mongoose from "mongoose";

>>>>>>> gaby
const orderSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    status: String,
  });
  
  const Order = mongoose.model('Order', orderSchema);
<<<<<<< HEAD
  
=======
  
  export default Order;
>>>>>>> gaby
