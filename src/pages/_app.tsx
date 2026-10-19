import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldAlert } from 'lucide-react';
import '@/styles/globals.css';
import { DataProvider, useData } from '@/context/DataContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { CustomCursor } from '@/components/CustomCursor';
import { AppSplashScreen } from '@/components/AppSplashScreen';

function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentTheme, brand, isAdminLoggedIn } = useData();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isTeamEntryRoute = router.pathname.startsWith('/team-entry');
  const isDedicatedRoute = isAdminRoute || isTeamEntryRoute;

  // Register PWA service worker on client side with eager update check
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('PWA service worker registration failed:', err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#060306] text-white selection:bg-rose-500 selection:text-white relative">
      {/* Web App Opening Animation Splash Screen */}
      <AppSplashScreen />
      {/* Interactive Magnetic Glowing Custom Cursor */}
      <CustomCursor />
      <Head>
        <title>{`${brand.eventName} ${brand.year} | Official Mobile Web App`}</title>
        <meta
          name="description"
          content={`Official mobile web app for ${brand.eventName} ${brand.year} featuring live results, schedules, galleries, standings, and participant portal.`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
      </Head>

      {/* Admin Top Notification Ribbon if Logged In (hidden on admin & team portal) */}
      {isAdminLoggedIn && !isDedicatedRoute && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs py-1.5 px-4 flex items-center justify-between font-bold z-[120] relative shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Logged in as Administrator. You have full edit access.</span>
          </div>
          <Link
            href="/admin"
            className="underline uppercase tracking-wider text-[11px] hover:text-white/80"
          >
            Go to Admin Control Panel →
          </Link>
        </div>
      )}

      {!isDedicatedRoute && <Navbar />}

      {/* Main Content with bottom padding on mobile for the fixed Bottom Nav */}
      <main className={`flex-1 w-full ${!isDedicatedRoute ? 'pb-24 lg:pb-0' : ''}`}>
        {children}
      </main>

      {!isDedicatedRoute && <Footer />}

      {/* Mobile Web App: Native-Style Floating Bottom Navigation & Install Prompt */}
      {!isDedicatedRoute && <MobileBottomNav />}
      {!isDedicatedRoute && <PWAInstallPrompt />}
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </DataProvider>
  );
}
