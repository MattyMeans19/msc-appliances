'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  photo: string;
  quantity: number;
  signature?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  cartTotal: number;
  saveSignature: (sku: string, name: string) => void; 
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

  const saveSignature = (sku: string, name: string) => {
    setCart((prev) => 
      prev.map((item) => 
        item.sku === sku ? { ...item, signature: name } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, cartTotal, addToCart, removeFromCart, clearCart, saveSignature }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      cartTotal: 0,
      saveSignature: (sku: string, name: string) => {},
    };
  }
  return context;
};