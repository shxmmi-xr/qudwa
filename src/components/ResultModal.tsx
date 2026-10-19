import React, { useEffect } from 'react';
import { X, Trophy, Medal, Award, Sparkles, Share2, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Competition } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface ResultModalProps {
  competition: Competition | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ competition, onClose }) => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (competition) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: [currentTheme.primary, currentTheme.secondary, '#ffffff', '#ffd700'],
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [competition, currentTheme]);

  if (!competition) return null;

  const getRankBadge = (pos: number) => {
    if (pos === 1) return { label: '1st Place', color: 'from-amber-400 to-yellow-600', icon: Trophy, text: 'text-amber-300' };
    if (pos === 2) return { label: '2nd Place', color: 'from-slate-300 to-slate-500', icon: Medal, text: 'text-slate-200' };
    return { label: '3rd Place', color: 'from-amber-700 to-amber-900', icon: Award, text: 'text-amber-500' };
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0e0710] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: `0 0 50px ${currentTheme.primaryGlow}`,
        }}
      >
        {/* Glow ambient */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-40"
          style={{ backgroundColor: currentTheme.primary }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-30"
          style={{ backgroundColor: currentTheme.secondary }}
        />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black"
                style={{ backgroundColor: currentTheme.secondary }}
              >
                Result #{competition.resultNumber}
              </span>
              <span className="text-xs text-white/50 font-semibold">• {competition.category}</span>
              <span className="text-xs text-white/50 font-semibold">• {competition.type}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{competition.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Winners list */}
        <div className="py-6 space-y-3 relative z-10">
          {competition.winners && competition.winners.length > 0 ? (
            competition.winners.map((winner) => {
              const rank = getRankBadge(winner.position);
              const RankIcon = rank.icon;

              return (
                <div
                  key={winner.position}
                  className={`relative p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    winner.position === 1
                      ? 'bg-white/10 border-white/25 shadow-lg'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shadow-md bg-gradient-to-br ${rank.color}`}
                    >
                      <RankIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-base leading-tight">
                          {winner.name}
                        </h4>
                        {winner.grade !== 'None' && (
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                            style={{
                              backgroundColor: `${currentTheme.primary}30`,
                              color: currentTheme.primary,
                              border: `1px solid ${currentTheme.primary}60`,
                            }}
                          >
                            Grade {winner.grade}
                          </span>
                        )}
                      </div>

                      {competition.category === 'General' || !winner.chestNo ? (
                        <div className="flex items-center gap-2 text-xs text-white/80 mt-1 font-medium">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {winner.team || winner.name || 'Team A'}
                          </span>
                          <span>•</span>
                          <span className="text-white/50 font-semibold">Team Points</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-white/60 mt-1 font-medium">
                          <span>Chest: #{winner.chestNo}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {winner.team || winner.sector}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right pl-2">
                    <span className="text-base font-black text-white">{winner.points}</span>
                    <span className="block text-[10px] text-white/40 uppercase font-bold tracking-wider">
                      Pts
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center py-6 text-white/50 text-sm">Results are being evaluated.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end relative z-10 text-xs text-white/60">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(
                  `Competition Result #${competition.resultNumber} - ${competition.name}: 1st Place ${competition.winners?.[0]?.name} (${competition.winners?.[0]?.team || competition.winners?.[0]?.sector})`
                );
                alert('Result details copied to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold transition-all shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Result</span>
          </button>
        </div>
      </div>
    </div>
  );
};
