import React from "react";
import { Helmet } from "react-helmet-async";

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
};

const SITE_NAME = "FitForgePK";
const DEFAULT_IMAGE = "https://ik.imagekit.io/sy6soezys/assets/hero-product-mockup.png";
const DEFAULT_CANONICAL = "https://www.fitforgepk.com/";

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  jsonLd,
}) => {
  const finalTitle = title ? `${title}` : "FitForgePK – Premium Streetwear in Pakistan";
  const finalDesc = description || "Discover premium oversized t‑shirts and streetwear for men, women, and unisex at FitForgePK. Quality, comfort, and style.";
  const finalCanonical = canonical || DEFAULT_CANONICAL;
  const finalImage = image || DEFAULT_IMAGE;

  const ldItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{finalTitle}</title>
      {finalDesc && <meta name="description" content={finalDesc} />}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      {finalDesc && <meta property="og:description" content={finalDesc} />}
      <meta property="og:site_name" content={SITE_NAME} />
      {finalImage && <meta property="og:image" content={finalImage} />}
      {finalCanonical && <meta property="og:url" content={finalCanonical} />}

      {/* Twitter Card (no twitter:site since none) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      {finalDesc && <meta name="twitter:description" content={finalDesc} />}  
      {finalImage && <meta name="twitter:image" content={finalImage} />}

      {/* JSON-LD */}
      {ldItems.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
