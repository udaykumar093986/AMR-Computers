import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import {
  X,
  Star,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Truck,
  MessageSquare,
  ShoppingCart,
  Plus,
  Minus
} from 'lucide-react';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart, formatPrice, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity !== undefined ? product.stockQuantity <= 0 : !product.inStock;
  const maxAvailable = product.stockQuantity !== undefined ? Math.max(1, product.stockQuantity) : 99;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
    openCart();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello AMR Computers! I am interested in purchasing "${product.name}" (${formatPrice(product.price)}). Can you share availability and shipping details?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="md:w-1/2 bg-slate-950 p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-900 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-cyan-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{product.warranty || 'Brand Warranty'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free Insured Transit</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-400">
              {product.categoryName}
            </span>
            
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {product.name}
            </h2>

            {/* Rating and review counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewsCount} verified reviews)</span>
              
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : product.stockQuantity !== undefined && product.stockQuantity <= 3 ? (
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  <CheckCircle className="w-3.5 h-3.5" /> Only {product.stockQuantity} Left in Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity ?? 5} units)
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specifications Bulleted */}
            {product.specs && product.specs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Technical Specifications:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Quantity:</span>
                <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                    className="p-2 text-slate-400 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart & Buy Now Buttons */}
            {isOutOfStock ? (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center">
                <p className="text-xs text-rose-300 font-semibold mb-1">This product is currently out of stock.</p>
                <p className="text-[11px] text-slate-400">New batch is arriving soon. Inquire below to reserve your unit.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Instant Checkout</span>
                </button>
              </div>
            )}

            {/* WhatsApp Inquire */}
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isOutOfStock ? 'Request Restock on WhatsApp' : 'Inquire / Negotiate on WhatsApp'}</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
