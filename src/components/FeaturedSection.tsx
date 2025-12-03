import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { menProducts, womenProducts, unisexProducts, animeProducts, gamingProducts, winterProducts } from "@/assets/products";
import { useNavigate } from "react-router-dom";
 

interface FeaturedSectionProps {
  onAddToCart?: (product: { id: string; name: string; price: number; image: string }) => void;
}

const FeaturedSection = ({ onAddToCart }: FeaturedSectionProps) => {
  const navigate = useNavigate();
  
  
  // Get multiple products from available categories to reach 5 total
  // Filter out products marked as "COMING SOON" and select available ones
  const availableMenProducts = menProducts.filter(p => p.tag !== "COMING SOON" && p.image);
  const availableWomenProducts = womenProducts.filter(p => p.tag !== "COMING SOON" && p.image);
  const availableUnisexProducts = unisexProducts.filter(p => p.tag !== "COMING SOON" && p.image);

  // Build featured grid: prioritize Winter Collection and exclude sold-out items
  const excludedSoldNames = new Set(["breath of sea", "city eighty"]);
  const selectedProducts = [
    ...winterProducts,
    ...availableMenProducts.slice(0, 2),
    ...availableWomenProducts.slice(0, 1),
    ...availableUnisexProducts.slice(0, 2)
  ]
    .filter((p) => !excludedSoldNames.has(p.name.trim().toLowerCase()))
    .slice(0, 5);

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
