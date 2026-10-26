import React, { useState, useEffect } from 'react';
import { ProductContext } from './ProductContextDef';
import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES } from '../data/products';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('amr_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amr_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Product CRUD
  const addProduct = (newProduct) => {
    const formatted = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      price: Number(newProduct.price) || 0,
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      rating: Number(newProduct.rating) || 5.0,
      reviewsCount: Number(newProduct.reviewsCount) || 1,
      inStock: newProduct.inStock !== false,
      isFeatured: !!newProduct.isFeatured,
      specs: Array.isArray(newProduct.specs)
        ? newProduct.specs
        : (newProduct.specs || '').split('\n').filter(Boolean)
    };
    setProducts((prev) => [formatted, ...prev]);
    return formatted;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          if (updatedFields.price !== undefined) {
            updated.price = Number(updatedFields.price) || 0;
          }
          if (updatedFields.originalPrice !== undefined) {
            updated.originalPrice = updatedFields.originalPrice
              ? Number(updatedFields.originalPrice)
              : undefined;
          }
          if (typeof updatedFields.specs === 'string') {
            updated.specs = updatedFields.specs.split('\n').filter(Boolean);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Category CRUD
  const addCategory = (categoryData) => {
    const id = categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id,
      name: categoryData.name,
      icon: categoryData.icon || 'Sparkles'
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = (id) => {
    if (id === 'all') return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Orders and Tickets
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addTicket = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  // Reset to original factory defaults
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    localStorage.removeItem('amr_products');
    localStorage.removeItem('amr_categories');
  };

  // Admin Auth
  const loginAdmin = (pin) => {
    if (pin === 'admin123' || pin === '1234') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('amr_admin_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('amr_admin_auth');
    } catch {
      // ignore
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        orders,
        tickets,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        addCategory,
        deleteCategory,
        addOrder,
        addTicket,
        resetToDefaults,
        isAdminOpen,
        openAdmin: () => setIsAdminOpen(true),
        closeAdmin: () => setIsAdminOpen(false),
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
