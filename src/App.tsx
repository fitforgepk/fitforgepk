import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Anime from "./pages/Anime";
import Gaming from "./pages/Gaming";
import Collection from "./pages/Collection";
import Category from "./pages/Category";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Sale from "./pages/Sale";
import Unisex from "./pages/Unisex";
import Customized from "./pages/Customized";
import { CartProvider, CartUIProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Checkout from "./pages/Checkout";
import { HeroBgProvider } from "@/components/HeroBgContext";
import { LoaderProvider } from "@/components/LoaderContext";
import Loader from "@/components/Loader";
import { useLoader } from "@/components/LoaderContext";
import ProductDetails from "./pages/ProductDetails";
import OrderHistory from "./pages/OrderHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppLoader = () => {
  const { loading } = useLoader();
  return loading ? <Loader /> : null;
};

// Sends GA4 page_view on client-side route changes (skip initial load to avoid double-counting)
const RouteAnalytics = () => {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    const pageLocation = typeof window !== "undefined" ? window.location.href : undefined;
    const pageTitle = typeof document !== "undefined" ? document.title : undefined;
    const gtag = (typeof window !== "undefined" && (window as any).gtag) ? (window as any).gtag : null;
    if (gtag) {
      gtag("event", "page_view", {
        page_title: pageTitle,
        page_location: pageLocation,
        page_path: pagePath,
        send_to: "G-L0H5JX07ZV",
      });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <CartUIProvider>
        <CartProvider>
          <HeroBgProvider>
            <LoaderProvider>
              <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppLoader />
                  <BrowserRouter>
                    <Routes>
                      {/* Admin Routes - No Header/Footer */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      
                      {/* Public Routes - With Header/Footer */}
                      <Route path="/*" element={
                        <>
                          <Header />
                          <RouteAnalytics />
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/anime" element={<Anime />} />
                            <Route path="/gaming" element={<Gaming />} />
                            <Route path="/collection" element={<Collection />} />
                            <Route path="/category" element={<Category />} />
                            <Route path="/men" element={<Men />} />
                            <Route path="/women" element={<Women />} />
                            <Route path="/sale" element={<Sale />} />
                            <Route path="/unisex" element={<Unisex />} />
                            <Route path="/customized" element={<Customized />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/order-history" element={<OrderHistory />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <Footer />
                          <Analytics />
                          {/* WhatsApp Floating Button */}
                          <a
                            href="https://wa.me/923392183002"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat with us on WhatsApp"
                            className="fixed z-50 bottom-6 right-6"
                          >
                            <button
                              style={{
                                background: "#25d366",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "60px",
                                height: "60px",
                                boxShadow: "0 4px 24px 0 rgba(37, 211, 102, 0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                transition: "box-shadow 0.3s, transform 0.2s",
                                cursor: "pointer",
                              }}
                              title="Chat with us on WhatsApp"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.19-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.22-1.44l-.37-.22-3.68.97.98-3.59-.24-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.65 0 5.15 1.03 7.03 2.9A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                              </svg>
                            </button>
                          </a>
                        </>
                      } />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </QueryClientProvider>
            </LoaderProvider>
          </HeroBgProvider>
        </CartProvider>
      </CartUIProvider>
    </AuthProvider>
  );
};

export default App;
