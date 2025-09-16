import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createCart, addToCart } from "@/api/shopify";

type Cart = {
  id: string;
  checkoutUrl: string;
  lines?: { edges: any[] };
};

type CartContextType = {
  cart: Cart | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);

  // Charger le panier depuis localStorage (persistance entre refresh)
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  async function addItem(variantId: string, quantity = 1) {
    let activeCart = cart;
    if (!activeCart) {
      activeCart = await createCart();
      setCart(activeCart);
    }
    const updatedCart = await addToCart(activeCart.id, variantId, quantity);
    setCart(updatedCart);
  }

  return (
    <CartContext.Provider value={{ cart, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
