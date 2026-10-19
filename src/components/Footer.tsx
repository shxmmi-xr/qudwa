import React from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Facebook, Globe, Sparkles, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { siteConfig } from '../config/siteConfig';

export const Footer: React.FC = () => {
  const { currentTheme, brand } = useTheme();

  return (
    <footer className="relative w-full bg-[#060306] border-t border-white/10 overflow-hidden mt-auto">
      {/* Ambient background glows */}
      <div
        className="absolute top-0 left-1/4 w-[350px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[350px] h-[350px] blur-[120px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-16 py-16 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-6 md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-14 rounded-2xl flex items-center justify-center p-1 relative overflow-hidden shrink-0 border border-white/10 bg-white/[0.04]">
              <img
                src="/images/qudwa-logo.png"
                alt="Qudwa Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-9 h-14 rounded-2xl flex items-center justify-center p-1.5 relative overflow-hidden shrink-0 border border-white/10 bg-white/[0.04]">
              <img
                src="/images/ifada-logo.png"
                alt="Al Ifada Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-none">
                {brand.eventName}
              </h2>
              <span className="text-xs text-white/50 tracking-widest uppercase font-semibold">
                AL IFADA STUDENTS UNION • {brand.year}
              </span>
            </div>
          </Link>

          <p className="font-medium text-white/50 max-w-sm leading-relaxed text-sm">
            {brand.subTitle || siteConfig.subTitle} {brand.themeBadge || siteConfig.themeBadge}
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#E1306C] hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.4)] transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Explore */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Explore Events</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/schedule" className="text-white/50 hover:text-white transition-colors font-medium">
                Schedule & Timeline
              </Link>
            </li>
            <li>
              <Link href="/results" className="text-white/50 hover:text-white transition-colors font-medium">
                Live Results
              </Link>
            </li>
            <li>
              <Link href="/standings" className="text-white/50 hover:text-white transition-colors font-medium">
                Team Standings
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-white/50 hover:text-white transition-colors font-medium">
                Photo Gallery
              </Link>
            </li>
            <li>
              <Link href="/media" className="text-white/50 hover:text-white transition-colors font-medium">
                Video & Media Hub
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal & Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Participants & Info</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/login" className="text-white/50 hover:text-white transition-colors font-medium">
                Participant Portal
              </Link>
            </li>
            <li>
              <Link href="/news" className="text-white/50 hover:text-white transition-colors font-medium">
                Latest News & Releases
              </Link>
            </li>
            <li>
              <a
                href="#brochure"
                className="text-white/50 hover:text-white transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Brochure download initiated!');
                }}
              >
                Official Brochure
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-white/40 text-xs font-medium">
            © {brand.year} {brand.eventName}. All rights reserved.
          </p>
          <div className="text-white/40 text-xs font-medium flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <span className="font-bold text-white tracking-wider">{brand.builtBy || siteConfig.builtBy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
