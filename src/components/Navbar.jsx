import React, { useState, useEffect } from 'react';
import { useCart } from '../context/useCart';
import { useProducts } from '../context/useProducts';
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  MessageSquare,
  Cpu,
  ShieldCheck,
  Search,
  Sliders
} from 'lucide-react';

export const Navbar = ({ onSearchChange, searchTerm }) => {
  const { cartCount, openCart } = useCart();
  const { openAdmin } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products & Store', href: '#shop' },
    { name: 'Custom PC Builder', href: '#pc-builder' },
    { name: 'Repair & Services', href: '#services' },
    { name: 'Why AMR', href: '#why-us' },
    { name: 'Customer Reviews', href: '#reviews' },
    { name: 'Contact & Store', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-xs py-1.5 px-4 text-slate-300 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-cyan-300">AMR COMPUTERS:</span>
            <span>Authorized Hardware Center • Custom PC Specialists • Chip-Level Repairs</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 100% Genuine Certified Parts
            </span>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" /> +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-md shadow-lg shadow-black/40 border-b border-slate-800'
            : 'bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <Cpu className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-wider text-white">AMR</span>
                  <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">COMPUTERS</span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
                  Custom Rigs & Tech Studio
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Actions: Search bar, WhatsApp & Cart Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search shortcut for desktop */}
              <div className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search PCs, GPUs, RAM..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-48 lg:w-56 pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              </div>

              {/* WhatsApp direct chat button */}
              <a
                href="https://wa.me/919876543210?text=Hello%20AMR%20Computers,%20I%20have%20an%20inquiry%20regarding%20a%20PC%20build%20or%20repair%20service"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                title="Chat with AMR Engineers on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Admin Portal Button */}
              <button
                onClick={openAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                title="Open AMR Store Admin Control Panel"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-cyan-400 transition-all group"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[11px] font-bold text-slate-950 shadow-md shadow-cyan-500/40 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            {/* Mobile Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search PCs, GPUs, RAM..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdmin();
                }}
                className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" /> Store Admin Control Panel
              </button>
              <a
                href="https://wa.me/919876543210?text=Hello%20AMR%20Computers,%20I%20have%20an%20inquiry%20regarding%20a%20PC%20build%20or%20repair%20service"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a
                href="tel:+919876543210"
                className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" /> Call +91 98765 43210
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
