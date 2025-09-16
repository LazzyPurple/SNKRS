// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { createCart, addToCart } from "@/api/shopify";

type CartLine = {
  id?: string;
  variantId: string;
  quantity: number;
  title?: string;
  price?: { amount: string; currencyCode: string };
};

type CartShape = {
  id: string;
  checkoutUrl?: string;
  lines?: { edges: { node: any }[] };
};

type CartContextType = {
  cart: CartShape | null;
  localLines: CartLine[]; // panier côté front (pour UI / total)
  addItem: (
    variantId: string,
    quantity?: number,
    opts?: { title?: string; price?: any }
  ) => Promise<void>;
  goToCheckout: () => void;
  clearCartLocal: () => void;
  resetCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartShape | null>(null);
  const [localLines, setLocalLines] = useState<CartLine[]>([]);

  // restore from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopify_cart");
    const savedLines = localStorage.getItem("shopify_local_lines");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedLines) setLocalLines(JSON.parse(savedLines));
  }, []);

  // persist
  useEffect(() => {
    if (cart) localStorage.setItem("shopify_cart", JSON.stringify(cart));
    else localStorage.removeItem("shopify_cart");
  }, [cart]);

  useEffect(() => {
    if (localLines.length)
      localStorage.setItem("shopify_local_lines", JSON.stringify(localLines));
    else localStorage.removeItem("shopify_local_lines");
  }, [localLines]);

  // addItem: ensure cart exists, then add lines to Shopify and update cart
  async function addItem(
    variantId: string,
    quantity = 1,
    opts?: { title?: string; price?: any }
  ) {
    // update local view immediately (optimistic UI)
    setLocalLines((prev) => {
      // merge if same variant
      const idx = prev.findIndex((p) => p.variantId === variantId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        { variantId, quantity, title: opts?.title, price: opts?.price },
      ];
    });

    try {
      let activeCart = cart;
      if (!activeCart) {
        // create cart with a first line
        const created = await createCart([
          { merchandiseId: variantId, quantity },
        ]);
        setCart(created);
        activeCart = created;
      } else {
        // add lines to existing cart
        const updated = await addToCart(activeCart.id, [
          { merchandiseId: variantId, quantity },
        ]);
        setCart(updated);
      }
    } catch (err) {
      console.error("Cart add error", err);
      // rollback local optimistic change if you want (optional)
    }
  }

  function goToCheckout() {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      console.warn(
        "No checkoutUrl available — make sure cart was created on Shopify"
      );
    }
  }

  function clearCartLocal() {
    setLocalLines([]);
    setCart(null);
    localStorage.removeItem("shopify_local_lines");
    localStorage.removeItem("shopify_cart");
  }

  function resetCart() {
    setCart(null);
    setLocalLines([]);
    localStorage.removeItem("shopify_cart");
    localStorage.removeItem("shopify_local_lines");
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        localLines,
        addItem,
        goToCheckout,
        clearCartLocal,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
