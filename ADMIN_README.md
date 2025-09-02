# FitForge Admin Dashboard

## Overview
The FitForge admin dashboard provides comprehensive analytics and management tools for the Pakistani streetwear e-commerce website. It includes **real-time order tracking**, **live product performance metrics**, **customer analytics**, and **administrative controls** with accurate Pakistani Rupee (Rs) pricing and **real data from your MongoDB database**.

## Access Information

### Admin Credentials
- **Email**: `fitforge.pk@gmail.com`
- **Password**: `lm@10ls@9ag@17`

### Access URLs
- **Login Page**: `/admin/login`
- **Dashboard**: `/admin/dashboard`

## Features

### 🔐 Authentication
- Secure login system with fixed credentials
- Session persistence using localStorage
- Automatic redirect to login for unauthorized access
- Protected routes for admin-only content

### 📊 Dashboard Analytics
- **Overview Tab**:
  - **Real-time** total orders, revenue, customers, and products from your database
  - **Live** recent orders with status tracking
  - **Actual** top performing products with real sales data
  - **Calculated** monthly growth metrics

- **Orders Tab**:
  - **Complete order management** with real orders from your database
  - **Live order status updates** (pending, confirmed, shipped, delivered, cancelled)
  - **Real customer and product information**
  - **Actual order amounts and dates** in Pakistani Rupees

- **Products Tab**:
  - **Real product performance analytics** from actual sales
  - **Live sales and revenue metrics** from your database
  - **Actual product categories** from your product catalog
  - **Product management actions**

- **Analytics Tab**:
  - **Real conversion rate metrics**
  - **Calculated monthly growth statistics** from actual data
  - **Live product category distribution** (Regular Fit, Oversized Tee, Crop Top, Drop Shoulder)
  - **Quick action buttons** for common tasks

### 🎨 UI/UX Features
- Modern, responsive design matching FitForge's beige/black color scheme
- Gradient backgrounds using brand colors (#e7dbc7, #a67c52, #1a1a1a)
- Tabbed interface for organized content
- Status badges with color coding
- Interactive elements with hover effects
- Mobile-friendly responsive layout
- Pakistani Rupee (Rs) currency formatting throughout

### 🔒 Security Features
- Protected routes that require authentication
- Automatic session management
- Secure logout functionality
- No admin content exposed to public users

## Technical Implementation

### Components Created
1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages authentication state
   - Handles login/logout functionality
   - Provides authentication context to components

2. **AdminLogin** (`src/pages/AdminLogin.tsx`)
   - Beautiful login form with gradient design
   - Form validation and error handling
   - Loading states and user feedback

3. **AdminDashboard** (`src/pages/AdminDashboard.tsx`)
   - Comprehensive dashboard with multiple tabs
   - **Real-time statistics and metrics from your database**
   - **Live order management with status updates**
   - Interactive tables and data visualization

4. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Route protection component
   - Automatic redirect to login for unauthorized users
   - Loading state management

### API Endpoints Created
1. **`/api/admin/stats`** - Fetches real-time dashboard statistics
2. **`/api/admin/orders`** - Retrieves all orders for management
3. **`/api/admin/update-order`** - Updates order status in real-time

### Routing
- Admin routes are separate from public routes
- No header/footer on admin pages for clean interface
- Protected dashboard route with authentication check

### Styling
- Uses existing Tailwind CSS and shadcn/ui components
- Consistent with website's design language
- Gradient themes and modern UI elements
- Responsive design for all screen sizes

## Usage Instructions

1. **Accessing the Admin Panel**:
   - Navigate to `/admin/login` or click the "Admin" link in the main navigation
   - Enter the provided credentials
   - You'll be redirected to the dashboard upon successful login

2. **Using the Dashboard**:
   - Browse through different tabs (Overview, Orders, Products, Analytics)
   - View **real-time statistics and metrics from your database**
   - **Update order statuses** directly from the Orders tab
   - Monitor **actual customer information and order details**
   - Track **real product performance** and sales data
   - Use the **Refresh button** to get the latest data

3. **Managing Orders**:
   - Go to the "Orders" tab to see all real orders
   - **Change order status** using the dropdown (Pending → Confirmed → Shipped → Delivered)
   - **Real-time updates** - changes are saved to your database immediately
   - View actual customer names, products, and amounts in Pakistani Rupees

4. **Logging Out**:
   - Click the "Logout" button in the top-right corner
   - You'll be redirected to the login page
   - Session will be cleared automatically

## Future Enhancements

The dashboard is designed to be easily extensible. Potential future features could include:
- Real-time order updates
- Product inventory management
- Customer communication tools
- Advanced analytics and reporting
- Bulk order processing
- Email notification system
- Export functionality for reports

## Security Notes

- Credentials are hardcoded for simplicity but should be moved to environment variables in production
- Consider implementing JWT tokens for enhanced security
- Add rate limiting for login attempts
- Implement audit logging for admin actions
- Consider two-factor authentication for production use
