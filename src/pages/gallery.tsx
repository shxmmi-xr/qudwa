import React, { useState } from 'react';
import Head from 'next/head';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { GalleryItem } from '@/data/mockData';
import { LightboxModal } from '@/components/LightboxModal';

export default function GalleryPage() {
  const { currentTheme, brand, gallery } = useData();
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const allCategories = Array.from(
    new Set(gallery.map((g) => g.category).filter(Boolean))
  );
  const tags = ['All', ...allCategories];

  const filteredGallery = gallery.filter((item) => {
    if (selectedTag === 'All') return true;
    return item.category?.toLowerCase() === selectedTag.toLowerCase();
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`Event Gallery | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <ImageIcon className="w-3.5 h-3.5" style={{ color: currentTheme.secondary }} />
            <span>High Resolution Photo Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Event Gallery
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Capturing the emotional essence, cultural vibrance, and memorable moments of {brand.eventName}.
          </p>
        </div>

        {/* Category Tag Pills */}
        {tags.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    isSelected
                      ? 'text-black shadow-lg border-transparent'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: currentTheme.secondary,
                          boxShadow: `0 0 20px ${currentTheme.secondaryGlow}`,
                        }
                      : {}
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {/* Photo Grid */}
        {filteredGallery.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto">
            <ImageIcon className="w-12 h-12 mx-auto text-white/30 mb-3" />
            <h3 className="text-white font-bold text-lg">No Photos Found</h3>
            <p className="text-white/50 text-xs mt-1">Photos will appear here as soon as they are uploaded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl cursor-pointer aspect-[4/3] sm:aspect-square"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="self-end p-2 rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-black mb-1 inline-block"
                      style={{ backgroundColor: currentTheme.secondary }}
                    >
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
