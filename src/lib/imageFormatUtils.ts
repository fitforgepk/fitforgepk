/**
 * Utility functions for image format detection and optimization
 * Enhanced for better cross-browser support including Safari and in-app browsers
 */

/**
 * Check if a specific image format is supported by the browser
 */
export function checkImageFormatSupport(format: string): boolean {
  if (typeof document === 'undefined') return false;
  
  const formats: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };
  
  const mime = formats[format.toLowerCase()];
  if (!mime) return false;
  
  // Use a more reliable method to check image format support
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) return false;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  
  // For Safari and in-app browsers, we need a more reliable detection
  try {
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL(mime);
    return dataUrl.indexOf(mime) !== -1;
  } catch (e) {
    return false;
  }
}

/**
 * Detect if the browser is Safari or an in-app browser
 */
export function isSafariOrInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isInAppBrowser = ua.includes('Instagram') || 
                         ua.includes('FBAV') || 
                         ua.includes('FBAN') || 
                         ua.includes('Twitter');
  
  return isSafari || isInAppBrowser;
}

/**
 * Get the best supported image format for the current browser
 */
export function getBestImageFormat(): string {
  // Safari and in-app browsers have better support for WebP than AVIF
  if (isSafariOrInAppBrowser()) {
    if (checkImageFormatSupport('webp')) return 'webp';
    return 'jpg'; // Fallback to jpg for Safari
  }
  
  // For other browsers, prefer AVIF if supported
  if (checkImageFormatSupport('avif')) return 'avif';
  if (checkImageFormatSupport('webp')) return 'webp';
  return 'jpg'; // Fallback to jpg
}

/**
 * Get an optimized URL for an image based on the current environment
 */
export function getOptimizedImageUrl(url: string | undefined): string {
  if (!url) return '';
  
  // Handle special cases
  if (url.startsWith('data:')) return url;
  
  // For production, use optimized formats
  if (import.meta.env.PROD) {
    try {
      // Get the best format for the current browser
      const bestFormat = getBestImageFormat();
      
      // Extract path and extension
      const urlParts = url.split('.');
      if (urlParts.length <= 1) return url;
      
      // Replace the extension with the best format
      const basePath = urlParts.slice(0, -1).join('.');
      return `${basePath}.${bestFormat}`;
    } catch (error) {
      console.error('Error optimizing image URL:', error);
      return url; // Fallback to original URL
    }
  }
  
  // In development, just return the original URL
  return url;
}

/**
 * Create a srcset attribute for responsive images
 * Enhanced to use Cloudinary for responsive images
 */
export function createSrcSet(url: string | undefined): string {
  if (!url) return '';
  
  // Skip for data URLs
  if (url.startsWith('data:')) return '';
  
  try {
    // Extract just the filename without path
    const filename = url.split('/').pop();
    if (!filename) return '';
    
    // Get the best format for the current browser
    const bestFormat = getBestImageFormat();
    
    // Define responsive widths
    const sizes = [320, 640, 960, 1280, 1920];
    
    // Generate srcset using Cloudinary
    return sizes
      .map(size => {
        const optimizedUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload/f_${bestFormat},q_auto,w_${size}/${filename}`;
        return `${optimizedUrl} ${size}w`;
      })
      .join(', ');
  } catch (error) {
    console.error('Error creating srcset:', error);
    return ''; // Return empty string on error
  }
}