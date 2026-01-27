'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  photo: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('metro_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('metro_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const isAlreadyInCart = prev.some((item) => item.sku === newItem.sku);
      if (isAlreadyInCart) return prev; 
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };
    
  const removeFromCart = (sku: string) => {
    setCart((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price / 100) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartTotal, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

/** * UPDATED: The "Safe" useCart Hook
 * Returning a fallback object prevents the entire app from crashing 
 * if a component (like the Navbar) is rendered outside the provider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    // Return empty/default values instead of throwing an error
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      cartTotal: 0
    };
  }
  
  return context;
};