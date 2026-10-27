
import React from 'react';
import {
  Cpu,
  ShieldCheck,
  Wrench,
  Cable,
  HardDrive,
  ArrowRight
} from 'lucide-react';

export const AboutPage = () => (
  <section className="min-h-[calc(100vh-5rem)] bg-slate-50 py-16 sm:py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 text-sm font-semibold">
          <Cpu className="w-4 h-4" />
          About AMR Computers
        </span>

        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Reliable Parts. Dependable Support.
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Explore computer spare parts, OEM components, and essential
          accessories, backed by AMR Computers' product guidance and
          dedicated repair support.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Cpu,
            title: 'Computer Spare Parts',
            text: 'Explore replacement components, processors, memory, motherboards, and other essential computer hardware.'
          },
          {
            icon: HardDrive,
            title: 'OEM Components & Accessories',
            text: 'Discover storage devices, cables, connectors, cooling parts, and accessories from established manufacturers.'
          },
          {
            icon: Wrench,
            title: 'Repair & Maintenance',
            text: 'Request help with hardware diagnostics, faulty components, replacements, and computer repair services.'
          }
        ].map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              {text}
            </p>
          </article>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-10 rounded-2xl bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-bold">
            Need help finding the right spare part?
          </h2>

          <p className="mt-2 text-slate-300">
            Explore our components or contact us for product and repair assistance.
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Explore Spare Parts
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

    </div>
  </section>
);
