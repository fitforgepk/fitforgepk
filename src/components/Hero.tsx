import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useHeroBg } from "@/components/HeroBgContext";
import heroImage1 from "@/assets/beigeblack.jpg";
import heroImage2 from "@/assets/beigeblack2.png";
import heroPic1 from "/assets/heropic1.jpg";
import heroPic2 from "/assets/heropic2.jpg";
import FFlogo from "@/assets/FFlogo.png";

// BlurUpImage component for progressive image loading
const BlurUpImage = ({ 
  src, 
  alt, 
  className = "", 
  style = {}, 
  placeholderSrc = null 
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholderSrc?: string | null;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a tiny blurred version for placeholder
    if (placeholderSrc) {
      setImageSrc(placeholderSrc);
    } else {
      // Generate a tiny version by scaling down the original
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create a very small version (20x20) for the blur effect
          canvas.width = 20;
          canvas.height = 20;
          ctx.drawImage(img, 0, 0, 20, 20);
          const tinyUrl = canvas.toDataURL('image/jpeg', 0.1);
          setImageSrc(tinyUrl);
        }
      };
      img.src = src;
    }
  }, [src, placeholderSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Blurred placeholder */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden={isLoaded}
        />
      )}
      
      {/* Full resolution image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        style={style}
      />
      
      {/* Skeleton loading state */}
      {!imageSrc && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
      )}
    </div>
  );
};

// Typewriter effect hook
function useTypewriter(text: string, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate intervals under React 18 Strict Mode (dev only)
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    setDisplayed("");
    let i = 0;

    const tick = () => {
      setDisplayed((prev) => {
        if (i < text.length) {
          const next = prev + text[i];
          i += 1;
          return next;
        }
        // Finished typing; stop interval safely
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      });
    };

    intervalRef.current = window.setInterval(tick, speed);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed]);

  return displayed;
}

const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const { heroBg, toggleHeroBg } = useHeroBg();
  const tagline = useTypewriter("Luxury streetwear, crafted for royalty.", 40);

  // Auto-toggle hero background every 4 seconds (less frequent)
  useEffect(() => {
    const interval = setInterval(() => {
      toggleHeroBg();
    }, 4000);
    return () => clearInterval(interval);
  }, [toggleHeroBg]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY * 0.3;
        bgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate content in and ensure opacity is set to 100 after animation
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.add("animate-hero-fade-in");
      const handleAnimationEnd = () => {
        setContentVisible(true);
      };
      const node = contentRef.current;
      node.addEventListener("animationend", handleAnimationEnd);
      return () => node.removeEventListener("animationend", handleAnimationEnd);
    }
  }, []);

  const handleDiscover = () => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      window.dispatchEvent(new Event('open-mobile-menu'));
      return;
    }
    const element = document.getElementById('featured');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Images - alternating based on heroBg state */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* First background image */}
        <img 
          src={heroPic1}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 filter blur-sm ${heroBg === 'beigeblack.jpg' ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />
        {/* Second background image */}
        <img 
          src={heroPic2}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 filter blur-sm ${heroBg === 'beigeblack.jpg' ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden="true"
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      {/* Parallax Background Image (fallback, can be removed if not needed) */}
      {/*
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform transition-transform duration-700 z-10"
        aria-hidden="true"
      >
        <BlurUpImage
          src={heroBg === 'beigeblack.jpg' ? heroImage1 : heroImage2}
          alt="Hero background"
          className="w-full h-full opacity-50"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/60 to-transparent" />
      </div>
      */}

      {/* Animated Sparkle/Glow Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Example sparkles using CSS animation, can be enhanced with a library if desired */}
        <span className="absolute left-1/4 top-1/3 w-6 h-6 bg-gradient-to-br from-yellow-100/80 to-yellow-300/40 rounded-full blur-2xl opacity-60 animate-pulse-slow" />
        <span className="absolute right-1/5 top-1/4 w-4 h-4 bg-gradient-to-br from-purple-200/70 to-brand-purple/30 rounded-full blur-xl opacity-50 animate-pulse-slow2" />
        <span className="absolute left-1/3 bottom-1/4 w-8 h-8 bg-gradient-to-br from-white/60 to-yellow-100/30 rounded-full blur-2xl opacity-40 animate-pulse-slow3" />
        <span className="absolute right-1/3 bottom-1/5 w-5 h-5 bg-gradient-to-br from-brand-purple/60 to-white/20 rounded-full blur-xl opacity-40 animate-pulse-slow4" />
      </div>

      {/* Animated Content + Side Image */}
      <div
        ref={contentRef}
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen text-center pt-16 md:pt-24 opacity-100"
        tabIndex={-1}
        aria-label="FitForge Hero Content"
      >
        {/* Glassmorphism background removed */}
        {/* <div className="absolute inset-0 mx-auto max-w-3xl h-full rounded-3xl bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 z-[-1]" aria-hidden="true"></div> */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight tracking-tight animate-hero-slide-in flex flex-col items-center animate-float-slow" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>
          <span className="block mb-4 pt-6 md:pt-8 relative">
            <BlurUpImage 
              src={FFlogo} 
              alt="FitForge Logo" 
              className="mx-auto animate-bounce-slow rounded-full shadow-2xl border-4 border-white/70" 
              style={{ width: '120px', height: '120px', objectFit: 'cover', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }} 
            />
            {/* Glowing circle behind logo, color changes with toggle */}
            <span
              className={`absolute inset-0 rounded-full z-[-1] blur-2xl opacity-70 animate-pulse-slow ${heroBg === 'beigeblack.jpg' ? 'bg-yellow-200' : 'bg-gray-200'}`}
              style={{ boxShadow: heroBg === 'beigeblack.jpg' ? '0 0 60px 20px #f7e9b0' : '0 0 60px 20px #e5e7eb' }}
              aria-hidden="true"
            />
          </span>
          <span className="text-white">Forge</span>
          <span
            className={`block bg-clip-text text-transparent animate-hero-slide-in-delay ${heroBg === 'beigeblack.jpg' ? 'bg-gradient-hero' : 'bg-gradient-to-r from-[hsl(45,33%,40%)] via-[hsl(45,33%,50%)] to-[hsl(45,33%,40%)]'}`}
          >
            Your Style
          </span>
        </h1>
        {/* Tagline/subtitle for extra brand messaging with typewriter effect */}
        <div className="text-lg md:text-2xl text-white font-serif italic mb-8 animate-hero-fade-in-delay2 min-h-[2.5em] mt-8">
          {tagline}
          <span className="inline-block w-2 h-6 align-middle bg-white animate-typewriter-cursor ml-1" />
        </div>



        <Button
          onClick={handleDiscover}
          className="relative inline-flex items-center px-6 py-3 text-lg font-semibold text-brand-dark bg-brand-light rounded-full shadow-md hover:bg-brand-light/90 transition-all duration-300 group focus:ring-2 focus:ring-brand-purple focus:outline-none before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 before:bg-gradient-to-r before:from-brand-purple/30 before:to-brand-light/30 hover:before:opacity-100"
          aria-label="Scroll to featured collection"
        >
          Discover More
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;