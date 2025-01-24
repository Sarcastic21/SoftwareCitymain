import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import HomePage from './components/Homepage';
import AccountPage from './components/AccountPage';
import CartPage from './components/CartPage';
import AdminPage from './components/AdminPage';
import ProductivityPage from './components/Productivitypage';
import PrivatePage from './components/PrivatePage';
import InternationalPage from './components/InternationalPage';
import CrackedPage from './components/CrackedPage';
import EntertainmentPage from './components/EntertainmentPage';
import AdultPage from './components/AdultPage';
import CheckoutPage from './components/CheckoutPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoginPageAdmin from './components/LoginPageAdmin';
import Footer from './components/Footer';
import PremiumCity from './components/PremiumCity';
import AboutPage from './components/AboutPage';
import Contact from './components/Contact';

import Games from './components/GamesPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in based on user data in localStorage
  useEffect(() => {
    const user = localStorage.getItem('user'); // e.g., user ID or authentication token
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);



  return (
    <>
      <Routes>
      <Route path="/softwarecity" element={<PremiumCity />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminPage /> : <Navigate to="/loginadmin" />} 
        />        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route 
          path="/loginadmin" 
          element={<LoginPageAdmin setAuth={setIsAuthenticated} />} 
        />        <Route path="/adult" element={<AdultPage />} />
        <Route path="/entertainment" element={<EntertainmentPage />} />
        <Route path="/cracked" element={<CrackedPage />} />
        <Route path="/international" element={<InternationalPage />} />
        <Route path="/private" element={<PrivatePage />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/games" element={<Games />} />

      </Routes>
      <Footer />
  
      
    </>
  );
}

export default App;




