import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { useCart } from '../context/useCart';
import { ProductModal } from './ProductModal';
import {
  Star,
  ShoppingCart,
  Eye,
  SlidersHorizontal,
  Check,
  Sparkles,
  Cpu,
  Server,
  Laptop,
  Layers,
  Microchip,
  HardDrive,
  Headphones,
  Search
} from 'lucide-react';

export const ProductCatalog = ({ searchTerm, setSearchTerm }) => {
  const { addToCart, formatPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const categoryIcons = {
    all: <Sparkles className="w-4 h-4" />,
    'gaming-pc': <Cpu className="w-4 h-4" />,
    workstation: <Server className="w-4 h-4" />,
    laptops: <Laptop className="w-4 h-4" />,
    gpus: <Layers className="w-4 h-4" />,
    cpus: <Microchip className="w-4 h-4" />,
    'storage-ram': <HardDrive className="w-4 h-4" />,
    peripherals: <Headphones className="w-4 h-4" />
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.specs.some((spec) => spec.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId((id) => (id === product.id ? null : id));
    }, 1500);
  };

  return (
    <section id="shop" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Tech Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hardware & Systems Catalog
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Browse pre-configured powerhouse gaming PCs, enterprise workstations, OEM components, and accessories backed by AMR comprehensive coverage.
            </p>
          </div>

          {/* Sort Dropdown & Search feedback */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <label htmlFor="sort-select" className="text-slate-400">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-slate-900">Featured First</option>
                <option value="price-low" className="bg-slate-900">Price: Low to High</option>
                <option value="price-high" className="bg-slate-900">Price: High to Low</option>
                <option value="rating" className="bg-slate-900">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                {categoryIcons[cat.id]}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active search tag pill if search is present */}
        {searchTerm && (
          <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="text-slate-300">
              Showing results for: <span className="font-semibold text-cyan-400">"{searchTerm}"</span> ({filteredProducts.length} items found)
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedAnimationId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveModalProduct(product)}
                  className="group bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-3.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                      {product.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                          {product.badge}
                        </span>
                      )}

                      {/* Quick view icon overlay on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalProduct(product);
                        }}
                        className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-slate-950/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Quick View Details"
                        aria-label={`Quick view ${product.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <div className="flex items-center text-amber-400 gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-white text-[11px]">{product.rating}</span>
                        <span className="text-slate-500 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-bold text-sm text-white line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Short Specs Snippets */}
                    <div className="space-y-1 mb-4">
                      {product.specs.slice(0, 2).map((spec, sidx) => (
                        <div key={sidx} className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Add to Cart Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-white font-mono">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <span className="text-[11px] text-slate-500 line-through font-mono block">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`p-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30'
                      }`}
                      title="Add item to cart"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span className="hidden sm:inline">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      {activeModalProduct && (
        <ProductModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </section>
  );
};
