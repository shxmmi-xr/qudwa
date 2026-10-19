import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { Search, ArrowRight, Trophy } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CATEGORIES, Competition } from '@/data/mockData';
import { ResultDetailView } from '@/components/ResultDetailView';

export default function ResultsPage() {
  const { currentTheme, brand, competitions, programs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState<'All' | 'Individual' | 'Group'>('All');
  const [selectedStageType, setSelectedStageType] = useState<'All' | 'Stage' | 'Non Stage'>('All');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  // Filter logic (Hook declared unconditionally at top level)
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((item) => {
      const matchedProg = programs.find(
        (p) => p.name.toLowerCase() === item.name.toLowerCase() || p.id === item.id
      );
      const stageTypeVal = item.stageType || matchedProg?.stageType || 'Stage';

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resultNumber.toString().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.winners?.some((w) => (w.team || w.sector || '').toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' || item.category === selectedCategory;

      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesStage = selectedStageType === 'All' || stageTypeVal === selectedStageType;

      return matchesSearch && matchesCategory && matchesType && matchesStage;
    });
  }, [searchTerm, selectedCategory, selectedType, selectedStageType, competitions, programs]);

  // If a competition is selected, render the Result Detail view
  if (selectedCompetition) {
    return (
      <ResultDetailView
        competition={selectedCompetition}
        onBack={() => setSelectedCompetition(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`Live Results | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div
        className="pointer-events-none absolute bottom-10 left-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Top Centered Counter Badge */}
        <div className="flex justify-center mb-8">
          <div className="px-6 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs font-black uppercase tracking-widest text-white/70 shadow-lg backdrop-blur-md">
            {competitions.length} RESULTS PUBLISHED
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search competition by name, number, or category..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs font-medium focus:outline-none focus:border-white/30 transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stage Type & Category Filter Pills */}
          <div className="flex flex-col items-center gap-3">
            {/* Stage Type Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setSelectedStageType('All')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedStageType === 'All'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                All Stage Types
              </button>
              <button
                type="button"
                onClick={() => setSelectedStageType('Stage')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedStageType === 'Stage'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300/60 hover:text-purple-300'
                }`}
              >
                Stage
              </button>
              <button
                type="button"
                onClick={() => setSelectedStageType('Non Stage')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedStageType === 'Non Stage'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-300/60 hover:text-amber-300'
                }`}
              >
                Non-Stage
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-full">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isSelected
                        ? 'border-white/30 text-black shadow-md'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: currentTheme.secondary,
                            borderColor: currentTheme.secondary,
                          }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results 2-Column Grid */}
        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredCompetitions.map((comp) => {
              const matchedProg = programs.find(
                (p) => p.name.toLowerCase() === comp.name.toLowerCase() || p.id === comp.id
              );
              const stageTypeVal = comp.stageType || matchedProg?.stageType || 'Stage';

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompetition(comp)}
                  className="group relative rounded-3xl bg-[#110712]/90 hover:bg-[#150a17] border border-white/10 hover:border-[#ec1c62]/70 p-6 sm:p-7 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col justify-between min-h-[140px]"
                >
                  {/* Subtle magenta glow on right half */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#ec1c62]/10 via-[#ec1c62]/5 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                  {/* Top Bar: Stage Type Pill + Category Pill + Type Pill & Arrow */}
                  <div className="flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Stage/Non-Stage Pill */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                          stageTypeVal === 'Stage'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {stageTypeVal === 'Stage' ? 'Stage' : 'Non-Stage'}
                      </span>

                      {/* Category Pill (Golden/Amber) */}
                      <span className="px-3 py-1 rounded-full bg-[#291705] border border-[#d97706]/40 text-[#f59e0b] text-[10px] font-black uppercase tracking-wider shadow-sm">
                        {comp.category}
                      </span>

                      {/* Type Pill (Cyan/Teal) */}
                      <span className="px-3 py-1 rounded-full bg-[#042628] border border-[#2dd4bf]/40 text-[#2dd4bf] text-[10px] font-black uppercase tracking-wider shadow-sm">
                        {comp.type}
                      </span>
                    </div>

                    {/* Right Arrow */}
                    <div className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Competition Title */}
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-white/95 transition-colors tracking-tight leading-snug">
                      {comp.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-white/30" />
            <h3 className="text-lg font-bold text-white">
              {competitions.length === 0 ? 'No results published yet' : 'No matching results found'}
            </h3>
            <p className="text-xs text-white/50 mt-1">
              {competitions.length === 0
                ? 'Competition results will appear here as soon as they are announced by the organizers.'
                : 'Try adjusting your search query or category filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
