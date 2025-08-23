import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "mens",
      title: "Men's Collection",
      description: "Bold styles for the modern man",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600",
      color: "from-brand-blue to-brand-purple",
      route: "/men"
    },
    {
      id: "womens",
      title: "Women's Collection",
      description: "Elegance meets street style",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
      color: "from-brand-purple to-accent",
      route: "/women"
    },
    {
      id: "anime-gaming",
      title: "Anime & Gaming",
      description: "Complete your look",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      color: "from-brand-dark to-brand-blue",
      route: "/anime"
    }
  ];

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <section id="categories" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shop by
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed for every style and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className="group relative overflow-hidden border-none shadow-brand-md hover:shadow-brand-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleCategoryClick(category.route)}
            >
              <div className="relative h-80 overflow-hidden">
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-contain bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                
                {/* Content */}
                <CardContent className="absolute inset-0 flex flex-col justify-end p-6 text-center">
                  <h3 className="text-2xl font-bold text-brand-light mb-2">
                    {category.title}
                  </h3>
                  <p className="text-brand-light/90 mb-4">
                    {category.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-brand-light/10 border-brand-light/30 text-brand-light hover:bg-brand-light hover:text-brand-dark transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.route);
                    }}
                  >
                    Shop Now
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;