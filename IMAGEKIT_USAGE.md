# ImageKit Integration Guide

## Overview
Your website now automatically loads images from ImageKit (`https://ik.imagekit.io/sy6soezys`) with automatic optimization.

## How to Use

### 1. Upload Images to ImageKit
Upload your images to your ImageKit media library at: https://imagekit.io/dashboard

### 2. Use Images in Your Components

#### Option A: Use Image Filename (Recommended)
```tsx
// Just use the filename - it automatically loads from ImageKit
<OptimizedImage 
  src="hero-product-mockup.png" 
  alt="Hero Product" 
  width={800} 
  height={600} 
/>
```

#### Option B: Use Full ImageKit URL
```tsx
<OptimizedImage 
  src="https://ik.imagekit.io/sy6soezys/hero-product-mockup.png" 
  alt="Hero Product" 
/>
```

### 3. Advanced Usage with Transformations

```tsx
import { buildImageKitUrl } from '@/lib/imagekit';

// Custom transformations
const imageUrl = buildImageKitUrl('hero-product-mockup.png', {
  width: 400,
  height: 300,
  quality: 90,
  format: 'webp',
  crop: 'maintain_ratio'
});

<OptimizedImage src={imageUrl} alt="Optimized Hero" />
```

## Migration Steps

### 1. Upload Existing Images
- Go to your ImageKit dashboard
- Upload all images from your `public/` and `src/assets/` folders
- Keep the same filenames for easy migration

### 2. Update Image References
Replace local paths with just the filename:

**Before:**
```tsx
<img src="/images/products/shirt.png" />
<img src="/assets/hero.jpg" />
```

**After:**
```tsx
<OptimizedImage src="shirt.png" alt="Shirt" />
<OptimizedImage src="hero.jpg" alt="Hero" />
```

### 3. Benefits You Get Automatically
- ✅ **Automatic format optimization** (WebP/AVIF)
- ✅ **Responsive images** with srcset
- ✅ **Lazy loading**
- ✅ **Quality optimization**
- ✅ **CDN delivery** (faster loading)
- ✅ **Bandwidth savings**

## Examples for Your FitForge Website

### Product Images
```tsx
<OptimizedImage 
  src="blackshirts1.png" 
  alt="Black Shirt Collection"
  width={400}
  height={400}
/>
```

### Hero Images
```tsx
<OptimizedImage 
  src="heropic1.jpg" 
  alt="Hero Banner"
  width={1920}
  height={1080}
  priority={true}
/>
```

### Model Images
```tsx
<OptimizedImage 
  src="models/model-1.jpg" 
  alt="Fashion Model"
  width={600}
  height={800}
/>
```

## Performance Benefits
- **50-80% smaller file sizes** with WebP/AVIF
- **Faster loading** via global CDN
- **Automatic responsive images** for different screen sizes
- **Lazy loading** saves bandwidth

## Troubleshooting

### Image Not Loading?
1. Check if the image exists in your ImageKit media library
2. Verify the filename matches exactly (case-sensitive)
3. Check browser console for any errors

### Need Different Quality?
```tsx
<OptimizedImage 
  src="image.jpg" 
  quality={90}  // Higher quality
  alt="High Quality Image" 
/>
```

### Disable Optimization (if needed)
```tsx
<OptimizedImage 
  src="image.jpg" 
  disableOptimization={true}
  alt="Original Image" 
/>
```
