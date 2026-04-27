const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addProductToWishlist,
  addPetToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../Controller/WishlistController');
const { verifyToken } = require('../Middleware/Auth');

router.use(verifyToken);

// GET user's wishlist
router.get('/', getWishlist);

// Check if item is in wishlist
router.get('/check', checkWishlist);

// ADD product to wishlist
router.post('/product', addProductToWishlist);

// ADD pet to wishlist
router.post('/pet', addPetToWishlist);

// REMOVE from wishlist
router.delete('/remove', removeFromWishlist);

module.exports = router;
