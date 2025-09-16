import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function Home() {
  const { resetCart } = useCart();

  useEffect(() => {
    resetCart();
  }, []);

  return <h1 className="text-2xl font-bold">Bienvenue sur PRCSM-Studio 👟</h1>;
}
