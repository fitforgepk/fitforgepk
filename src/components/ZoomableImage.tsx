import { useState, useRef, forwardRef, ForwardedRef } from "react";
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
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    // update position on hover
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!enableZoom || !isZoomed || !containerRef.current) return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setPosition({ x, y });
    };

    // toggle zoom on click
    const handleClick = () => {
      if (!enableZoom) return;
      setIsZoomed((z) => !z);
      setPosition({ x: 50, y: 50 }); // reset to center when toggling
    };

    // reset zoom on leave
    const handleMouseLeave = () => {
      if (!enableZoom) return;
      setIsZoomed(false);
      setPosition({ x: 50, y: 50 });
    };

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          containerRef.current = node;
        }}
        className={`relative overflow-hidden select-none ${className}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          {...props}
          className={`w-full h-full object-contain transition-transform duration-200 ease-out ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          style={{
            ...(props.style || {}),
            transform: isZoomed ? `scale(${zoomScale})` : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`, // 👈 this makes zoom follow mouse
            willChange: "transform",
          }}
        />
      </div>
    );
  }
);

ZoomableImage.displayName = "ZoomableImage";
