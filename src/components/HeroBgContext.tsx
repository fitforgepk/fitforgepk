import React, { createContext, useContext, useState } from "react";

export type HeroBgType = 'beigeblack.jpg' | 'beigeblack2.png';

interface HeroBgContextType {
  heroBg: HeroBgType;
  toggleHeroBg: () => void;
}

const HeroBgContext = createContext<HeroBgContextType | undefined>(undefined);

export const useHeroBg = () => {
  const ctx = useContext(HeroBgContext);
  if (!ctx) throw new Error('useHeroBg must be used within HeroBgProvider');
  return ctx;
};

export const HeroBgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroBg, setHeroBg] = useState<HeroBgType>('beigeblack.jpg');
  const toggleHeroBg = () => setHeroBg(bg => bg === 'beigeblack.jpg' ? 'beigeblack2.png' : 'beigeblack.jpg');
  return (
    <HeroBgContext.Provider value={{ heroBg, toggleHeroBg }}>
      {children}
    </HeroBgContext.Provider>
  );
};
