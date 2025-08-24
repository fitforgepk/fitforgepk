// Import the model images
import { useState, useEffect, useMemo, useRef } from "react";
import model1 from "@/assets/Front_page_models/Front_model1.png";
import model2 from "@/assets/Front_page_models/Front_model2.png";
// Removed model2 import to test Cloudinary integration
import model3 from "@/assets/Front_page_models/Front_model3.png";
import model4 from "@/assets/Front_page_models/Front_model.png";
import modelWomensGrace from "@/assets/womens-collection-framed/Grace_model-min.png";

const FrontPageModels = () => {
  // Model images array
  const models = [
    { src: model1, alt: "Front Model 1" },
    { src: model2, alt: "Front Model 2" }, // Using original asset path for Cloudinary
    { src: model3, alt: "Front Model 3" },
    { src: model4, alt: "Front Model" },
    { src: modelWomensGrace, alt: "Grace Model" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => models.map(() => false));

  const markLoaded = (i: number) => {
    // Use requestAnimationFrame for smoother UI updates on iOS
    window.requestAnimationFrame(() => {
      setLoaded((prev) => {
        const next = prev.slice();
        next[i] = true;
        return next;
      });
    });
  };

  // Pause control for the auto-advance carousel
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const setPaused = (v: boolean) => {
    pausedRef.current = v;
    if (!v && resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current as number);
      resumeTimerRef.current = null;
    }
  };

  // Pause when the tab is hidden (user switches away)
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
      else setPaused(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Detect iOS/iPadOS (including iOS in-app browsers). We'll avoid native lazy loading there
  // because some iOS webviews have inconsistent support and can leave images unloaded.
  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isIPhone = /iPhone|iPad|iPod/.test(ua);
    // Mac with touch points is iPadOS 13+ reporting Mac platform
    const isIPadOS = (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
    return isIPhone || isIPadOS;
  }, []);

  // Image loading props, optimize for iOS to ensure faster loading
  const imageProps = useMemo(() => {
    if (isIOS) return { 
      decoding: 'async' as const,
      loading: 'eager' as const, // Force eager loading on iOS for reliability
      fetchPriority: 'high' as const // Prioritize these images
    };
    return { 
      loading: 'lazy' as const, 
      decoding: 'async' as const 
    };
  }, [isIOS]);

  // Auto-advance carousel every 4 seconds. Pauses on unmount.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % models.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [models.length]);

  if (models.length === 0) {
    return null; // Don't render if no models
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-[#e7dbc7]/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          
          <p className="text-lg text-[#805208] max-w-2xl mx-auto">
            Discover our latest collections 
          </p>
        </div>

        {/* Auto-scrolling Carousel Layout */}
        <div className="max-w-7xl mx-auto">
          {/* Mobile: Single image carousel */}
          <div
            className="md:hidden relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => {
              setPaused(true);
              if (resumeTimerRef.current) {
                window.clearTimeout(resumeTimerRef.current as number);
                resumeTimerRef.current = null;
              }
            }}
            onTouchEnd={() => {
              // resume after a short delay to avoid immediate flip
              resumeTimerRef.current = window.setTimeout(() => setPaused(false), 1200);
            }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {models.map((model, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mx-auto max-w-sm">
                    {/* Vertical Image Container - Fixed aspect ratio to prevent cropping */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {/* Subtle skeleton while the image loads */}
                      {!loaded[index] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 animate-pulse">
                          <div className="w-24 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md shadow-inner" />
                        </div>
                      )}
                      <img
                        src={model.src}
                        alt={model.alt}
                        {...imageProps}
                        width="400"
                        height="600"
                        onLoad={() => markLoaded(index)}
                        onError={() => markLoaded(index)}
                        className={`w-full h-full object-contain bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] transition-opacity duration-500 ${loaded[index] ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {models.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-[#a67c52]' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Single row layout with auto-scroll highlight */}
          <div
            className="hidden md:flex md:flex-row md:overflow-x-auto md:gap-4 md:pb-4 md:snap-x md:snap-mandatory"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
              {models.map((model, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 flex-shrink-0 md:w-1/4 lg:w-1/5 snap-center ${
                  index === currentIndex ? 'ring-4 ring-[#a67c52] shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-102'
                }`}
              >
                {/* Vertical Image Container - Improved for desktop to prevent cropping */}
                <div className="aspect-[3/4] relative overflow-hidden">
                    {/* Subtle skeleton while the image loads */}
                    {!loaded[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 animate-pulse">
                        <div className="w-32 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md shadow-inner" />
                      </div>
                    )}
                    <img
                      src={model.src}
                      alt={model.alt}
                      {...imageProps}
                      width="400"
                      height="600"
                      onLoad={() => markLoaded(index)}
                      onError={() => markLoaded(index)}
                      className={`w-full h-full object-contain bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] transition-opacity duration-500 group-hover:scale-110 ${loaded[index] ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrontPageModels;
