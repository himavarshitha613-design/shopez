const asyncHandler = require('../middleware/asyncHandler');
const Banner = require('../models/Banner');

const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findOne().sort({ createdAt: -1 });
  res.json(banner || { imageUrl: '' });
});

const updateBanner = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  let banner = await Banner.findOne();
  if (banner) { banner.imageUrl = imageUrl; await banner.save(); }
  else { banner = await Banner.create({ imageUrl }); }
  res.json(banner);
});

module.exports = { getBanner, updateBanner };
