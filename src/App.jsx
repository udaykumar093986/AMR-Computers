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

class AppRenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[AMR Computers] A rendering error occurred:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
          <section className="max-w-xl text-center">
            <div className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">AMR Computers</div>
            <h1 className="text-3xl font-bold mb-4">We’re fixing a temporary display issue.</h1>
            <p className="text-slate-300 mb-6">The page encountered an unexpected error. Please refresh the website. If the problem continues, open the browser console and share the first red error message with support.</p>
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300">Refresh website</button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <AppRenderErrorBoundary>
      <ProductProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </AppRenderErrorBoundary>
  );
}
