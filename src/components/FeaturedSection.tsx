import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { menProducts, womenProducts, unisexProducts } from "@/assets/products";
import { useNavigate } from "react-router-dom";

interface FeaturedSectionProps {
  onAddToCart?: (product: { id: string; name: string; price: number; image: string }) => void;
}

const FeaturedSection = ({ onAddToCart }: FeaturedSectionProps) => {
  const navigate = useNavigate();
  
  // Get one product from each category (men, women, unisex)
  // Filter out products marked as "COMING SOON" and select the first available one from each
  const menProduct = menProducts.find(p => p.tag !== "COMING SOON" && p.image);
  const womenProduct = womenProducts.find(p => p.tag !== "COMING SOON" && p.image);
  const unisexProduct = unisexProducts.find(p => p.tag !== "COMING SOON" && p.image);

  // Create array of the 3 selected products
  const selectedProducts = [menProduct, womenProduct, unisexProduct].filter(Boolean);

  const handleViewAllProducts = () => {
    navigate('/collection');
  };

  return (
    <section id="featured" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Products Grid - Exactly 3 products (one from each category) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
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