import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="h-12 w-12 text-brand-light mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-brand-light mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg text-brand-light/90">
              Be the first to know about new arrivals, exclusive offers, and style tips. 
              Join the FitForge community today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-brand-light/10 border-brand-light/30 text-brand-light placeholder:text-brand-light/70 focus:bg-brand-light focus:text-brand-dark"
            />
            <Button 
              type="submit" 
              variant="outline"
              className="bg-brand-light text-brand-dark hover:bg-brand-light/90 border-brand-light"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-sm text-brand-light/70 mt-4">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;