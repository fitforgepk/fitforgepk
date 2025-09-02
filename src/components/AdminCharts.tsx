import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  salesTrend: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  orderStatus: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
    }[];
  };
  productCategories: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
    }[];
  };
  monthlyRevenue: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  customerAcquisition: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

interface AdminChartsProps {
  data: ChartData;
}

const AdminCharts: React.FC<AdminChartsProps> = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e7dbc7',
        },
      },
      tooltip: {
        backgroundColor: '#2a2a2a',
        titleColor: '#e7dbc7',
        bodyColor: '#e7dbc7',
        borderColor: '#a67c52',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e7dbc7',
        },
        grid: {
          color: '#3a3a3a',
        },
      },
      y: {
        ticks: {
          color: '#e7dbc7',
          callback: function(value: any) {
            return 'Rs ' + value.toLocaleString();
          },
        },
        grid: {
          color: '#3a3a3a',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e7dbc7',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#2a2a2a',
        titleColor: '#e7dbc7',
        bodyColor: '#e7dbc7',
        borderColor: '#a67c52',
        borderWidth: 1,
      },
    },
  };

  // Check if all data is zero (no orders yet)
  const hasNoData = data.salesTrend.datasets[0].data.every(val => val === 0) &&
                   data.orderStatus.datasets[0].data.every(val => val === 0) &&
                   data.productCategories.datasets[0].data.every(val => val === 0);

  return (
    <div className="space-y-6">
      {hasNoData && (
        <div className="bg-[#2a2a2a] border border-[#a67c52] rounded-lg p-6 text-center">
          <h3 className="text-[#e7dbc7] text-lg font-semibold mb-2">📊 No Data Yet</h3>
          <p className="text-[#a67c52]">
            Your dashboard will show real analytics once customers start placing orders. 
            All charts will update automatically with live data from your database.
          </p>
        </div>
      )}
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#2a2a2a] border border-[#a67c52]">
          <TabsTrigger 
            value="sales" 
            className="data-[state=active]:bg-[#a67c52] data-[state=active]:text-[#1a1a1a] text-[#e7dbc7]"
          >
            Sales Trends
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="data-[state=active]:bg-[#a67c52] data-[state=active]:text-[#1a1a1a] text-[#e7dbc7]"
          >
            Order Status
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-[#a67c52] data-[state=active]:text-[#1a1a1a] text-[#e7dbc7]"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:bg-[#a67c52] data-[state=active]:text-[#1a1a1a] text-[#e7dbc7]"
          >
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-[#a67c52]">
              <CardHeader>
                <CardTitle className="text-[#e7dbc7]">Daily Sales Trend</CardTitle>
                <CardDescription className="text-[#a67c52]">
                  Revenue over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={data.salesTrend} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-[#a67c52]">
              <CardHeader>
                <CardTitle className="text-[#e7dbc7]">Monthly Revenue</CardTitle>
                <CardDescription className="text-[#a67c52]">
                  Revenue comparison by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={data.monthlyRevenue} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-[#2a2a2a] border-[#a67c52]">
            <CardHeader>
              <CardTitle className="text-[#e7dbc7]">Order Status Distribution</CardTitle>
              <CardDescription className="text-[#a67c52]">
                Current status of all orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <Doughnut data={data.orderStatus} options={pieOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-[#2a2a2a] border-[#a67c52]">
            <CardHeader>
              <CardTitle className="text-[#e7dbc7]">Product Category Performance</CardTitle>
              <CardDescription className="text-[#a67c52]">
                Sales by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={data.productCategories} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="bg-[#2a2a2a] border-[#a67c52]">
            <CardHeader>
              <CardTitle className="text-[#e7dbc7]">Customer Acquisition</CardTitle>
              <CardDescription className="text-[#a67c52]">
                New customers over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={data.customerAcquisition} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCharts;
