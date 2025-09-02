import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { allProducts } from '@/assets/products';
import AdminCharts from '@/components/AdminCharts';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Eye,
  LogOut,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Star,
  MessageSquare,
  RefreshCw,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Palette
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
  conversionRate: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  rating: number;
  views: number;
}

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

interface AdminSettings {
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  currencyFormat: 'PKR' | 'USD';
  chartTheme: 'dark' | 'light';
  adminTheme: 'dark' | 'light'; // New theme toggle
  notifications: {
    newOrders: boolean;
    lowStock: boolean;
    dailyReports: boolean;
  };
  dashboardLayout: 'compact' | 'spacious';
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
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
  });

  // Settings state
  const [settings, setSettings] = useState<AdminSettings>({
    autoRefresh: true,
    refreshInterval: 5,
    currencyFormat: 'PKR',
    chartTheme: 'dark',
    adminTheme: 'dark',
    notifications: {
      newOrders: true,
      lowStock: true,
      dailyReports: false,
    },
    dashboardLayout: 'spacious',
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Theme helper function
  const getThemeClasses = () => {
    if (settings.adminTheme === 'light') {
      return {
        background: 'bg-gradient-to-br from-white via-gray-50 to-amber-50',
        card: 'bg-white/90 border-amber-200 shadow-lg',
        text: 'text-gray-800',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        border: 'border-amber-200',
        accent: 'text-amber-600',
        accentBg: 'bg-amber-50',
        button: 'bg-amber-500 hover:bg-amber-600 text-white',
        buttonOutline: 'border-amber-300 text-amber-700 hover:bg-amber-50',
        header: 'bg-white/95 border-amber-200',
        input: 'bg-white border-amber-200 text-gray-800',
        select: 'bg-white border-amber-200 text-gray-800',
        table: 'bg-white',
        tableHeader: 'bg-amber-50 text-gray-800',
        tableRow: 'border-amber-100 hover:bg-amber-25',
        badge: 'bg-amber-100 text-amber-800',
        chart: 'bg-white border-amber-200'
      };
    } else {
      return {
        background: 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',
        card: 'bg-[#1a1a1a]/90 border-[#e7dbc7]/20 shadow-2xl',
        text: 'text-[#e7dbc7]',
        textSecondary: 'text-[#e7dbc7]/80',
        textMuted: 'text-[#e7dbc7]/60',
        border: 'border-[#a67c52]',
        accent: 'text-[#a67c52]',
        accentBg: 'bg-[#a67c52]/10',
        button: 'bg-[#a67c52] hover:bg-[#a67c52]/90 text-[#1a1a1a]',
        buttonOutline: 'border-[#e7dbc7]/30 text-[#e7dbc7] hover:bg-[#e7dbc7]/10',
        header: 'bg-[#1a1a1a]/95 border-[#a67c52]',
        input: 'bg-[#1a1a1a]/50 border-[#e7dbc7]/20 text-[#e7dbc7]',
        select: 'bg-[#2a2a2a] border-[#a67c52] text-[#e7dbc7]',
        table: 'bg-[#1a1a1a]',
        tableHeader: 'bg-[#2a2a2a] text-[#e7dbc7]',
        tableRow: 'border-[#a67c52]/20 hover:bg-[#a67c52]/5',
        badge: 'bg-[#a67c52]/20 text-[#e7dbc7]',
        chart: 'bg-[#2a2a2a] border-[#a67c52]'
      };
    }
  };

  const theme = getThemeClasses();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Load real dashboard data from API
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load stats and chart data in parallel
        const [statsResponse, chartResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/chart-data')
        ]);

        const statsResult = await statsResponse.json();
        const chartResult = await chartResponse.json();
        
        if (statsResult.success) {
          setStats({
            totalOrders: statsResult.data.totalOrders,
            totalRevenue: statsResult.data.totalRevenue,
            totalCustomers: statsResult.data.totalCustomers,
            totalProducts: allProducts.length,
            monthlyGrowth: statsResult.data.monthlyGrowth,
            conversionRate: statsResult.data.conversionRate
          });
          
          // Update recent orders with real data
          setRecentOrders(statsResult.data.recentOrders || []);
          
          // Update top products with real data
          setTopProducts(statsResult.data.topProducts || []);
        } else {
          console.error('Failed to fetch stats:', statsResult.error);
          // Keep zeros if API fails - no fake data
          setStats({
            totalOrders: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            totalProducts: allProducts.length,
            monthlyGrowth: 0,
            conversionRate: 0
          });
        }

        // Update chart data with real data
        if (chartResult.success) {
          setChartData(chartResult.data);
          console.log('📊 Real chart data loaded:', chartResult.summary);
        } else {
          console.error('Failed to fetch chart data:', chartResult.error);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to sample data if API fails
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalProducts: allProducts.length,
          monthlyGrowth: 0,
          conversionRate: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSettingsOpen(false);
    
    // Apply auto-refresh if enabled
    if (settings.autoRefresh) {
      const intervalMs = settings.refreshInterval * 60 * 1000;
      setInterval(() => {
        loadDashboardData();
      }, intervalMs);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings: AdminSettings = {
      autoRefresh: true,
      refreshInterval: 5,
      currencyFormat: 'PKR',
      chartTheme: 'dark',
      adminTheme: 'dark',
      notifications: {
        newOrders: true,
        lowStock: true,
        dailyReports: false,
      },
      dashboardLayout: 'spacious',
    };
    setSettings(defaultSettings);
  };

  const handleRefresh = async () => {
    // Reload dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load stats and chart data in parallel
        const [statsResponse, chartResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/chart-data')
        ]);

        const statsResult = await statsResponse.json();
        const chartResult = await chartResponse.json();
        
        if (statsResult.success) {
          setStats({
            totalOrders: statsResult.data.totalOrders,
            totalRevenue: statsResult.data.totalRevenue,
            totalCustomers: statsResult.data.totalCustomers,
            totalProducts: allProducts.length,
            monthlyGrowth: statsResult.data.monthlyGrowth,
            conversionRate: statsResult.data.conversionRate
          });
          
          setRecentOrders(statsResult.data.recentOrders || []);
          setTopProducts(statsResult.data.topProducts || []);
        }

        // Update chart data with real data
        if (chartResult.success) {
          setChartData(chartResult.data);
          console.log('📊 Chart data refreshed:', chartResult.summary);
        }
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    await loadDashboardData();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/update-order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: orderId,
          status: newStatus
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the local state
        setRecentOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus as RecentOrder['status'] } : order
          )
        );
        // Refresh the dashboard to get updated stats
        handleRefresh();
      } else {
        console.error('Failed to update order status:', result.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading && stats.totalOrders === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e7dbc7] mx-auto mb-4"></div>
          <p className="text-[#e7dbc7] text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Header */}
      <header className={`${theme.header} shadow-sm border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${settings.adminTheme === 'light' ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-[#e7dbc7] to-[#a67c52]'} rounded-lg flex items-center justify-center`}>
                <BarChart3 className={`w-6 h-6 ${settings.adminTheme === 'light' ? 'text-white' : 'text-[#1a1a1a]'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme.text}`}>FitForge Admin</h1>
                <p className={`text-sm ${theme.textSecondary}`}>Dashboard & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className={theme.buttonOutline}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className={theme.buttonOutline}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className={theme.buttonOutline}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className={`${theme.card} border ${theme.border} ${theme.text} max-w-2xl`}>
                  <DialogHeader>
                    <DialogTitle className={`${theme.text} text-xl`}>Admin Settings</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Auto Refresh Settings */}
                    <div className="space-y-3">
                      <h3 className={`${theme.text} font-semibold flex items-center`}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Dashboard Refresh
                      </h3>
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-refresh" className={theme.text}>Auto Refresh</Label>
                          <Switch
                            id="auto-refresh"
                            checked={settings.autoRefresh}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefresh: checked }))}
                          />
                        </div>
                        {settings.autoRefresh && (
                          <div className="space-y-2">
                            <Label htmlFor="refresh-interval" className={theme.text}>Refresh Interval (minutes)</Label>
                            <Select
                              value={settings.refreshInterval.toString()}
                              onValueChange={(value) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(value) }))}
                            >
                              <SelectTrigger className={`${theme.select} border ${theme.border}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={`${theme.select} border ${theme.border}`}>
                                <SelectItem value="1">1 minute</SelectItem>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="10">10 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Currency Settings */}
                    <div className="space-y-3">
                      <h3 className={`${theme.text} font-semibold flex items-center`}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Currency Display
                      </h3>
                      <div className="pl-6">
                        <Select
                          value={settings.currencyFormat}
                          onValueChange={(value: 'PKR' | 'USD') => setSettings(prev => ({ ...prev, currencyFormat: value }))}
                        >
                          <SelectTrigger className={`${theme.select} border ${theme.border}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className={`${theme.select} border ${theme.border}`}>
                            <SelectItem value="PKR">Pakistani Rupee (Rs)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-3">
                      <h3 className={`${theme.text} font-semibold flex items-center`}>
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </h3>
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-orders" className={theme.text}>New Order Alerts</Label>
                          <Switch
                            id="new-orders"
                            checked={settings.notifications.newOrders}
                            onCheckedChange={(checked) => setSettings(prev => ({ 
                              ...prev, 
                              notifications: { ...prev.notifications, newOrders: checked }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="low-stock" className={theme.text}>Low Stock Warnings</Label>
                          <Switch
                            id="low-stock"
                            checked={settings.notifications.lowStock}
                            onCheckedChange={(checked) => setSettings(prev => ({ 
                              ...prev, 
                              notifications: { ...prev.notifications, lowStock: checked }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="daily-reports" className={theme.text}>Daily Reports</Label>
                          <Switch
                            id="daily-reports"
                            checked={settings.notifications.dailyReports}
                            onCheckedChange={(checked) => setSettings(prev => ({ 
                              ...prev, 
                              notifications: { ...prev.notifications, dailyReports: checked }
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Layout Settings */}
                    <div className="space-y-3">
                      <h3 className={`${theme.text} font-semibold flex items-center`}>
                        <Monitor className="w-4 h-4 mr-2" />
                        Dashboard Layout
                      </h3>
                      <div className="pl-6">
                        <Select
                          value={settings.dashboardLayout}
                          onValueChange={(value: 'compact' | 'spacious') => setSettings(prev => ({ ...prev, dashboardLayout: value }))}
                        >
                          <SelectTrigger className={`${theme.select} border ${theme.border}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className={`${theme.select} border ${theme.border}`}>
                            <SelectItem value="spacious">Spacious Layout</SelectItem>
                            <SelectItem value="compact">Compact Layout</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="space-y-3">
                      <h3 className={`${theme.text} font-semibold flex items-center`}>
                        <Palette className="w-4 h-4 mr-2" />
                        Admin Theme
                      </h3>
                      <div className="pl-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="admin-theme" className={theme.text}>Light Theme (White & Golden)</Label>
                            <p className={`${theme.textMuted} text-sm`}>Switch to a clean white and golden theme</p>
                          </div>
                          <Switch
                            id="admin-theme"
                            checked={settings.adminTheme === 'light'}
                            onCheckedChange={(checked) => setSettings(prev => ({ 
                              ...prev, 
                              adminTheme: checked ? 'light' : 'dark'
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex justify-between pt-4 border-t ${theme.border}`}>
                    <Button
                      variant="outline"
                      onClick={handleResetSettings}
                      className={`${theme.buttonOutline} hover:${theme.accentBg}`}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSettingsOpen(false)}
                        className={`${theme.buttonOutline} hover:${theme.accentBg}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className={theme.button}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={handleLogout} className={theme.buttonOutline}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">Rs {order.amount}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Best selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="w-3 h-3 mr-1" />
                              {product.views}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">{product.sales} sales</p>
                          <p className="text-sm text-muted-foreground">Rs {product.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Complete order management and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-[#a67c52]">
                            <p className="text-lg font-medium mb-2">📦 No Orders Yet</p>
                            <p>Orders will appear here once customers start placing them.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>Rs {order.amount}</TableCell>
                          <TableCell>
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Detailed analytics for all products</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-[#a67c52]">
                            <p className="text-lg font-medium mb-2">📊 No Product Data Yet</p>
                            <p>Product performance will appear here once orders are placed.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>Rs {product.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1">{product.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.views}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Charts Section */}
            <AdminCharts data={chartData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#2a2a2a] border-[#a67c52]">
                <CardHeader>
                  <CardTitle className="text-[#e7dbc7]">Conversion Rate</CardTitle>
                  <CardDescription className="text-[#a67c52]">Website conversion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#e7dbc7]">{stats.conversionRate}%</div>
                  <p className="text-sm text-[#a67c52] mt-2">
                    Average conversion rate across all traffic sources
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#2a2a2a] border-[#a67c52]">
                <CardHeader>
                  <CardTitle className="text-[#e7dbc7]">Monthly Growth</CardTitle>
                  <CardDescription className="text-[#a67c52]">Growth metrics for this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">+{stats.monthlyGrowth}%</div>
                  <p className="text-sm text-[#a67c52] mt-2">
                    Compared to last month's performance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Product Categories */}
            <Card className="bg-[#2a2a2a] border-[#a67c52]">
              <CardHeader>
                <CardTitle className="text-[#e7dbc7]">Product Categories</CardTitle>
                <CardDescription className="text-[#a67c52]">Distribution of products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Regular Fit', 'Oversized Tee', 'Crop Top', 'Drop Shoulder'].map((category) => {
                    const categoryCount = allProducts.filter(p => p.category === category).length;
                    return (
                      <div key={category} className="text-center p-4 border border-[#a67c52] rounded-lg bg-[#1a1a1a]">
                        <div className="text-2xl font-bold text-[#e7dbc7]">{categoryCount}</div>
                        <div className="text-sm text-[#a67c52]">{category}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-[#a67c52]">
              <CardHeader>
                <CardTitle className="text-[#e7dbc7]">Quick Actions</CardTitle>
                <CardDescription className="text-[#a67c52]">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#a67c52] text-[#e7dbc7] hover:bg-[#a67c52] hover:text-[#1a1a1a]">
                    <Package className="w-6 h-6 mb-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#a67c52] text-[#e7dbc7] hover:bg-[#a67c52] hover:text-[#1a1a1a]">
                    <Users className="w-6 h-6 mb-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#a67c52] text-[#e7dbc7] hover:bg-[#a67c52] hover:text-[#1a1a1a]">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    View Messages
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-[#a67c52] text-[#e7dbc7] hover:bg-[#a67c52] hover:text-[#1a1a1a]">
                    <Calendar className="w-6 h-6 mb-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
