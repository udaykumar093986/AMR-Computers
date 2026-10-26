import React from 'react';
import {
  Cpu,
  Flame,
  Wrench,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle
} from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Call To Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-medium shadow-lg shadow-cyan-500/5">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-semibold">AMR Tech Hub:</span>
              <span className="text-slate-300">New Gen RTX 40 Super Series & Ryzen 9000 In Stock!</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Unleash Peak Power with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                AMR Computers
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              We design custom liquid-cooled gaming rigs, heavy-duty production workstations, and deliver precision chip-level motherboard and laptop repairs with certified genuine components.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#pc-builder"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group"
              >
                <Cpu className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Build Your Custom PC</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Explore Store</span>
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-cyan-400 border border-cyan-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Book a Repair</span>
              </a>
            </div>

            {/* Trust bullet points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3-Year AMR Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>48h Burn-In Stress Tested</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Express Doorstep Pickup</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Interactive Highlights */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-30 blur-xl group-hover:opacity-100 transition duration-1000"></div>

              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl space-y-4">
                {/* Visual Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
                    alt="AMR Custom Gaming PC"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Featured Battle Rig</span>
                  </div>

                  {/* Benchmark pill on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-700/60 text-slate-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-white">4K Cyberpunk 2077</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">144+ FPS ULTRA</span>
                  </div>
                </div>

                {/* Machine Specs Quick Overview */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-base">AMR Apex Predator Edition</h3>
                      <p className="text-xs text-slate-400">Intel i9-14900KS • RTX 4090 24GB • 64GB DDR5</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block line-through">₹3,59,999</span>
                      <span className="text-base font-extrabold text-cyan-400">₹3,29,999</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-center">
                      <span className="text-[10px] text-slate-400 block">Thermals</span>
                      <span className="text-xs font-bold text-emerald-400">Sub 65°C</span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-center">
                      <span className="text-[10px] text-slate-400 block">Warranty</span>
                      <span className="text-xs font-bold text-cyan-400">3 Yrs Direct</span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-center">
                      <span className="text-[10px] text-slate-400 block">Testing</span>
                      <span className="text-xs font-bold text-purple-400">Passed 48H</span>
                    </div>
                  </div>
                </div>

                {/* Call to inspect */}
                <a
                  href="#shop"
                  className="w-full block py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
                >
                  View Details & Custom Options
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
