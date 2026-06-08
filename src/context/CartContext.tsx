"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/supabase";

export interface CartItem {
  product: Product;
  market: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, market: string, price: number) => void;
  removeFromCart: (productId: string, market: string) => void;
  updateQuantity: (productId: string, market: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marketradar_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("marketradar_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, market: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.market === market);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.market === market
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, market, price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, market: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.market === market)));
  };

  const updateQuantity = (productId: string, market: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId && i.market === market) {
          const newQ = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQ };
        }
        return i;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
