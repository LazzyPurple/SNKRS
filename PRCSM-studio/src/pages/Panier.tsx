import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function Panier() {
  const { cart } = useCart();

  if (!cart) return <p className="text-center mt-6">Votre panier est vide.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
      <ul className="space-y-2">
        {cart.lines?.edges?.map((line: any) => (
          <li
            key={line.node.id}
            className="flex justify-between border p-2 rounded"
          >
            <span>
              {line.node.merchandise.product.title} (
              {line.node.merchandise.title})
            </span>
            <span>
              {line.node.quantity} × {line.node.merchandise.price.amount}{" "}
              {line.node.merchandise.price.currencyCode}
            </span>
          </li>
        ))}
      </ul>
      <Button asChild className="mt-4 w-full">
        <a href={cart.checkoutUrl} target="_blank" rel="noreferrer">
          Passer commande
        </a>
      </Button>
    </div>
  );
}
