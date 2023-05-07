const orderSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    status: String,
  });
  
  const Order = mongoose.model('Order', orderSchema);
  