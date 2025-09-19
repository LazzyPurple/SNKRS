import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import ProductPage from "./pages/ProductPage";
import Catalogue from "./pages/Catalogue";
import Panier from "./pages/Panier";
import Home from "./pages/Home";
import Lookbook from "./pages/Lookbook";
import Archive from "./pages/Archive";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";
import Stores from "./pages/Stores";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:handle" element={<ProductPage />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stores" element={<Stores />} />
      </Routes>
    </Layout>
  );
}
