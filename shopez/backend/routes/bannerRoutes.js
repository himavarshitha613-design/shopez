const express = require('express');
const { getBanner, updateBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getBanner);
router.put('/', protect, admin, updateBanner);

module.exports = router;
