import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  size: String,
  image: String,
  category: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  name: String,
  email: String,
  phone: String,
  address: String,
  paymentMethod: String,
  items: [ItemSchema],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
