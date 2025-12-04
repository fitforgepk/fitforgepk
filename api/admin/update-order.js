import dbConnect from '../../src/lib/mongodb.js';
import Order from '../../src/models/Order.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const { orderNumber, status } = req.body;
      
      if (!orderNumber || !status) {
        return res.status(400).json({ success: false, error: 'Order number and status are required' });
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }

      const order = await Order.findOneAndUpdate(
        { orderNumber },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
