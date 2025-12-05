import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { menProducts } from "@/assets/products";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

const Men = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string; size?: string }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-24 py-24">
        <section className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>Men's Collection</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">Explore our curated selection of men's streetwear, designed for comfort and style.</p>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menProducts.map((product) => (
            <ProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Men;
