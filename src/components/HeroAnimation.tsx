import React from 'react';
import { MapPin, Calendar, Trophy, Sparkles } from 'lucide-react';
import { ThemeConfig } from '@/config/siteConfig';

interface HeroAnimationProps {
  theme?: ThemeConfig;
  brand: {
    eventName: string;
    edition?: string;
    year: string;
    venue: string;
    dates: string;
    organization?: string;
  };
}

// Geometric 8-pointed Islamic arabesque star motif (matches exact h-7 w-7 motif on Kerala Sahityotsav tapes)
const TapeMotif = ({ color = '#fef08a' }: { color?: string }) => (
  <svg
    viewBox="0 0 32 32"
    className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 opacity-85"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
  >
    <rect x="7" y="7" width="18" height="18" rx="1.5" />
    <rect x="7" y="7" width="18" height="18" rx="1.5" transform="rotate(45 16 16)" />
    <circle cx="16" cy="16" r="3" fill={color} />
  </svg>
);

export const HeroAnimation: React.FC<HeroAnimationProps> = ({ brand }) => {
  const eventName = brand?.eventName || 'QUDWA';
  const year = brand?.year || '2026';
  const venue = brand?.venue || 'KANNIYATH USTHAD ISLAMIC ACADEMY';
  const dates = brand?.dates || 'OCT 12 13 14';
  const organization = brand?.organization || 'KUIA ARTS FEST';

  // 1. TOP TAPE: Maroon Ribbon (#6C0E0E) with Cream text & motifs (#EBD5AA)
  const renderRedTapeUnit = (key: number) => (
    <span
      key={key}
      className="flex shrink-0 items-center gap-8 pr-8 text-[#EBD5AA] font-bold uppercase text-xs sm:text-[13px] tracking-[0.2em]"
    >
      <TapeMotif color="#EBD5AA" />
      <span className="flex items-center gap-2">
        <span className="text-white drop-shadow-sm font-extrabold">{eventName}</span>
        <span className="text-[#EBD5AA] font-black">{year}</span>
      </span>
      <TapeMotif color="#EBD5AA" />
      <span
        className="font-sans text-xs sm:text-[13px] font-bold text-white tracking-normal"
        style={{ direction: 'rtl' }}
      >
        فبهداهم اقتده
      </span>
      <TapeMotif color="#EBD5AA" />
      <span className="text-[#EBD5AA]/90 font-bold">{organization}</span>
    </span>
  );

  // 2. MIDDLE TAPE: Champagne Cream Ribbon (#EBD5AA) with Maroon text & motifs (#6C0E0E)
  const renderYellowTapeUnit = (key: number) => (
    <span
      key={key}
      className="flex shrink-0 items-center gap-8 pr-8 text-[#6C0E0E] font-bold uppercase text-xs sm:text-[13px] tracking-[0.2em]"
    >
      <TapeMotif color="#6C0E0E" />
      <span className="flex items-center gap-1.5 font-extrabold">
        <MapPin className="w-4 h-4 text-[#6C0E0E] shrink-0" />
        <span>{venue}</span>
      </span>
      <TapeMotif color="#6C0E0E" />
      <span className="flex items-center gap-1.5 font-extrabold">
        <Trophy className="w-4 h-4 text-[#6C0E0E] shrink-0" />
        <span>LIVE FESTIVAL DESK</span>
      </span>
      <TapeMotif color="#6C0E0E" />
      <span className="flex items-center gap-1.5 font-extrabold">
        <Calendar className="w-4 h-4 text-[#6C0E0E] shrink-0" />
        <span>{dates}</span>
      </span>
      <TapeMotif color="#6C0E0E" />
      <span className="text-[#6C0E0E] font-bold">TALENT & ART ARCHIVE</span>
    </span>
  );

  // 3. BOTTOM TAPE: Deep Burgundy Maroon Ribbon with Cream accents
  const renderGreenTapeUnit = (key: number) => (
    <span
      key={key}
      className="flex shrink-0 items-center gap-8 pr-8 text-[#EBD5AA] font-bold uppercase text-xs sm:text-[13px] tracking-[0.2em]"
    >
      <TapeMotif color="#EBD5AA" />
      <span className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#EBD5AA] shrink-0" />
        <span className="text-white font-extrabold">{eventName} {year}</span>
      </span>
      <TapeMotif color="#EBD5AA" />
      <span className="text-[#EBD5AA] font-bold">OFFICIAL PARTICIPANT PORTAL</span>
      <TapeMotif color="#EBD5AA" />
      <span className="text-white/95 font-bold">CELEBRATING VIRTUE & CREATIVE ARTS</span>
      <TapeMotif color="#EBD5AA" />
      <span className="text-[#EBD5AA] font-mono text-[11px] sm:text-xs tracking-widest font-extrabold">
        {venue.toUpperCase()}
      </span>
    </span>
  );

  return (
    <div
      aria-hidden="true"
      data-hero-tapes="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 select-none overflow-hidden"
    >
      {/* ================= TAPE 1: DEEP MAROON (#6C0E0E, bottom-12, rotate -1.9deg) ================= */}
      <div
        data-hero-tape="true"
        className="absolute inset-x-[-8%] overflow-hidden bottom-12 -rotate-[1.9deg] shadow-[0_14px_40px_rgba(0,0,0,0.5)] z-30"
        style={{
          backgroundColor: '#6C0E0E',
        }}
      >
        <div className="flex w-max animate-tape-flow">
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderRedTapeUnit(i))}
          </span>
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderRedTapeUnit(i + 100))}
          </span>
        </div>
      </div>

      {/* ================= TAPE 2: CHAMPAGNE CREAM (#EBD5AA, bottom-7, rotate +0.4deg) ================= */}
      <div
        data-hero-tape="true"
        className="absolute inset-x-[-8%] overflow-hidden bottom-7 rotate-[0.4deg] shadow-[0_10px_30px_rgba(0,0,0,0.4)] z-20"
        style={{
          backgroundColor: '#EBD5AA',
        }}
      >
        <div className="flex w-max animate-tape-flow-reverse">
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderYellowTapeUnit(i))}
          </span>
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderYellowTapeUnit(i + 100))}
          </span>
        </div>
      </div>

      {/* ================= TAPE 3: DARK VELVET MAROON (#480909, bottom-2, rotate +1.5deg) ================= */}
      <div
        data-hero-tape="true"
        className="absolute inset-x-[-8%] overflow-hidden bottom-2 rotate-[1.5deg] shadow-[0_8px_24px_rgba(0,0,0,0.35)] z-10"
        style={{
          backgroundColor: '#480909',
        }}
      >
        <div className="flex w-max animate-tape-flow-slow">
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderGreenTapeUnit(i))}
          </span>
          <span className="flex shrink-0 items-center py-2 sm:py-2.5">
            {Array.from({ length: 4 }).map((_, i) => renderGreenTapeUnit(i + 100))}
          </span>
        </div>
      </div>
    </div>
  );
};
