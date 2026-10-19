import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Trophy,
  Image as ImageIcon,
  Video,
  Calendar,
  Newspaper,
  User,
  Menu,
  X,
  Sparkles,
  BarChart2,
  Bell,
  Download,
  ScanLine,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { currentTheme, brand } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/bulletin', label: 'Updates', icon: Bell },
    { href: '/results', label: 'Results', icon: Trophy },
    { href: '/standings', label: 'Standings', icon: BarChart2 },
    { href: '/downloads', label: 'Downloads', icon: Download },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/media', label: 'Media', icon: Video },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/scanner', label: 'Scanner', icon: ScanLine },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 py-4 ${
          isScrolled
            ? 'bg-[#060306]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-12">
            {/* Top-Left Brand Logo with Official Qudwa Emblem - Anchored to far left end */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none z-10">
              <div className="w-9 h-10 p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/images/qudwa-logo.png"
                  alt="Qudwa Logo"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-amber-200 transition-colors uppercase leading-none font-sans">
                  {brand?.eventName || 'QUDWA'}
                </span>
                <span
                  className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border tracking-widest uppercase transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.secondary,
                    borderColor: `${currentTheme.secondary}50`,
                    boxShadow: `0 0 10px ${currentTheme.primaryGlow}`,
                  }}
                >
                  {brand?.year || '2026'}
                </span>
              </div>
            </Link>

            {/* Desktop Capsule Menu (Dashboard Bar) - Aligned to exact center of website */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-1.5 bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-full backdrop-blur-lg shadow-inner z-20">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === '/'
                    ? router.pathname === '/'
                    : router.pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-[11px] xl:text-xs uppercase tracking-wider font-bold rounded-full select-none cursor-pointer transition-all duration-150 active:scale-95 active:brightness-125 ${
                      isActive
                        ? 'shadow-md'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: currentTheme.primary,
                            color: currentTheme.secondary,
                            border: `1px solid ${currentTheme.secondary}60`,
                            boxShadow: `0 0 12px ${currentTheme.primaryGlow}`,
                          }
                        : {}
                    }
                  >
                    <Icon
                      className="w-3.5 h-3.5 transition-colors shrink-0"
                      style={{ color: isActive ? currentTheme.secondary : currentTheme.primary }}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Participant Login Button */}
              <Link
                href="/login"
                className="relative flex items-center gap-1.5 px-3 xl:px-4 py-1.5 xl:py-2 text-[11px] xl:text-xs uppercase tracking-wider font-extrabold rounded-full transition-all duration-150 active:scale-95 active:brightness-125 select-none cursor-pointer shadow-lg hover:scale-105 whitespace-nowrap shrink-0 border"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: currentTheme.secondary,
                  borderColor: `${currentTheme.secondary}60`,
                  boxShadow: `0 0 18px ${currentTheme.primaryGlow}`,
                }}
              >
                <User className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.secondary }} />
                <span className="whitespace-nowrap hidden xl:inline">Participant Login</span>
                <span className="whitespace-nowrap xl:hidden">Login</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden ml-auto z-10">
              <Link
                href="/login"
                className="p-2 rounded-full text-white text-xs font-bold flex items-center gap-1 px-3 shadow-md active:scale-95 transition-transform"
                style={{ backgroundColor: currentTheme.primary, color: currentTheme.secondary }}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Login</span>
              </Link>

              <button
                aria-label="Toggle Navigation Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:border-white/30 transition-all active:scale-90"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-[#060306]/95 backdrop-blur-2xl lg:hidden pt-24 px-6 flex flex-col justify-between pb-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-9 flex items-center justify-center">
                  <img src="/images/qudwa-logo.png" alt="Qudwa" className="w-full h-full object-contain" />
                </div>
                <span className="text-base font-black uppercase tracking-wider text-white">{brand?.eventName || 'QUDWA'}</span>
              </div>
              <span
                className="text-xs font-black px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: currentTheme.secondary,
                  borderColor: `${currentTheme.secondary}50`,
                }}
              >
                {brand?.year || '2026'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === '/'
                    ? router.pathname === '/'
                    : router.pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-150 active:scale-95 ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    style={
                      isActive
                        ? {
                            borderLeft: `4px solid ${currentTheme.primary}`,
                            color: currentTheme.secondary,
                          }
                        : {}
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                      style={{ color: currentTheme.primary }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white shadow-lg uppercase tracking-wider text-xs whitespace-nowrap"
              style={{
                backgroundColor: currentTheme.primary,
                boxShadow: `0 0 20px ${currentTheme.primaryGlow}`,
              }}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Participant Login Portal</span>
            </Link>
            <p className="text-center text-[11px] text-white/40">
              {brand.eventName} • {brand.venue}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
