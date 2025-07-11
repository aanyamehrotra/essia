const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const CartItem = require('../models/cartItem');

// ✅ Get cart items
router.get('/', authenticateUser, async (req, res) => {
  try {
    console.log('🛒 GET cart for user:', req.user.email);

    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      attributes: [
        'id',
        'userId',
        'userEmail',
        'documentId',
        'productId',
        'productName',
        'productPrice',
        'productImage',
        'quantity',
        'totalPrice',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(cartItems);
  } catch (err) {
    console.error('❌ Error fetching cart items:', err);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
});


// ✅ Add product to cart
router.post('/', authenticateUser, async (req, res) => {
  try {
    console.log('🛒 POST add to cart for user:', req.user.email);

    const {
      documentId,
      productId,
      productName,
      productPrice,
      productImage,
      quantity = 1,
    } = req.body;

    if (!documentId || !productName || productPrice == null) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const [item, created] = await CartItem.findOrCreate({
      where: { userId: req.user.id, documentId },
      defaults: {
        userId: req.user.id,
        userEmail: req.user.email,
        documentId,
        productId,
        productName,
        productPrice,
        productImage,
        quantity,
        totalPrice: quantity * productPrice,
      },
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// ✅ Update quantity
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.id);

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error('❌ Error updating cart item:', err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
});

// ✅ Delete item from cart
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);

    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await item.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('❌ Error deleting cart item:', err);
    res.status(500).json({ message: 'Failed to delete item from cart' });
  }
});

module.exports = router;
