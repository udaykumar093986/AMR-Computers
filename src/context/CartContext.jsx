import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContextDef';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('amr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('amr_cart', JSON.stringify(cart));
    } catch {
      // localStorage may fail in some environments
    }
  }, [cart]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        showNotification(`Updated quantity of "${product.name}" in your cart!`, 'info');
        return updated;
      } else {
        showNotification(`Added "${product.name}" to cart!`, 'success');
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const addCustomPcToCart = (builtPc) => {
    const pcItem = {
      id: `custom-pc-${Date.now()}`,
      name: builtPc.name || 'Custom Built Gaming Beast by AMR',
      price: builtPc.totalPrice,
      originalPrice: Math.round(builtPc.totalPrice * 1.08),
      image: builtPc.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
      quantity: 1,
      type: 'custom-pc',
      specsSummary: builtPc.partsSummary || [],
      wattage: builtPc.totalWattage,
      badge: 'Custom Engineered'
    };

    setCart((prev) => [...prev, pcItem]);
    showNotification('Custom PC Rig added to your cart with all components configured!', 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        showNotification(`Removed "${item.name}" from cart.`, 'info');
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AMRNEW' || clean === 'AMRGAMING') {
      setDiscountPercent(5);
      setPromoCode(clean);
      showNotification('Coupon applied! 5% discount activated.', 'success');
      return { success: true, message: '5% discount applied!' };
    } else if (clean === 'RIGPRO10') {
      setDiscountPercent(10);
      setPromoCode(clean);
      showNotification('Coupon applied! 10% pro discount activated.', 'success');
      return { success: true, message: '10% discount applied!' };
    } else {
      showNotification('Invalid coupon code. Try AMRNEW or RIGPRO10', 'error');
      return { success: false, message: 'Invalid or expired code.' };
    }
  };

  const removePromo = () => {
    setDiscountPercent(0);
    setPromoCode('');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  const formatPrice = (num) => {
    if (typeof num !== 'number') return '₹0';
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addCustomPcToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountPercent,
        discountAmount,
        promoCode,
        applyPromo,
        removePromo,
        total,
        formatPrice,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        notification,
        showNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
