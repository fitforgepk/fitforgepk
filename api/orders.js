import { connectToDatabase } from './_db';
import { Order } from './_models/Order';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      // Ensure unique orderNumber
      if (!data.orderNumber) {
        return res.status(400).json({ success: false, error: 'orderNumber is required' });
      }
      // Upsert to avoid duplicates
      const doc = await Order.findOneAndUpdate(
        { orderNumber: data.orderNumber },
        { $set: data },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, data: doc });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const { identifier } = req.query;
      const filter = identifier ? {
        $or: [
          { email: identifier },
          { phone: identifier }
        ]
      } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: orders });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
