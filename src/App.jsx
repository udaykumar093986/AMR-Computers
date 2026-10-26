import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomPcBuilder } from './components/CustomPcBuilder';
import { RepairBooking } from './components/RepairBooking';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminModal } from './components/AdminModal';
import { ToastNotification } from './components/ToastNotification';

export function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    // If user starts searching from the navbar, scroll to the catalog smoothly
    if (term.trim().length > 1) {
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        const topOffset = shopEl.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ToastNotification />
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      
      <main className="flex-grow">
        <Hero />
        <StatsSection />
        <ProductCatalog searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CustomPcBuilder />
        <RepairBooking />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <AdminModal />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  );
}
