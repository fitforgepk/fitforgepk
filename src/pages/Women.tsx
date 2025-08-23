import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { womenProducts } from "@/assets/products";

const Women = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-24 py-24">
        <section className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>Women's Collection</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">Discover the latest in women's streetwear, blending elegance and edge.</p>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {womenProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Women;