const Cart = require('../Models/CartModel');
const Product = require('../Models/ProductModel');
const Pet = require('../Models/PetModel');

// GET user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.userid;
    let cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name productimage price')
      .populate('items.pet', 'name image age gender type');

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD product to cart
const addProductToCart = async (req, res) => {
  try {
    const userId = req.userid;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Remove from pets if exists
      cart.items = cart.items.filter(item => !item.pet || item.pet.toString() !== productId);
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product', 'name productimage price');
    await cart.populate('items.pet', 'name image age gender type');

    res.json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD pet to cart
const addPetToCart = async (req, res) => {
  try {
    const userId = req.userid;
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ success: false, message: "Pet ID is required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // Check if pet already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.pet && item.pet.toString() === petId
    );

    if (existingItemIndex > -1) {
      return res.status(400).json({ success: false, message: "Pet already in cart" });
    }

    // Remove from products if exists
    cart.items = cart.items.filter(item => !item.product || item.product.toString() !== petId);
    cart.items.push({ pet: petId, quantity: 1 });

    await cart.save();
    await cart.populate('items.pet', 'name image age gender type');
    await cart.populate('items.product', 'name productimage price');

    res.json({ success: true, message: "Pet added to cart", cart });
  } catch (error) {
    console.error("Error adding pet to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.userid;
    const { itemId, quantity } = req.body;

    if (!itemId || quantity < 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(item => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name productimage price');
    await cart.populate('items.pet', 'name image age gender type');

    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userid;
    const { itemId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CLEAR cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userid;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.json({ success: true, message: "Cart already empty" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCart,
  addProductToCart,
  addPetToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
