import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sale = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      <main className="flex flex-col items-center justify-center py-24 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-hero bg-clip-text text-transparent mb-6">Sale</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-center mb-8">Don't miss out on our exclusive deals and discounts. Shop the sale now!</p>
        {/* Add sale products or sections here */}
      </main>
      <Footer />
    </div>
  );
};

export default Sale; 