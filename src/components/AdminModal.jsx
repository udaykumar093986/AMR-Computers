import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/useProducts';
import { useCart } from '../context/useCart';
import {
  X,
  Lock,
  Unlock,
  Package,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Check,
  Search,
  RotateCcw,
  Layers,
  ShoppingBag,
  Wrench,
  Save,
  LogOut,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';

export const AdminModal = () => {
  const {
    products,
    categories,
    orders,
    tickets,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrder,
    deleteOrder,
    updateTicket,
    deleteTicket,
    toggleStock,
    addCategory,
    deleteCategory,
    resetToDefaults,
    isAdminOpen,
    closeAdmin,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin
  } = useProducts();

  const { formatPrice, showNotification } = useCart();

  // Firebase email/password authentication state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab: 'products' | 'categories' | 'orders' | 'tickets' | 'new-product'
  const [activeTab, setActiveTab] = useState('products');
  const [productSearch, setProductSearch] = useState('');

  // Editing Product State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    company: '',
    category: categories.find((category) => category.id !== 'all')?.id || '',
    price: '',
    originalPrice: '',
    stockQuantity: 5,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    specs: '64GB DDR5 Memory\nRTX 4080 Super 16GB\n2TB Gen4 NVMe SSD',
    warranty: '3 Years AMR Warranty',
    description: 'High-performance hardware engineered for extreme workloads.'
  });

  // Keep the selected category valid when the category list changes.
  useEffect(() => {
    const availableCategory = categories.find((category) => category.id !== 'all');
    if (
      availableCategory &&
      !categories.some((category) => category.id === newProductForm.category)
    ) {
      setNewProductForm((previous) => ({ ...previous, category: availableCategory.id }));
    }
  }, [categories, newProductForm.category]);

  // New Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');

  // Inline Quick Price Editing State
  const [inlinePriceEditId, setInlinePriceEditId] = useState(null);
  const [inlinePriceValue, setInlinePriceValue] = useState('');

  if (!isAdminOpen) return null;

  // Sign in with Firebase Authentication; ProductContext verifies the admins/{uid} record.
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!adminEmail.trim() || !adminPassword) {
      setAuthError('Enter your administrator email and password.');
      return;
    }

    setLoginLoading(true);
    try {
      await loginAdmin(adminEmail.trim(), adminPassword);
      setAdminPassword('');
      setShowPassword(false);
      showNotification('Admin signed in successfully!', 'success');
    } catch (error) {
      console.error('Admin login failed:', error?.code || error?.message || error);

      if (
        error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/invalid-email'
      ) {
        setAuthError('Invalid email or password.');
      } else if (
        error?.message === 'ADMIN_NOT_AUTHORIZED' ||
        error?.message === 'ADMIN_VERIFICATION_DENIED'
      ) {
        setAuthError('This account is not authorized as an administrator.');
      } else if (error?.code === 'auth/too-many-requests') {
        setAuthError('Too many attempts. Please try again later.');
      } else if (error?.code === 'auth/network-request-failed') {
        setAuthError('Network error. Check your internet connection and try again.');
      } else {
        setAuthError('Sign-in failed. Check your details and try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Convert uploaded product photos to a compact JPEG so browser storage is less likely to exceed its quota.
  const handleProductImageUpload = (file, onImageReady) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Please choose an image smaller than 10 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => showNotification('Could not read that image. Please try another file.', 'error');
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => showNotification('That image could not be opened.', 'error');
      image.onload = () => {
        const maxDimension = 1200;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          showNotification('Image processing is not supported in this browser.', 'error');
          return;
        }
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const compressedImage = canvas.toDataURL('image/jpeg', 0.78);
        onImageReady(compressedImage);
        showNotification('Product photo uploaded. Save the product to apply it.', 'success');
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showNotification('Please enter product name and price', 'error');
      return;
    }

    const matchedCat = categories.find((category) => category.id === newProductForm.category && category.id !== 'all')
      || categories.find((category) => category.id !== 'all');

    if (!matchedCat) {
      showNotification('Create a product category before adding products.', 'error');
      return;
    }

    try {
      await addProduct({
        ...newProductForm,
        category: matchedCat.id,
        categoryName: matchedCat.name,
        company: (newProductForm.company || '').trim()
      });
      showNotification(`Product "${newProductForm.name}" added to catalog!`, 'success');
    } catch (error) {
      console.error('Failed to add product:', error);
      showNotification(error?.message === 'ADMIN_LOGIN_REQUIRED' ? 'Please sign in as an administrator again.' : 'Could not save product. Check Firebase permissions and try again.', 'error');
      return;
    }
    setActiveTab('products');
    setNewProductForm({
      name: '',
      company: '',
      category: categories.find((category) => category.id !== 'all')?.id || '',
      price: '',
      originalPrice: '',
      badge: 'New Arrival',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      specs: '64GB DDR5 Memory\nRTX 4080 Super 16GB\n2TB Gen4 NVMe SSD',
      warranty: '3 Years AMR Warranty',
      description: 'High-performance hardware engineered for extreme workloads.'
    });
  };

  // Handle Edit Product Save
  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      company: (editingProduct.company || editingProduct.brand || editingProduct.manufacturer || '').trim(),
      companyImage: editingProduct.companyImage || '',
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice,
      stockQuantity: editingProduct.stockQuantity,
      category: editingProduct.category,
      categoryName: categories.find((category) => category.id === editingProduct.category)?.name || editingProduct.categoryName,
      badge: editingProduct.badge,
      image: editingProduct.image,
      inStock: editingProduct.stockQuantity > 0,
      specs: editingProduct.specs,
      warranty: editingProduct.warranty,
      description: editingProduct.description
    });

    showNotification(`Product "${editingProduct.name}" updated!`, 'success');
    setEditingProduct(null);
  };

  // Handle Inline Quick Price Save
  const handleSaveInlinePrice = (id) => {
    const num = Number(inlinePriceValue);
    if (!isNaN(num) && num > 0) {
      updateProduct(id, { price: num });
      showNotification('Price updated successfully!', 'success');
    }
    setInlinePriceEditId(null);
  };

  // Handle Add Category — only report success after Firestore confirms the write.
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const added = await addCategory({ name: newCategoryName.trim(), image: newCategoryImage });
      showNotification(`Category "${added.name}" saved to Firebase!`, 'success');
      setNewCategoryName('');
      setNewCategoryImage('');
    } catch (error) {
      console.error('[AMR Computers] Category save failed:', error?.code || error?.message || error);
      showNotification('Category was not saved to Firebase. Check Firestore permissions and try again.', 'error');
    }
  };

  // Filter products defensively: Firestore documents may omit optional fields.
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const normalizedProductSearch =
    typeof productSearch === 'string' ? productSearch.trim().toLowerCase() : '';

  const filteredAdminProducts = safeProducts.filter((product) => {
    const name = typeof product.name === 'string' ? product.name : '';
    const categoryName =
      typeof product.categoryName === 'string' ? product.categoryName : '';
    const category = typeof product.category === 'string' ? product.category : '';

    return (
      name.toLowerCase().includes(normalizedProductSearch) ||
      categoryName.toLowerCase().includes(normalizedProductSearch) ||
      category.toLowerCase().includes(normalizedProductSearch)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">AMR Control Center</h2>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-500/30 font-bold uppercase">
                  Live Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Update prices, add inventory, manage categories & view orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5 transition-colors"
                title="Lock / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>
            )}
            <button
              onClick={closeAdmin}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier Screen */}
        {!isAdminAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-sm">
              <h3 className="text-xl font-bold text-white">Administrator Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sign in with your authorized Firebase administrator account to manage the AMR catalog.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <div className="space-y-1.5 text-left">
                <label htmlFor="amr-admin-email" className="block text-[11px] font-semibold text-slate-300">
                  Administrator email
                </label>
                <input
                  id="amr-admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder=""
                  autoComplete="username"
                  autoFocus
                  required
                  disabled={loginLoading}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="amr-admin-password" className="block text-[11px] font-semibold text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="amr-admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder=""
                    autoComplete="current-password"
                    required
                    disabled={loginLoading}
                    className="w-full px-3.5 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={loginLoading}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p role="alert" className="text-xs text-rose-400 font-medium text-left">{authError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {loginLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Sign In to Control Center</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-500 max-w-xs">
              Confidential AMR administrative access only.
            </p>
          </div>
        ) : (
          /* Authenticated Admin Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto gap-1">
              <div className="flex md:flex-col gap-1 w-full">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full transition-all ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Products ({products.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('new-product');
                    setEditingProduct(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full transition-all ${
                    activeTab === 'new-product'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Add New Product</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('categories');
                    setEditingProduct(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full transition-all ${
                    activeTab === 'categories'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Categories ({categories.filter((category) => category.id !== 'all').length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setEditingProduct(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full transition-all ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('tickets');
                    setEditingProduct(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Repairs ({tickets.length})</span>
                </button>
              </div>

              {/* Reset to Factory Defaults button */}
              <div className="hidden md:block pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    if (window.confirm('Reset all catalog changes back to factory default products?')) {
                      resetToDefaults();
                      showNotification('Catalog restored to original factory defaults!', 'info');
                    }
                  }}
                  className="w-full py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/50">
              
              {/* TAB 1: PRODUCT LIST & INLINE EDITING */}
              {activeTab === 'products' && !editingProduct && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Filter by product name..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    </div>

                    <button
                      onClick={() => setActiveTab('new-product')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Products Table / Cards */}
                  <div className="space-y-3">
                    {filteredAdminProducts.map((p) => {
                      const isInlineEditing = inlinePriceEditId === p.id;

                      return (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-14 h-14 rounded-xl object-cover bg-slate-900 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                  {p.categoryName || p.category}
                                </span>
                                {p.badge && (
                                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                                    {p.badge}
                                  </span>
                                )}
                                
                                {/* Stock Quantity Stepper */}
                                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-1 py-0.5">
                                  <button
                                    onClick={() => updateProduct(p.id, { stockQuantity: Math.max(0, (p.stockQuantity ?? 5) - 1) })}
                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Decrease stock by 1"
                                    aria-label="Decrease stock"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className={`text-[11px] font-mono font-bold px-1.5 min-w-[28px] text-center ${
                                    (p.stockQuantity ?? 5) === 0
                                      ? 'text-rose-400 font-extrabold'
                                      : (p.stockQuantity ?? 5) <= 3
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                  }`}>
                                    Qty: {p.stockQuantity ?? 5}
                                  </span>
                                  <button
                                    onClick={() => updateProduct(p.id, { stockQuantity: (p.stockQuantity ?? 5) + 1 })}
                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Increase stock by 1"
                                    aria-label="Increase stock"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => toggleStock(p.id)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                                    (p.stockQuantity ?? 5) > 0
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                  }`}
                                  title="Click to toggle in-stock status"
                                >
                                  {(p.stockQuantity ?? 5) > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                                </button>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                                {p.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {Array.isArray(p.specs) ? p.specs.join(' • ') : p.specs}
                              </p>
                            </div>
                          </div>

                          {/* Price & Action Buttons */}
                          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                            {/* Price display / Inline editor */}
                            <div className="flex items-center gap-1.5">
                              {isInlineEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={inlinePriceValue}
                                    onChange={(e) => setInlinePriceValue(e.target.value)}
                                    autoFocus
                                    className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-cyan-400 text-xs font-mono text-white focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveInlinePrice(p.id)}
                                    className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                    title="Save Price"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setInlinePriceEditId(null)}
                                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setInlinePriceEditId(p.id);
                                    setInlinePriceValue(String(p.price));
                                  }}
                                  className="cursor-pointer group flex items-center gap-1 p-1 rounded hover:bg-slate-900"
                                  title="Click to quickly edit price"
                                >
                                  <div className="text-right">
                                    <span className="text-sm font-extrabold text-cyan-400 font-mono block">
                                      {formatPrice(p.price)}
                                    </span>
                                    {p.originalPrice && (
                                      <span className="text-[10px] text-slate-500 line-through font-mono">
                                        {formatPrice(p.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                  <Edit2 className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 ml-1" />
                                </div>
                              )}
                            </div>

                            {/* Full Edit & Delete Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingProduct({ ...p, specs: Array.isArray(p.specs) ? p.specs.join('\n') : p.specs })}
                                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs"
                                title="Full Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                                    deleteProduct(p.id);
                                    showNotification(`Deleted "${p.name}"`, 'info');
                                  }
                                }}
                                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT EXISTING PRODUCT MODAL/FORM */}
              {editingProduct && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-cyan-400" />
                      <span>Edit Product: {editingProduct.name}</span>
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          {categories.filter((c) => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand (sub-category)</label>
                      <input type="text" placeholder="e.g. Logitech, Kingston, Corsair" value={editingProduct.company || editingProduct.brand || editingProduct.manufacturer || ''} onChange={(e) => setEditingProduct({ ...editingProduct, company: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {editingProduct.companyImage && <img src={editingProduct.companyImage} alt="Company / sub-category preview" className="h-14 w-14 rounded-lg object-contain bg-white p-1" />}
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-950">
                          <Upload className="h-4 w-4" /> Upload sub-category image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleProductImageUpload(e.target.files?.[0], (image) => setEditingProduct((prev) => ({ ...prev, companyImage: image }))); e.target.value = ''; }} />
                        </label>
                        <span className="text-[11px] text-slate-500">Used for the company card</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Selling Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Original / MRP Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Stock Quantity (Units) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editingProduct.stockQuantity ?? 0}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            stockQuantity: Math.max(0, parseInt(e.target.value) || 0)
                          })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">0 = Out of Stock</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Product Photo</label>
                      {editingProduct.image && (
                        <img src={editingProduct.image} alt={editingProduct.name || 'Product preview'} className="h-32 w-full max-w-xs rounded-xl border border-slate-700 bg-white object-contain p-2" />
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                          <Upload className="h-4 w-4" /> Upload Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleProductImageUpload(e.target.files?.[0], (image) => setEditingProduct((prev) => ({ ...prev, image }))); e.target.value = ''; }} />
                        </label>
                        <span className="text-[11px] text-slate-400">JPG, PNG or WebP · up to 10 MB</span>
                      </div>
                      <label className="block text-[11px] text-slate-400">Or paste an image URL</label>
                      <input
                        type="url"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="https://example.com/product.jpg"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Technical Specifications (One line per feature)
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.specs}
                        onChange={(e) => setEditingProduct({ ...editingProduct, specs: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                        />
                        <span>Product is In Stock</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: ADD NEW PRODUCT FORM */}
              {activeTab === 'new-product' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 animate-fade-in max-w-3xl">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Spare Part</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter the spare-part details, category, brand, price and stock. It will appear on the store after saving.
                    </p>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mechanical Keyboard, DDR4 RAM, SATA Cable"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category *
                        </label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          {categories.filter((c) => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand (sub-category) *</label>
                      <input type="text" required placeholder="e.g. Logitech, Kingston, Corsair" value={newProductForm.company} onChange={(e) => setNewProductForm({ ...newProductForm, company: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {newProductForm.companyImage && <img src={newProductForm.companyImage} alt="Company / sub-category preview" className="h-14 w-14 rounded-lg object-contain bg-white p-1" />}
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-950">
                          <Upload className="h-4 w-4" /> Upload sub-category image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleProductImageUpload(e.target.files?.[0], (image) => setNewProductForm((prev) => ({ ...prev, companyImage: image }))); e.target.value = ''; }} />
                        </label>
                        <span className="text-[11px] text-slate-500">Used for the company card</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Selling Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="84999"
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Original / MRP Price (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="94999"
                          value={newProductForm.originalPrice}
                          onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Initial Stock Quantity *
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="5"
                          value={newProductForm.stockQuantity}
                          onChange={(e) => setNewProductForm({ ...newProductForm, stockQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Badge / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="New Gen / Hot Deal"
                          value={newProductForm.badge}
                          onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Product Photo</label>
                      {newProductForm.image && (
                        <img src={newProductForm.image} alt="New product preview" className="h-32 w-full max-w-xs rounded-xl border border-slate-700 bg-white object-contain p-2" />
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                          <Upload className="h-4 w-4" /> Upload Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleProductImageUpload(e.target.files?.[0], (image) => setNewProductForm((prev) => ({ ...prev, image }))); e.target.value = ''; }} />
                        </label>
                        <span className="text-[11px] text-slate-400">JPG, PNG or WebP · up to 10 MB</span>
                      </div>
                      <label className="block text-[11px] text-slate-400">Or paste an image URL</label>
                      <input
                        type="url"
                        value={newProductForm.image}
                        onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                        placeholder="https://example.com/product.jpg"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Key Specifications (One spec per line)
                      </label>
                      <textarea
                        rows={3}
                        value={newProductForm.specs}
                        onChange={(e) => setNewProductForm({ ...newProductForm, specs: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Overview Description
                      </label>
                      <textarea
                        rows={2}
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish Product to Store</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: CATEGORY MANAGER */}
              {activeTab === 'categories' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Add New Category Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Create New Product Category</span>
                    </h3>

                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {newCategoryImage && <img src={newCategoryImage} alt="Category preview" className="h-16 w-24 rounded-lg border border-slate-700 bg-white object-contain p-1" />}
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-950">
                          <Upload className="h-4 w-4" /> Upload category image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleProductImageUpload(e.target.files?.[0], setNewCategoryImage); e.target.value = ''; }} />
                        </label>
                      </div>
                      <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Networking & Routers, Gaming Chairs, Cooling Pads"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0"
                      >
                        Add Category
                      </button>
                      </div>
                    </form>
                  </div>

                  {/* List of Current Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Store Categories ({categories.length})
                    </h4>

                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.id).length;

                      return (
                        <div
                          key={cat.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {cat.image ? <img src={cat.image} alt={cat.name} className="h-12 w-16 rounded-lg object-cover bg-slate-900" /> : <div className="h-12 w-16 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-500"><Upload className="h-4 w-4" /></div>}
                            <div><span className="text-xs font-bold text-white">{cat.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2 font-mono">
                              id: {cat.id} • ({count} products)
                            </span></div>
                          </div>

                          {cat.id !== 'all' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}" from Firebase? Products assigned to this category will not be deleted.`)) {
                                  deleteCategory(cat.id)
                                    .then(() => showNotification(`Category "${cat.name}" deleted from Firebase.`, 'success'))
                                    .catch((error) => {
                                      console.error('[AMR Computers] Category delete failed:', error?.code || error?.message || error);
                                      showNotification('Category was not deleted from Firebase. Check Firestore permissions and try again.', 'error');
                                    });
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: CUSTOMER ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Customer Orders Placed ({orders.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Live orders submitted via the online checkout
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800">
                      <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white">No customer orders recorded yet</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        When visitors place an order through the shopping cart, it appears here instantly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 gap-3">
                            <div>
                              <span className="text-xs font-bold text-cyan-400 font-mono">{ord.orderId || ord.id || `Order ${idx + 1}`}</span>
                              <span className="text-[11px] text-slate-400 ml-2">Date: {ord.date || '—'}</span>
                              <div className="mt-2">
                                <label className="text-[10px] text-slate-400 mr-2" htmlFor={`order-status-${ord.orderId || idx}`}>Status</label>
                                <select id={`order-status-${ord.orderId || idx}`} value={ord.status || 'Pending'} onChange={async (e) => {
                                  try {
                                    await updateOrder(ord.id || ord.orderId || idx, { status: e.target.value });
                                    showNotification('Order status saved to Firebase.', 'success');
                                  } catch (error) {
                                    console.error('[AMR Computers] Order status update failed:', error?.code || error?.message || error);
                                    showNotification('Order status could not be saved to Firebase.', 'error');
                                  }
                                }} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <div className="text-right">
                                <span className="text-sm font-bold text-white font-mono">Total: {formatPrice(ord.total)}</span>
                                <span className="text-[10px] text-emerald-400 ml-2 uppercase font-semibold">{ord.shipping?.paymentMethod}</span>
                              </div>
                              <button type="button" onClick={async () => {
                                 if (!window.confirm(`Delete order ${ord.orderId || ''} from Firebase?`)) return;
                                 try {
                                   await deleteOrder(ord.id || ord.orderId || idx);
                                   showNotification('Order deleted from Firebase.', 'success');
                                 } catch (error) {
                                   console.error('[AMR Computers] Order delete failed:', error?.code || error?.message || error);
                                   showNotification('Order could not be deleted from Firebase.', 'error');
                                 }
                               }} className="p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10" title="Delete order" aria-label="Delete order">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                            <div>
                              <strong className="text-slate-400">Customer:</strong> {ord.shipping?.fullName} ({ord.shipping?.phone})
                            </div>
                            <div>
                              <strong className="text-slate-400">Delivery:</strong> {ord.shipping?.address}, {ord.shipping?.city} - {ord.shipping?.pincode}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/60 text-[11px] text-slate-300 space-y-1">
                            <span className="text-slate-500 font-bold uppercase text-[10px] block">
                              Items Ordered:
                            </span>
                            {ord.items?.map((it, itIdx) => (
                              <div key={itIdx} className="flex justify-between">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-mono text-cyan-400">{formatPrice(it.price * it.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: REPAIR SERVICE TICKETS */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Diagnostic & Repair Appointments ({tickets.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Appointments scheduled through the Service Booking lab
                    </span>
                  </div>

                  {tickets.length === 0 ? (
                    <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800">
                      <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white">No repair tickets booked yet</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        When users book a diagnostic service or chip repair, tickets will show here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2 gap-3">
                            <div>
                              <span className="font-bold font-mono text-cyan-400">{t.ticketId || t.id || `Repair ${idx + 1}`}</span>
                              <span className="text-emerald-400 font-semibold ml-2">{t.mode}</span>
                              <div className="mt-2 flex items-center gap-2">
                                <label className="text-[10px] text-slate-400" htmlFor={`repair-status-${t.ticketId || idx}`}>Status</label>
                                <select id={`repair-status-${t.ticketId || idx}`} value={t.status || 'Pending'} onChange={async (e) => {
                                  try {
                                    await updateTicket(t.id || t.ticketId || idx, { status: e.target.value });
                                    showNotification('Repair status saved to Firebase.', 'success');
                                  } catch (error) {
                                    console.error('[AMR Computers] Repair status update failed:', error?.code || error?.message || error);
                                    showNotification('Repair status could not be saved to Firebase.', 'error');
                                  }
                                }} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                            <button type="button" onClick={async () => {
                                 if (!window.confirm(`Delete repair request ${t.ticketId || ''} from Firebase?`)) return;
                                 try {
                                   await deleteTicket(t.id || t.ticketId || idx);
                                   showNotification('Repair request deleted from Firebase.', 'success');
                                 } catch (error) {
                                   console.error('[AMR Computers] Repair delete failed:', error?.code || error?.message || error);
                                   showNotification('Repair request could not be deleted from Firebase.', 'error');
                                 }
                               }} className="self-start p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10" title="Delete repair request" aria-label="Delete repair request">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                            <div>
                              <strong className="text-slate-400">Client:</strong> {t.name} ({t.phone})
                            </div>
                            <div>
                              <strong className="text-slate-400">Device:</strong> {t.deviceType}
                            </div>
                            <div>
                              <strong className="text-slate-400">Service:</strong> {t.serviceType}
                            </div>
                            <div>
                              <strong className="text-slate-400">Preferred Slot:</strong> {t.preferredDate || 'Earliest'} ({t.timeSlot})
                            </div>
                          </div>

                          {t.issueDescription && (
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-slate-300 text-[11px]">
                              <strong className="text-slate-400 block">Reported Symptoms:</strong>
                              {t.issueDescription}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
