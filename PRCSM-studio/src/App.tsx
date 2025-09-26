import "./App.css";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import ProductPage from "./pages/ProductPage";
import Catalogue from "./pages/Catalogue";
import Panier from "./pages/Panier";
import Home from "./pages/Home";
import Lookbook from "./pages/Lookbook";
import Archive from "./pages/Archive";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";
import Stores from "./pages/Stores";
import ThankYouPage from "./pages/ThankYouPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Component to handle redirect from /product/:handle to /produit/:handle
function RedirectToCanonical() {
  const { handle } = useParams<{ handle: string }>();
  return <Navigate to={`/produit/${handle}`} replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        {/* Canonical PDP route */}
        <Route path="/produit/:handle" element={<ProductPage />} />
        {/* Alias redirect to canonical route */}
        <Route 
          path="/product/:handle" 
          element={<RedirectToCanonical />} 
        />
        <Route path="/panier" element={<Panier />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/merci" element={<ThankYouPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/profile" 
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          } 
        />
      </Routes>
    </Layout>
  );
}
