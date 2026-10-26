import React from 'react';
import { TRUST_STATS } from '../data/testimonials';
import { ShieldCheck, Wrench, Truck, Cpu } from 'lucide-react';

export const StatsSection = () => {
  const valueProps = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Expert Custom Assembly',
      desc: 'Precision cable routing, optimized positive-pressure air flows, and custom BIOS tuning.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: '100% Genuine Components',
      desc: 'Direct brand-authorized stock from NVIDIA, AMD, ASUS, MSI, Corsair, Gigabyte & Intel.'
    },
    {
      icon: <Wrench className="w-6 h-6 text-blue-400" />,
      title: 'Chip-Level Repair Lab',
      desc: 'Advanced SMD micro-soldering, BGA rework station, and cleanroom motherboard diagnostics.'
    },
    {
      icon: <Truck className="w-6 h-6 text-purple-400" />,
      title: 'Insured Transit & Pickup',
      desc: 'Secure wooden-crated packaging for rigs pan-India and express doorstep service locally.'
    }
  ];

  return (
    <section id="why-us" className="py-16 bg-slate-900/50 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Numerical Stats Counter Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-slate-800">
          {TRUST_STATS.map((stat, idx) => (
            <div key={idx} className="text-center p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Core Value Pillars */}
        <div className="pt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Tech Enthusiasts Trust <span className="text-cyan-400">AMR Computers</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From competitive esports tournaments to critical corporate infrastructure, we deliver precision and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="p-3 w-fit rounded-xl bg-slate-900 border border-slate-700/60 mb-4 group-hover:scale-110 transition-transform">
                  {prop.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
