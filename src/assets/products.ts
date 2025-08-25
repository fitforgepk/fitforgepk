import { buildImageKitUrl, convertToImageKitPath } from "@/lib/imagekit";

// ImageKit URLs for all product images
const featuredImage = buildImageKitUrl(convertToImageKitPath("featured-collection.png"));
const mensBeigeShirtFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/beigeboyfront.png"));
const mensBeigeShirtBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/beigeboyback.png"));
const mensCharcoalShirtFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/charcoalboyfront.png"));
const mensCharcoalShirtBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/charcoalboyback.png"));
const womensWhiteShirtFront = buildImageKitUrl(convertToImageKitPath("womens-collection-framed/whitegirlfront.png"));
const womensWhiteShirtBack = buildImageKitUrl(convertToImageKitPath("womens-collection-framed/whitegirlback.png"));

// New product ImageKit URLs
const mensBlackVisionVoidFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/black-warrior.png"));
const mensBlackVisionVoidBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/black-warrior(back).png"));
const mensGraceFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/gracefront.jpg"));
const mensGraceBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/graceback.jpg"));
const mensEightysFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/eightysfront.jpg"));
const mensEightysBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/eightysback.jpg"));
const mensWhiteVisionVoidBack = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/Vision Void (White Version).png"));
const mensWhiteVisionVoidFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/Vision Void (White Version)f.png"));
const mensVisionaryWhiteFront = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/Visionary_w_front.png"));

// Unisex collection ImageKit URLs
const unisexGraceShirtFront = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/gracefront.png"));
const unisexGraceShirtBack = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/graceback.png"));
const unisexEightysShirtFront = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/eightysfront.png"));
const unisexEightysShirtBack = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/eightysback.png"));

// Anime collection ImageKit URLs
const animeSoloLevelingFront = buildImageKitUrl(convertToImageKitPath("Anime/Solo-Leveling_front.png"));
const animeSoloLevelingBack = buildImageKitUrl(convertToImageKitPath("Anime/Solo-Leveling_back.png"));
const animeZoroStyleFront = buildImageKitUrl(convertToImageKitPath("Anime/Zoro-Style_front.png"));
const animeZoroStyleBack = buildImageKitUrl(convertToImageKitPath("Anime/Zoro-Style_back.png"));
const animeZenitsuFront = buildImageKitUrl(convertToImageKitPath("Anime/Zenitsu_front.png"));
const animeZenitsuBack = buildImageKitUrl(convertToImageKitPath("Anime/Zenitsu_back.png"));

// Front page models ImageKit URLs
const frontModel1 = buildImageKitUrl(convertToImageKitPath("Front_page_models/Front_model1.png"));
const frontModel2 = buildImageKitUrl(convertToImageKitPath("Front_page_models/Front_model2.png"));
const frontModel3 = buildImageKitUrl(convertToImageKitPath("Front_page_models/Front_model3.png"));
const frontModel4 = buildImageKitUrl(convertToImageKitPath("Front_page_models/Front_model.png"));

// Model images ImageKit URLs
const modelMensBeigeShirt = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/BeigeBoymodel.png"));
const modelMensBeigeShirt2 = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/BeigeBoymodel2.png"));
const modelWomensAfterlightShirt = buildImageKitUrl(convertToImageKitPath("womens-collection-framed/Afterlightmodel.png"));
const modelUnisexBlackVisionVoid = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/Vision_Void_Bmodel.png"));
const modelUnisexBlackVisionVoid2 = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/Vision_Void_Bmodel2.png"));
const modelUnisexVisionVoid = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/Vision_Void_model.png"));
const modelUnisexVisionVoid2 = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/Vision_Void_model2.png"));

// Additional model images ImageKit URLs
const modelMensEighty = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/80_Boys_model-min.png"));
const modelMensBlacksmith = buildImageKitUrl(convertToImageKitPath("mens-collection-framed/The_Blacksmith_model-min.png"));
const modelWomensGrace = buildImageKitUrl(convertToImageKitPath("womens-collection-framed/Grace_model-min.png"));
const modelWomensEighty = buildImageKitUrl(convertToImageKitPath("unisex-collection-framed/80_Girl_model-min.png"));

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
