/**
 * ImageKit integration utilities for FitForge
 * Provides URL generation and optimization for images hosted on ImageKit
 */

// ImageKit configuration
export const IMAGEKIT_CONFIG = {
  urlEndpoint: 'https://ik.imagekit.io/sy6soezys',
  // No API key needed for image delivery - only for uploads
};

/**
 * Generate ImageKit URL with transformations
 */
export interface ImageKitTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  focus?: 'auto' | 'face' | 'center';
  blur?: number;
  progressive?: boolean;
  lossless?: boolean;
}

/**
 * Build ImageKit URL with transformations
 */
export function buildImageKitUrl(
  imagePath: string,
  transformations: ImageKitTransformations = {}
): string {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Default transformations
  const defaultTransforms: ImageKitTransformations = {
    format: 'auto',
    quality: 80,
    progressive: true,
  };
  
  // Merge with provided transformations
  const transforms = { ...defaultTransforms, ...transformations };
  
  // Build transformation string
  const transformParams: string[] = [];
  
  if (transforms.width) transformParams.push(`w-${transforms.width}`);
  if (transforms.height) transformParams.push(`h-${transforms.height}`);
  if (transforms.quality) transformParams.push(`q-${transforms.quality}`);
  if (transforms.format) transformParams.push(`f-${transforms.format}`);
  if (transforms.crop) transformParams.push(`c-${transforms.crop}`);
  if (transforms.focus) transformParams.push(`fo-${transforms.focus}`);
  if (transforms.blur) transformParams.push(`bl-${transforms.blur}`);
  if (transforms.progressive) transformParams.push('pr-true');
  if (transforms.lossless) transformParams.push('lo-true');
  
  // Build final URL
  const transformString = transformParams.length > 0 
    ? `tr:${transformParams.join(',')}` 
    : '';
  
  return transformString 
    ? `${IMAGEKIT_CONFIG.urlEndpoint}/${transformString}/${cleanPath}`
    : `${IMAGEKIT_CONFIG.urlEndpoint}/${cleanPath}`;
}

/**
 * Generate responsive srcset for ImageKit images
 */
export function createImageKitSrcSet(
  imagePath: string,
  sizes: number[] = [320, 640, 960, 1280, 1920],
  baseTransforms: ImageKitTransformations = {}
): string {
  return sizes
    .map(width => {
      const url = buildImageKitUrl(imagePath, {
        ...baseTransforms,
        width,
      });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimized ImageKit URL based on device capabilities
 */
export function getOptimizedImageKitUrl(
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    isMobile?: boolean;
  } = {}
): string {
  const { width, height, quality = 80, isMobile = false } = options;
  
  // Adjust quality for mobile devices
  const adjustedQuality = isMobile ? Math.min(quality, 70) : quality;
  
  return buildImageKitUrl(imagePath, {
    width,
    height,
    quality: adjustedQuality,
    format: 'auto',
    progressive: true,
    focus: 'auto',
  });
}

/**
 * Convert local image path to ImageKit path
 * Useful for migrating from local images to ImageKit
 */
export function convertToImageKitPath(localPath: string): string {
  // Remove common prefixes but keep the assets folder structure
  const cleanPath = localPath
    .replace(/^\//, '') // Remove leading slash
    .replace(/^public\//, '') // Remove public folder prefix
    .replace(/^src\/assets\//, 'assets/') // Convert src/assets to assets
    .replace(/^assets\//, 'assets/'); // Ensure assets prefix exists
  
  // If path doesn't start with assets/, add it
  return cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;
}

/**
 * Preload ImageKit image
 */
export function preloadImageKitImage(
  imagePath: string,
  transformations: ImageKitTransformations = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = buildImageKitUrl(imagePath, transformations);
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
    img.src = url;
  });
}

/**
 * Check if a URL is an ImageKit URL
 */
export function isImageKitUrl(url: string): boolean {
  return url.includes('ik.imagekit.io');
}

/**
 * Extract image path from ImageKit URL
 */
export function extractImageKitPath(url: string): string {
  if (!isImageKitUrl(url)) return url;
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the transformation part (starts with 'tr:')
    const trIndex = pathParts.findIndex(part => part.startsWith('tr:'));
    
    if (trIndex !== -1) {
      // Return path after transformations
      return pathParts.slice(trIndex + 1).join('/');
    } else {
      // No transformations, return the path after the base
      return pathParts.slice(1).join('/');
    }
  } catch (error) {
    console.error('Error extracting ImageKit path:', error);
    return url;
  }
}
