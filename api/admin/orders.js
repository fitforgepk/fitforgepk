import dbConnect from '../../src/lib/mongodb.js';
import Order from '../../src/models/Order.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Get all orders for admin dashboard
      const orders = await Order.find({})
        .sort({ date: -1 })
        .limit(100); // Limit to recent 100 orders for performance

      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
