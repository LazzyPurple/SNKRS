import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/shopify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;
  if (!data) return <p>Aucun produit trouvé</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {data.map((p: any) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle>
              <Link to={`/produit/${encodeURIComponent(p.id)}`}>
              {p.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={p.images.edges[0]?.node.url}
              alt={p.title}
              className="rounded mb-2"
            />
            <p className="mb-2 font-semibold">
              {p.variants.edges[0].node.price.amount}{" "}
              {p.variants.edges[0].node.price.currencyCode}
            </p>
            <Button className="w-full bg-black text-white">
              Ajouter au panier
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
