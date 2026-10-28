import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import { useProducts } from '../context/useProducts';
import { STORE_INFO } from '../data/storeInfo';
import {
  X,
  CheckCircle,
  CreditCard,
  QrCode,
  Truck,
  Building2,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    cart,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    total,
    formatPrice,
    showNotification
  } = useCart();
  const { addOrder, deductStock } = useProducts();

  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryType: 'express', // express or store-pickup
    paymentMethod: 'upi' // upi, card, cod
  });

  const [orderCompleted, setOrderCompleted] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isSavingOrder) return;
    if (!Array.isArray(cart) || cart.length === 0) {
      showNotification('Your cart is empty. Add products before placing an order.', 'error');
      return;
    }
    if (!shippingData.fullName.trim() || !shippingData.phone.trim() || !shippingData.address.trim() || !shippingData.city.trim() || !shippingData.pincode.trim()) {
      showNotification('Please fill in all required contact and delivery fields.', 'error');
      return;
    }

    const normalizedPhone = shippingData.phone.replace(/[\s()-]/g, '').replace(/^\+?91/, '');
    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      showNotification('Enter a valid 10-digit Indian mobile number.', 'error');
      return;
    }
    if (!/^\d{6}$/.test(shippingData.pincode.trim())) {
      showNotification('Enter a valid 6-digit PIN code.', 'error');
      return;
    }

    // Timestamp plus random suffix avoids overwriting an existing order reference.
    const orderId = `AMR-ORD-${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    const completedOrder = {
      orderId,
      items: [...cart],
      total,
      shipping: { ...shippingData },
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    setIsSavingOrder(true);
    try {
      await addOrder(completedOrder);
      setOrderCompleted(completedOrder);
      await deductStock(completedOrder.items);
      clearCart();
      showNotification(`Order saved to Firebase! Reference #${orderId}`, 'success');
    } catch (error) {
      console.error('[AMR Computers] Order save failed:', error?.code || error?.message || error);
      showNotification('Order could not be saved. Your cart is unchanged; please try again.', 'error');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const shareOrderWhatsApp = () => {
    if (!orderCompleted) return;
    const itemsList = orderCompleted.items
      .map((i) => `• ${i.quantity}x ${i.name}`)
      .join('%0A');

    const msg = `Hello AMR Computers! I placed an order on your website:%0A%0A*Order ID:* ${orderCompleted.orderId}%0A*Customer:* ${orderCompleted.shipping.fullName}%0A*Phone:* ${orderCompleted.shipping.phone}%0A*Delivery Type:* ${orderCompleted.shipping.deliveryType}%0A*Address:* ${orderCompleted.shipping.address}, ${orderCompleted.shipping.city} - ${orderCompleted.shipping.pincode}%0A*Payment Mode:* ${orderCompleted.shipping.paymentMethod.toUpperCase()}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total Amount:* ${formatPrice(orderCompleted.total)}`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              {orderCompleted ? 'Order Receipt & Confirmation' : 'Secure Order Checkout'}
            </h2>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {orderCompleted ? (
            /* Order Success View */
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  Order Request Received
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  Thank You For Your Order!
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                  Your order request has been saved. AMR Computers will confirm product availability, delivery details, and payment arrangements via WhatsApp or phone at {orderCompleted.shipping.phone}. No online payment was processed by this website.
                </p>
              </div>

              {/* Invoice Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4 max-w-lg mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Order Reference</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      {orderCompleted.orderId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Order Date</span>
                    <span className="text-xs text-slate-300">{orderCompleted.date}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                    Purchased Equipment:
                  </span>
                  {orderCompleted.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                      <span className="font-mono text-white shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300">Order Total (not charged online):</span>
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">
                    {formatPrice(orderCompleted.total)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <span className="text-slate-500">Recipient:</span> {orderCompleted.shipping.fullName} ({orderCompleted.shipping.phone})
                  </div>
                  <div>
                    <span className="text-slate-500">Shipping To:</span> {orderCompleted.shipping.address}, {orderCompleted.shipping.city} - {orderCompleted.shipping.pincode}
                  </div>
                  <div>
                    <span className="text-slate-500">Payment:</span> {orderCompleted.shipping.paymentMethod.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={shareOrderWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify AMR Dispatch via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setOrderCompleted(null);
                    closeCheckout();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Back to Store
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Delivery Option Selector */}
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    shippingData.deliveryType === 'express'
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value="express"
                    checked={shippingData.deliveryType === 'express'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-bold block text-white">Insured Express Courier</span>
                    <span className="text-[10px] text-slate-400">Pan-India doorstep delivery</span>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    shippingData.deliveryType === 'store-pickup'
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value="store-pickup"
                    checked={shippingData.deliveryType === 'store-pickup'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Building2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-bold block text-white">In-Store Pickup</span>
                    <span className="text-[10px] text-slate-400">AMR Showroom Experience</span>
                  </div>
                </label>
              </div>

              {/* Shipping Address Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contact & Shipping Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Patel"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Mobile Number (for delivery OTP) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={16}
                      aria-invalid={shippingData.phone.length > 0 && !/^[6-9]\d{9}$/.test(shippingData.phone.replace(/[\s()-]/g, '').replace(/^\+?91/, ''))}
                      aria-describedby="checkout-phone-hint"
                      required
                      className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-cyan-500 ${shippingData.phone.length > 0 && !/^[6-9]\d{9}$/.test(shippingData.phone.replace(/[\s()-]/g, '').replace(/^\+?91/, '')) ? 'border-rose-500' : 'border-slate-800'}`}
                    />
                    {shippingData.phone.length === 0 && (
                      <p id="checkout-phone-hint" className="mt-1.5 text-[11px] text-slate-500">
                        Enter a valid 10-digit Indian mobile number.
                      </p>
                    )}
                    {shippingData.phone.length > 0 && !/^[6-9]\d{9}$/.test(shippingData.phone.replace(/[\s()-]/g, '').replace(/^\+?91/, '')) && (
                      <p id="checkout-phone-hint" className="mt-1.5 text-[11px] font-medium text-rose-400" role="alert">
                        Enter a valid 10-digit Indian mobile number.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleChange}
                    placeholder="e.g. Shop / House No., Street, Landmark"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleChange}
                      placeholder="Nellore"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={handleChange}
                      placeholder="Andhra Pradesh"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingData.pincode}
                      onChange={handleChange}
                      placeholder="524001"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                      shippingData.paymentMethod === 'upi'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={shippingData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">UPI (arrange with store)</span>
                    <span className="text-[9px] text-slate-400">No online payment gateway</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                      shippingData.paymentMethod === 'card'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={shippingData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Card / Netbanking</span>
                    <span className="text-[9px] text-slate-400">Confirm payment with store</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                      shippingData.paymentMethod === 'cod'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={shippingData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Pay on Delivery</span>
                    <span className="text-[9px] text-slate-400">Cash or UPI at Doorstep</span>
                  </label>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Order total (no online charge):</span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSavingOrder}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>{isSavingOrder ? 'Saving order…' : 'Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
