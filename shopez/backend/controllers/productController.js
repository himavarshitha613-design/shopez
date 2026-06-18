const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const { q, category, gender, sort, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
  if (category) filter.category = category;
  if (gender) filter.gender = gender;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(parseInt(limit) || 12, 50);

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else sortObj = { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip((pageNum - 1) * limitNum).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page: pageNum, pages: Math.ceil(total / limitNum) || 1, total });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview };
