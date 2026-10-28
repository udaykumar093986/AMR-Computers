import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. Guard check: If db is null (no keys), do not call collection(db)
    if (!db) {
      console.warn('[AMR Computers] Firestore db is null. Loading offline catalog.');
      const local = localStorage.getItem('amr_products');
      if (local) {
        try {
          setProducts(JSON.parse(local));
        } catch (e) {
          // ignore parse errors
        }
      }
      return;
    }

    // 2. Only subscribe when db is a valid Firestore instance
    const colRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(items);
      },
      (error) => {
        console.warn('[AMR Computers] Firestore error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData) => {
    if (!db) {
      const newProduct = { ...productData, id: 'local-' + Date.now() };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    }
    const colRef = collection(db, 'products');
    const ref = await addDoc(colRef, productData);
    return { ...productData, id: ref.id };
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
