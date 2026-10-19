import React, { useState } from 'react';
import Head from 'next/head';
import { Video, Play, Instagram, Youtube, Film } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { MediaVideo } from '@/data/mockData';
import { VideoModal } from '@/components/VideoModal';

export default function MediaPage() {
  const { currentTheme, brand, videos } = useData();
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`Media & Video Hub | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <Video className="w-3.5 h-3.5" style={{ color: currentTheme.secondary }} />
            <span>Recorded Keynotes, Reels & Performances</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Media & Video Hub
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Watch Instagram Reels, live streams, grand sessions, and cultural highlights from {brand.eventName}.
          </p>
        </div>

        {/* Video Cards Grid */}
        {videos.length === 0 ? (
          <div className="p-14 text-center rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto">
            <Video className="w-12 h-12 mx-auto text-white/30 mb-3" />
            <h3 className="text-white font-bold text-lg">No Videos Published Yet</h3>
            <p className="text-white/50 text-xs mt-1">Festival videos, keynotes, and reels will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {videos.map((video) => {
              const isInsta = video.platform === 'instagram' || Boolean(video.instagramUrl);
              const isDirect = video.platform === 'direct' || Boolean(video.videoUrl);

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group rounded-3xl bg-white/5 border border-white/10 hover:border-white/25 overflow-hidden shadow-2xl transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01]"
                >
                  <div className="relative aspect-video w-full bg-black/50 overflow-hidden">
                    <img
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-md group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: isInsta ? '#ec1c62' : currentTheme.primary,
                          boxShadow: `0 0 25px ${isInsta ? 'rgba(236,28,98,0.6)' : currentTheme.primaryGlow}`,
                        }}
                      >
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Top Platform Badge */}
                    <div className="absolute top-3 left-3">
                      {isInsta ? (
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                          <Instagram className="w-3 h-3" /> Instagram Reel
                        </span>
                      ) : isDirect ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                          <Film className="w-3 h-3" /> Video
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                          <Youtube className="w-3 h-3" /> YouTube
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/80 text-[10px] font-bold text-white backdrop-blur-sm">
                      {video.duration || 'Reel'}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span
                      className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded text-black inline-block"
                      style={{ backgroundColor: currentTheme.secondary }}
                    >
                      {video.speaker}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-white/90 transition-colors leading-snug line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
