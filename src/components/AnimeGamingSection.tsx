import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { featuredImage } from "@/assets/products";

const AnimeGamingSection = () => {
  const animeGamingProducts = [
    {
      id: "ag1",
      name: "Anime Spirit Hoodie",
      price: 65,
      originalPrice: 85,
      image: featuredImage,
      category: "Anime",
      isNew: true,
      isSale: false
    },
    {
      id: "ag2",
      name: "Gaming Legend Tee",
      price: 45,
      image: featuredImage,
      category: "Gaming",
      isNew: false,
      isSale: true
    },
    {
      id: "ag3",
      name: "Pixel Perfect Jacket",
      price: 95,
      image: featuredImage,
      category: "Gaming",
      isNew: true,
      isSale: false
    },
    {
      id: "ag4",
      name: "Retro Wave Cap",
      price: 35,
      image: featuredImage,
      category: "Anime",
      isNew: false,
      isSale: false
    }
  ];

  return (
    <section id="anime-gaming" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Anime & Gaming
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your look with exclusive anime and gaming-inspired streetwear. 
            Discover the perfect pieces to level up your style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {animeGamingProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

        {/* Shop Now Button */}
        <div className="text-center">
          <Button variant="accent" size="lg">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnimeGamingSection;
