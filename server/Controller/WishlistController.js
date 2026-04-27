const Wishlist = require('../Models/WishlistModel');
const Product = require('../Models/ProductModel');
const Pet = require('../Models/PetModel');

// GET user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.userid;
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate('products', 'name productimage price')
      .populate('pets', 'name image age gender type');

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [], pets: [] });
      await wishlist.save();
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ADD product to wishlist
const addProductToWishlist = async (req, res) => {
  try {
    const userId = req.userid;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId }, $pull: { pets: productId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('products', 'name productimage price')
     .populate('pets', 'name image age gender type');

    const productInWishlist = wishlist.products.some(p => p._id.toString() === productId);
    if (!productInWishlist) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }

    res.json({ success: true, message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD pet to wishlist
const addPetToWishlist = async (req, res) => {
  try {
    const userId = req.userid;
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ success: false, message: "Pet ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [], pets: [] });
    }

    // Check if already in wishlist
    if (wishlist.pets.includes(petId)) {
      return res.status(400).json({ success: false, message: "Pet already in wishlist" });
    }

    // Remove from products if it exists there
    wishlist.products = wishlist.products.filter(p => p.toString() !== petId);

    wishlist.pets.push(petId);
    await wishlist.save();
    await wishlist.populate('pets', 'name image age gender type');

    res.json({ success: true, message: "Pet added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding pet to wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userid;
    const { itemId, type } = req.body; // type: 'product' or 'pet'

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    if (type === 'product') {
      wishlist.products = wishlist.products.filter(p => p.toString() !== itemId);
    } else if (type === 'pet') {
      wishlist.pets = wishlist.pets.filter(p => p.toString() !== itemId);
    }

    await wishlist.save();

    res.json({ success: true, message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CHECK if item is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const userId = req.userid;
    const { itemId, type } = req.query;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    const items = type === 'product' ? wishlist.products : wishlist.pets;
    const inWishlist = items.some(item => item.toString() === itemId);

    res.json({ inWishlist });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getWishlist,
  addProductToWishlist,
  addPetToWishlist,
  removeFromWishlist,
  checkWishlist,
};
