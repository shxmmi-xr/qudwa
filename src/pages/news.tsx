import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function NewsPage() {
  const { currentTheme, brand, news } = useData();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`News & Press Releases | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />

      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <Newspaper className="w-3.5 h-3.5" style={{ color: currentTheme.secondary }} />
            <span>Official Festival Media & Bulletin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            News & Press Releases
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Read daily updates, session summaries, announcements, and coverage from {brand.eventName}.
          </p>
        </div>

        {/* News List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group flex flex-col rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 p-5 transition-all shadow-xl hover:shadow-2xl hover:bg-white/[0.07]"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 mb-5">
                <img
                  src={item.image}
                  alt={item.titleMalayalam}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black backdrop-blur-md"
                  style={{ backgroundColor: currentTheme.secondary }}
                >
                  {item.category}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-white/90 leading-snug">
                    {item.titleMalayalam}
                  </h2>
                  <p className="text-xs text-white/50 font-medium mt-1">
                    {item.titleEnglish}
                  </p>
                  <p className="text-white/60 text-sm line-clamp-2 mt-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div
                  className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider"
                  style={{ color: currentTheme.secondary }}
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
