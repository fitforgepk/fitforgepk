import { Instagram, Mail } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { OptimizedImage } from "./OptimizedImage";

const Footer = () => {
  const [showSizeChart, setShowSizeChart] = useState(false);

  return (
    <footer className="bg-[linear-gradient(135deg,_hsl(0,0%,14%),_hsl(0,0%,8%))] text-[hsl(45,33%,90%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand & Contact */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[hsl(45,33%,95%)] mb-2">FitForge</h3>
              <p className="text-sm text-[hsl(45,33%,90%)] max-w-xs">
                Forge your style with premium streetwear
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="mailto:fitforge.pk@gmail.com" className="text-sm text-[hsl(45,33%,95%)] hover:text-brand-purple transition-colors">
                fitforge.pk@gmail.com
              </a>
              <a href="https://instagram.com/fitforge.pk" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-600 shadow-lg hover:scale-110 transition-transform">
                <Instagram className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-6 text-sm">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Size Guide clicked');
                setShowSizeChart(true);
              }}
              className="text-[hsl(45,33%,90%)] hover:text-brand-purple transition-colors cursor-pointer bg-transparent border-none p-0 m-0"
            >
              Size Guide
            </button>
            <a href="#" className="text-[hsl(45,33%,90%)] hover:text-brand-purple transition-colors">Shipping</a>
            <a href="#" className="text-[hsl(45,33%,90%)] hover:text-brand-purple transition-colors">Returns</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[hsl(45,33%,40%)] mt-6 pt-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <p className="text-[hsl(45,33%,90%)] text-xs">
            © 2025 FitForge. All rights reserved.
          </p>
          <a
            href="mailto:fitforge.pk@gmail.com"
            className="text-xs text-[hsl(45,33%,90%)] hover:text-brand-purple transition-colors"
            title="Contact the developer"
          >
            Developed by fitforge.pk@gmail.com
          </a>
        </div>
      </div>

      {/* Size Chart Dialog */}
      <Dialog open={showSizeChart} onOpenChange={setShowSizeChart}>
        <DialogContent className="bg-white border border-[#a67c52]/20 rounded-2xl max-w-4xl w-[90vw] h-[85vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-[#1a1a1a]">Size Chart</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 pb-6" style={{height: 'calc(85vh - 80px)'}}>
            <div className="w-full h-full">
              <OptimizedImage
                src="https://ik.imagekit.io/sy6soezys/assets/public/assets/size_chart.jpg"
                alt="Size chart"
                className="w-full h-auto min-h-full object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;