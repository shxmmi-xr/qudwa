import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Instagram, Youtube, Film } from 'lucide-react';
import { MediaVideo } from '@/data/mockData';

interface VideoModalProps {
  video: MediaVideo | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  // Resolve playable direct URL with automatic base64->blob conversion for mobile Safari
  const [playableUrl, setPlayableUrl] = useState<string>('');

  useEffect(() => {
    let rawUrl = video.videoUrl || '';
    if (video.title?.toUpperCase().includes('LOGO') && (!rawUrl || rawUrl.startsWith('data:'))) {
      rawUrl = '/media/logo-revealing.mp4';
    }

    if (rawUrl.startsWith('data:video/')) {
      try {
        const parts = rawUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'video/mp4';
        const binaryStr = atob(parts[1]);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        setPlayableUrl(blobUrl);

        return () => {
          URL.revokeObjectURL(blobUrl);
        };
      } catch (err) {
        console.warn('Could not convert base64 video to blob url:', err);
        setPlayableUrl(rawUrl);
      }
    } else {
      setPlayableUrl(rawUrl);
    }
  }, [video?.videoUrl, video?.title]);

  // Extract Instagram embed URL or ID
  const getInstagramEmbedUrl = (urlOrId: string) => {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    if (clean.includes('instagram.com/reel/') || clean.includes('instagram.com/p/') || clean.includes('instagram.com/tv/')) {
      // Remove query parameters
      const baseUrl = clean.split('?')[0].replace(/\/$/, '');
      return `${baseUrl}/embed/`;
    }
    // If just an ID
    return `https://www.instagram.com/reel/${clean}/embed/`;
  };

  const isInstagram = video.platform === 'instagram' || Boolean(video.instagramUrl);
  const isDirectVideo = video.platform === 'direct' || Boolean(video.videoUrl);
  const isYouTube = !isInstagram && !isDirectVideo;

  const instagramEmbedUrl = isInstagram ? getInstagramEmbedUrl(video.instagramUrl || video.youtubeId || '') : '';
  const instagramDirectUrl = video.instagramUrl || (video.youtubeId ? `https://www.instagram.com/reel/${video.youtubeId}/` : 'https://www.instagram.com');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className={`relative w-full ${isInstagram ? 'max-w-md' : 'max-w-4xl'} bg-[#0a050b] border border-white/15 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            {isInstagram ? (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
            ) : isDirectVideo ? (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Film className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center shrink-0">
                <Youtube className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm line-clamp-1">{video.title}</h3>
              <p className="text-[10px] text-white/50">{video.speaker}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative bg-black flex items-center justify-center">
          {isInstagram ? (
            /* Instagram Reel Player Container */
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-[520px] max-h-[70vh] bg-black">
                <iframe
                  className="w-full h-full border-0"
                  src={instagramEmbedUrl}
                  title={video.title}
                  allowTransparency={true}
                  allow="encrypted-media"
                />
              </div>

              {/* Open in Instagram Action Bar */}
              <div className="w-full p-3 bg-black/80 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="text-[11px] text-white/60">Watch in full HD & audio:</span>
                <a
                  href={instagramDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Open on Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : isDirectVideo ? (
            /* Direct Uploaded MP4 Video */
            <div className="w-full flex flex-col items-center">
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                {playableUrl ? (
                  <video
                    key={playableUrl}
                    src={playableUrl}
                    controls
                    autoPlay
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    className="w-full h-full object-contain"
                  >
                    <source src={playableUrl} type="video/mp4" />
                    Your browser does not support HTML5 video playback.
                  </video>
                ) : (
                  <div className="p-8 text-center text-white/50 text-xs">
                    Loading video stream...
                  </div>
                )}
              </div>
              <div className="w-full p-3 bg-black/80 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="text-[11px] text-white/60">Direct Festival Video</span>
                {playableUrl && (
                  <a
                    href={playableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Watch in New Tab</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* YouTube Player */
            <div className="relative aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
