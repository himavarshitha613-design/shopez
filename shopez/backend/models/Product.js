const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'],
  },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 100 },
  image: { type: String, default: '' },
  reviews: [reviewSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.virtual('discount').get(function() {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
