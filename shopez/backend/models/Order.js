const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, default: 'M' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  totalMRP: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  paymentMethod: { type: String, default: 'netbanking' },
  status: {
    type: String,
    enum: ['order placed', 'In-transit', 'delivered', 'cancelled'],
    default: 'order placed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
