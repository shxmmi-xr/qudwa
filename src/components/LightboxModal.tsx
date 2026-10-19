import React from 'react';
import { X, Download, Share2, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../data/mockData';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-200">
      <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between pb-3 text-white">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10">
            {item.category} • {item.title}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={item.image}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Open full image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-h-[75vh]">
          <img
            src={item.image}
            alt={item.title}
            className="w-auto h-auto max-h-[75vh] object-contain rounded-2xl"
          />
        </div>

        <p className="mt-3 text-sm font-semibold text-white/70">{item.title}</p>
      </div>
    </div>
  );
};
