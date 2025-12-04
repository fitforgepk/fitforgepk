import dbConnect from '../src/lib/mongodb.js';
import Order from '../src/models/Order.js';

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