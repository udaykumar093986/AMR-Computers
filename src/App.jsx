import React, { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { RepairBooking } from './components/RepairBooking';
import { ContactSection } from './components/ContactSection';
import { AboutPage } from './components/AboutPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminModal } from './components/AdminModal';
import { ToastNotification } from './components/ToastNotification';

const getPageFromHash = () => {
  const route = window.location.hash.replace('#', '').split('?')[0];
  if (['repair', 'about', 'contact'].includes(route)) return route;
  return 'products';
};

export function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleRouteChange = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (term.trim().length > 1 && page !== 'products') {
      window.location.hash = '#products';
    } else if (term.trim().length > 1) {
      const shopEl = document.getElementById('shop');
      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <ToastNotification />
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <main className="flex-grow">
        {page === 'repair' ? <RepairBooking /> : null}
        {page === 'about' ? <AboutPage /> : null}
        {page === 'contact' ? <ContactSection /> : null}
        {page === 'products' ? <ProductCatalog searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> : null}
      </main>
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
