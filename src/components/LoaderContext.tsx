import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LoaderContextType {
  loading: boolean;
  setLoading: (val: boolean) => void;
  progress: number;
}

const LoaderContext = createContext<LoaderContextType>({ loading: false, setLoading: () => {}, progress: 0 });

export const useLoader = () => useContext(LoaderContext);

// Small set of critical assets to preload on first load. Adjust as needed.
const CRITICAL_ASSETS = [
  'https://ik.imagekit.io/sy6soezys/assets/FFlogo.png',
  'https://ik.imagekit.io/sy6soezys/assets/hero-main.jpg',
  'https://ik.imagekit.io/sy6soezys/assets/hero-product-mockup.png',
  'https://ik.imagekit.io/sy6soezys/assets/Front_page_models/Front_model1.png',
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      // start loading
      img.src = src;
      // If already cached, onload should fire; but set a fallback in case
      setTimeout(() => resolve(), 3000);
    } catch (e) {
      resolve();
    }
  });
}

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  // Start in loading state so the Loader component is visible until assets are primed
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function runPreload() {
      try {
        const urls = CRITICAL_ASSETS;
        const total = urls.length;
        const threshold = Math.max(1, Math.floor(total * 0.9));
        let loadedCount = 0;

        // Start individual image loads and resolve as they complete.
        const loaders = urls.map((u, i) =>
          preloadImage(u).then(() => {
            // update loaded count and progress state
            loadedCount += 1;
            if (mounted) {
              setProgress(Math.round((loadedCount / total) * 100));
            }
            // If we've reached threshold, stop waiting further.
            if (mounted && loadedCount >= threshold) {
              setLoading(false);
            }
          })
        );

        // Also enforce a maximum wait (fallback) so the loader doesn't hang.
        const timeout = new Promise((res) => setTimeout(res, 5000));

        // Wait for either threshold reached (setLoading called) or timeout or all loads done.
        await Promise.race([Promise.all(loaders), timeout]);
        if (mounted) {
          setProgress(100);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setProgress(100);
          setLoading(false);
        }
      }
    }

    runPreload();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, setLoading, progress }}>
      {children}
    </LoaderContext.Provider>
  );
};
