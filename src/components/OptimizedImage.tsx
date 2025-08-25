import React, { useEffect, useState, useRef } from 'react';
import { useLazyLoadImage } from '@/hooks/use-image-lazy-load';
import { getOptimizedImageUrl, createSrcSet, getBestImageFormat, isSafariOrInAppBrowser } from '@/lib/imageFormatUtils';
import { buildImageKitUrl, createImageKitSrcSet, isImageKitUrl, convertToImageKitPath } from '@/lib/imagekit';
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
  
  // Determine if we should use ImageKit or local optimization
  const useImageKit = !isImageKitUrl(src) && !src.startsWith('data:') && !src.startsWith('http');
  
  // Get the optimized image URL with ImageKit
  const optimizedSrc = disableOptimization 
    ? src 
    : useImageKit 
      ? buildImageKitUrl(convertToImageKitPath(src), { 
          width, 
          height, 
          quality,
          format: 'auto'
        })
      : isImageKitUrl(src) 
        ? src 
        : getOptimizedImageUrl(src);

  // Debug logging
  if (import.meta.env.DEV) {
    console.log('OptimizedImage Debug:', {
      originalSrc: src,
      useImageKit,
      convertedPath: useImageKit ? convertToImageKitPath(src) : 'N/A',
      finalSrc: optimizedSrc
    });
  }
  
  // Create srcset for responsive images
  const srcSet = disableOptimization 
    ? '' 
    : useImageKit 
      ? createImageKitSrcSet(convertToImageKitPath(src), [320, 640, 960, 1280, 1920], { quality })
      : isImageKitUrl(src)
        ? ''
        : createSrcSet(src);
  
  // Set browser info for debugging
  useEffect(() => {
    if (import.meta.env.DEV) {
      const isSafari = isSafariOrInAppBrowser();
      setBrowserInfo(`Using ${disableOptimization ? 'original format' : bestFormat + ' format'}${isSafari ? ' (Safari/in-app browser)' : ''}`);
      console.log(`Image optimization: ${disableOptimization ? 'disabled' : 'enabled'} - ${browserInfo}`);
    }
  }, [bestFormat, disableOptimization, browserInfo]);
  
  // Temporarily disable lazy loading for debugging
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    setError(false);
    if (onLoad) onLoad();
  };
  
  // Handle image error event
  const handleError = () => {
    setIsLoaded(false);
    setIsLoading(false);
    setError(true);
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