import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PWAInstallPrompt: React.FC = () => {
  const { currentTheme, brand } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);

  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Android/Chrome beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Always show banner after 2 seconds if not installed
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // If browser already prompted or hasn't fired beforeinstallprompt, show Android instructions
      setShowAndroidInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    setShowAndroidInstructions(false);
  };

  if (!showPrompt || installed) return null;

  return (
    <aside
      aria-label="Install App Banner"
      className="lg:hidden fixed bottom-20 inset-x-3 z-40 animate-in slide-in-from-bottom duration-300 pointer-events-auto"
    >
      <div className="p-3.5 rounded-2xl bg-[#120516]/95 border border-white/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg relative overflow-hidden bg-black border border-white/20 p-1"
          >
            <img src="/icons/icon-192.png" alt="Qudwa App Icon" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-white truncate">Install {brand.eventName} App</h4>
            <p className="text-[10px] text-white/60 truncate">Add to Home Screen for fast offline access</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-black flex items-center gap-1 shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: currentTheme.secondary }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-white/40 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari instructions modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end p-4">
          <div className="w-full bg-[#120516] border border-white/20 rounded-3xl p-5 space-y-3 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white">Install on iPhone / iPad</h4>
              <button onClick={() => setShowIOSInstructions(false)} className="text-white/40">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="text-xs text-white/70 space-y-2 list-decimal list-inside">
              <li>Tap the <strong className="text-white">Share</strong> button (box with upward arrow) at the bottom of Safari.</li>
              <li>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="text-white">Add</strong> in the top-right corner.</li>
            </ol>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Android Chrome instructions modal (if native banner is pending) */}
      {showAndroidInstructions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end p-4">
          <div className="w-full bg-[#120516] border border-white/20 rounded-3xl p-5 space-y-3 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white">Install on Android / Chrome</h4>
              <button onClick={() => setShowAndroidInstructions(false)} className="text-white/40">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="text-xs text-white/70 space-y-2.5 list-decimal list-inside">
              <li>Tap the <strong className="text-white">⋮</strong> (three dots menu) at the top-right of Chrome.</li>
              <li>Tap <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.</li>
              <li>Tap <strong className="text-white">Install</strong> to add the QUDWA App to your phone.</li>
            </ol>
            <button
              onClick={() => setShowAndroidInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
