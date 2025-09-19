import Hero from "@/components/hero/Hero";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function Home() {
  const { resetCart } = useCart();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return <Hero />;
}
