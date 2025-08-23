import React, { useState, useEffect } from 'react';
import { useLazyLoadImage } from '@/hooks/use-image-lazy-load';
import { getOptimizedImageUrl, createSrcSet, getBestImageFormat, isSafariOrInAppBrowser } from '@/lib/imageFormatUtils';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
  disableOptimization?: boolean;
}

/**
 * OptimizedImage component for lazy loading and optimizing images
 * 
 * Features:
 * - Lazy loading using Intersection Observer
 * - Image format optimization based on browser support (WebP/AVIF)
 * - Special handling for Safari and in-app browsers
 * - Responsive images with srcset
 * - Loading placeholder
 * - Error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '100vw',
  onLoad,
  onError,
  quality = 80,
  disableOptimization = false,
  ...props
}: OptimizedImageProps) {
  // State to track browser info for debugging
  const [browserInfo, setBrowserInfo] = useState<string>('');
  
  // Get the best format for the current browser
  const bestFormat = getBestImageFormat();
  
  // Get the optimized image URL with format conversion (if optimization is enabled)
  const optimizedSrc = disableOptimization ? src : getOptimizedImageUrl(src);
  
  // Create srcset for responsive images (if optimization is enabled)
  const srcSet = disableOptimization ? '' : createSrcSet(src);
  
  // Set browser info for debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      const isSafari = isSafariOrInAppBrowser();
      setBrowserInfo(`Using ${disableOptimization ? 'original format' : bestFormat + ' format'}${isSafari ? ' (Safari/in-app browser)' : ''}`);
      console.log(`Image optimization: ${disableOptimization ? 'disabled' : 'enabled'} - ${browserInfo}`);
    }
  }, [bestFormat, disableOptimization, browserInfo]);
  
  // Use lazy loading hook (skip if priority is true)
  const { isLoaded, isLoading, error, imageRef } = useLazyLoadImage({
    src: optimizedSrc,
    threshold: 0.1,
    rootMargin: '200px',
  });
  
  // Handle image load event
  const handleLoad = () => {
    if (onLoad) onLoad();
  };
  
  // Handle image error event
  const handleError = () => {
    if (onError) onError();
  };
  
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Loading placeholder */}
      {isLoading && !isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        />
      )}
      
      {/* Image */}
      <img
        ref={imageRef}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          error ? 'hidden' : 'block'
        )}
        {...props}
      />
      
      {/* Error fallback */}
      {error && (
        <div 
          className="flex items-center justify-center bg-gray-100 text-gray-400 text-sm"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '200px',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}