import { connectToDatabase } from '../_db';
import { Order } from '../_models/Order';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }

  try {
    const orders = await Order.find({}).lean();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const customersSet = new Set();
    orders.forEach((o) => {
      if (o.email) customersSet.add(`e:${o.email}`);
      if (o.phone) customersSet.add(`p:${o.phone}`);
    });
    const totalCustomers = customersSet.size;

    // monthly growth: last month vs current month totals
    const now = new Date();
    const startCurr = new Date(now.getFullYear(), now.getMonth(), 1);
    const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endPrev = new Date(now.getFullYear(), now.getMonth(), 0);
    const currTotal = orders.filter(o => new Date(o.date) >= startCurr).reduce((s, o) => s + (o.total || 0), 0);
    const prevTotal = orders.filter(o => {
      const d = new Date(o.date);
      return d >= startPrev && d <= endPrev;
    }).reduce((s, o) => s + (o.total || 0), 0);
    const monthlyGrowth = prevTotal > 0 ? Math.round(((currTotal - prevTotal) / prevTotal) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        monthlyGrowth,
        conversionRate: 0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
