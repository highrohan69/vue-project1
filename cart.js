const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get user's cart
router.get('/', async (req, res) => {
  const userId = req.user._id; // Assuming req.user contains authenticated user's info
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
