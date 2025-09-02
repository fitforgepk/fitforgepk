import dbConnect from '../../src/lib/mongodb.js';
import Order from '../../src/models/Order.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Get all orders
      const orders = await Order.find({});
      
      // If no orders, return zeros
      if (!orders || orders.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            totalOrders: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            monthlyGrowth: 0,
            conversionRate: 0,
            recentOrders: [],
            topProducts: []
          }
        });
      }
      
      // Calculate total orders
      const totalOrders = orders.length;
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Get unique customers (by email)
      const uniqueCustomers = new Set(orders.map(order => order.email)).size;
      
      // Calculate monthly growth (compare this month vs last month)
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const thisMonthOrders = orders.filter(order => 
        new Date(order.date) >= thisMonth && new Date(order.date) <= thisMonthEnd
      );
      
      const lastMonthOrders = orders.filter(order => 
        new Date(order.date) >= lastMonth && new Date(order.date) <= lastMonthEnd
      );
      
      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
      
      const monthlyGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;
      
      // Calculate conversion rate (simplified - would need more data for accurate calculation)
      const conversionRate = 3.2; // This would need website analytics data
      
      // Get product performance
      const productStats = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productStats[item.name]) {
            productStats[item.name] = {
              name: item.name,
              sales: 0,
              revenue: 0,
              orders: 0
            };
          }
          productStats[item.name].sales += item.quantity;
          productStats[item.name].revenue += item.price * item.quantity;
          productStats[item.name].orders += 1;
        });
      });
      
      // Convert to array and sort by revenue
      const topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
      
      // Get recent orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .map(order => ({
          id: order.orderNumber,
          customer: order.name,
          product: order.items.map(item => item.name).join(', '),
          amount: order.total,
          status: order.status,
          date: new Date(order.date).toISOString().split('T')[0]
        }));
      
      const stats = {
        totalOrders,
        totalRevenue,
        totalCustomers: uniqueCustomers,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10, // Round to 1 decimal
        conversionRate,
        topProducts,
        recentOrders
      };
      
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
