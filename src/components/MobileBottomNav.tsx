import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Bell,
  Trophy,
  User,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { notifications } = useData();

  // Active route checking
  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  const hasUrgentUpdates = notifications.some((n) => n.priority === 'Urgent' || n.isPinned);

  // Exactly the 4 requested tabs: Home, Updates, Results, and Login
  const mainTabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/bulletin', label: 'Updates', icon: Bell, badge: hasUrgentUpdates },
    { href: '/results', label: 'Results', icon: Trophy },
    { href: '/login', label: 'Login', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#08020a]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),10px)] pt-2 transition-all"
    >
      <div className="max-w-md mx-auto px-3 flex items-center justify-between">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center py-1 relative group touch-manipulation select-none cursor-pointer active:scale-95 transition-transform duration-150"
            >
              {/* Active Pill Glow Indicator */}
              {active && (
                <span
                  className="absolute -top-2 w-10 h-1 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: currentTheme.secondary,
                    boxShadow: `0 0 14px ${currentTheme.secondaryGlow}`,
                  }}
                />
              )}

              <div
                className={`w-12 h-7 rounded-xl flex items-center justify-center transition-all duration-150 relative ${
                  active ? 'scale-105' : 'opacity-70 group-hover:opacity-100'
                }`}
                style={
                  active
                    ? { backgroundColor: `${currentTheme.primary}40`, color: currentTheme.secondary, border: `1px solid ${currentTheme.secondary}50` }
                    : { color: '#ffffff' }
                }
              >
                <Icon className="w-4 h-4" />
                {/* Notification Dot */}
                {tab.badge && (
                  <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {tab.badge && (
                  <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>

              <span
                className={`text-[10px] font-bold tracking-tight mt-0.5 transition-colors ${
                  active ? 'text-white' : 'text-white/60'
                }`}
                style={active ? { color: currentTheme.secondary } : {}}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
