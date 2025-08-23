import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Search, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { CartContext, CartUIContext } from "@/components/CartContext";
import { useHeroBg } from "@/components/HeroBgContext";
import FFlogo from "@/assets/FFlogo.png";
import { allProducts } from "@/assets/products";
import { getFitLabelByName } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUtils";

const FALLBACK_IMAGE = "https://via.placeholder.com/150?text=Custom+Design";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { cartCount, cartItems, removeFromCart } = useContext(CartContext);
  const { heroBg, toggleHeroBg } = useHeroBg();
  const { cartOpen, setCartOpen } = useContext(CartUIContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for global event to open mobile menu (triggered from Hero "Discover More" on mobile)
  useEffect(() => {
    const openMobileMenu = () => setIsMenuOpen(true);
    window.addEventListener('open-mobile-menu', openMobileMenu as EventListener);
    return () => window.removeEventListener('open-mobile-menu', openMobileMenu as EventListener);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      )
    );
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl bg-[rgba(30,30,36,0.85)] shadow-xl border-b-0 before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-1 before:bg-gradient-to-r before:from-brand-purple before:via-[#e7dbc7] before:to-brand-purple before:rounded-b-xl before:blur-[2px] ${
      isScrolled 
        ? 'bg-[linear-gradient(135deg,_hsl(0,0%,15%),_hsl(45,33%,30%))]/90 shadow-elegant border-b border-[hsl(45,33%,30%)]' 
        : 'bg-gradient-hero/80'
    }`} style={{boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)'}}>
      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            className="w-full p-3 rounded-lg border border-border bg-muted/30 text-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="mt-4 text-muted-foreground text-sm">
            {searchQuery && searchResults.length === 0 && (
              <div>No products found.</div>
            )}
            {searchResults.length > 0 && (
              <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center gap-4 px-2 py-3 hover:bg-muted/40 transition rounded-lg"
                      onClick={() => setSearchOpen(false)}
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] rounded-lg border border-border" />
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                        <div className="text-sm font-bold text-[#e7dbc7]">Rs {product.price}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!searchQuery && <div>Type to search for products by name or category.</div>}
          </div>
        </DialogContent>
      </Dialog>
      {/* Cart Drawer */}
      <Drawer open={cartOpen} onOpenChange={setCartOpen}>
        <DrawerContent className="max-w-md ml-auto">
          <DrawerHeader>
            <DrawerTitle>Your Cart</DrawerTitle>
          </DrawerHeader>
          {/* Static Red Banner */}
    <div className="w-full py-2 bg-red-600 text-center">
      <span className="text-white font-bold text-sm tracking-wide">
        Free shipping over 2000-Rs (for Lahore only)
      </span>
    </div>
          <div className="p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-muted-foreground">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                

{cartItems.map((item) => (
  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 border-b pb-2 relative">
    <img src={getImageUrl(item.image)} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]" onError={e => { e.currentTarget.src = FALLBACK_IMAGE; }} />
    <div className="flex-1">
      <div className="font-semibold text-foreground">{item.name}</div>
      <div className="text-xs text-muted-foreground">
        {(() => {
          const fit = getFitLabelByName(item.name);
          return fit ? `${fit} • ` : "";
        })()}
        Size: {item.size} | Rs {item.price} x {item.quantity}
      </div>
    </div>
    <div className="font-bold text-[#e7dbc7]">Rs {item.price * item.quantity}</div>
    <button
      className="absolute top-1 right-0 p-1 text-muted-foreground hover:text-destructive"
      onClick={() => removeFromCart(item.id)}
      aria-label={`Remove ${item.name} from cart`}
    >
      <X className="w-4 h-4" />
    </button>
  </div>
))}


              </div>
            )}
            <Button
              className="w-full mt-4"
              variant="hero"
              disabled={cartItems.length === 0}
              onClick={() => {
                setCartOpen(false);
                window.location.href = '/checkout';
              }}
            >
              Checkout
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" className="absolute top-4 right-4">Close</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-20'
        }`}>
          {/* Logo */}
          <a href="/" className="logo flex items-center gap-2 group relative">
            <span className="relative">
              {/* Beige inner ring behind logo */}
              <span className="absolute inset-0 rounded-full bg-[#e7dbc7] scale-110 z-0"></span>
              <img src={FFlogo} alt="FitForge Logo" className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white/80 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 relative z-10" />
              <span className="absolute inset-0 rounded-full ring-2 ring-brand-purple/40 group-hover:ring-4 group-hover:ring-brand-purple/80 animate-glow z-20" aria-hidden="true"></span>
            </span>
            <span className="font-serif font-extrabold text-3xl bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple bg-clip-text text-transparent drop-shadow-lg tracking-wider group-hover:scale-105 transition-transform duration-300">FitForge</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Add a subtle gradient underline and font enhancements */}
            <Link to="/collection" className="relative group text-foreground hover:text-brand-purple transition-all duration-300 font-semibold tracking-wide text-lg px-2">
              Collection
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="/men" className="relative group text-foreground hover:text-brand-purple transition-all duration-300 font-semibold tracking-wide text-lg px-2">
              Men
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="/women" className="relative group text-foreground hover:text-brand-purple transition-all duration-300 font-semibold tracking-wide text-lg px-2">
              Women
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="/unisex" className="relative group text-foreground hover:text-brand-purple transition-all duration-300 font-semibold tracking-wide text-lg px-2">
              Unisex
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link to="/customized" className="relative group text-foreground hover:text-brand-purple transition-all duration-300 font-semibold tracking-wide text-lg px-2">
              Customized
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hover:bg-brand-purple/20 hover:scale-110 transition-all duration-300 focus:ring-2 focus:ring-brand-purple" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/order-history">
              <Button variant="ghost" size="icon" className="hover:bg-brand-purple/20 hover:scale-110 transition-all duration-300 focus:ring-2 focus:ring-brand-purple">
                <Clock className="h-5 w-5" />
                <span className="sr-only">Order History</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative hover:bg-brand-purple/20 hover:scale-110 transition-all duration-300 group focus:ring-2 focus:ring-brand-purple" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-brand-purple via-[#e7dbc7] to-brand-purple text-brand-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 border border-[hsl(45,33%,56%)] animate-bounce-badge shadow-lg">
                +{cartCount}
              </span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay - Touch to Close */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="md:hidden relative z-50">
              {/* Mobile Menu Header with Close Button */}
              <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
                <h3 className="text-lg font-semibold text-foreground">Menu</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:bg-brand-purple/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Mobile Menu Content */}
              <div className="px-2 pb-3 space-y-1 bg-card">
                <Link
                  to="/collection"
                  className="block px-3 py-3 text-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Collection
                </Link>
                <Link
                  to="/men"
                  className="block px-3 py-3 text-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  to="/women"
                  className="block px-3 py-3 text-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women
                </Link>
                <Link
                  to="/unisex"
                  className="block px-3 py-3 text-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Unisex
                </Link>
                <Link
                  to="/customized"
                  className="block px-3 py-3 text-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Customized
                </Link>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 px-3 py-4 border-t border-border mt-4">
                  <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="hover:bg-brand-purple/20">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.location.href = '/order-history'} className="hover:bg-brand-purple/20">
                    <Clock className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="relative hover:bg-brand-purple/20" onClick={() => setCartOpen(true)}>
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-brand-purple text-brand-light text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;