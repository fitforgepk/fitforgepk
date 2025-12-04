import { connectToDatabase } from '../_db';
import { Order } from '../_models/Order';

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  try {
    await connectToDatabase();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }

  try {
    const { orderNumber, status } = req.body || {};
    if (!orderNumber || !status) {
      return res.status(400).json({ success: false, error: 'orderNumber and status are required' });
    }
    const doc = await Order.findOneAndUpdate({ orderNumber }, { $set: { status } }, { new: true });
    if (!doc) return res.status(404).json({ success: false, error: 'Order not found' });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
