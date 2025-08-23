import { useState, useEffect, useRef } from 'react';

interface UseLazyLoadImageProps {
  src: string;
  threshold?: number;
  rootMargin?: string;
}

interface UseLazyLoadImageReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

/**
 * A hook for lazy loading images using the Intersection Observer API
 */
export function useLazyLoadImage({
  src,
  threshold = 0.1,
  rootMargin = '0px'
}: UseLazyLoadImageProps): UseLazyLoadImageReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [imageRef, threshold, rootMargin]);

  // Handle image loading
  useEffect(() => {
    if (!shouldLoad || !src) return;

    setIsLoading(true);
    setError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, shouldLoad]);

  return { isLoaded, isLoading, error, imageRef };
}