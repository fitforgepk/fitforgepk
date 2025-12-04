import dbConnect from '../../src/lib/mongodb.js';
import Order from '../../src/models/Order.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get all orders from database
    const orders = await Order.find({}).sort({ date: -1 });
    
    // If no orders exist, return zero data
    if (!orders || orders.length === 0) {
      const emptyChartData = {
        salesTrend: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Revenue (Rs)',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#a67c52',
            backgroundColor: 'rgba(166, 124, 82, 0.1)',
          }]
        },
        orderStatus: {
          labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
            borderColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
          }]
        },
        productCategories: {
          labels: ['Regular Fit', 'Oversized Tee', 'Crop Top', 'Drop Shoulder'],
          datasets: [{
            label: 'Sales Count',
            data: [0, 0, 0, 0],
            backgroundColor: ['#a67c52', '#8b5cf6', '#10b981', '#f59e0b'],
            borderColor: ['#a67c52', '#8b5cf6', '#10b981', '#f59e0b'],
          }]
        },
        monthlyRevenue: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan'],
          datasets: [{
            label: 'Monthly Revenue (Rs)',
            data: [0, 0, 0, 0],
            backgroundColor: '#a67c52',
            borderColor: '#a67c52',
          }]
        },
        customerAcquisition: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'New Customers',
            data: [0, 0, 0, 0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
          }]
        }
      };

      return res.status(200).json({ 
        success: true, 
        data: emptyChartData,
        summary: {
          totalOrders: 0,
          totalRevenue: 0,
          uniqueCustomers: 0
        }
      });
    }

    // Calculate sales trend (last 7 days)
    const last7Days = [];
    const salesTrendData = [];
    const salesTrendLabels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      salesTrendLabels.push(dayName);
      salesTrendData.push(dayRevenue);
    }

    // Calculate order status distribution
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });

    const orderStatusData = [
      statusCounts.pending,
      statusCounts.confirmed,
      statusCounts.shipped,
      statusCounts.delivered,
      statusCounts.cancelled
    ];

    // Calculate product category performance
    const categoryCounts = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Extract category from product name or use a default
          let category = 'Regular Fit'; // default
          if (item.name) {
            if (item.name.includes('Oversized')) category = 'Oversized Tee';
            else if (item.name.includes('Crop')) category = 'Crop Top';
            else if (item.name.includes('Drop Shoulder')) category = 'Drop Shoulder';
            else if (item.name.includes('Regular')) category = 'Regular Fit';
          }
          
          categoryCounts[category] = (categoryCounts[category] || 0) + item.quantity;
        });
      }
    });

    const productCategoriesData = [
      categoryCounts['Regular Fit'] || 0,
      categoryCounts['Oversized Tee'] || 0,
      categoryCounts['Crop Top'] || 0,
      categoryCounts['Drop Shoulder'] || 0
    ];

    // Calculate monthly revenue (last 4 months)
    const monthlyRevenueData = [];
    const monthlyRevenueLabels = [];
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      monthlyRevenueLabels.push(monthName);
      monthlyRevenueData.push(monthRevenue);
    }

    // Calculate customer acquisition (last 4 weeks)
    const customerAcquisitionData = [];
    const customerAcquisitionLabels = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (i * 7)));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });
      
      // Count unique customers (by email)
      const uniqueCustomers = new Set(weekOrders.map(order => order.email)).size;
      
      customerAcquisitionLabels.push(`Week ${4 - i}`);
      customerAcquisitionData.push(uniqueCustomers);
    }

    const chartData = {
      salesTrend: {
        labels: salesTrendLabels,
        datasets: [{
          label: 'Daily Revenue (Rs)',
          data: salesTrendData,
          borderColor: '#a67c52',
          backgroundColor: 'rgba(166, 124, 82, 0.1)',
        }]
      },
      orderStatus: {
        labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        datasets: [{
          data: orderStatusData,
          backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
          borderColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
        }]
      },
      productCategories: {
        labels: ['Regular Fit', 'Oversized Tee', 'Crop Top', 'Drop Shoulder'],
        datasets: [{
          label: 'Sales Count',
          data: productCategoriesData,
          backgroundColor: ['#a67c52', '#8b5cf6', '#10b981', '#f59e0b'],
          borderColor: ['#a67c52', '#8b5cf6', '#10b981', '#f59e0b'],
        }]
      },
      monthlyRevenue: {
        labels: monthlyRevenueLabels,
        datasets: [{
          label: 'Monthly Revenue (Rs)',
          data: monthlyRevenueData,
          backgroundColor: '#a67c52',
          borderColor: '#a67c52',
        }]
      },
      customerAcquisition: {
        labels: customerAcquisitionLabels,
        datasets: [{
          label: 'New Customers',
          data: customerAcquisitionData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        }]
      }
    };

    res.status(200).json({ 
      success: true, 
      data: chartData,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        uniqueCustomers: new Set(orders.map(order => order.email)).size
      }
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chart data',
      details: error.message 
    });
  }
}
