import ProductList from "@/components/ProductList";

export default function Catalogue() {
  return (
    <div className="flex-1 w-full flex flex-col bg-prcsm-black text-prcsm-white">
      <div className="w-full px-6 py-8">
        <h1 className="text-4xl font-orbitron text-prcsm-violet mb-8 text-center">Catalogue</h1>
        <ProductList />
      </div>
    </div>
  );
}
