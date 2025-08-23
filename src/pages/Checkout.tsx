import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import { useNavigate } from "react-router-dom";
import { getFitLabelByName } from "@/lib/utils";
import { ShoppingCart, Truck, Shield, CheckCircle, ArrowLeft, CreditCard, MapPin, User, Mail, Phone } from "lucide-react";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderCart, setOrderCart] = useState<typeof cartItems>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal < 2000 ? 150 : 0;
  const total = subtotal + deliveryFee;

  // Scroll to top when component mounts or when submitted changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.phone) newErrors.phone = "Phone number is required.";
    if (!form.address) newErrors.address = "Address is required.";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required.";
    return newErrors;
  };

  const saveOrderToDatabase = async (order: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to save order to database:', error);
      throw error;
    }
  };

  const sendOrderEmail = async (order: any) => {
    try {
      console.log('📧 Attempting to send order email:', order);

      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      console.log('✅ Email result:', result);

      if (result.customerSuccess) {
        console.log('✅ Customer email sent successfully');
      } else {
        console.warn('⚠️ Customer email failed, but order was processed');
      }

    } catch (err) {
      console.error('❌ Failed to send order email:', err);

      try {
        console.log('🔄 Trying backup email service...');
        const backupResponse = await fetch('/api/send-order-backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        const backupResult = await backupResponse.json();
        console.log('✅ Backup email service result:', backupResult);

      } catch (backupErr) {
        console.error('❌ Backup email service also failed:', backupErr);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Ensure sizes are only S, M, L
    const filteredCartItems = cartItems.map(item => ({
      ...item,
      size: ["S", "M", "L"].includes(item.size) ? item.size : "S"
    }));

    const now = new Date();
    const datePart = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `FF-${datePart}-${randomPart}`;

    setOrderNumber(orderNum);
    setOrderCart(filteredCartItems);
    setOrderTotal(total);
    setSubmitted(true);

    const orderObj = {
      orderNumber: orderNum,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      paymentMethod: paymentMethod,
      items: filteredCartItems,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      date: now.toISOString(),
    };

    saveOrderToDatabase(orderObj);
    sendOrderEmail(orderObj);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e7dbc7]/20 via-background to-[#a67c52]/10 text-foreground relative overflow-hidden py-20">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#a67c52]/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#e7dbc7]/30 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#a67c52]/15 rounded-full animate-spin"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-4">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-[#a67c52] to-[#805206] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-[#a67c52]/30 rounded-full animate-ping"></div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#1a1a1a] via-[#a67c52] to-[#1a1a1a] bg-clip-text text-transparent">
              Order Confirmed! 🎉
            </h1>
            <p className="text-xl text-[#805206] font-medium">
              Thank you for your purchase! A confirmation email will be sent to you soon.
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-gradient-to-r from-[#e7dbc7]/50 to-[#a67c52]/20 p-6 rounded-2xl border border-[#a67c52]/30 shadow-lg">
            <p className="text-sm text-[#805206] mb-2 font-medium">Your Order Number:</p>
            <p className="text-3xl font-bold text-[#1a1a1a] tracking-wider font-mono">{orderNumber}</p>
          </div>

          {/* Order Details */}
          <div className="w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#a67c52]/20 space-y-6">
            <h2 className="font-bold text-2xl mb-6 text-center text-[#1a1a1a]">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#a67c52]" />
                <span className="font-semibold text-[#a67c52]">Name:</span> {form.name}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#a67c52]" />
                <span className="font-semibold text-[#a67c52]">Email:</span> {form.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#a67c52]" />
                <span className="font-semibold text-[#a67c52]">Phone:</span> {form.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a67c52]" />
                <span className="font-semibold text-[#a67c52]">Address:</span> {form.address}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#a67c52]" />
                <span className="font-semibold text-[#a67c52]">Payment:</span> {paymentMethod}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-[#a67c52]/30 pt-6 mt-6">
              <h3 className="font-bold mb-4 text-center text-[#1a1a1a] text-lg">Order Summary</h3>
              <div className="space-y-3">
                {orderCart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm bg-[#e7dbc7]/20 p-3 rounded-lg">
                    <span className="text-[#1a1a1a]">
                      {item.name} ({item.size}) x {item.quantity}
                      {(() => {
                        const fit = getFitLabelByName(item.name);
                        return fit ? ` — ${fit}` : "";
                      })()}
                    </span>
                    <span className="font-semibold text-[#a67c52]">Rs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-[#805206] mt-3 bg-red-50 p-3 rounded-lg">
                  <span>Delivery Fee:</span>
                  <span>Rs {deliveryFee}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-xl mt-6 pt-4 border-t border-[#a67c52]/30">
                <span className="text-[#1a1a1a]">Total:</span>
                <span className="text-[#a67c52]">Rs {orderTotal}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#a67c52] to-[#805206] text-white font-bold hover:from-[#805206] hover:to-[#a67c52] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#a67c52]/30"
              onClick={() => navigate("/")}
            >
              🏠 Back to Home
            </button>
            <button
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#e7dbc7] to-[#a67c52] text-[#1a1a1a] font-bold hover:from-[#a67c52] hover:to-[#e7dbc7] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#a67c52]/30"
              onClick={() => navigate("/order-history")}
            >
              📋 View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e7dbc7]/20 via-background to-[#a67c52]/10 text-foreground">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#a67c52]/20 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="w-10 h-10 text-[#a67c52]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Your cart is empty</h1>
          <p className="text-[#805206] text-lg">Add some products to get started!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#a67c52] text-white rounded-lg hover:bg-[#805206] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e7dbc7]/20 via-background to-[#a67c52]/10 text-foreground">
      {/* Header Navigation */}
      <div className="absolute top-8 left-8 z-30">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#1a1a1a] px-4 py-2 rounded-lg border border-[#a67c52]/20 shadow-lg backdrop-blur-sm transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Shipping Banner */}
      <div className="w-full py-4 bg-gradient-to-r from-[#a67c52] to-[#805206] shadow-lg mt-20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-lg tracking-wide">
            <Truck className="w-5 h-5" />
            <span>Free shipping over 2000 PKR (Lahore only)</span>
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-[#1a1a1a] mb-4">Checkout</h1>
            <p className="text-xl text-[#805206] max-w-2xl mx-auto">
              Complete your order and get ready to receive your premium FitForge streetwear
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#a67c52]/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-[#a67c52]" />
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-[#e7dbc7]/20 p-4 rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a1a1a]">{item.name}</p>
                      <p className="text-sm text-[#805206]">
                        Size: {["S", "M", "L"].includes(item.size) ? item.size : "S"} | 
                        Quantity: {item.quantity}
                        {(() => {
                          const fit = getFitLabelByName(item.name);
                          return fit ? ` | Fit: ${fit}` : "";
                        })()}
                      </p>
                    </div>
                    <span className="font-bold text-[#a67c52] text-lg">Rs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 p-6 bg-gradient-to-r from-[#e7dbc7]/30 to-[#a67c52]/10 rounded-2xl border border-[#a67c52]/20">
                <div className="flex justify-between text-[#1a1a1a]">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Rs {subtotal}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#805206]">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">Rs {deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-2xl pt-3 border-t border-[#a67c52]/30">
                  <span className="text-[#1a1a1a]">Total:</span>
                  <span className="text-[#a67c52]">Rs {total}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center space-x-4 mt-6">
                <div className="flex items-center gap-2 bg-[#e7dbc7]/50 px-3 py-2 rounded-full border border-[#a67c52]/20">
                  <Shield className="w-4 h-4 text-[#a67c52]" />
                  <span className="text-xs font-medium text-[#1a1a1a]">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 bg-[#e7dbc7]/50 px-3 py-2 rounded-full border border-[#a67c52]/20">
                  <CheckCircle className="w-4 h-4 text-[#a67c52]" />
                  <span className="text-xs font-medium text-[#1a1a1a]">COD Available</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#a67c52]/10 p-8">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-[#1a1a1a]" htmlFor="name">
                    <User className="w-4 h-4 inline mr-2 text-[#a67c52]" />
                    Full Name
                  </label>
                  <input
                    className="w-full p-4 rounded-xl border border-[#a67c52]/30 bg-[#e7dbc7]/10 text-lg focus:outline-none focus:ring-2 focus:ring-[#a67c52]/50 focus:border-[#a67c52] transition-all duration-300"
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#1a1a1a]" htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2 text-[#a67c52]" />
                    Email Address
                  </label>
                  <input
                    className="w-full p-4 rounded-xl border border-[#a67c52]/30 bg-[#e7dbc7]/10 text-lg focus:outline-none focus:ring-2 focus:ring-[#a67c52]/50 focus:border-[#a67c52] transition-all duration-300"
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#1a1a1a]" htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2 text-[#a67c52]" />
                    Phone Number
                  </label>
                  <input
                    className="w-full p-4 rounded-xl border border-[#a67c52]/30 bg-[#e7dbc7]/10 text-lg focus:outline-none focus:ring-2 focus:ring-[#a67c52]/50 focus:border-[#a67c52] transition-all duration-300"
                    type="tel"
                    name="phone"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9\-\+\s\(\)]{7,15}"
                    placeholder="e.g. 0300-1234567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#1a1a1a]" htmlFor="address">
                    <MapPin className="w-4 h-4 inline mr-2 text-[#a67c52]" />
                    Shipping Address
                  </label>
                  <textarea
                    className="w-full p-4 rounded-xl border border-[#a67c52]/30 bg-[#e7dbc7]/10 text-lg focus:outline-none focus:ring-2 focus:ring-[#a67c52]/50 focus:border-[#a67c52] transition-all duration-300 resize-none"
                    rows={3}
                    name="address"
                    id="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your complete shipping address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-gradient-to-r from-[#e7dbc7]/30 to-[#a67c52]/10 rounded-xl border border-[#a67c52]/20">
                  <label className="block mb-2 font-semibold text-[#1a1a1a]">
                    <CreditCard className="w-4 h-4 inline mr-2 text-[#a67c52]" />
                    Payment Method
                  </label>
                  <div className="flex items-center gap-3 text-lg text-[#805206] font-medium">
                    <CheckCircle className="w-5 h-5 text-[#a67c52]" />
                    Cash on Delivery (COD)
                  </div>
                  <p className="text-sm text-[#805206] mt-2">Pay when you receive your order</p>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a67c52] to-[#805206] text-white font-bold text-lg hover:from-[#805206] hover:to-[#a67c52] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#a67c52]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
