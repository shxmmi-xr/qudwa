import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Medal, Download, Sparkles } from 'lucide-react';
import { Competition } from '@/data/mockData';
import { useData, calculateWinnerPoints } from '@/context/DataContext';
import { PosterGeneratorModal } from './PosterGeneratorModal';

interface ResultDetailViewProps {
  competition: Competition;
  onBack?: () => void;
}

export const ResultDetailView: React.FC<ResultDetailViewProps> = ({ competition, onBack }) => {
  const { currentTheme, brand, programs } = useData();
  const [showPosterModal, setShowPosterModal] = useState(false);

  const matchedProg = programs.find(
    (p) => p.name.toLowerCase() === competition.name.toLowerCase() || p.id === competition.id
  );
  const stageType = competition.stageType || matchedProg?.stageType || 'Stage';

  const winners = competition.winners || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306] text-white">
      <Head>
        <title>{`${competition.name} Result | ${brand.eventName}`}</title>
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

      <div className="container max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Top Link: Back to Results */}
        <div>
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </button>
          ) : (
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Link>
          )}
        </div>

        {/* Center Header Area */}
        <div className="text-center space-y-3 pt-2">
          {/* Stage Type & Category Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border ${
                stageType === 'Stage'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {stageType === 'Stage' ? 'Stage' : 'Non-Stage'}
            </span>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#291705] border border-[#d97706]/40 shadow-md">
              <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest">
                {competition.category} • {competition.type}
              </span>
            </div>
          </div>

          {/* Program Big Bold Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            {competition.name}
          </h1>

          {/* Generate Poster Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowPosterModal(true)}
              className="px-7 py-3 rounded-full bg-[#ec1c62] hover:bg-[#d41555] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(236,28,98,0.55)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2.5"
            >
              <Download className="w-4 h-4" />
              <span>Generate Poster</span>
            </button>
          </div>
        </div>

        {/* Winner Cards Main Container */}
        <div className="max-w-2xl mx-auto rounded-[2.5rem] bg-[#110712]/95 border border-white/10 p-5 sm:p-7 space-y-3.5 shadow-2xl backdrop-blur-xl">
          {winners.length > 0 ? (
            winners.map((winner, index) => {
              const isFirst = winner.position === 1;
              const isSecond = winner.position === 2;
              const isThird = winner.position === 3;

              const medalBg = isFirst
                ? 'bg-[#ec1c62]'
                : isSecond
                ? 'bg-[#94a3b8]'
                : 'bg-[#f59e0b]';

              const cardBorder = isFirst
                ? 'border-[#ec1c62]/40 bg-[#1c0a1f] shadow-lg hover:border-[#ec1c62]/70'
                : isSecond
                ? 'border-white/10 bg-[#140d18] hover:bg-[#180f1d]'
                : 'border-amber-500/20 bg-[#140d18] hover:bg-[#180f1d]';

              const pointsColor = isFirst ? 'text-[#ec1c62]' : 'text-white';

              const winnerDisplayName =
                winner.name || (winner.team ? `${winner.team} & Team` : `Participant #${winner.chestNo}`);
              const sectorLabel = (winner.team || winner.sector || 'TEAM ENTRY').toUpperCase();
              const gradeVal = winner.grade && winner.grade !== 'None' ? winner.grade : '-';

              return (
                <div
                  key={winner.position || index}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${cardBorder}`}
                >
                  {/* Left: Medal Box & Winner Info */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Medal Icon Square */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${medalBg} flex items-center justify-center text-white shrink-0 shadow-md`}
                    >
                      <Medal className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Winner Name & Subtitle / Team */}
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                        {winnerDisplayName}
                      </h3>
                      <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mt-0.5 truncate">
                        {sectorLabel} {winner.setNumber ? `• SET ${winner.setNumber}` : ''}
                      </p>

                      {/* Group Members or Chest Nos */}
                      {winner.groupMembers && winner.groupMembers.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {winner.groupMembers.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-emerald-300 font-mono flex items-center gap-1"
                            >
                              <span className="font-bold">#{m.chestNo}</span>
                              <span className="text-white/80">{m.name}</span>
                            </span>
                          ))}
                        </div>
                      ) : winner.chestNo ? (
                        <p className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                          Chest #{winner.chestNo}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Right: Points & Grade Dual Columns */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    {/* Points Column */}
                    <div className="text-center min-w-[45px]">
                      <span className={`text-xl sm:text-2xl font-black ${pointsColor} leading-none block`}>
                        {winner.points ?? calculateWinnerPoints(winner.position, winner.grade, competition.category, competition.type)}
                      </span>
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-wider block mt-1">
                        POINTS
                      </span>
                    </div>

                    {/* Vertical Divider Line */}
                    <div className="h-8 w-[1px] bg-white/10" />

                    {/* Grade Column */}
                    <div className="text-center min-w-[45px]">
                      <span className="text-xl sm:text-2xl font-black text-white leading-none block">
                        {gradeVal}
                      </span>
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-wider block mt-1">
                        GRADE
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-white/50 text-xs">
              No winners published yet for this event.
            </div>
          )}
        </div>
      </div>

      {/* Poster Generator Modal */}
      {showPosterModal && (
        <PosterGeneratorModal
          competition={competition}
          brand={brand}
          onClose={() => setShowPosterModal(false)}
        />
      )}
    </div>
  );
};
