import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import { winterProducts as comingSoonWinterProducts } from "@/assets/products";
import { Snowflake } from "lucide-react";

const winterProducts = comingSoonWinterProducts;

const Winter = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string; size?: string }) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center py-24 space-y-10">
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-3xl bg-[#1a1a1a]/70 backdrop-blur-xl border border-[#a67c52]/30 shadow-2xl p-8 md:p-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a67c52]/20 text-[#a67c52] font-bold uppercase text-xs tracking-widest">
                  <Snowflake className="w-4 h-4" /> Coming Soon
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple tracking-tight" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>
                Winter Collection
              </h1>
              <p className="mt-4 text-lg md:text-xl text-[#e7dbc7] max-w-2xl mx-auto">
                Stay warm with premium fabrics and elevated streetwear silhouettes.
              </p>
              
            </div>
          </div>
        </section>

        

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {winterProducts.map((product) => (
              <ProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Winter;
