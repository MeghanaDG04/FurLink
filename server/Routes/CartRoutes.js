const express = require('express');
const router = express.Router();
const {
  getCart,
  addProductToCart,
  addPetToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../Controller/CartController');
const { verifyToken } = require('../Middleware/Auth');

router.use(verifyToken);

// GET user's cart
router.get('/', getCart);

// ADD product to cart
router.post('/product', addProductToCart);

// ADD pet to cart
router.post('/pet', addPetToCart);

// UPDATE cart item quantity
router.put('/update', updateCartItem);

// REMOVE item from cart
router.delete('/remove', removeFromCart);

// CLEAR cart
router.delete('/clear', clearCart);

module.exports = router;
