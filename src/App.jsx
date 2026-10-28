import React, { useEffect, useRef, useState } from 'react';
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
import { useCart } from './context/useCart';
import { useProducts } from './context/useProducts';

const getPageFromHash = () => {
  const route = window.location.hash.replace('#', '').split('?')[0];
  if (['repair', 'about', 'contact'].includes(route)) return route;
  return 'products';
};

export function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(getPageFromHash);
  const { isCartOpen, closeCart, isCheckoutOpen, closeCheckout } = useCart();
  const { isAdminOpen, closeAdmin } = useProducts();

  useEffect(() => {
    const handleRouteChange = () => {
      setPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const backStateRef = useRef({});
  backStateRef.current = {
    isCheckoutOpen, closeCheckout,
    isCartOpen, closeCart,
    isAdminOpen, closeAdmin,
    page
  };

  // Keep Android/mobile browser Back inside the storefront first:
  // close overlays, return to Products from a secondary page, and only
  // then keep the root storefront open instead of exiting the browser.
  useEffect(() => {
    window.history.pushState({ amrStorefront: true }, '', window.location.href);

    const handleBackButton = (event) => {
      // ProductCatalog owns the nested Products → Category → Company history.
      // Let it restore that view before the storefront-level Back handler runs.
      if (event.state?.amrCatalogView) return;

      const current = backStateRef.current;
      if (current.isCheckoutOpen) {
        current.closeCheckout();
      } else if (current.isCartOpen) {
        current.closeCart();
      } else if (current.isAdminOpen) {
        current.closeAdmin();
      } else if (current.page !== 'products') {
        // Let normal browser history return from About, Contact, or Repair to
        // the page the visitor came from. Forcing #products here can hijack
        // navigation and unexpectedly redirect secondary pages.
        return;
      }

      window.history.pushState({ amrStorefront: true }, '', window.location.href);
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
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
