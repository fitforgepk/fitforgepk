import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { menProducts, womenProducts, unisexProducts, animeProducts, gamingProducts, winterShowcaseImages } from "@/assets/products";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FeaturedSectionProps {
  onAddToCart?: (product: { id: string; name: string; price: number; image: string }) => void;
}

const FeaturedSection = ({ onAddToCart }: FeaturedSectionProps) => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % winterShowcaseImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Get multiple products from available categories to reach 5 total
  // Filter out products marked as "COMING SOON" and select available ones
  const availableMenProducts = menProducts.filter(p => p.tag !== "COMING SOON" && p.image);
  const availableWomenProducts = womenProducts.filter(p => p.tag !== "COMING SOON" && p.image);
  const availableUnisexProducts = unisexProducts.filter(p => p.tag !== "COMING SOON" && p.image);

  // Prepend Winter feature (Coming Soon) to featured grid
  const winterFeature = {
    id: "winter-feature",
    name: "Winter Collection",
    price: 0,
    image: winterShowcaseImages[0],
    category: "Winter",
    isNew: false,
    isSale: false,
    tag: "COMING SOON"
  };

  // Select up to 5 products with Winter feature first
  const selectedProducts = [
    winterFeature,
    ...availableMenProducts.slice(0, 2),
    ...availableWomenProducts.slice(0, 1),
    ...availableUnisexProducts.slice(0, 2)
  ].slice(0, 5);

  const handleViewAllProducts = () => {
    navigate('/collection');
  };

  return (
    <section id="featured" className="relative py-20 bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {winterShowcaseImages.map((src, i) => (
          <img key={i} src={src} alt="Winter Background" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${bgIndex === i ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/60 to-background" />
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Collection
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked pieces that define modern streetwear. Discover the latest trends 
            and timeless classics that elevate your wardrobe.
          </p>
        </div>

        {/* Products Grid - 5 products (one from each category) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {selectedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart ? () => onAddToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              }) : undefined}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="accent" size="lg" onClick={handleViewAllProducts}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
