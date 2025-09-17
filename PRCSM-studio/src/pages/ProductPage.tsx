import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/shopify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;
  if (!product) return <p>Produit introuvable</p>;

  return (
    <div className="flex-1 w-full flex flex-col bg-prcsm-black text-prcsm-white px-6 py-8">
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle className="text-2xl">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {product.images.edges.map((img: any, i: number) => (
              <img
                key={i}
                src={img.node.url}
                alt={product.title}
                className="rounded"
              />
            ))}
          </div>
          <p className="mb-4">{product.description}</p>

          <div className="space-y-2">
            {product.variants.edges.map((v: any) => (
              <div
                key={v.node.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{v.node.title}</span>
                <span>
                  {v.node.price.amount} {v.node.price.currencyCode}
                </span>
                <Button
                  onClick={() => addItem(v.node.id)}
                  disabled={!v.node.availableForSale}
                  className="bg-black text-white"
                >
                  Ajouter au panier
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
