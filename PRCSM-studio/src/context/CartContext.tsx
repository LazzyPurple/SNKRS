// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { createCart, addToCart, fetchCart } from "@/api/shopify";

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
  cost?: any;
};

type CartContextType = {
  cart: CartShape | null;
  localLines: CartLine[];
  addItem: (
    variantId: string,
    quantity?: number,
    opts?: { title?: string; price?: any }
  ) => Promise<CartShape | null>;
  goToCheckout: () => void;
  clearCartLocal: () => void;
  resetCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartShape | null>(null);
  const [localLines, setLocalLines] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Init depuis localStorage
  useEffect(() => {
    (async () => {
      const id = localStorage.getItem("shopify_cart_id");
      const cached = localStorage.getItem("shopify_cart");
      const savedLines = localStorage.getItem("shopify_local_lines");

      if (savedLines) setLocalLines(JSON.parse(savedLines));

      try {
        setIsLoading(true);
        if (cached) {
          setCart(JSON.parse(cached));
        } else if (id) {
          // on refetch le cart par id (au lieu de recréer)
          const existing = await fetchCart(id);
          if (existing) {
            setCart(existing);
            localStorage.setItem("shopify_cart", JSON.stringify(existing));
          } else {
            const created = await createCart([]);
            setCart(created);
            localStorage.setItem("shopify_cart_id", created.id);
            localStorage.setItem("shopify_cart", JSON.stringify(created));
          }
        } else {
          // rien en cache → on crée un cart vide une fois pour toutes
          const created = await createCart([]);
          setCart(created);
          localStorage.setItem("shopify_cart_id", created.id);
          localStorage.setItem("shopify_cart", JSON.stringify(created));
        }
      } catch (e) {
        console.error("Cart init error:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- Persist cart + id
  useEffect(() => {
    if (cart) {
      localStorage.setItem("shopify_cart", JSON.stringify(cart));
      localStorage.setItem("shopify_cart_id", cart.id);
    }
  }, [cart]);

  // --- Persist lignes locales (UI)
  useEffect(() => {
    if (localLines.length)
      localStorage.setItem("shopify_local_lines", JSON.stringify(localLines));
    else localStorage.removeItem("shopify_local_lines");
  }, [localLines]);

  // small helper
  async function getOrCreateCart(): Promise<CartShape> {
    const id = localStorage.getItem("shopify_cart_id");
    if (id) {
      try {
        const c = await fetchCart(id);
        if (c) return c;
      } catch {}
    }
    const created = await createCart([]);
    localStorage.setItem("shopify_cart_id", created.id);
    localStorage.setItem("shopify_cart", JSON.stringify(created));
    setCart(created);
    return created;
  }

  async function addItem(
    variantId: string,
    quantity = 1,
    opts?: { title?: string; price?: any }
  ) {
    setIsLoading(true);

    // Optimistic UI côté front
    setLocalLines((prev) => {
      const i = prev.findIndex((p) => p.variantId === variantId);
      if (i >= 0) {
        const copy = [...prev];
        copy[i].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        { variantId, quantity, title: opts?.title, price: opts?.price },
      ];
    });

    try {
      const base = cart ?? (await getOrCreateCart());
      const updated = await addToCart(base.id, [
        { merchandiseId: variantId, quantity },
      ]);
      setCart(updated);
      localStorage.setItem("shopify_cart", JSON.stringify(updated));
      localStorage.setItem("shopify_cart_id", updated.id);
      return updated;
    } catch (err) {
      console.error("Cart add error", err);
      // (optionnel) rollback de localLines ici si tu veux
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function goToCheckout() {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  }

  function clearCartLocal() {
    setLocalLines([]);
    localStorage.removeItem("shopify_local_lines");
  }

  function resetCart() {
    setCart(null);
    setLocalLines([]);
    localStorage.removeItem("shopify_cart");
    localStorage.removeItem("shopify_local_lines");
    localStorage.removeItem("shopify_cart_id");
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
        isLoading,
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
