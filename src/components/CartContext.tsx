import React, { createContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  changeSize: (id: string, newSize: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  addToCart: () => { },
  removeFromCart: () => { },
  incrementQuantity: () => { },
  decrementQuantity: () => { },
  changeSize: () => { },
  clearCart: () => { },
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (isBrowser) {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isBrowser]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        console.log('Cart updated (increment):', updated);
        return updated;
      }
      const updated = [...prev, { ...item, quantity: 1 }];
      console.log('Cart updated (new item):', updated);
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const changeSize = (id: string, newSize: string) => {
    setCartItems((prev) => {
      const itemToChange = prev.find((item) => item.id === id);
      if (!itemToChange) return prev;

      // Extract base id (without size suffix)
      const baseId = id.replace(/-[SML]$|-[XS]$|-XL$|-XXL$/, '');
      const newId = `${baseId}-${newSize}`;

      // Update name: replace old size with new size
      const baseName = itemToChange.name.replace(/\s*\([SMLX]+\)$/, '');
      const newName = `${baseName} (${newSize})`;

      // Check if an item with the new id already exists
      const existingItem = prev.find((item) => item.id === newId);
      if (existingItem) {
        // Merge quantities and remove old item
        return prev
          .map((item) =>
            item.id === newId
              ? { ...item, quantity: item.quantity + itemToChange.quantity }
              : item
          )
          .filter((item) => item.id !== id);
      }

      // Just update the item's id, name, and size
      return prev.map((item) =>
        item.id === id
          ? { ...item, id: newId, name: newName, size: newSize }
          : item
      );
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, incrementQuantity, decrementQuantity, changeSize, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Cart UI Context for global cart drawer state
interface CartUIContextType {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const CartUIContext = createContext<CartUIContextType>({
  cartOpen: false,
  setCartOpen: () => { },
});

export const CartUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <CartUIContext.Provider value={{ cartOpen, setCartOpen }}>
      {children}
    </CartUIContext.Provider>
  );
};