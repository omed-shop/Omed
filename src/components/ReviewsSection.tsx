import React from 'react';
import { REVIEWS } from '../data/products';
import { Star, CheckCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-medium mb-2">
              <span>Verified Stewards</span>
              <span aria-hidden="true">·</span>
              <span>Long-Term Evaluations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-display">
              Critiques from the Field
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>4.92 / 5.0 Average Across 240+ Delivered Artifacts</span>
          </div>
        </div>

        {/* 3 Attributable Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">{review.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{review.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-stone-900 dark:text-stone-100">{review.author}</h4>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">{review.role}</p>
                    <p className="text-stone-400 text-[10px]">{review.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  Piece: {review.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
