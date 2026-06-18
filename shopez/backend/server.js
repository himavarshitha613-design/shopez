require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banner', bannerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Start server first, then connect DB
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Connect DB after server starts
  require('./config/db')();
});
