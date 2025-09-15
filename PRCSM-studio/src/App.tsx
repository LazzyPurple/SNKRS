import "./App.css";
import { Button } from "./components/ui/button";
import ProductList from "./components/ProductList";

function App() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">PRCSM-Studio 👟</h1>
        <Button className="bg-black text-white hover:bg-gray-800">
          Acheter maintenant
        </Button>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Bienvenue sur PRCSM-Studio 👟
        </h1>
        <ProductList />
      </div>
    </>
  );
}

export default App;
