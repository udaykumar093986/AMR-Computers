import React from 'react';
import { Cpu, ShieldCheck, Wrench, Laptop, ArrowRight } from 'lucide-react';

export const AboutPage = () => (
  <section className="min-h-[calc(100vh-5rem)] bg-slate-50 py-16 sm:py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 text-sm font-semibold">
          <Cpu className="w-4 h-4" /> About AMR Computers
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Technology that works for you.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">AMR Computers helps customers choose dependable computer hardware, build custom systems, and get support for their devices.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { icon: Laptop, title: 'Computer Products', text: 'Explore computers, laptops, components, storage, memory and everyday accessories.' },
          { icon: Cpu, title: 'Custom PC Guidance', text: 'Find components and system configurations suited to gaming, creative work and productivity.' },
          { icon: Wrench, title: 'Repair Support', text: 'Request assistance for laptop, desktop and component issues through our repair booking page.' }
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-2xl bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div><h2 className="text-2xl font-bold">Need help choosing or repairing a device?</h2><p className="mt-2 text-slate-300">Browse our products or send us a repair request.</p></div>
        <a href="#repair" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Book a Repair <ArrowRight className="h-4 w-4" /></a>
      </div>
    </div>
  </section>
);
