const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

wishlistSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
