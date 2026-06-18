const express = require('express');
const { getStats, getUsers, updateUser, deleteUser, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect, admin);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
