const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getStats = asyncHandler(async (req, res) => {
  const [userCount, productCount, orderCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);
  res.json({ userCount, productCount, orderCount });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, isActive: updated.isActive });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  await Order.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

module.exports = { getStats, getUsers, updateUser, deleteUser, getAllOrders, updateOrderStatus };
