import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from './ProductContextDef';
import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export { ProductContext };

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

  useEffect(() => {
    try { localStorage.setItem('amr_products', JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('amr_categories', JSON.stringify(categories)); } catch {}
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('amr_orders', JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('amr_tickets', JSON.stringify(tickets)); } catch {}
  }, [tickets]);

  useEffect(() => {
    if (!db) {
      console.info('[AMR Computers] Firestore db is unavailable. Using local/offline data.');
      return undefined;
    }

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const items = snapshot.docs.map((d) => {
            const data = d.data();
            const stock = data.stockQuantity === undefined
              ? (data.inStock === false ? 0 : 5)
              : Number(data.stockQuantity);
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
        (error) => console.warn('[AMR Computers] Products subscription fallback:', error)
      );
      return () => unsubscribe();
    } catch (error) {
      console.warn('[AMR Computers] Failed to listen to products collection:', error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (!db) return undefined;

    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        // An empty collection must not erase the existing browser category list.
        // The first Admin category save migrates these categories in one atomic batch.
        if (snapshot.empty) return;
        const cloudCategories = snapshot.docs.map((categoryDoc) => ({
          ...categoryDoc.data(),
          id: categoryDoc.id,
          name: typeof categoryDoc.data().name === 'string' ? categoryDoc.data().name : categoryDoc.id,
          icon: categoryDoc.data().icon || 'Sparkles'
        }));
        setCategories(cloudCategories);
      },
      (error) => console.warn('[AMR Computers] Categories subscription failed:', error)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return undefined;
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
    setProducts((prev) => prev.map((product) => product.id === id ? { ...product, ...updatedData } : product));
    if (db) {
      try { await updateDoc(doc(db, 'products', id), updatedData); }
      catch (error) { console.warn('Update Firestore failed:', error); }
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (db) {
      try { await deleteDoc(doc(db, 'products', id)); }
      catch (error) { console.warn('Delete Firestore failed:', error); }
    }
  };

  const toggleStock = async (id) => {
    const item = products.find((product) => product.id === id);
    if (!item) return;
    const inStock = !item.inStock;
    const stockQuantity = inStock ? Math.max(1, Number(item.stockQuantity) || 5) : 0;
    await updateProduct(id, { inStock, stockQuantity });
  };

  const deductStock = async (itemsToDeduct) => {
    if (!Array.isArray(itemsToDeduct) || itemsToDeduct.length === 0) return;
    for (const item of itemsToDeduct) {
      const current = products.find((product) => product.id === item.id);
      if (current) {
        const remaining = Math.max(0, (Number(current.stockQuantity) || 5) - (Number(item.quantity) || 1));
        await updateProduct(current.id, { stockQuantity: remaining, inStock: remaining > 0 });
      }
    }
  };

  const addCategory = async (category) => {
    const newCategory = {
      id: category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: category.name,
      icon: category.icon || 'Sparkles',
      ...(category.image ? { image: category.image } : {})
    };

    if (!db) throw new Error('Firebase is not configured. Category was not saved.');

    // Migrate the existing browser categories and add the new category atomically.
    // Stable document IDs make this safe to retry without creating duplicates.
    const batch = writeBatch(db);
    categories.forEach((existingCategory) => {
      if (!existingCategory?.id || existingCategory.id === 'all') return;
      batch.set(doc(db, 'categories', existingCategory.id), {
        name: existingCategory.name || existingCategory.id,
        icon: existingCategory.icon || 'Sparkles',
        ...(existingCategory.image ? { image: existingCategory.image } : {})
      }, { merge: true });
    });
    batch.set(doc(db, 'categories', newCategory.id), {
      name: newCategory.name,
      icon: newCategory.icon,
      ...(newCategory.image ? { image: newCategory.image } : {})
    }, { merge: true });
    await batch.commit();

    setCategories((prev) => {
      const withoutDuplicate = prev.filter((item) => item.id !== newCategory.id);
      return [...withoutDuplicate, newCategory];
    });
    return newCategory;
  };

  const deleteCategory = async (id) => {
    if (id === 'all') return;
    if (!db) throw new Error('Firebase is not configured. Category was not deleted.');
    await deleteDoc(doc(db, 'categories', id));
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const addOrder = (order) => setOrders((prev) => [order, ...prev]);
  const updateOrder = (id, data) => setOrders((prev) => prev.map((order) => order.id === id ? { ...order, ...data } : order));
  const deleteOrder = (id) => setOrders((prev) => prev.filter((order) => order.id !== id));

  const addTicket = (ticket) => setTickets((prev) => [ticket, ...prev]);
  const updateTicket = (id, data) => setTickets((prev) => prev.map((ticket) => ticket.ticketId === id || ticket.id === id ? { ...ticket, ...data } : ticket));
  const deleteTicket = (id) => setTickets((prev) => prev.filter((ticket) => ticket.ticketId !== id && ticket.id !== id));

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const loginAdmin = async (email, password) => {
    if (!auth) {
      setIsAdminAuthenticated(true);
      return true;
    }
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    setIsAdminAuthenticated(true);
    setAuthUser(result.user);
    return true;
  };

  const logoutAdmin = async () => {
    if (auth) await signOut(auth);
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
    products, categories, orders, tickets,
    addProduct, updateProduct, deleteProduct, toggleStock, deductStock,
    addCategory, deleteCategory, addOrder, updateOrder, deleteOrder,
    addTicket, updateTicket, deleteTicket, resetToDefaults,
    isAdminOpen, openAdmin, closeAdmin,
    isAdminAuthenticated, authLoading, authUser, loginAdmin, logoutAdmin
  };

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export default ProductProvider;
