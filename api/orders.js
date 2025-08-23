import mongoose from 'mongoose';

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(uri);
  isConnected = true;
}

const OrderItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    size: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number },
    deliveryFee: { type: Number },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const order = req.body;

    if (!order || !order.orderNumber || !order.email || !Array.isArray(order.items) || order.items.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid order data' });
    }

    const saved = await Order.create(order);
    return res.status(200).json({ success: true, data: saved });
  } catch (err) {
    console.error('❌ Failed to save order:', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }
}

import dbConnect from '../../src/lib/mongodb';
import Order from '../../src/models/Order';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    // Save new order
    try {
      const order = await Order.create(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    // Get orders by email or phone
    try {
      const { identifier } = req.query;
      
      if (!identifier) {
        return res.status(400).json({ success: false, error: 'Identifier is required' });
      }

      const orders = await Order.find({
        $or: [
          { email: identifier },
          { phone: identifier }
        ]
      }).sort({ date: -1 });

      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
} 