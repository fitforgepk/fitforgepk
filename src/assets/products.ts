import featuredImage from "@/assets/featured-collection.png";
import mensBeigeShirtFront from "@/assets/mens-collection-framed/beigeboyfront.png";
import mensBeigeShirtBack from "@/assets/mens-collection-framed/beigeboyback.png";
import mensCharcoalShirtFront from "@/assets/mens-collection-framed/charcoalboyfront.png";
import mensCharcoalShirtBack from "@/assets/mens-collection-framed/charcoalboyback.png";
import womensWhiteShirtFront from "@/assets/womens-collection-framed/whitegirlfront.png";
import womensWhiteShirtBack from "@/assets/womens-collection-framed/whitegirlback.png";

// New product imports
import mensBlackVisionVoidFront from "@/assets/mens-collection-framed/black-warrior.png";
import mensBlackVisionVoidBack from "@/assets/mens-collection-framed/black-warrior(back).png";
import mensGraceFront from "@/assets/mens-collection-framed/gracefront.jpg";
import mensGraceBack from "@/assets/mens-collection-framed/graceback.jpg";
import mensEightysFront from "@/assets/mens-collection-framed/eightysfront.jpg";
import mensEightysBack from "@/assets/mens-collection-framed/eightysback.jpg";
import mensWhiteVisionVoidBack from "@/assets/mens-collection-framed/Vision Void (White Version).png";
import mensWhiteVisionVoidFront from "@/assets/mens-collection-framed/Vision Void (White Version)f.png";
import mensVisionaryWhiteFront from "@/assets/mens-collection-framed/Visionary_w_front.png";

// Unisex collection imports
import unisexGraceShirtFront from "@/assets/unisex-collection-framed/gracefront.png";
import unisexGraceShirtBack from "@/assets/unisex-collection-framed/graceback.png";
import unisexEightysShirtFront from "@/assets/unisex-collection-framed/eightysfront.png";
import unisexEightysShirtBack from "@/assets/unisex-collection-framed/eightysback.png";

// Anime collection imports
import animeSoloLevelingFront from "@/assets/Anime/Solo-Leveling_front.png";
import animeSoloLevelingBack from "@/assets/Anime/Solo-Leveling_back.png";
import animeZoroStyleFront from "@/assets/Anime/Zoro-Style_front.png";
import animeZoroStyleBack from "@/assets/Anime/Zoro-Style_back.png";
import animeZenitsuFront from "@/assets/Anime/Zenitsu_front.png";
import animeZenitsuBack from "@/assets/Anime/Zenitsu_back.png";

// Front page models imports
import frontModel1 from "@/assets/Front_page_models/Front_model1.png";
import frontModel2 from "@/assets/Front_page_models/Front_model2.png";
import frontModel3 from "@/assets/Front_page_models/Front_model3.png";
import frontModel4 from "@/assets/Front_page_models/Front_model.png";

// New model imports for updated products
import modelMensBeigeShirt from "@/assets/mens-collection-framed/BeigeBoymodel.png";
import modelMensBeigeShirt2 from "@/assets/mens-collection-framed/BeigeBoymodel2.png";
import modelWomensAfterlightShirt from "@/assets/womens-collection-framed/Afterlightmodel.png";
import modelUnisexBlackVisionVoid from "@/assets/unisex-collection-framed/Vision_Void_Bmodel.png";
import modelUnisexBlackVisionVoid2 from "@/assets/unisex-collection-framed/Vision_Void_Bmodel2.png";
import modelUnisexVisionVoid from "@/assets/unisex-collection-framed/Vision_Void_model.png";
import modelUnisexVisionVoid2 from "@/assets/unisex-collection-framed/Vision_Void_model2.png";

// New model images imports
import modelMensEighty from "@/assets/unisex-collection-framed/80_Boys_model-min.png";
import modelMensBlacksmith from "@/assets/mens-collection-framed/The_Blacksmith_model-min.png";
import modelWomensGrace from "@/assets/womens-collection-framed/Grace_model-min.png";
import modelWomensEighty from "@/assets/unisex-collection-framed/80_Girl_model-min.png";

// Add a type for products that includes optional imageBack and additional images
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageBack?: string;
  additionalImages?: string[]; // For products with multiple images like models + product shots
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  tag?: string; // Add tag property
}

export const featuredProducts: Product[] = [
  // Real T-shirt products (with actual images)
  {
    id: "u1",
    name: "Breath of SEA ",
    price: 1899,
    originalPrice: 2399,
    image: modelMensBeigeShirt,
    imageBack: modelMensBeigeShirt2,
    additionalImages: [mensBeigeShirtFront, mensBeigeShirtBack],
    category: "Regular Fit",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "m4",
    name: "The Blacksmith ",
    price: 1799,
    originalPrice: 2249,
    image: modelMensBlacksmith,
    imageBack: mensCharcoalShirtFront,
    additionalImages: [mensCharcoalShirtBack],
    category: "Regular Fit",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "m7",
    name: "Vision Void",
    price: 1899,
    originalPrice: 2399,
    image: frontModel4,
    imageBack: modelUnisexBlackVisionVoid2,
    additionalImages: [mensBlackVisionVoidBack, mensBlackVisionVoidFront],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "w1",
    name: "Varsity Grace ",
    price: 1999,
    originalPrice: 2499,
    image: unisexGraceShirtFront,
    imageBack: unisexGraceShirtBack,
    category: "Drop Shoulder",
    isNew: true,
    isSale: false,
    tag: "NEW"
  },
  {
    id: "u2",
    name: "City Eighty ",
    price: 1999,
    originalPrice: 2499,
    image: modelMensEighty, 
    additionalImages: [,unisexEightysShirtFront, unisexEightysShirtBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW"
  },
  {
    id: "w3",
    name: "Afterlight ",
    price: 1799,
    originalPrice: 2249,
    image: modelWomensAfterlightShirt,
    imageBack: frontModel1,
    additionalImages: [womensWhiteShirtBack, womensWhiteShirtFront],
    category: "Crop Top",
    isNew: true,
    isSale: false,
    tag: "NEW"
  }
  // Anime Collection (Premium products)
  

];

export const menProducts: Product[] = [
  // Real products first - NEW MODEL IMAGES FIRST
  
  {
    id: "u1",
    name: "Breath of SEA",
    price: 1899,
    originalPrice: 2399,
    image: modelMensBeigeShirt,
    imageBack: modelMensBeigeShirt2,
    additionalImages: [mensBeigeShirtFront, mensBeigeShirtBack],
    category: "Regular Fit",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
   {
    id: "m4",
    name: "The Blacksmith ",
    price: 1799,
    originalPrice: 2249,
    image: modelMensBlacksmith,
    imageBack: mensCharcoalShirtFront,
    additionalImages: [mensCharcoalShirtBack],
    category: "Regular Fit",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "m5",
    name: "Vision Void ",
    price: 1899,
    originalPrice: 2399,
    image: frontModel4,
    imageBack: frontModel2,
    additionalImages: [mensBlackVisionVoidFront, mensBlackVisionVoidBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "m6",
    name: "Vision Void (White Version)",
    price: 1899,
    originalPrice: 2399,
  image: mensVisionaryWhiteFront,
  imageBack: modelUnisexBlackVisionVoid,
  additionalImages: [mensWhiteVisionVoidBack, mensWhiteVisionVoidFront],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "u21",
    name: "City Eighty ",
    price: 1999,
    originalPrice: 2499,
    image: modelMensEighty, 
    additionalImages: [,unisexEightysShirtFront, unisexEightysShirtBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW"
  }
  
];

export const womenProducts: Product[] = [
  // Real products first - NEW MODEL IMAGE FIRST
  
  {
    id: "w3",
    name: "Afterlight ",
    price: 1799,
    originalPrice: 2249,
    image: modelWomensAfterlightShirt,
    imageBack: frontModel1,
    additionalImages: [womensWhiteShirtBack, womensWhiteShirtFront],
    category: "Crop Top",
    isNew: true,
    isSale: false,
    tag: "NEW"
  },
  {
    id: "w1", // Varsity Grace is women's only
    name: "Varsity Grace",
    price: 1999,
    originalPrice: 2499,
    image: modelWomensGrace,
    imageBack: unisexGraceShirtFront,
    additionalImages: [unisexGraceShirtBack],
    category: "Drop Shoulder",
    isNew: true,
    isSale: false,
    tag: "NEW"
  },
  {
    id: "u22",
    name: "City Eighty",
    price: 1999,
    originalPrice: 2499,
    image: modelWomensEighty,
    imageBack: unisexEightysShirtFront,
    additionalImages: [unisexEightysShirtBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW"
  },
  {
    id: "w4",
    name: "Vision Void ",
    price: 1899,
    originalPrice: 2399,
    image: modelUnisexBlackVisionVoid2,
    imageBack: modelUnisexVisionVoid,
    additionalImages: [mensBlackVisionVoidBack, mensBlackVisionVoidFront],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "w5",
    name: "Vision Void (White Version)",
    price: 1899,
    originalPrice: 2399,
    image: modelUnisexVisionVoid2,
    imageBack: frontModel3,
    additionalImages: [mensWhiteVisionVoidFront, mensWhiteVisionVoidBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  }
];

export const unisexProducts: Product[] = [
  // Real unisex products - NEW MODEL IMAGES FIRST
  
  {
    id: "m7",
    name: "Vision Void ",
    price: 1899,
    originalPrice: 2399,
    image: modelUnisexVisionVoid,
    imageBack: modelUnisexBlackVisionVoid2,
    additionalImages: [mensBlackVisionVoidBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "n6",
    name: "Vision Void (White Version)",
    price: 1899,
    originalPrice: 2399,
    image: mensVisionaryWhiteFront,
    imageBack: modelUnisexBlackVisionVoid,
    additionalImages: [modelUnisexVisionVoid2, mensWhiteVisionVoidBack, mensWhiteVisionVoidFront],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW" 
  },
  {
    id: "u2",
    name: "City Eighty",
    price: 1999,
    originalPrice: 2499,
    image: modelMensEighty,
    imageBack: modelWomensEighty,
    additionalImages: [unisexEightysShirtFront, unisexEightysShirtBack],
    category: "Oversized Tee",
    isNew: true,
    isSale: false,
    tag: "NEW"
  }
 
];

export const gamingProducts: Product[] = [
  // All coming soon products (no real products yet)
  
  {
    id: "g2",
    name: "Coming Soon",
    price: 0,
    image: featuredImage,
    category: "Gaming",
    isNew: false,
    isSale: true,
    tag: "COMING SOON"
  }
];

export const animeProducts: Product[] = [
  // Real anime products
  {
    id: "a1",
    name: "Solo Leveling T-shirt",
    price: 2499,
    image: animeSoloLevelingFront,
    imageBack: animeSoloLevelingBack,
    category: "T-shirts",
    isNew: true,
    isSale: false,
    tag: "COMING SOON" 
  },
  {
    id: "a2",
    name: "Zoro Style T-shirt",
    price: 2499,
    image: animeZoroStyleFront,
    imageBack: animeZoroStyleBack,
    category: "T-shirts",
    isNew: true,
    isSale: false,
    tag: "COMING SOON" 
  },
  {
    id: "a3",
    name: "Zenitsu T-shirt",
    price: 2499,
    image: animeZenitsuFront,
    imageBack: animeZenitsuBack,
    category: "T-shirts",
    isNew: true,
    isSale: false,
    tag: "COMING SOON" 
  }
];

// Combine all products for easy lookup
export const allProducts: Product[] = [
  ...featuredProducts,
  ...menProducts,
  ...womenProducts,
  ...unisexProducts,
  ...gamingProducts,
  ...animeProducts
];

export { featuredImage };
