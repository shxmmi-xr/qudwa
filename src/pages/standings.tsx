import React from 'react';
import Head from 'next/head';
import { Flame, Users } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function StandingsPage() {
  const { currentTheme, brand, standings } = useData();

  const rankedStandings = standings.filter((s) => (Number(s.points) || 0) > 0);
  const maxPoints = Math.max(...standings.map((s) => Number(s.points) || 0), 1);
  const topThree = rankedStandings.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`Team Standings | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div
        className="pointer-events-none absolute bottom-10 left-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Team Championship Leaderboard</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Team Standings
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Live team points tally and medal standings for {brand.eventName} {brand.year}.
          </p>
        </div>

        {/* Podium Highlights or Pending Banner */}
        {topThree.length === 0 ? (
          <div className="max-w-2xl mx-auto mb-12 bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Championship Rankings Pending
            </h3>
            <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
              Official team rankings and podium positions will be unlocked once competition results are officially published. According to fest rules, teams with 0 points are not awarded positioning.
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              topThree.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : topThree.length === 1
                ? 'max-w-md mx-auto'
                : 'md:grid-cols-3'
            } gap-6 mb-12 items-end`}
          >
            {/* 1st Place (Champion Team) */}
            {topThree[0] && (
              <div
                className={`${
                  topThree.length >= 3 ? 'order-1 md:order-2 scale-105' : 'order-1'
                } bg-[#140a18] border rounded-3xl p-8 text-center backdrop-blur-2xl relative overflow-hidden flex flex-col items-center shadow-2xl`}
                style={{
                  borderColor: currentTheme.primary,
                  boxShadow: `0 0 40px ${currentTheme.primaryGlow}`,
                }}
              >
                <div className="absolute top-0 inset-x-0 py-1 bg-gradient-to-r from-amber-400 to-yellow-600 text-black text-[10px] font-black uppercase tracking-widest">
                  Leading Champion Team
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center font-black text-2xl mt-4 mb-4 shadow-xl">
                  1
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Overall Team Champion
                </span>
                <h3 className="text-3xl font-black text-white mb-2">{topThree[0].name}</h3>
                <div
                  className="text-4xl font-black mb-4"
                  style={{ color: currentTheme.secondary }}
                >
                  {topThree[0].points} <span className="text-xs text-white/50">PTS</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/90 font-bold bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-amber-400 font-bold">Gold: {topThree[0].gold}</span>
                  <span className="text-slate-300 font-bold">Silver: {topThree[0].silver}</span>
                  <span className="text-amber-600 font-bold">Bronze: {topThree[0].bronze}</span>
                </div>
              </div>
            )}

            {/* 2nd Place Team */}
            {topThree[1] && (
              <div
                className={`${
                  topThree.length >= 3 ? 'order-2 md:order-1' : 'order-2'
                } bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-xl relative overflow-hidden flex flex-col items-center`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 flex items-center justify-center font-black text-xl mb-4 shadow-lg">
                  2
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-1">
                  Runner Up Team
                </span>
                <h3 className="text-2xl font-black text-white mb-2">{topThree[1].name}</h3>
                <div
                  className="text-3xl font-black mb-3"
                  style={{ color: currentTheme.secondary }}
                >
                  {topThree[1].points} <span className="text-xs text-white/50">PTS</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 font-semibold">
                  <span className="text-amber-400">Gold: {topThree[1].gold}</span>
                  <span className="text-slate-300">Silver: {topThree[1].silver}</span>
                  <span className="text-amber-600">Bronze: {topThree[1].bronze}</span>
                </div>
              </div>
            )}

            {/* 3rd Place Team */}
            {topThree[2] && (
              <div className="order-3 md:order-3 bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 flex items-center justify-center font-black text-xl mb-4 shadow-lg">
                  3
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
                  2nd Runner Up Team
                </span>
                <h3 className="text-2xl font-black text-white mb-2">{topThree[2].name}</h3>
                <div
                  className="text-3xl font-black mb-3"
                  style={{ color: currentTheme.secondary }}
                >
                  {topThree[2].points} <span className="text-xs text-white/50">PTS</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 font-semibold">
                  <span className="text-amber-400">Gold: {topThree[2].gold}</span>
                  <span className="text-slate-300">Silver: {topThree[2].silver}</span>
                  <span className="text-amber-600">Bronze: {topThree[2].bronze}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Team Points Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: currentTheme.primary }} />
              <span>Full Team Standings</span>
            </h3>
            <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">
              Updated Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10 pb-3">
                  <th className="pb-3 pl-3">Rank</th>
                  <th className="pb-3">Team Name</th>
                  <th className="pb-3 text-center">Gold (1st)</th>
                  <th className="pb-3 text-center">Silver (2nd)</th>
                  <th className="pb-3 text-center">Bronze (3rd)</th>
                  <th className="pb-3">Points Ratio</th>
                  <th className="pb-3 pr-3 text-right">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {standings.map((team) => {
                  const hasScore = (Number(team.points) || 0) > 0;
                  const isRanked = hasScore && (Number(team.rank) || 0) > 0;
                  const percentage = hasScore ? Math.round(((Number(team.points) || 0) / maxPoints) * 100) : 0;

                  return (
                    <tr
                      key={team.id || team.name}
                      className="group hover:bg-white/5 transition-colors text-sm"
                    >
                      <td className="py-4 pl-3 font-black text-base">
                        {isRanked ? (
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              team.rank === 1
                                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                                : team.rank === 2
                                ? 'bg-slate-300 text-black shadow-md'
                                : team.rank === 3
                                ? 'bg-amber-700 text-white shadow-md'
                                : 'bg-white/5 text-white/60'
                            }`}
                          >
                            #{team.rank}
                          </span>
                        ) : (
                          <span
                            className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm bg-white/5 text-white/30"
                            title="No position awarded (Score is 0)"
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-4 font-bold text-white group-hover:text-white/90">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/40" />
                          <span>{team.name}</span>
                          {!hasScore && (
                            <span className="text-[10px] uppercase font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                              Unranked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center font-bold text-amber-400">{team.gold}</td>
                      <td className="py-4 text-center font-bold text-slate-300">{team.silver}</td>
                      <td className="py-4 text-center font-bold text-amber-600">{team.bronze}</td>
                      <td className="py-4 w-1/4">
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                isRanked && team.rank === 1 ? currentTheme.primary : currentTheme.secondary,
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 pr-3 text-right font-black text-lg text-white">
                        {team.points} <span className="text-xs text-white/40 font-normal">PTS</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
