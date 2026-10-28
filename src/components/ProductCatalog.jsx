import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/useProducts';
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
  HardDrive,
  Headphones,
  Search
} from 'lucide-react';

const Microchip = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

export const ProductCatalog = ({ searchTerm = '', setSearchTerm }) => {
  const { products = [], categories = [] } = useProducts();
  const { addToCart, formatPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const safeCategories = Array.isArray(categories) ? categories.filter(Boolean) : [];

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

  const getSpecs = (specs) => {
    if (Array.isArray(specs)) {
      return specs.filter((spec) => typeof spec === 'string' && spec.trim());
    }
    if (typeof specs === 'string') {
      return specs.split(/\r?\n|,/).map((spec) => spec.trim()).filter(Boolean);
    }
    return [];
  };

  const getCompany = (product) => {
    const value = product?.company ?? product?.brand ?? product?.manufacturer ?? product?.companyName;
    return typeof value === 'string' && value.trim() ? value.trim() : 'Other Brands';
  };

  const normalizeCategoryValue = (value) =>
    typeof value === 'string' ? value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const matchesCategory = (product, category) => {
    const categoryId = normalizeCategoryValue(category?.id);
    const categoryName = normalizeCategoryValue(category?.name);
    const productCategory = normalizeCategoryValue(product?.category);
    const productCategoryName = normalizeCategoryValue(product?.categoryName);
    return Boolean(
      (categoryId && productCategory === categoryId) ||
      (categoryName && productCategory === categoryName) ||
      (categoryId && productCategoryName === categoryId) ||
      (categoryName && productCategoryName === categoryName)
    );
  };

  const categoryProducts = selectedCategory
    ? safeProducts.filter((product) => {
        const category = safeCategories.find((item) => item.id === selectedCategory);
        return category ? matchesCategory(product, category) : normalizeCategoryValue(product.category) === normalizeCategoryValue(selectedCategory);
      })
    : [];
  const companies = [...new Set(categoryProducts.map(getCompany))].sort((a, b) => a.localeCompare(b));

  const filteredProducts = useMemo(() => {
    let result = [...safeProducts];
    if (selectedCategory) {
      const category = safeCategories.find((item) => item.id === selectedCategory);
      result = result.filter((product) =>
        category ? matchesCategory(product, category) : normalizeCategoryValue(product.category) === normalizeCategoryValue(selectedCategory)
      );
    }
    if (selectedCompany) result = result.filter((product) => getCompany(product) === selectedCompany);

    const query = typeof searchTerm === 'string' ? searchTerm.trim().toLowerCase() : '';
    if (query) {
      result = result.filter((product) => {
        const name = typeof product.name === 'string' ? product.name : '';
        const categoryName = typeof product.categoryName === 'string' ? product.categoryName : '';
        const description = typeof product.description === 'string' ? product.description : '';
        const specs = getSpecs(product.specs);
        return name.toLowerCase().includes(query) ||
          categoryName.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          specs.some((spec) => spec.toLowerCase().includes(query));
      });
    }

    if (sortBy === 'price-low') result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sortBy === 'price-high') result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else if (sortBy === 'rating') result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    else result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    return result;
  }, [selectedCategory, selectedCompany, searchTerm, sortBy, safeProducts, safeCategories]);

  const handleQuickAdd = (product, event) => {
    event.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId((id) => (id === product.id ? null : id)), 1500);
  };

  return (
    <section id="shop" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /><span>Certified Tech Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Hardware &amp; Systems Catalog</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">Explore quality computer spare parts, OEM components, and essential accessories backed by AMR’s comprehensive product support.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <label htmlFor="sort-select" className="text-slate-400">Sort by:</label>
              <select id="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent border-none text-white font-medium focus:outline-none cursor-pointer">
                <option value="featured" className="bg-slate-900">Featured First</option>
                <option value="price-low" className="bg-slate-900">Price: Low to High</option>
                <option value="price-high" className="bg-slate-900">Price: High to Low</option>
                <option value="rating" className="bg-slate-900">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {!searchTerm && !selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeCategories.filter((category) => category.id !== 'all').map((category) => {
              const items = safeProducts.filter((product) => matchesCategory(product, category));
              const cover = category.image || items.find((product) => product.image)?.image;
              return (
                <button key={category.id} onClick={() => { setSelectedCategory(category.id); setSelectedCompany(''); }} className="group text-left overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-400/70 hover:-translate-y-1 transition-all shadow-lg">
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img src={cover || 'https://placehold.co/800x500/0f172a/67e8f9?text=AMR+Computers'} alt={category.name || 'Product category'} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-cyan-300">{categoryIcons[category.id] || <Sparkles className="w-5 h-5" />}</div>
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div><h3 className="text-lg font-bold text-white">{category.name || 'Category'}</h3><p className="text-xs text-slate-400 mt-1">{items.length} product{items.length === 1 ? '' : 's'}</p></div>
                    <span className="text-cyan-400 text-xl">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedCategory && !selectedCompany && !searchTerm && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div><button onClick={() => { setSelectedCategory(''); setSelectedCompany(''); }} className="text-xs text-cyan-400 hover:underline mb-2">← All categories</button><h3 className="text-2xl font-bold text-white">{safeCategories.find((category) => category.id === selectedCategory)?.name || 'Category'} <span className="text-slate-500">/ Companies</span></h3><p className="text-sm text-slate-400 mt-1">Choose a company to browse its products.</p></div>
            </div>
            {companies.length === 0 ? <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center"><p className="text-slate-300">No products or companies have been added to this category yet.</p><button onClick={() => setSelectedCategory('')} className="mt-4 text-cyan-400 text-sm">Back to categories</button></div> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {companies.map((company) => { const items = categoryProducts.filter((product) => getCompany(product) === company); const cover = items.find((product) => product.companyImage)?.companyImage || items.find((product) => product.image)?.image; return <button key={company} onClick={() => setSelectedCompany(company)} className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left hover:border-cyan-400/70 hover:bg-slate-900/90 transition-all"><div className="h-24 rounded-xl bg-slate-950 overflow-hidden mb-4 flex items-center justify-center">{cover ? <img src={cover} alt={company} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" loading="lazy" /> : <span className="text-2xl font-black text-cyan-400">{company.slice(0,2).toUpperCase()}</span>}</div><h4 className="font-bold text-white truncate">{company}</h4><p className="text-xs text-slate-400 mt-1">{items.length} product{items.length === 1 ? '' : 's'}</p></button>; })}
              </div>
            )}
          </div>
        )}

        {(selectedCompany || searchTerm) && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div><button onClick={() => { if (selectedCompany) setSelectedCompany(''); else { setSelectedCategory(''); setSearchTerm?.(''); } }} className="text-xs text-cyan-400 hover:underline mb-2">← {selectedCompany ? 'Back to companies' : 'All categories'}</button><h3 className="text-2xl font-bold text-white">{selectedCompany || 'Search results'}</h3><p className="text-xs text-slate-400 mt-1">{safeCategories.find((category) => category.id === selectedCategory)?.name || ''}</p></div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"><SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /><label htmlFor="sort-select-results" className="text-slate-400">Sort by:</label><select id="sort-select-results" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent border-none text-white font-medium focus:outline-none cursor-pointer"><option value="featured">Featured First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Customer Rating</option></select></div>
          </div>
        )}

        {searchTerm && (
          <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="text-slate-300">Showing results for: <span className="font-semibold text-cyan-400">“{searchTerm}”</span> ({filteredProducts.length} items found)</div>
            <button onClick={() => setSearchTerm?.('')} className="text-cyan-400 hover:underline font-semibold">Clear search</button>
          </div>
        )}

        {(selectedCompany || searchTerm) && (filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">{safeProducts.length === 0 ? 'Products will appear here when they are added to the catalog.' : 'Try adjusting your search query or switching categories.'}</p>
            <button onClick={() => { setSelectedCategory(''); setSelectedCompany(''); setSearchTerm?.(''); }} className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const specs = getSpecs(product.specs);
              const isAdded = addedAnimationId === product.id;
              const stockQuantity = Number(product.stockQuantity);
              const hasStockQuantity = product.stockQuantity !== undefined && product.stockQuantity !== null;
              const isOutOfStock = hasStockQuantity ? stockQuantity <= 0 : product.inStock === false;
              const isLowStock = !isOutOfStock && hasStockQuantity && stockQuantity > 0 && stockQuantity <= 3;
              const productName = typeof product.name === 'string' ? product.name : 'Unnamed product';
              return (
                <div key={product.id} onClick={() => setActiveModalProduct({ ...product, name: productName, specs })} className={`group bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer ${isOutOfStock ? 'opacity-85' : ''}`}>
                  <div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-3.5">
                      <img src={product.image || 'https://placehold.co/800x600/0f172a/94a3b8?text=AMR+Computers'} alt={productName} className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale-[40%]' : ''}`} loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      {product.badge && <span className="absolute top-2.5 left-2.5 bg-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">{product.badge}</span>}
                      {isOutOfStock ? <span className="absolute top-2.5 right-2.5 bg-rose-600/95 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg backdrop-blur-sm animate-pulse">Out of Stock</span> : isLowStock ? <span className="absolute top-2.5 right-2.5 bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">Only {stockQuantity} Left</span> : null}
                      <button onClick={(event) => { event.stopPropagation(); setActiveModalProduct({ ...product, name: productName, specs }); }} className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-slate-950/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200" title="Quick View Details" aria-label={`Quick view ${productName}`}><Eye className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2"><span className="text-slate-400">{getCompany(product)}</span>{product.rating ? <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-current" />{Number(product.rating).toFixed(1)}</span> : null}</div>
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{productName}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{product.description || 'Quality computer component or accessory.'}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">{specs.slice(0, 3).map((spec, i) => <span key={i} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px]">{spec}</span>)}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800"><div><div className="text-lg font-extrabold text-white">{formatPrice(Number(product.price) || 0)}</div>{product.originalPrice > product.price ? <div className="text-xs text-slate-500 line-through">{formatPrice(product.originalPrice)}</div> : null}</div><button disabled={isOutOfStock} onClick={(event) => handleQuickAdd(product, event)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 px-3 py-2 text-xs font-bold transition-colors"><ShoppingCart className="w-4 h-4" />{isAdded ? <Check className="w-4 h-4" /> : 'Add'}</button></div>
                </div>
              );
            })}
          </div>
        ))}
        {!searchTerm && !selectedCategory && safeCategories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <Cpu className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Your computer parts catalog is being prepared</h3>
            <p className="text-slate-400 mt-2">Products and categories will appear here when the catalog is available.</p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"><span>Secure checkout support</span><span>•</span><span>Genuine components</span><span>•</span><span>Local repair service</span></div>
      </div>
      {activeModalProduct && <ProductModal product={activeModalProduct} onClose={() => setActiveModalProduct(null)} />}
    </section>
  );
};

export default ProductCatalog;
