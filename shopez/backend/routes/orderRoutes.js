const express = require('express');
const { placeOrder, getMyOrders, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/mine', getMyOrders);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
