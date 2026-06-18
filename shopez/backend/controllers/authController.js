const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Order = require('../models/Order');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('All fields required'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid email or password'); }
  if (!user.isActive) { res.status(403); throw new Error('Account deactivated'); }
  const orderCount = await Order.countDocuments({ user: user._id });
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, orderCount, token: generateToken(user._id) });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const orderCount = await Order.countDocuments({ user: user._id });
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, pincode: user.pincode, orderCount });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.address = req.body.address ?? user.address;
  user.pincode = req.body.pincode ?? user.pincode;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, token: generateToken(updated._id) });
});

module.exports = { register, login, getProfile, updateProfile };
