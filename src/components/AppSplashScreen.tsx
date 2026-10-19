import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const AppSplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const hasShown = sessionStorage.getItem('qudwa_splash_shown');
    if (hasShown) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem('qudwa_splash_shown', 'true');

    // Trigger smooth fade out after 1.5s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Completely unmount after 2.0s
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060306] select-none transition-all duration-500 ease-out pointer-events-none ${
        fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Background ambient radial glows */}
      <div className="absolute w-80 h-80 rounded-full bg-rose-600/20 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-400/15 blur-[90px] pointer-events-none delay-300 animate-pulse" />

      {/* Center Q Logo Icon with premium pulsing ripple */}
      <div className="relative flex flex-col items-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-rose-500/30 via-amber-400/20 to-teal-400/30 blur-md animate-ping opacity-60 duration-1000" />

        {/* Animated Q Logo Badge */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-black border-2 border-white/20 p-2 shadow-[0_0_50px_rgba(236,28,98,0.4)] flex items-center justify-center overflow-hidden animate-in zoom-in-75 duration-700 ease-out">
          <img
            src="/icons/icon-512.png"
            alt="QUDWA Icon"
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse"
          />
        </div>

        {/* Brand Text */}
        <div className="mt-6 flex flex-col items-center space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            QUDWA
          </h1>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>KUIA ARTS FEST 2026</span>
          </div>
        </div>

        {/* Loading progress bar */}
        <div className="mt-7 w-36 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-teal-400 rounded-full animate-[progress_1.5s_ease-in-out_forwards]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          60% {
            width: 75%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
