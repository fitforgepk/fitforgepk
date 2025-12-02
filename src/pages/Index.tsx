import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FrontPageModels from "@/components/FrontPageModels";
import FeaturedSection from "@/components/FeaturedSection";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import { Shield, Truck, Star, Users, Award, CheckCircle, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const Index = () => {
  const { addToCart } = useContext(CartContext);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set end date - 7 days from now at 23:59:59
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FitForgePK – Oversized T‑Shirts & Unisex Streetwear in Pakistan"
        description="Shop premium oversized t‑shirts and unisex streetwear for men and women in Pakistan. Quality fabrics, fast delivery, easy returns."
        canonical="https://www.fitforgepk.com/"
        image="https://ik.imagekit.io/sy6soezys/assets/hero-product-mockup.png"
      />
      <Header />

      <main className="flex flex-col">
        <Hero />

        {/* Winter Collection — Coming Soon (under Hero) */}
        <section className="relative py-12 md:py-20 bg-gradient-to-br from-brand-purple/10 via-[#e7dbc7]/15 to-brand-purple/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-3xl bg-[#1a1a1a]/70 backdrop-blur-xl border border-[#a67c52]/30 shadow-2xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a67c52]/20 text-[#a67c52] font-bold uppercase text-xs tracking-widest">
                  <Snowflake className="w-4 h-4" /> Coming Soon
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-[#e7dbc7] to-brand-purple tracking-tight text-center">
                Winter Collection
              </h2>
              <p className="mt-4 text-base md:text-lg text-[#e7dbc7] text-center max-w-2xl mx-auto">
                Elevate your season with cozy layers, premium warmth, and refined streetwear aesthetics.
              </p>
              <div className="mt-8 flex items-center justify-center">
                <a href="#newsletter">
                  <Button className="px-8 py-3 font-bold" variant="brand">
                    Notify Me
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        


        {/* Front Page Models Carousel */}
        <FrontPageModels />

        

        <div className="bg-background">
          <FeaturedSection onAddToCart={addToCart} />
          <Categories />
          <div id="newsletter">
            <Newsletter />
          </div>
        </div>

        {/* Trust Building Section - Moved to end of page */}
        <section className="py-16 bg-gradient-to-b from-background to-[#e7dbc7]/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-[#e7dbc7] rounded-xl shadow-lg border border-[#a67c52]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-brand-purple" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">100% Authentic</h3>
                <p className="text-sm text-[#805206]">Premium quality guaranteed</p>
              </div>
              
              <div className="text-center p-6 bg-[#e7dbc7] rounded-xl shadow-lg border border-[#a67c52]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-[#a67c52]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-[#a67c52]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Free Shipping</h3>
                <p className="text-sm text-[#805206]">On orders above 2000 PKR</p>
              </div>
              
              <div className="text-center p-6 bg-[#e7dbc7] rounded-xl shadow-lg border border-[#a67c52]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-brand-purple" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Easy Returns</h3>
                <p className="text-sm text-[#805206]">7-10 day return policy</p>
              </div>
              
              <div className="text-center p-6 bg-[#e7dbc7] rounded-xl shadow-lg border border-[#a67c52]/20 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-[#a67c52]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#a67c52]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Premium Quality</h3>
                <p className="text-sm text-[#805206]">Crafted with care</p>
              </div>
            </div>

            {/* Customer Testimonials */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Loved by <span className="text-brand-purple">Thousands</span>
              </h2>
              <p className="text-lg text-[#805206] max-w-2xl mx-auto">
                Join our community of satisfied customers who trust FitForge for their style needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-[#e7dbc7] p-6 rounded-xl shadow-lg border border-[#a67c52]/20">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#a67c52]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[#1a1a1a] mb-4 italic">
                  "Amazing quality! The fit is perfect and the material feels premium. Will definitely buy again!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Armghan Tariq.</p>
                    <p className="text-sm text-[#805206]">Verified Buyer</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e7dbc7] p-6 rounded-xl shadow-lg border border-[#a67c52]/20">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#a67c52]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[#1a1a1a] mb-4 italic">
                  "Fast delivery and excellent customer service. The streetwear collection is exactly what I was looking for!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Sarah M.</p>
                    <p className="text-sm text-[#805206]">Verified Buyer</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#e7dbc7] p-6 rounded-xl shadow-lg border border-[#a67c52]/20">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#a67c52]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[#1a1a1a] mb-4 italic">
                  "Best streetwear brand I've found! Unique designs and the quality is outstanding. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    R
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">Ali Farooq.</p>
                    <p className="text-sm text-[#805206]">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center bg-[#e7dbc7] p-8 rounded-2xl shadow-lg border border-[#a67c52]/20">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-brand-purple mr-3" />
                <h3 className="text-2xl font-bold text-[#1a1a1a]"> Join In Fit Forge Customers</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1a1a1a] mb-2">4.9/5</div>
                  <div className="text-sm font-medium text-[#805206]">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1a1a1a] mb-2">95%</div>
                  <div className="text-sm font-medium text-[#805206]">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1a1a1a] mb-2">24-48h</div>
                  <div className="text-sm font-medium text-[#805206]">Fast Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1a1a1a] mb-2">100%</div>
                  <div className="text-sm font-medium text-[#805206]">Authentic Products</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default Index;
