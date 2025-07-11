const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userEmail: { type: DataTypes.STRING, allowNull: false },
  documentId: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  productName: { type: DataTypes.STRING, allowNull: false },
  productPrice: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  productImage: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'CartItems',
  timestamps: true,
});

CartItem.belongsTo(User, { foreignKey: 'userId' });

CartItem.beforeSave((cartItem) => {
  cartItem.totalPrice = cartItem.quantity * cartItem.productPrice;
});

module.exports = CartItem;
