const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const placeOrder = asyncHandler(async (req, res) => {
  const { items, address, pincode, paymentMethod } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No items in order'); }
  if (!address || !pincode) { res.status(400); throw new Error('Address and pincode required'); }

  let totalMRP = 0;
  let totalPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product ${item.product} not found`); }
    totalMRP += product.mrp * item.quantity;
    totalPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      mrp: product.mrp,
      quantity: item.quantity,
      size: item.size || 'M',
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalMRP,
    totalPrice,
    discount: totalMRP - totalPrice,
    address,
    pincode,
    paymentMethod: paymentMethod || 'netbanking',
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.status === 'delivered') { res.status(400); throw new Error('Cannot cancel a delivered order'); }
  order.status = 'cancelled';
  await order.save();
  res.json(order);
});

module.exports = { placeOrder, getMyOrders, cancelOrder };
