import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { unisexProducts } from "@/assets/products";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

const Unisex = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string; size: string }) => {
    addToCart({
      id: product.id + (product.size ? `-${product.size}` : ""),
      name: `${product.name}${product.size ? ` (${product.size})` : ""}`,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center py-24 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-hero bg-clip-text text-transparent mb-6" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>
          Unisex Collection
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-center mb-8">
          Explore our versatile unisex styles designed for everyone. Fashion
          without boundaries, comfort without compromise.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {unisexProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Unisex;