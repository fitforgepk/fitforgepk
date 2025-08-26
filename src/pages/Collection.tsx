import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import { 
  menProducts, 
  womenProducts, 
  unisexProducts, 
  animeProducts, 
  gamingProducts 
} from "@/assets/products";

const Collection = () => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  // Filter real products (with actual images) from each collection
  const realMenProducts = menProducts.filter(product => product.image && !product.image.includes('featured-collection'));
  const realWomenProducts = womenProducts.filter(product => product.image && !product.image.includes('featured-collection'));
  const realUnisexProducts = unisexProducts.filter(product => product.image && !product.image.includes('featured-collection'));
  const realAnimeProducts = animeProducts.filter(product => product.image && !product.image.includes('featured-collection'));
  const realGamingProducts = gamingProducts.filter(product => product.image && !product.image.includes('featured-collection'));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-24 py-24">
        {/* Page Header */}
        <section className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">Complete Collection</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Explore our entire range of premium streetwear, from classic designs to exclusive anime and gaming collections.
          </p>
        </section>

        {/* Men's Collection */}
        {realMenProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Men's Collection</h2>
              <p className="text-muted-foreground">Bold styles for the modern man</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realMenProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Women's Collection */}
        {realWomenProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Women's Collection</h2>
              <p className="text-muted-foreground">Elegance meets street style</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realWomenProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Unisex Collection */}
        {realUnisexProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Unisex Collection</h2>
              <p className="text-muted-foreground">Versatile styles for everyone</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realUnisexProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Anime Collection */}
        {realAnimeProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Anime Collection</h2>
              <p className="text-muted-foreground">Limited edition anime-inspired designs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realAnimeProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Gaming Collection */}
        {realGamingProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gaming Collection</h2>
              <p className="text-muted-foreground">Level up your wardrobe with gaming-inspired apparel</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realGamingProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Section */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">New collections and products launching soon</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menProducts
              .filter(product => product.image && product.image.includes('featured-collection'))
              .map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            {womenProducts
              .filter(product => product.image && product.image.includes('featured-collection'))
              .map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            {gamingProducts
              .filter(product => product.image && product.image.includes('featured-collection'))
              .map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Collection;