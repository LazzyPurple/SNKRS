import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function Panier() {
  const { cart, goToCheckout } = useCart();
  console.log("Shopify cart:", cart); // debug

  const lines = cart?.lines?.edges ?? [];

  return (
    <div className="flex-1 w-full flex flex-col bg-prcsm-black text-prcsm-white">
      <div className="w-full px-6 py-8">
        <h1 className="text-4xl font-orbitron text-prcsm-violet mb-6 text-center">Votre panier</h1>

      {lines.length === 0 ? (
        <p className="text-center">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {lines.map((edge) => {
              const line = edge.node;
              const variant = line.merchandise;
              return (
                <li
                  key={line.id}
                  className="flex items-center justify-between border rounded p-3 gap-4"
                >
                  {/* Image */}
                  <img
                    src={variant.product.images?.edges?.[0]?.node?.url}
                    alt={variant.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  {/* Infos produit */}
                  <div className="flex-1">
                    <div className="font-medium">
                      {variant.product.title} ({variant.title})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {line.quantity} × {variant.price.amount}{" "}
                      {variant.price.currencyCode}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Button className="w-full" onClick={() => goToCheckout()}>
            Passer commande
          </Button>

          <p className="mt-3 text-sm text-center text-muted-foreground">
            (tu seras redirigé vers Shopify pour finaliser le paiement)
          </p>
        </>
      )}
      </div>
    </div>
  );
}
