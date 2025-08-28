import {
  useState,
  useRef,
  forwardRef,
  ForwardedRef,
  useEffect,
} from "react";
import { OptimizedImage, OptimizedImageProps } from "./OptimizedImage";

type OptimizedImagePropsWithoutRef = Omit<OptimizedImageProps, "ref">;

interface ZoomableImageProps extends OptimizedImagePropsWithoutRef {
  zoomScale?: number;
  className?: string;
  style?: React.CSSProperties;
  enableZoom?: boolean;
}

export const ZoomableImage = forwardRef<HTMLDivElement, ZoomableImageProps>(
  (
    {
      src,
      alt,
      className = "",
      zoomScale = 2,
      enableZoom = true,
      ...props
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pinchStart = useRef<number | null>(null);

    // --- Desktop Mouse Controls ---
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!enableZoom || scale === 1) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!enableZoom || !isDragging || !dragStart.current) return;
      const x = e.clientX - dragStart.current.x;
      const y = e.clientY - dragStart.current.y;
      setPosition({ x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStart.current = null;
    };

    const handleClick = () => {
      if (!enableZoom) return;
      if (scale === 1) {
        setScale(zoomScale);
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    // --- Mobile Touch Controls ---
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!enableZoom) return;

      if (e.touches.length === 1) {
        // drag
        setIsDragging(true);
        dragStart.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      } else if (e.touches.length === 2) {
        // pinch
        setIsDragging(false);
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStart.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!enableZoom) return;
      e.preventDefault(); // stop browser zoom

      if (e.touches.length === 1 && isDragging && dragStart.current) {
        const x = e.touches[0].clientX - dragStart.current.x;
        const y = e.touches[0].clientY - dragStart.current.y;
        setPosition({ x, y });
      } else if (e.touches.length === 2 && pinchStart.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const newScale = Math.min(
          Math.max((distance / pinchStart.current) * zoomScale, 1),
          4
        );
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      dragStart.current = null;
      pinchStart.current = null;
    };

    // Prevent full-page zoom (desktop ctrl+scroll or mobile pinch)
    useEffect(() => {
      const preventZoom = (e: WheelEvent) => {
        if (e.ctrlKey) e.preventDefault();
      };
      document.addEventListener("wheel", preventZoom, { passive: false });
      return () => document.removeEventListener("wheel", preventZoom);
    }, []);

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          containerRef.current = node;
        }}
        className={`relative overflow-hidden touch-none select-none ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          {...props}
          className={`w-full h-full object-contain transition-transform duration-200 ease-out ${
            scale > 1
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-zoom-in"
          }`}
          style={{
            ...(props.style || {}),
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            touchAction: "none",
            willChange: "transform",
          }}
        />
      </div>
    );
  }
);

ZoomableImage.displayName = "ZoomableImage";
