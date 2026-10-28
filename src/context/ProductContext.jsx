import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amr_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_tickets', JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Real-time products listener (SAFELY GUARDED)
  useEffect(() => {
    // If Firebase db is null (e.g. running on GitHub Pages without secrets), use local fallback
    if (!db) {
      console.info('[AMR Computers] Firestore db is null. Running in offline/demo mode.');
      return;
    }

    try {
      const colRef = collection(db, 'products');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const items = snapshot.docs.map((d) => {
            const data = d.data();
            const stock = data.stockQuantity === undefined ? (data.inStock === false ? 0 : 5) : Number(data.stockQuantity);
            return {
              ...data,
              id: d.id,
              name: typeof data.name === 'string' ? data.name : '',
              price: Number(data.price) || 0,
              stockQuantity: Number.isFinite(stock) ? stock : 0,
              inStock: (Number.isFinite(stock) ? stock : 0) > 0,
              specs: Array.isArray(data.specs) ? data.specs : []
            };
          });
          setProducts(items);
        },
        (error) => {
          console.warn('[AMR Computers] Products subscription fallback:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('[AMR Computers] Failed to listen to products collection:', err);
    }
  }, []);

  // Admin Auth state observer (SAFELY GUARDED)
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      setAuthUser(user);
      setAuthLoading(false);

      if (!user) {
        setIsAdminAuthenticated(false);
      } else if (db) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          const isAdmin = adminDoc.exists() && adminDoc.data().admin === true;
          if (isMounted) setIsAdminAuthenticated(isAdmin);
        } catch {
          if (isMounted) setIsAdminAuthenticated(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Safe CRUD Actions
  const addProduct = async (productData) => {
    if (!db) {
      const localProduct = { ...productData, id: 'local-' + Date.now() };
      setProducts((prev) => [...prev, localProduct]);
      return localProduct;
    }
    const docRef = await addDoc(collection(db, 'products'), productData);
    return { ...productData, id: docRef.id };
  };

  const updateProduct = async (id, updatedData) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    if (db) {
      try {
        await updateDoc(doc(db, 'products', id), updatedData);
      } catch (err) {
        console.warn('Update Firestore failed:', err);
      }
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.warn('Delete Firestore failed:', err);
      }
    }
  };

  const toggleStock = async (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    const newStock = !item.inStock;
    const newQty = newStock ? Math.max(1, Number(item.stockQuantity) || 5) : 0;
    await updateProduct(id, { inStock: newStock, stockQuantity: newQty });
  };

  const deductStock = async (itemsToDeduct) => {
    if (!Array.isArray(itemsToDeduct) || itemsToDeduct.length === 0) return;
    for (const item of itemsToDeduct) {
      const current = products.find((p) => p.id === item.id);
      if (current) {
        const remaining = Math.max(0, (Number(current.stockQuantity) || 5) - (Number(item.quantity) || 1));
        await updateProduct(current.id, {
          stockQuantity: remaining,
          inStock: remaining > 0
        });
      }
    }
  };

  const addCategory = (cat) => {
    const newCat = {
      id: cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: cat.name,
      icon: cat.icon || 'Sparkles'
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = (id) => {
    if (id !== 'all') {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addOrder = (order) => setOrders((prev) => [order, ...prev]);
  const updateOrder = (id, data) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  const deleteOrder = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const addTicket = (ticket) => setTickets((prev) => [ticket, ...prev]);
  const updateTicket = (id, data) => setTickets((prev) => prev.map((t) => (t.ticketId === id || t.id === id ? { ...t, ...data } : t)));
  const deleteTicket = (id) => setTickets((prev) => prev.filter((t) => t.ticketId !== id && t.id !== id));

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const loginAdmin = async (email, password) => {
    if (!auth) {
      setIsAdminAuthenticated(true);
      return true;
    }
    const res = await signInWithEmailAndPassword(auth, email.trim(), password);
    setIsAdminAuthenticated(true);
    setAuthUser(res.user);
    return true;
  };

  const logoutAdmin = async () => {
    if (auth) {
      await signOut(auth);
    }
    setIsAdminAuthenticated(false);
    setAuthUser(null);
  };

  const resetToDefaults = async () => {
    localStorage.removeItem('amr_products');
    localStorage.removeItem('amr_categories');
    localStorage.removeItem('amr_orders');
    localStorage.removeItem('amr_tickets');
  };

  const contextValue = {
    products,
    categories,
    orders,
    tickets,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    deductStock,
    addCategory,
    deleteCategory,
    addOrder,
    updateOrder,
    deleteOrder,
    addTicket,
    updateTicket,
    deleteTicket,
    resetToDefaults,
    isAdminOpen,
    openAdmin,
    closeAdmin,
    isAdminAuthenticated,
    authLoading,
    authUser,
    loginAdmin,
    logoutAdmin
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook exported from the EXACT SAME CONTEXT
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductProvider;
