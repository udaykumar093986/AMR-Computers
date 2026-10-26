import React from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { Star, MessageSquare, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-slate-900/40 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Real Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trusted by Gamers, Studios & Creators
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            See what esports players, architects, software engineers, and businesses say about building and repairing their tech at AMR Computers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-800">
                    {review.tag}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-slate-700 mb-2 group-hover:text-cyan-500/50 transition-colors" />

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  "{review.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">{review.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Customer" />
                  </div>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
