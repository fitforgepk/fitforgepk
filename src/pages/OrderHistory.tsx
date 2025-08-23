import { useState } from "react";
import { getFitLabelByName } from "@/lib/utils";

const OrderHistory = () => {
  const [identifier, setIdentifier] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!identifier) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`http://localhost:5000/api/orders?identifier=${encodeURIComponent(identifier)}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      setError('Failed to connect to server');
      setOrders([]);
    } finally {
      setLoading(false);
      setTouched(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-black mb-8 mt-12">Order History</h1>
      <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-lg space-y-6 mb-8">
        <label className="block mb-2 font-semibold" htmlFor="identifier">
          Enter your email or phone number
        </label>
        <input
          className="w-full p-3 rounded-lg border border-border bg-muted/30 text-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
          type="text"
          id="identifier"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          placeholder="Email or phone number"
        />
        <button
          className="w-full py-3 rounded-lg bg-[hsl(0,0%,10%)] text-[hsl(45,33%,90%)] font-bold text-lg hover:bg-[hsl(0,0%,0%)] hover:text-[hsl(45,33%,100%)] transition shadow-lg border border-[hsl(45,33%,90%)] disabled:opacity-50"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'View Order History'}
        </button>
      </div>
      
      {error && (
        <div className="text-lg text-red-500 mb-8">{error}</div>
      )}
      
      {touched && !loading && orders.length === 0 && !error && (
        <div className="text-lg text-red-500 mb-8">No orders found for this identifier.</div>
      )}
      
      {orders.length > 0 && (
        <div className="w-full max-w-2xl space-y-8">
          {orders.map((order, idx) => (
            <div key={order.orderNumber + idx} className="bg-card p-6 rounded-2xl shadow space-y-2 border border-border">
              <div className="font-bold text-lg mb-1">Order #{order.orderNumber}</div>
              <div className="text-sm text-muted-foreground mb-2">Placed on {new Date(order.date).toLocaleString()}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div><span className="font-semibold">Name:</span> {order.name}</div>
              <div><span className="font-semibold">Email:</span> {order.email}</div>
              <div><span className="font-semibold">Phone:</span> {order.phone}</div>
              <div><span className="font-semibold">Address:</span> {order.address}</div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="font-bold mb-1">Order Summary</div>
                <ul className="mb-2">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm mb-1">
                      <span>
                        {item.name} x {item.quantity}
                        {item.size && ` (Size: ${item.size})`}
                        {(() => {
                          const fit = getFitLabelByName(item.name);
                          return fit ? ` — ${fit}` : "";
                        })()}
                      </span>
                      <span>Rs {item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>Rs {order.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 