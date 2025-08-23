export function getImageUrl(image: any): string {
  // If it's already a string URL, return it
  if (typeof image === 'string') {
    return image;
  }
  
  // If it's an imported image module, get its default export
  if (image && typeof image === 'object' && image.default) {
    return image.default;
  }
  
  // Fallback
  return "https://via.placeholder.com/150?text=Product+Image";
} 