import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bell,
  Megaphone,
  FileText,
  FileDown,
  Pin,
  Search,
  AlertCircle,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  X,
  Maximize2,
  Minimize2,
  Activity,
  Trophy,
  Award,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { FestivalNotification } from '@/data/mockData';
import { downloadOrOpenFile } from '@/lib/downloadHelper';

const STAGES = [
  { id: 'stage1', name: 'Main Arena (Stage 1)', description: 'Major performance stage and special events.', capacity: '5,000+ Seats' },
  { id: 'stage2', name: 'Stage 2', description: 'Elocution, debates, and recitations.', capacity: '800 Seats' },
  { id: 'stage3', name: 'Stage 3', description: 'Presentations and demonstrations.', capacity: '500 Seats' },
  { id: 'stage4', name: 'Stage 4', description: 'Fine arts, painting, and drawing.', capacity: '600 Seats' },
];

export default function BulletinPage() {
  const router = useRouter();
  const {
    currentTheme,
    brand,
    notifications,
    competitions,
    schedule,
    standings,
  } = useData();

  // Arena TV Mode state
  const isTvMode = router.query.mode === 'tv' || router.query.mode === 'screen';
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tvScene, setTvScene] = useState<'result_flash' | 'leaderboard_race' | 'stage_radar'>('result_flash');
  const [showLogoStinger, setShowLogoStinger] = useState<boolean>(false);
  const [activeResultIdx, setActiveResultIdx] = useState<number>(0);

  // Filters for standard public bulletin view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [activeModalBulletin, setActiveModalBulletin] = useState<FestivalNotification | null>(null);

  // TV mode rotating clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Live digital clock for TV studio
  useEffect(() => {
    if (!isTvMode) return;
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [isTvMode]);

  // 10-Second Scene & 3D Logo Stinger Cycle with Safe Timer Cleanup
  const stingerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isTvMode) return;

    // Trigger confetti on result flash
    const triggerConfetti = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec1c62', '#78e8d2', '#ffffff', '#8b5cf6'],
        });
      } catch (e) {
        // Confetti skipped
      }
    };

    const mainInterval = setInterval(() => {
      // 1. Show Logo Stinger smoothly for 1.8s
      setShowLogoStinger(true);
      if (stingerTimeoutRef.current) clearTimeout(stingerTimeoutRef.current);
      stingerTimeoutRef.current = setTimeout(() => {
        setShowLogoStinger(false);
      }, 1800);

      // 2. Rotate to next scene
      setTvScene((prev) => {
        if (prev === 'result_flash') {
          return 'leaderboard_race';
        } else if (prev === 'leaderboard_race') {
          return 'stage_radar';
        } else {
          setActiveResultIdx((rIdx) => (rIdx + 1) % Math.max(1, competitions.length));
          triggerConfetti();
          return 'result_flash';
        }
      });
    }, 10000);

    return () => {
      clearInterval(mainInterval);
      if (stingerTimeoutRef.current) clearTimeout(stingerTimeoutRef.current);
    };
  }, [isTvMode, competitions.length]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Current active result for TV broadcast
  const currentBroadcastResult = competitions[activeResultIdx] || competitions[0];

  // Sorted team standings for election race
  const sortedStandings = useMemo(() => {
    return [...standings].sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));
  }, [standings]);

  const topTeam = sortedStandings.find((s) => (Number(s.points) || 0) > 0) || null;
  const maxPoints = topTeam ? (Number(topTeam.points) || 100) : 100;

  // Filtered bulletins for standard view
  const filteredBulletins = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPri = selectedPriority === 'All' || item.priority === selectedPriority;

      return matchesSearch && matchesCat && matchesPri;
    });
  }, [notifications, searchQuery, selectedCategory, selectedPriority]);

  // Pinned bulletins for marquee
  const pinnedBulletins = useMemo(() => {
    const pinned = notifications.filter((n) => n.isPinned);
    return pinned.length > 0 ? pinned : notifications.slice(0, 3);
  }, [notifications]);

  const categoriesList = [
    'All',
    'By-Laws & Regulations',
    'Urgent Alert',
    'Circular',
    'Schedule Notice',
    'Result Bulletin',
    'General',
  ];

  // =========================================================================
  // 1. MASSIVE 3D ARENA TV BROADCAST SCREEN (ENTERED ONLY FROM ADMIN PANEL)
  // =========================================================================
  if (isTvMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#030104] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
        <Head>
          <title>{`LIVE ARENA TV 4K | ${brand.eventName}`}</title>
        </Head>

        {/* 3D LOGO STINGER OVERLAY (PLAYS EVERY 10 SECONDS) */}
        {showLogoStinger && (
          <div className="absolute inset-0 z-50 bg-[#060207]/98 flex flex-col items-center justify-center animate-in fade-in duration-200 pointer-events-none will-change-transform">
            {/* Background Ray Burst */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-600/30 via-rose-600/40 to-amber-500/30 blur-3xl animate-spin-slow"></div>
              <div className="absolute w-[600px] h-[600px] rounded-full border border-purple-500/30 animate-ping"></div>
            </div>

            {/* 3D Animated Centerpiece Emblem */}
            <div className="relative z-10 flex flex-col items-center space-y-6 text-center animate-stinger-3d">
              <div
                className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-950/80 border-2 border-white/40 relative overflow-hidden"
                style={{
                  backgroundColor: currentTheme.primary,
                  boxShadow: `0 0 70px ${currentTheme.primaryGlow}`,
                }}
              >
                {/* Metallic Sweep Ray */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-sweep-ray"></div>
                <span className="font-black text-6xl text-white tracking-tighter drop-shadow-2xl">
                  S
                </span>
              </div>

              <div className="space-y-2">
                <span className="px-4 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl">
                  OFFICIAL LIVE BROADCAST DESK
                </span>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                  {brand.eventName}
                </h1>
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-white/70 block">
                  {brand.venue} • EDITION {brand.year}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TOP STUDIO 4K BROADCAST HEADER ================= */}
        <header className="px-6 py-3.5 bg-gradient-to-r from-[#0b030e] via-[#15041c] to-[#0b030e] border-b border-purple-500/30 flex items-center justify-between shadow-2xl relative z-20">
          <div className="flex items-center gap-4">
            {/* Live On-Air Pill Bug */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-950/80 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE ON AIR</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md"
                style={{ backgroundColor: currentTheme.primary }}
              >
                S
              </div>
              <div>
                <h2 className="text-sm font-black text-white leading-none">
                  {brand.eventName} 4K STUDIO DESK
                </h2>
                <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                  ARENA PROJECTION FEED • 60 FPS HDR
                </span>
              </div>
            </div>
          </div>

          {/* Active Stage Radar Badges */}
          <div className="hidden lg:flex items-center gap-2.5">
            {STAGES.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-bold text-white/90"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{v.name.split('(')[0]}</span>
              </div>
            ))}
          </div>

          {/* Studio Digital Clock & Fullscreen Control */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg sm:text-2xl font-black font-mono text-white tracking-widest drop-shadow-md">
                {currentTime}
              </div>
              <div className="text-[10px] uppercase font-black text-amber-400 tracking-widest">
                {currentDate}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFullScreen}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-md"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter 4K Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ================= MAIN DYNAMIC 3D ARENA STAGE ================= */}
        <main className="flex-1 px-6 py-4 flex flex-col justify-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none"></div>

          {/* SCENE 1: 3D ELECTION-STYLE PODIUM RESULT FLASH */}
          {tvScene === 'result_flash' && currentBroadcastResult && (
            <div className="w-full max-w-7xl mx-auto space-y-6 animate-card-3d-in">
              {/* Giant Flash Alert Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-[#1e0524] to-black/90 border-2 border-rose-500/50 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-950/80 animate-pulse shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow">
                        BREAKING RESULT DECLARED
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                        Result #{currentBroadcastResult.resultNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                        {currentBroadcastResult.category} • {currentBroadcastResult.type}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                      {currentBroadcastResult.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-lg">
                    VERIFIED JURY SCORE
                  </span>
                </div>
              </div>

              {/* 3D Podium Cards (1st Gold, 2nd Silver, 3rd Bronze) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                {/* 2ND PLACE (SILVER) */}
                {currentBroadcastResult.winners?.find((w) => w.position === 2) && (
                  <div className="order-2 md:order-1 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#100818] to-black/90 border-2 border-slate-400/40 p-6 shadow-2xl transform transition-all hover:scale-105 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-black font-black text-base flex items-center justify-center shadow-lg">
                          2nd
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest text-slate-300">
                          SILVER RUNNER-UP
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-slate-400/20 text-slate-200 font-black text-xs border border-slate-400/30">
                        Grade {currentBroadcastResult.winners.find((w) => w.position === 2)?.grade}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                        {currentBroadcastResult.winners.find((w) => w.position === 2)?.name}
                      </h3>
                      <span className="text-xs sm:text-sm font-extrabold text-purple-300 block mt-1">
                        {currentBroadcastResult.winners.find((w) => w.position === 2)?.team}
                        {currentBroadcastResult.winners.find((w) => w.position === 2)?.chestNo &&
                          ` (Chest #${currentBroadcastResult.winners.find((w) => w.position === 2)?.chestNo})`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/50 font-bold uppercase">Points Awarded</span>
                      <span className="text-lg font-black text-white">
                        +{currentBroadcastResult.winners.find((w) => w.position === 2)?.points} Pts
                      </span>
                    </div>
                  </div>
                )}

                {/* 1ST PLACE (GOLD CHAMPION - CENTER ELEVATED) */}
                {currentBroadcastResult.winners?.find((w) => w.position === 1) && (
                  <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-amber-950/80 via-[#261005] to-black/95 border-2 border-amber-400 p-8 shadow-2xl animate-gold-glow transform scale-105 space-y-5 relative overflow-hidden">
                    {/* Metallic Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-sweep-ray pointer-events-none"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-black font-black text-xl flex items-center justify-center shadow-xl shadow-amber-950/80">
                          1st
                        </div>
                        <div>
                          <span className="font-black text-xs uppercase tracking-widest text-amber-300 block">
                            GOLD CHAMPION
                          </span>
                          <span className="text-[10px] text-white/50 font-bold">STATE WINNER</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-3.5 py-1.5 rounded-2xl bg-amber-400 text-black font-black text-sm uppercase shadow-lg">
                          Grade {currentBroadcastResult.winners.find((w) => w.position === 1)?.grade}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight truncate drop-shadow-md">
                        {currentBroadcastResult.winners.find((w) => w.position === 1)?.name}
                      </h3>
                      <span className="text-sm sm:text-base font-black text-amber-300 block mt-1">
                        {currentBroadcastResult.winners.find((w) => w.position === 1)?.team}
                        {currentBroadcastResult.winners.find((w) => w.position === 1)?.chestNo &&
                          ` (Chest #${currentBroadcastResult.winners.find((w) => w.position === 1)?.chestNo})`}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-amber-500/30 flex items-center justify-between">
                      <span className="text-white/70 text-xs font-bold uppercase">Championship Points</span>
                      <span className="text-2xl font-black text-amber-400">
                        +{currentBroadcastResult.winners.find((w) => w.position === 1)?.points} Pts
                      </span>
                    </div>
                  </div>
                )}

                {/* 3RD PLACE (BRONZE) */}
                {currentBroadcastResult.winners?.find((w) => w.position === 3) && (
                  <div className="order-3 rounded-3xl bg-gradient-to-b from-[#1c0c05]/90 via-[#100818] to-black/90 border-2 border-amber-700/40 p-6 shadow-2xl transform transition-all hover:scale-105 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-base flex items-center justify-center shadow-lg">
                          3rd
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest text-amber-400">
                          BRONZE 3RD PLACE
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-800/30 text-amber-300 font-black text-xs border border-amber-800/40">
                        Grade {currentBroadcastResult.winners.find((w) => w.position === 3)?.grade}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                        {currentBroadcastResult.winners.find((w) => w.position === 3)?.name}
                      </h3>
                      <span className="text-xs sm:text-sm font-extrabold text-purple-300 block mt-1">
                        {currentBroadcastResult.winners.find((w) => w.position === 3)?.team}
                        {currentBroadcastResult.winners.find((w) => w.position === 3)?.chestNo &&
                          ` (Chest #${currentBroadcastResult.winners.find((w) => w.position === 3)?.chestNo})`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/50 font-bold uppercase">Points Awarded</span>
                      <span className="text-lg font-black text-white">
                        +{currentBroadcastResult.winners.find((w) => w.position === 3)?.points} Pts
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCENE 2: ELECTION-NIGHT LIVE TEAM POINTS BATTLE / LEADERBOARD RACE */}
          {tvScene === 'leaderboard_race' && (
            <div className="w-full max-w-7xl mx-auto space-y-6 animate-card-3d-in">
              {/* Header */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#1e0524] to-black/90 border-2 border-purple-500/50 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-950/80 animate-pulse shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-3 py-0.5 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-widest shadow">
                      CHAMPIONSHIP RACE
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                      Live Team Points Table & Tally
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-white/50 font-bold block uppercase">
                    {topTeam ? 'Current Leader' : 'Championship Status'}
                  </span>
                  <span className="text-lg sm:text-2xl font-black text-amber-400">
                    {topTeam ? `${topTeam.name} (${topTeam.points} Pts)` : 'Awaiting First Result'}
                  </span>
                </div>
              </div>

              {/* Animated Live Race Bars */}
              <div className="space-y-3.5">
                {sortedStandings.slice(0, 5).map((team, tIdx) => {
                  const pts = Number(team.points) || 0;
                  const hasPoints = pts > 0;
                  const isLeader = hasPoints && tIdx === 0;
                  const percentage = hasPoints ? Math.max(12, Math.round((pts / maxPoints) * 100)) : 0;
                  const delta = !hasPoints ? '0 PTS' : isLeader ? 'LEADER' : `-${maxPoints - pts} pts`;

                  return (
                    <div
                      key={team.id || tIdx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLeader
                          ? 'bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-black/80 border-amber-400/80 shadow-2xl'
                          : 'bg-black/60 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                              isLeader
                                ? 'bg-amber-400 text-black shadow-lg shadow-amber-950'
                                : hasPoints
                                ? 'bg-white/10 text-white'
                                : 'bg-white/5 text-white/30'
                            }`}
                          >
                            {hasPoints && (team.rank || 0) > 0 ? `#${team.rank}` : '—'}
                          </span>
                          <span className="text-lg font-black text-white">{team.name}</span>
                          {isLeader && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                              CROWN LEADER
                            </span>
                          )}
                          {!hasPoints && (
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[10px] font-semibold uppercase">
                              Unranked (0 Pts)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-5">
                          {/* Medals Breakdown */}
                          <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
                            <span className="text-amber-400">Gold: {team.gold || 0}</span>
                            <span className="text-slate-300">Silver: {team.silver || 0}</span>
                            <span className="text-amber-700">Bronze: {team.bronze || 0}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-xl sm:text-2xl font-black text-white block leading-none">
                              {team.points} <span className="text-xs text-white/50">PTS</span>
                            </span>
                            <span className="text-[10px] font-mono text-purple-300 font-bold">{delta}</span>
                          </div>
                        </div>
                      </div>

                      {/* Animated Points Progress Bar */}
                      <div className="w-full h-3.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${percentage}%`,
                            background: isLeader
                              ? 'linear-gradient(90deg, #f59e0b, #ec1c62)'
                              : 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCENE 3: LIVE STAGE STATUS RADAR */}
          {tvScene === 'stage_radar' && (
            <div className="w-full max-w-7xl mx-auto space-y-6 animate-card-3d-in">
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#071a12] to-black/90 border-2 border-emerald-500/50 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-black shadow-xl shadow-emerald-950/80 animate-pulse shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow">
                      STAGE MATRIX RADAR
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                      Live Stage Performances & Schedule
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-black uppercase tracking-wider block">
                    {STAGES.length} Active Stages
                  </span>
                  <span className="text-xs text-white/50">Synchronized Clock</span>
                </div>
              </div>

              {/* 4-Stage Live Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAGES.slice(0, 4).map((v, vIdx) => {
                  const stageSchedule = schedule.filter((s) => s.stage.toLowerCase().includes(`stage ${vIdx + 1}`) || s.stage.toLowerCase().includes(v.name.toLowerCase()));
                  const activeItem = stageSchedule[0] || {
                    title: `${v.name} Performance`,
                    category: 'Senior',
                    status: 'Live',
                    time: '10:30 AM',
                  };

                  return (
                    <div
                      key={v.id}
                      className="p-5 rounded-3xl bg-black/60 border border-emerald-500/30 space-y-3 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                          <span className="font-black text-sm text-emerald-400 uppercase tracking-wider">
                            {v.name}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                          ON AIR NOW
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white truncate">
                          {activeItem.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-0.5 truncate">{v.description}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                        <span>Capacity: <strong className="text-white">{v.capacity}</strong></span>
                        <span className="font-mono text-emerald-300 font-bold">Live Stream Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {/* ================= BOTTOM ELECTION-NIGHT NEWS CHANNEL TICKER ================= */}
        <footer className="bg-black border-t-2 border-purple-500/40 relative z-20 shadow-2xl">
          {/* Top Marquee Tier: Breaking Flash */}
          <div className="px-6 py-2 bg-gradient-to-r from-rose-900 via-rose-950 to-black border-b border-rose-500/30 flex items-center gap-4 overflow-hidden">
            <div className="px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-xs uppercase tracking-widest shrink-0 shadow-md flex items-center gap-1.5 animate-pulse">
              <span>●</span>
              <span>BREAKING RESULTS TICKER</span>
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-marquee text-xs font-black uppercase tracking-wider text-white">
                {competitions.slice(0, 6).map((c) => (
                  <span key={c.id} className="inline-flex items-center gap-2 mx-8">
                    <span className="text-amber-400 font-bold">[{c.name}]</span>
                    <span className="text-white font-black">
                      1st: {c.winners?.[0]?.name} ({c.winners?.[0]?.team})
                    </span>
                    <span className="text-slate-300">
                      • 2nd: {c.winners?.[1]?.name} ({c.winners?.[1]?.team})
                    </span>
                    <span className="text-purple-400">★</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Marquee Tier: Team Standings & State Alerts */}
          <div className="px-6 py-2.5 bg-[#09020b] flex items-center gap-4 overflow-hidden">
            <div className="px-3 py-1 rounded-lg bg-purple-600 text-white font-black text-xs uppercase tracking-widest shrink-0 shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE LEADERBOARD FEED</span>
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-marquee-reverse text-xs font-extrabold uppercase tracking-wider text-white/90">
                {sortedStandings.map((t, idx) => (
                  <span key={t.id || idx} className="inline-flex items-center gap-2 mx-8">
                    <span className="text-amber-400 font-black">#{idx + 1} {t.name}:</span>
                    <span className="text-white">{t.points} POINTS</span>
                    <span className="text-white/50">({t.gold || 0} Gold, {t.silver || 0} Silver)</span>
                    <span className="text-rose-400">◆</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }


  // STANDARD CLEAN PUBLIC BULLETINS & NOTIFICATIONS PAGE
  return (
    <div className="min-h-screen bg-[#060306] text-white selection:bg-purple-500 selection:text-white flex flex-col font-sans pt-20">
      <Head>
        <title>{`Updates | ${brand.eventName}`}</title>
        <meta
          name="description"
          content={`Official Updates, Circulars, and Announcements for ${brand.eventName}`}
        />
      </Head>

      {/* CONTINUOUS BREAKING NOTICES TICKER */}
      {pinnedBulletins.length > 0 && (
        <div className="bg-[#100315] border-b border-white/10 py-2.5 px-4 sm:px-8 flex items-center gap-3 overflow-hidden shadow-inner">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
            <Bell className="w-3 h-3" />
            <span>ALERTS</span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-xs font-semibold text-white/90">
              {pinnedBulletins.map((b) => (
                <span key={b.id} className="inline-flex items-center gap-2 mx-6">
                  <span className="text-amber-400 font-bold">[{b.category}]</span>
                  <span className="font-bold text-white">{b.title}</span>
                  <span className="text-white/50">— {b.summary}</span>
                  <span className="text-purple-400 text-xs">★</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* CLEAN PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Updates
            </h1>
            <p className="text-xs text-white/50 mt-1">
              {brand.eventName} • Official Announcements, Regulations & Documents
            </p>
          </div>

          {/* Quick By-Laws Download */}
          {notifications.find((n) => n.category === 'By-Laws & Regulations' && n.attachmentUrl) && (
            <button
              type="button"
              onClick={() => {
                const doc = notifications.find((n) => n.category === 'By-Laws & Regulations');
                if (doc?.attachmentUrl) {
                  downloadOrOpenFile(doc.attachmentUrl, doc.attachmentName || 'Sahityotsav_ByLaws_2026.pdf', 'application/pdf');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg transition-all self-start sm:self-auto cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download By-Laws (PDF)</span>
            </button>
          )}
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: currentTheme.primary,
                            color: '#ffffff',
                          }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search & Priority */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-purple-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40"
                />
              </div>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white/5 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-semibold"
              >
                <option value="All" className="bg-[#120417] text-white">All Priorities</option>
                <option value="Urgent" className="bg-[#120417] text-rose-300">Urgent</option>
                <option value="High" className="bg-[#120417] text-amber-300">High</option>
                <option value="Normal" className="bg-[#120417] text-white">Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* NOTIFICATION CARDS GRID */}
        {filteredBulletins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBulletins.map((item) => {
              const isUrgent = item.priority === 'Urgent';
              const isHigh = item.priority === 'High';
              const isPinned = Boolean(item.isPinned);

              // Distinct color schemes based on Priority and Category
              let cardBg = '';
              let badgeColor = '';
              let badgeText: string = item.priority;

              if (isUrgent) {
                cardBg = 'bg-gradient-to-br from-rose-950/80 via-red-950/40 to-[#0d0205] border-rose-500/60 shadow-xl shadow-rose-950/40 hover:border-rose-400 hover:shadow-rose-900/60';
                badgeColor = 'bg-rose-600 text-white font-black animate-pulse shadow-md shadow-rose-600/40 border border-rose-400/50';
                badgeText = '🚨 URGENT';
              } else if (isHigh) {
                cardBg = 'bg-gradient-to-br from-amber-950/80 via-orange-950/40 to-[#0e0602] border-amber-500/60 shadow-xl shadow-amber-950/40 hover:border-amber-400 hover:shadow-amber-900/60';
                badgeColor = 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/40 border border-amber-300/50';
                badgeText = '⚡ HIGH';
              } else if (isPinned) {
                cardBg = 'bg-gradient-to-br from-amber-950/50 via-yellow-950/30 to-[#080703] border-yellow-500/50 shadow-xl shadow-yellow-950/30 hover:border-yellow-400';
                badgeColor = 'bg-yellow-500 text-black font-black';
                badgeText = '📌 PINNED';
              } else if (item.category === 'By-Laws & Regulations' || item.category === 'Circular') {
                cardBg = 'bg-gradient-to-br from-sky-950/70 via-blue-950/30 to-[#02070e] border-sky-500/40 shadow-xl shadow-sky-950/30 hover:border-sky-400';
                badgeColor = 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold';
                badgeText = 'CIRCULAR';
              } else if (item.category === 'Schedule Notice' || item.category === 'Result Bulletin') {
                cardBg = 'bg-gradient-to-br from-purple-950/70 via-indigo-950/30 to-[#0a020f] border-purple-500/40 shadow-xl shadow-purple-950/30 hover:border-purple-400';
                badgeColor = 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold';
                badgeText = 'SCHEDULE';
              } else {
                cardBg = 'bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-[#020a06] border-emerald-500/40 shadow-xl shadow-emerald-950/30 hover:border-emerald-400';
                badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
                badgeText = 'NORMAL';
              }

              return (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01] ${cardBg}`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Badges and Date */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isPinned && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}

                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase ${badgeColor}`}>
                          {badgeText}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white/80 text-[10px] font-semibold border border-white/10">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-white/50 font-mono font-medium">
                        <Calendar className="w-3 h-3 text-white/40" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    {/* BIG TITLE */}
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                      {item.title}
                    </h3>

                    {/* Subtitle / Summary */}
                    {item.summary && (
                      <p className="text-xs sm:text-sm text-white/75 font-medium line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-white/50 truncate">
                      Audience: <strong className="text-white/80">{item.targetAudience}</strong>
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveModalBulletin(item)}
                        className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Read More
                      </button>

                      {item.attachmentName && item.attachmentUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            downloadOrOpenFile(item.attachmentUrl!, item.attachmentName!, 'application/pdf');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/40 shadow-md cursor-pointer transition-all active:scale-95"
                          title={`Download ${item.attachmentName}`}
                        >
                          <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl p-6 text-xs text-white/50">
            No bulletins found matching your filter.
          </div>
        )}
      </main>

      {/* NOTICE DETAILS MODAL */}
      {activeModalBulletin && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#0f0714] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModalBulletin(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header: Priority & Category Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {activeModalBulletin.isPinned && (
                  <span className="px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned Notice
                  </span>
                )}

                <span
                  className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                    activeModalBulletin.priority === 'Urgent'
                      ? 'bg-rose-600 text-white border border-rose-400'
                      : activeModalBulletin.priority === 'High'
                      ? 'bg-amber-500 text-black border border-amber-300'
                      : 'bg-white/15 text-white border border-white/20'
                  }`}
                >
                  {activeModalBulletin.priority === 'Urgent' ? '🚨 URGENT ALERT' : activeModalBulletin.priority === 'High' ? '⚡ HIGH PRIORITY' : 'NORMAL PRIORITY'}
                </span>

                <span className="px-3 py-1 rounded-xl bg-white/10 text-white/90 text-[10px] font-bold uppercase border border-white/15">
                  {activeModalBulletin.category}
                </span>
              </div>

              {/* Big Bold Headline */}
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight pt-1">
                {activeModalBulletin.title}
              </h2>

              {/* Date & Time Callouts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 text-white/80 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Date: {activeModalBulletin.date}</span>
                </span>
                {activeModalBulletin.time && (
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 text-white/80 font-bold flex items-center gap-1.5">
                    <span>⏰ Time: {activeModalBulletin.time}</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 text-white/80 font-bold flex items-center gap-1.5">
                  <span>👥 Target: {activeModalBulletin.targetAudience}</span>
                </span>
              </div>
            </div>

            {/* Subtitle / Summary Callout Box */}
            {activeModalBulletin.summary && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-l-4 border-amber-400 text-sm font-semibold text-amber-200/90 leading-relaxed shadow-sm">
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block mb-1">
                  Subtitle / Summary Overview
                </span>
                {activeModalBulletin.summary}
              </div>
            )}

            {/* Detailed Explanation / Circular Content */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-3 text-sm text-white/90 leading-relaxed shadow-inner">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest block mb-2">
                Detailed Announcement & Instructions
              </span>
              {activeModalBulletin.content && activeModalBulletin.content.length > 0 ? (
                activeModalBulletin.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-white/60 italic">{activeModalBulletin.summary || 'No detailed explanation text.'}</p>
              )}
            </div>

            {/* Attached File Download */}
            {activeModalBulletin.attachmentName && activeModalBulletin.attachmentUrl && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block truncate">
                      {activeModalBulletin.attachmentName}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Official Attached Document (PDF)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    downloadOrOpenFile(activeModalBulletin.attachmentUrl!, activeModalBulletin.attachmentName!, 'application/pdf');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 shrink-0 cursor-pointer transition-all active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalBulletin(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

