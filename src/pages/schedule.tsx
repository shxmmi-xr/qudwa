import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { Calendar, Clock, MapPin, Radio, CheckCircle, Hourglass, Search, Filter } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function SchedulePage() {
  const { currentTheme, brand, schedule } = useData();
  const [selectedDayOrDate, setSelectedDayOrDate] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique days & dates dynamically from schedule
  const uniqueTabs = useMemo(() => {
    const map = new Map<string, { key: string; label: string; date: string; count: number }>();

    schedule.forEach((item) => {
      const isNonStage = item.day === 0 || item.date === '2026-10-11' || item.stage?.toLowerCase().includes('non-stage') || item.stage?.toLowerCase().includes('non stage');
      const key = item.date || (isNonStage ? 'NON STAGE' : `Day ${item.day}`);
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: isNonStage ? 'NON STAGE' : `DAY ${item.day}`,
          date: item.date,
          count: 1,
        });
      } else {
        map.get(key)!.count += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [schedule]);

  // Extract unique stages dynamically
  const uniqueStages = useMemo(() => {
    const set = new Set<string>();
    schedule.forEach((item) => {
      if (item.stage) set.add(item.stage);
    });
    return Array.from(set);
  }, [schedule]);

  // Filter schedule items
  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      const isNonStage = item.day === 0 || item.date === '2026-10-11' || item.stage?.toLowerCase().includes('non-stage') || item.stage?.toLowerCase().includes('non stage');
      const matchesDay =
        selectedDayOrDate === 'All' ||
        item.date === selectedDayOrDate ||
        (isNonStage && (selectedDayOrDate === 'NON STAGE' || selectedDayOrDate === 'Day 0' || selectedDayOrDate === 'Non-Stage')) ||
        `Day ${item.day}` === selectedDayOrDate ||
        `DAY ${item.day}` === selectedDayOrDate;

      const matchesStage = selectedStage === 'All' || item.stage === selectedStage;

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stage.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDay && matchesStage && matchesSearch;
    });
  }, [schedule, selectedDayOrDate, selectedStage, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306]">
      <Head>
        <title>{`Event Schedule & Timings | ${brand.eventName} ${brand.year}`}</title>
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

      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <Calendar className="w-3.5 h-3.5" style={{ color: currentTheme.secondary }} />
            <span>Festival Timeline & Stages</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Event Schedule
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Explore real-time program timings, stage locations, and live competition slots.
          </p>
        </div>

        {/* Dynamic Day / Date Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 max-w-full justify-start sm:justify-center">
          <button
            onClick={() => setSelectedDayOrDate('All')}
            className={`py-2.5 px-4 rounded-2xl text-center whitespace-nowrap transition-all text-xs font-bold border ${
              selectedDayOrDate === 'All'
                ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg font-black'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Dates ({schedule.length})
          </button>

          {uniqueTabs.map((tab) => {
            const isSelected = selectedDayOrDate === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedDayOrDate(tab.key)}
                className={`py-2 px-4 rounded-2xl text-center whitespace-nowrap transition-all flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-white/20 text-white border-white/40 shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${currentTheme.primary}40`,
                        borderColor: currentTheme.primary,
                      }
                    : {}
                }
              >
                <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
                <span className="text-[10px] text-white/50">{tab.date}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Stage Filter Bar */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by program name, category, or stage..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-white/40 shrink-0" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Stages / Venues</option>
              {uniqueStages.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-4">
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((item) => {
              const isLive = item.status === 'Live';
              const isCompleted = item.status === 'Completed';

              return (
                <div
                  key={item.id}
                  className={`relative rounded-3xl p-5 sm:p-6 border transition-all backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLive
                      ? 'bg-white/10 border-white/30 shadow-2xl scale-[1.01]'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                  style={
                    isLive
                      ? {
                          boxShadow: `0 0 30px ${currentTheme.primaryGlow}`,
                          borderColor: currentTheme.primary,
                        }
                      : {}
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* Time & Date Box */}
                    <div
                      className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-center bg-white/5 border border-white/10 shrink-0 p-1"
                      style={
                        isLive
                          ? {
                              backgroundColor: currentTheme.primary,
                              color: '#ffffff',
                            }
                          : {}
                      }
                    >
                      <Clock className="w-4 h-4 mb-0.5 opacity-80" />
                      <span className="text-[11px] font-black leading-tight text-center">{item.time}</span>
                      <span className="text-[9px] text-white/50 block mt-0.5">{item.date}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {/* Day Badge */}
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/70 uppercase">
                          {item.day === 0 || item.date === '2026-10-11' || item.stage?.toLowerCase().includes('non-stage') || item.stage?.toLowerCase().includes('non stage') ? 'NON STAGE' : `DAY ${item.day}`}
                        </span>

                        {/* Category Pill */}
                        <span className="px-2.5 py-0.5 rounded-full bg-[#291705] border border-[#d97706]/40 text-[#f59e0b] text-[10px] font-black uppercase">
                          {item.category}
                        </span>

                        {/* Live Status indicator */}
                        {isLive && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                            <Radio className="w-3 h-3 text-emerald-400" /> LIVE NOW
                          </span>
                        )}
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            <CheckCircle className="w-3 h-3 text-emerald-500" /> COMPLETED
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{item.stage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator on Right */}
                  <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border ${
                        isLive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isCompleted
                          ? 'bg-white/5 text-white/40 border-white/10'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {isLive ? (
                        <>
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>Happening Now</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Finished</span>
                        </>
                      ) : (
                        <>
                          <Hourglass className="w-3.5 h-3.5" />
                          <span>Upcoming Slot</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white/[0.03] border border-white/10 rounded-3xl space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-white/20" />
              <h4 className="text-lg font-bold text-white">No Programs Scheduled</h4>
              <p className="text-xs text-white/50">
                No events match your current date or filter selection. Check other dates or view all.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
