import { useState, useRef, useEffect, forwardRef, ForwardedRef, useCallback } from 'react';
import { OptimizedImage, OptimizedImageProps } from './OptimizedImage';

type OptimizedImagePropsWithoutRef = Omit<OptimizedImageProps, 'ref'>;

interface ZoomableImageProps extends OptimizedImagePropsWithoutRef {
  zoomScale?: number;
  className?: string;
  style?: React.CSSProperties;
  enableZoom?: boolean;
}

export const ZoomableImage = forwardRef<HTMLDivElement, ZoomableImageProps>(({
  src,
  alt,
  className = '',
  zoomScale = 2.5,
  enableZoom = true,
  ...props
}, ref: ForwardedRef<HTMLDivElement>) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const zoomTimeout = useRef<NodeJS.Timeout>();
  const lastTap = useRef(0);

  const updatePosition = useCallback((clientX: number, clientY: number, isDrag = false) => {
    if (!containerRef.current || !imgRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const imgElement = imgRef.current;
    
    // Calculate the cursor position relative to the container
    const cursorX = clientX - left;
    const cursorY = clientY - top;
    
    // Calculate the current cursor position in image coordinates (0-1)
    const cursorXPercent = cursorX / width;
    const cursorYPercent = cursorY / height;
    
    // Calculate the new position to keep the cursor over the same point in the image
    const newX = -cursorX * (zoomScale - 1);
    const newY = -cursorY * (zoomScale - 1);
    
    // Calculate bounds to prevent empty space
    const maxX = Math.max(0, (width * zoomScale - width) / 2);
    const maxY = Math.max(0, (height * zoomScale - height) / 2);
    
    // Ensure we don't show empty space
    const boundedX = Math.min(Math.max(newX, -maxX), maxX);
    const boundedY = Math.min(Math.max(newY, -maxY), maxY);
    
    setPosition({
      x: boundedX,
      y: boundedY
    });
  }, [zoomScale, dragStart]);

  // Desktop mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableZoom) return;
    e.preventDefault();
    
    if (isZoomed) {
      // If already zoomed, start dragging
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      // First click to zoom in
      setIsZoomed(true);
      updatePosition(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableZoom || !isZoomed) return;
    
    if (isDragging && dragStart) {
      updatePosition(e.clientX, e.clientY, true);
    } else {
      updatePosition(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!enableZoom) return;
    e.preventDefault();
    
    if (!isZoomed) {
      // First click to zoom in
      setIsZoomed(true);
      updatePosition(e.clientX, e.clientY);
    } else if (!isDragging) {
      // Click without dragging toggles zoom out
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    if (!enableZoom) return;
    setIsDragging(false);
    setDragStart(null);
  };

  // Mobile touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableZoom) return;
    const touch = e.touches[0];
    const now = Date.now();
    
    // Double tap detection (within 300ms)
    if (now - lastTap.current < 300) {
      // Double tap detected
      e.preventDefault();
      lastTap.current = 0;
      
      // Toggle zoom
      if (isZoomed) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      } else {
        setIsZoomed(true);
        updatePosition(touch.clientX, touch.clientY);
      }
    } else {
      // Single tap - start drag if zoomed
      lastTap.current = now;
      if (isZoomed) {
        setDragStart({ x: touch.clientX, y: touch.clientY });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableZoom || !isZoomed) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    if (dragStart) {
      // If we have a drag start, it's a drag operation
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: touch.clientX, y: touch.clientY });
    } else {
      // Otherwise, just update the position for zooming
      updatePosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setDragStart(null);
  };

  // Reset zoom on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isZoomed]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (zoomTimeout.current) {
        clearTimeout(zoomTimeout.current);
      }
    };
  }, []);

  return (
    <div 
      ref={(node) => {
        // Handle both forwarded ref and local ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        containerRef.current = node;
      }}
      className={`relative overflow-hidden touch-none select-none ${className}`}
      onClick={enableZoom ? handleClick : undefined}
      onMouseDown={enableZoom ? handleMouseDown : undefined}
      onMouseMove={enableZoom ? handleMouseMove : undefined}
      onMouseUp={enableZoom ? handleMouseUp : undefined}
      onMouseLeave={enableZoom ? handleMouseLeave : undefined}
      onTouchStart={enableZoom ? handleTouchStart : undefined}
      onTouchMove={enableZoom ? handleTouchMove : undefined}
      onTouchEnd={enableZoom ? handleTouchEnd : undefined}
      onTouchCancel={enableZoom ? handleTouchEnd : undefined}
    >
      <div className="relative w-full h-full">
        <OptimizedImage
          src={src}
          alt={alt}
          {...props}
          className={`w-full h-full object-contain transition-transform duration-200 ease-out ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
          style={{
            ...(props.style || {}),
            transform: isZoomed 
              ? `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoomScale})` 
              : 'translate3d(0, 0, 0) scale(1)',
            transformOrigin: 'center center',
            touchAction: 'none',
            userSelect: 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
      </div>
      
      {/* Zoom indicator */}
      {enableZoom && (
        <div className={`absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-none transition-all duration-300 ${isZoomed ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
          {window.innerWidth < 768 ? (
            <span className="flex items-center">
              <span className="text-sm mr-1">👆</span> Double tap to zoom, drag to pan
            </span>
          ) : (
            <span className="flex items-center">
              <span className="text-sm mr-1">🔍</span> {isZoomed ? 'Click and drag to pan' : 'Click to zoom'}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ZoomableImage.displayName = 'ZoomableImage';
