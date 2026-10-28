import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import { STORE_INFO } from '../data/storeInfo';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Tag,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountPercent,
    discountAmount,
    promoCode,
    applyPromo,
    removePromo,
    total,
    formatPrice,
    openCheckout
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyPromo(inputCoupon);
    setInputCoupon('');
  };

  const shareCartWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map((item) => `• ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`)
      .join('%0A');

    const msg = `Hello AMR Computers! I want to place an order for the following items in my cart:%0A%0A${itemsList}%0A%0A*Total Order Value:* ${formatPrice(total)}%0A%0APlease let me know payment and dispatch details.`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex h-full min-h-0 flex-col">
          
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                {cart.length}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your cart is currently empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Discover our custom gaming rigs, laptops, and ultra-fast components to start building your dream setup.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-md hover:bg-cyan-400"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.badge && (
                        <span className="inline-block mt-0.5 text-[10px] text-cyan-400 font-semibold">
                          {item.badge}
                        </span>
                      )}

                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {formatPrice(item.price)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* If custom PC, list brief parts */}
                  {item.specsSummary && item.specsSummary.length > 0 && (
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[10px] text-slate-400 space-y-0.5">
                      <span className="font-semibold text-slate-300 block">Configured Specs:</span>
                      {item.specsSummary.slice(0, 4).map((spec, sidx) => (
                        <div key={sidx} className="truncate">
                          {spec}
                        </div>
                      ))}
                      {item.specsSummary.length > 4 && (
                        <div className="text-cyan-400">
                          +{item.specsSummary.length - 4} more components
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-400">Quantity:</span>
                    <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Coupon Box */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. AMRNEW)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700"
                  >
                    Apply
                  </button>
                </form>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                    <span>Coupon "{promoCode}" applied ({discountPercent}% OFF)</span>
                    <button
                      onClick={removePromo}
                      className="text-emerald-400 hover:text-rose-400 text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Financial Totals & Actions */}
          {cart.length > 0 && (
            <div className="shrink-0 max-h-[48dvh] sm:max-h-none overflow-y-auto sm:overflow-visible p-3 sm:p-5 border-t border-slate-800 bg-slate-950 space-y-2 sm:space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Shipping & Transit Insurance:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>GST Taxes:</span>
                  <span className="text-slate-300">Inclusive</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Final Total:</span>
                  <span className="text-cyan-400 font-mono text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={openCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={shareCartWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>256-bit Encrypted Checkout • 100% Genuine Certified</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
