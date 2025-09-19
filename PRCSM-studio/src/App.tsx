import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import ProductPage from "./pages/ProductPage";
import Catalogue from "./pages/Catalogue";
import Panier from "./pages/Panier";
import Home from "./pages/Home";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:handle" element={<ProductPage />} />
        <Route path="/panier" element={<Panier />} />
      </Routes>
    </Layout>
  );
}
