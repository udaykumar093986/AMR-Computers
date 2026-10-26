import React from 'react';
import {
  Cpu,
  ShieldCheck,
  Truck
} from 'lucide-react';

const currentYear = new Date().getFullYear();

export const Footer = () => {

  const brandPartners = [
    'NVIDIA GeForce RTX',
    'AMD Ryzen & Radeon',
    'Intel Core Ultra',
    'ASUS Republic of Gamers',
    'GIGABYTE AORUS',
    'MSI Gaming',
    'Corsair',
    'Samsung SSD'
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Brands Ticker Strip */}
      <div className="py-6 border-b border-slate-900 bg-slate-950/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-500 font-bold tracking-wider uppercase text-[11px]">
          {brandPartners.map((brand, i) => (
            <span key={i} className="hover:text-cyan-400 transition-colors">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Cpu className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white">AMR </span>
                <span className="font-bold text-lg text-cyan-400">COMPUTERS</span>
                <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                  Hardware Excellence • Est. 2014
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              AMR Computers is a premier technology boutique specializing in bespoke high-end liquid-cooled gaming PCs, AI workstations, certified hardware components, and professional chip-level micro-soldering repairs.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Components
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-cyan-400">
                <Truck className="w-3.5 h-3.5" /> Pan-India Insured Shipping
              </span>
            </div>
          </div>

          {/* Column 2: Systems & Shop */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Products & Systems</h4>
            <ul className="space-y-2">
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  Flagship Gaming Rigs
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  Creator & AI Workstations
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  High Refresh Gaming Laptops
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  GeForce RTX 40 Super GPUs
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  Ryzen 7000 & 9000 Processors
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-cyan-400 transition-colors">
                  Gen4 & Gen5 NVMe SSDs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Custom Builder & Repairs */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Studio Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#pc-builder" className="hover:text-cyan-400 transition-colors">
                  Interactive PC Configurator
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Motherboard Chip-Level Repair
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Laptop Display & Hinge Repair
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Custom Liquid Loop Fabrication
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Thermal Spa & Deep De-dusting
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Annual Maintenance (AMC)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Store Hours & Help</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Mon – Sat: 10:00 AM – 9:00 PM</li>
              <li>Sunday: 11:00 AM – 6:00 PM</li>
              <li className="pt-2 text-cyan-400 font-semibold">
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <a href="mailto:support@amrcomputers.in" className="hover:text-white">
                  support@amrcomputers.in
                </a>
              </li>
              <li>Shop #12, Ground Floor, Tech Arcade, Commercial Complex, Bengaluru</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} AMR Computers. All Rights Reserved. Built with Precision & Passion.</p>
          <div className="flex items-center gap-4">
            <a href="#why-us" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#why-us" className="hover:text-slate-400">Warranty Terms</a>
            <span>•</span>
            <a href="#faqs" className="hover:text-slate-400">Return & Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
