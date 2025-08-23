import Header from "@/components/Header";
import Categories from "@/components/Categories";

const Category = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-24 py-24">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6" style={{ fontFamily: 'Ethnocentric Bold, Playfair Display, DM Serif Display, serif' }}>Shop by Category</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">Explore our curated categories for every style and occasion.</p>
        </section>
        <Categories />
      </main>
    </div>
  );
};

export default Category;