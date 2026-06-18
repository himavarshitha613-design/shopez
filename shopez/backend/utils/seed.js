require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  { name: 'Iphone 12', description: 'Apple Iphone with 8GB ram and 128GB storage. Best in class camera and performance.', category: 'mobiles', gender: 'Unisex', price: 67999, mrp: 79999, image: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?w=400' },
  { name: 'Realme buds', description: 'TWS buds with 10.2mm drivers giving deep bass and clear sound.', category: 'Electronics', gender: 'Unisex', price: 2599, mrp: 3999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
  { name: 'MRF cricket bat', description: 'Popular willow wood cricket bat from MRF. Suitable for your all format plays in all conditions.', category: 'Sports-Equipment', gender: 'Unisex', price: 1308, mrp: 1699, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400' },
  { name: 'Kokobura cricket bat', description: 'Imported cricket bat made with English willow wood. Premium bat to enhance your playing experience.', category: 'Sports-Equipment', gender: 'Unisex', price: 2355, mrp: 3200, image: 'https://images.unsplash.com/photo-1540747913346-19212a4e3dd3?w=400' },
  { name: 'Carrom board', description: 'Quality carrom board along with necessary equipment to make your free time more joyful.', category: 'Sports-Equipment', gender: 'Unisex', price: 919, mrp: 1500, image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400' },
  { name: 'Samsung Galaxy S23', description: 'Flagship Samsung phone with 200MP camera, 8K video recording, and powerful Snapdragon processor.', category: 'mobiles', gender: 'Unisex', price: 74999, mrp: 89999, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400' },
  { name: 'Men\'s Running Shoes', description: 'Lightweight and breathable running shoes with superior cushioning for long distance runs.', category: 'Fashion', gender: 'Men', price: 1899, mrp: 2999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Women\'s Ethnic Kurta', description: 'Beautiful cotton kurta with traditional embroidery. Perfect for festive and casual occasions.', category: 'Fashion', gender: 'Women', price: 899, mrp: 1499, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400' },
  { name: 'Basmati Rice 5kg', description: 'Premium long grain basmati rice from the foothills of Himalayas. Aged for 2 years for perfect taste.', category: 'Groceries', gender: 'Unisex', price: 449, mrp: 599, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancelling headphones with 30hr battery life and crystal clear audio.', category: 'Electronics', gender: 'Unisex', price: 24999, mrp: 34990, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat with alignment lines. 6mm thick for superior joint protection.', category: 'Sports-Equipment', gender: 'Unisex', price: 699, mrp: 1199, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
  { name: 'Organic Olive Oil 1L', description: 'Extra virgin cold pressed olive oil imported from Greece. Rich in antioxidants and healthy fats.', category: 'Groceries', gender: 'Unisex', price: 799, mrp: 1099, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { name: 'Denim Jacket', description: 'Classic blue denim jacket with a slim fit. Perfect for casual outings and layering.', category: 'Fashion', gender: 'Men', price: 1499, mrp: 2499, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' },
  { name: 'Smart LED TV 43"', description: '4K Ultra HD Android Smart TV with Dolby Vision, built-in Chromecast, and voice remote.', category: 'Electronics', gender: 'Unisex', price: 27999, mrp: 39999, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400' },
];

const seed = async () => {
  try {
    await connectDB();

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) { await Product.create(p); console.log(`Created: ${p.name}`); }
      else console.log(`Skipped: ${p.name}`);
    }

    const adminEmail = 'admin@shopez.com';
    if (!(await User.findOne({ email: adminEmail }))) {
      await User.create({ name: 'Admin', email: adminEmail, password: 'Admin@123', role: 'ADMIN' });
      console.log('Created admin: admin@shopez.com / Admin@123');
    } else {
      console.log('Admin already exists');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e.message);
    process.exit(1);
  }
};

seed();
