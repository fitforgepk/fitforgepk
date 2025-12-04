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
    const today = new Date();
    const salesTrendLabels = [];
    const salesTrendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      salesTrendLabels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      const dayTotal = orders.filter((o) => {
        const od = new Date(o.date);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate();
      }).reduce((sum, o) => sum + (o.total || 0), 0);
      salesTrendData.push(dayTotal);
    }

    const statusCounts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => { statusCounts[o.status || 'pending'] = (statusCounts[o.status || 'pending'] || 0) + 1; });

    const productAgg = {};
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const key = it.name;
        const qty = it.quantity || 1;
        const rev = (it.price || 0) * qty;
        if (!productAgg[key]) productAgg[key] = { name: key, sales: 0, revenue: 0, views: 0, rating: 4.8 };
        productAgg[key].sales += qty;
        productAgg[key].revenue += rev;
      });
    });
    const topProducts = Object.values(productAgg).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    const monthLabels = [];
    const monthData = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthLabels.push(d.toLocaleDateString(undefined, { month: 'short' }));
      const mTotal = orders.filter((o) => {
        const od = new Date(o.date);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      }).reduce((sum, o) => sum + (o.total || 0), 0);
      monthData.push(mTotal);
    }

    return res.status(200).json({
      success: true,
      data: {
        recentOrders: orders.slice(-10).reverse().map((o) => ({
          id: o.orderNumber,
          customer: o.name,
          product: (o.items && o.items[0] && o.items[0].name) || '',
          amount: o.total || 0,
          status: o.status || 'pending',
          date: new Date(o.date).toLocaleString(),
        })),
        topProducts,
        salesTrend: {
          labels: salesTrendLabels,
          datasets: [{ label: 'Daily Revenue (Rs)', data: salesTrendData, borderColor: '#a67c52', backgroundColor: 'rgba(166, 124, 82, 0.1)' }],
        },
        orderStatus: {
          labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
          datasets: [{ data: [statusCounts.pending, statusCounts.confirmed, statusCounts.shipped, statusCounts.delivered, statusCounts.cancelled], backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'], borderColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'] }],
        },
        monthlyRevenue: {
          labels: monthLabels,
          datasets: [{ label: 'Monthly Revenue (Rs)', data: monthData, backgroundColor: '#a67c52', borderColor: '#a67c52' }],
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
