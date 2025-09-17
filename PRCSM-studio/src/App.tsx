import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './components/auth/PrivateRoute';

import ProductPage from "./pages/ProductPage";
import Catalogue from "./pages/Catalogue";
import Panier from "./pages/Panier";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Account } from "./pages/Account";

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/account" 
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
