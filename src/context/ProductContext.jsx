import React, { useState, useEffect } from 'react';
import { ProductContext } from './ProductContextDef';
import {
  PRODUCTS as DEFAULT_PRODUCTS,
  CATEGORIES as DEFAULT_CATEGORIES,
} from '../data/products';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';


const CATEGORY_ALIASES = {
  keyboard: 'keyboard',
  keyboards: 'keyboard',
  mouse: 'mouse',
  mice: 'mouse',
  'hard-drive': 'hard-disk',
  'hard-disk': 'hard-disk',
  'hard-disks': 'hard-disk',
  hdd: 'hard-disk',
  ssd: 'storage-ram',
  ssds: 'storage-ram',
  ram: 'storage-ram',
  'ram-ssds': 'storage-ram',
  processor: 'cpus',
  processors: 'cpus',
  cpu: 'cpus',
  'graphics-card': 'gpus',
  'graphics-cards': 'gpus',
  gpu: 'gpus',
  motherboard: 'motherboards',
  'power-supply': 'power-supplies',
  fans: 'cooling',
  coolers: 'cooling',
  'pc-cases': 'cases',
  case: 'cases',
  monitor: 'monitors',
  headphones: 'sound-audio',
  audio: 'sound-audio',
  cables: 'cables-adapters',
};

const normalizeCategoryId = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return CATEGORY_ALIASES[slug] || slug;
};

const categoryLabel = (value) => {
  const id = normalizeCategoryId(value);
  const category = DEFAULT_CATEGORIES.find((item) => item.id === id);
  if (category && category.id !== 'all') return category.name;
  return typeof value === 'string' ? value.trim() : '';
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((product) => {
          const quantity =
            product.stockQuantity !== undefined
              ? Number(product.stockQuantity)
              : product.inStock === false
                ? 0
                : 5;

          return {
            ...product,
            stockQuantity: quantity,
            inStock: quantity > 0,
          };
        });
      }
      return DEFAULT_PRODUCTS;
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  // Firestore is the source of truth for products. Other data remains local for now.
  useEffect(() => {
    try {
      localStorage.setItem('amr_categories', JSON.stringify(categories));
    } catch {
      // Ignore storage errors.
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_orders', JSON.stringify(orders));
    } catch {
      // Ignore storage errors.
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('amr_tickets', JSON.stringify(tickets));
    } catch {
      // Ignore storage errors.
    }
  }, [tickets]);

  // Subscribe to Firestore products. This also correctly handles an empty collection.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const firestoreProducts = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();
          const rawQuantity =
            data.stockQuantity !== undefined
              ? Number(data.stockQuantity)
              : data.inStock === false
                ? 0
                : 5;
          const stockQuantity = Number.isFinite(rawQuantity) ? rawQuantity : 0;

          return {
            ...data,
            id: productDoc.id,
            name: typeof data.name === 'string' ? data.name : '',
            category: normalizeCategoryId(data.category ?? data.categoryId ?? data.categoryName),
            categoryName:
              typeof data.categoryName === 'string' && data.categoryName.trim()
                ? data.categoryName.trim()
                : categoryLabel(data.category ?? data.categoryId ?? data.categoryName),
            price: Number(data.price) || 0,
            stockQuantity,
            inStock: stockQuantity > 0,
            specs: Array.isArray(data.specs)
              ? data.specs
              : typeof data.specs === 'string'
                ? data.specs.split('\\n').filter(Boolean)
                : [],
          };
        });

        // Do not keep stale local/default products when Firestore is empty.
        setProducts(firestoreProducts);
      },
      (error) => {
        console.error(
          'Firestore products subscription failed:',
          error.code || error.message
        );
      }
    );

    return unsubscribe;
  }, []);

  // Keep admin access closed until Firebase has restored and verified the session.
  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      setAuthUser(user);
      setIsAdminAuthenticated(false);

      if (!user) {
        setAuthLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (!active) return;

        const approved =
          adminSnapshot.exists() &&
          adminSnapshot.data().admin === true;

        setIsAdminAuthenticated(approved);

        if (!approved) {
          await signOut(auth).catch(() => {});
          if (active) setAuthUser(null);
        }
      } catch (error) {
        console.error(
          'Admin verification failed:',
          error.code || error.message
        );

        if (active) {
          setIsAdminAuthenticated(false);
          setAuthUser(null);
        }

        await signOut(auth).catch(() => {});
      } finally {
        if (active) setAuthLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Product CRUD writes directly to Firestore.
  const normalizeProduct = (source) => {
    const rawQuantity =
      source.stockQuantity !== undefined ? Number(source.stockQuantity) : 5;
    const stockQuantity = Math.max(
      0,
      Number.isFinite(rawQuantity) ? rawQuantity : 0
    );

    const formatted = {
      ...source,
      name: typeof source.name === 'string' ? source.name.trim() : '',
      category: normalizeCategoryId(source.category ?? source.categoryId ?? source.categoryName),
      categoryName:
        typeof source.categoryName === 'string' && source.categoryName.trim()
          ? source.categoryName.trim()
          : categoryLabel(source.category ?? source.categoryId ?? source.categoryName),
      company: typeof (source.company ?? source.brand ?? source.manufacturer ?? source.companyName) === 'string'
        ? (source.company ?? source.brand ?? source.manufacturer ?? source.companyName).trim()
        : '',
      price: Number(source.price) || 0,
      stockQuantity,
      inStock: stockQuantity > 0,
      rating: Number(source.rating) || 5,
      reviewsCount: Number(source.reviewsCount) || 0,
      isFeatured: Boolean(source.isFeatured),
      specs: Array.isArray(source.specs)
        ? source.specs
        : typeof source.specs === 'string'
          ? source.specs.split('\\n').filter(Boolean)
          : [],
    };

    if (formatted.originalPrice === '' || formatted.originalPrice == null) {
      delete formatted.originalPrice;
    } else {
      formatted.originalPrice = Number(formatted.originalPrice) || 0;
    }

    delete formatted.id;
    Object.keys(formatted).forEach((key) => {
      if (formatted[key] === undefined) delete formatted[key];
    });
    return formatted;
  };

  const requireAdmin = () => {
    if (!auth.currentUser || !isAdminAuthenticated) {
      throw new Error('ADMIN_LOGIN_REQUIRED');
    }
  };

  const addProduct = async (newProduct) => {
    requireAdmin();
    const formatted = normalizeProduct(newProduct);
    const created = await addDoc(collection(db, 'products'), formatted);
    return { ...formatted, id: created.id };
  };

  const updateProduct = async (id, updatedFields) => {
    requireAdmin();
    const current = products.find((product) => product.id === id) || {};
    const formatted = normalizeProduct({ ...current, ...updatedFields });
    await updateDoc(doc(db, 'products', id), formatted);
  };

  const deductStock = async (purchasedItems) => {
    if (!Array.isArray(purchasedItems) || purchasedItems.length === 0) return;

    await Promise.all(
      purchasedItems.map(async (item) => {
        const product = products.find((entry) => entry.id === item.id);
        if (!product) return;

        const currentQuantity = Number(product.stockQuantity ?? 5);
        const nextQuantity = Math.max(
          0,
          currentQuantity - (Number(item.quantity) || 1)
        );

        await updateDoc(doc(db, 'products', product.id), {
          stockQuantity: nextQuantity,
          inStock: nextQuantity > 0,
        });
      })
    );
  };

  const deleteProduct = async (id) => {
    requireAdmin();
    await deleteDoc(doc(db, 'products', id));
  };

  const toggleStock = async (id) => {
    requireAdmin();
    const product = products.find((entry) => entry.id === id);
    if (!product) return;

    const inStock = !product.inStock;
    const stockQuantity = inStock
      ? Math.max(1, Number(product.stockQuantity) || 5)
      : 0;

    await updateDoc(doc(db, 'products', id), { inStock, stockQuantity });
  };

  // Category CRUD — local state/localStorage only for now.
  const addCategory = (categoryData) => {
    const id =
      categoryData.id ||
      categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCategory = {
      id,
      name: categoryData.name,
      icon: categoryData.icon || 'Sparkles',
    };

    setCategories((previous) => [...previous, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id) => {
    if (id === 'all') return;
    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    );
  };

  // Orders and repair tickets — local state/localStorage only for now.
  const addOrder = (order) => {
    setOrders((previous) => [order, ...previous]);
  };

  const updateOrder = (orderKey, updatedFields) => {
    setOrders((previous) =>
      previous.map((order, index) =>
        (order.id || order.orderId || index) === orderKey
          ? { ...order, ...updatedFields }
          : order
      )
    );
  };

  const deleteOrder = (orderKey) => {
    setOrders((previous) =>
      previous.filter(
        (order, index) =>
          (order.id || order.orderId || index) !== orderKey
      )
    );
  };

  const addTicket = (ticket) => {
    setTickets((previous) => [ticket, ...previous]);
  };

  const updateTicket = (ticketKey, updatedFields) => {
    setTickets((previous) =>
      previous.map((ticket, index) =>
        (ticket.id || ticket.ticketId || index) === ticketKey
          ? { ...ticket, ...updatedFields }
          : ticket
      )
    );
  };

  const deleteTicket = (ticketKey) => {
    setTickets((previous) =>
      previous.filter(
        (ticket, index) =>
          (ticket.id || ticket.ticketId || index) !== ticketKey
      )
    );
  };

  const resetToDefaults = async () => {
    requireAdmin();
    // Reset the local category catalog only. Never delete Firestore products here.
    setCategories(DEFAULT_CATEGORIES);
    localStorage.setItem('amr_categories', JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem('amr_categories_schema_version', '2');
  };

  // Firebase Email/Password login followed by Firestore admin-role verification.
  const loginAdmin = async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    try {
      const adminRef = doc(db, 'admins', credential.user.uid);
      const adminSnapshot = await getDoc(adminRef);

      const approved =
        adminSnapshot.exists() &&
        adminSnapshot.data().admin === true;

      if (!approved) {
        await signOut(auth).catch(() => {});
        throw new Error('ADMIN_NOT_AUTHORIZED');
      }

      setAuthUser(credential.user);
      setIsAdminAuthenticated(true);
      return true;
    } catch (error) {
      if (
        error.message === 'ADMIN_NOT_AUTHORIZED' ||
        error.code === 'permission-denied'
      ) {
        await signOut(auth).catch(() => {});
        setAuthUser(null);
        setIsAdminAuthenticated(false);

        if (error.message === 'ADMIN_NOT_AUTHORIZED') throw error;
        throw new Error('ADMIN_VERIFICATION_DENIED');
      }

      await signOut(auth).catch(() => {});
      setAuthUser(null);
      setIsAdminAuthenticated(false);
      throw error;
    }
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    setAuthUser(null);
    setIsAdminAuthenticated(false);
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
        deductStock,
        deleteProduct,
        toggleStock,
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
        openAdmin: () => setIsAdminOpen(true),
        closeAdmin: () => setIsAdminOpen(false),
        isAdminAuthenticated,
        authLoading,
        authUser,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
