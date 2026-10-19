import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Printer, Search, Filter, X } from 'lucide-react';
import { DEMO_PARTICIPANTS } from '@/data/mockData';
import { useData } from '@/context/DataContext';

// Barcode component using JsBarcode
const Barcode: React.FC<{ value: string; height?: number }> = ({ value, height = 60 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let isMounted = true;
    import('jsbarcode').then((mod) => {
      const JsBarcode = mod.default;
      if (svgRef.current && isMounted) {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          height,
          fontSize: 13,
          margin: 6,
          displayValue: true,
          lineColor: '#1a0606',
          background: '#ffffff',
          fontOptions: 'bold',
          textMargin: 4,
        });
      }
    });
    return () => { isMounted = false; };
  }, [value, height]);

  return <svg ref={svgRef} className="w-full" />;
};

// Category color badge
const categoryColor = (cat: string) => {
  switch (cat) {
    case 'Sub Junior': return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' };
    case 'Junior':     return { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' };
    case 'Senior':     return { bg: '#d1fae5', text: '#064e3b', border: '#10b981' };
    default:           return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
  }
};

const teamColor = (team: string) => {
  if (team === 'DAHFATAHAN') return { bg: '#6C0E0E', text: '#EBD5AA' };
  if (team === 'BADFATHAN')  return { bg: '#1e3a5f', text: '#93c5fd' };
  return { bg: '#374151', text: '#f9fafb' };
};

export default function BarcodesPage() {
  const { brand } = useData();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const teams = ['All', ...Array.from(new Set(DEMO_PARTICIPANTS.map(p => p.team)))];
  const categories = ['All', 'Sub Junior', 'Junior', 'Senior'];

  const filtered = DEMO_PARTICIPANTS.filter(p => {
    const matchSearch =
      p.chestNo.includes(search) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase());
    const matchTeam = teamFilter === 'All' || p.team === teamFilter;
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchTeam && matchCat;
  });

  return (
    <>
      <Head>
        <title>Barcode Cards – {brand?.eventName || 'QUDWA'} 2026</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Controls — hidden when printing */}
        <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">
                🏷️ Participant Barcode Cards
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {filtered.length} of {DEMO_PARTICIPANTS.length} participants · Scan to view details
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name / chest no…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800 w-52"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Team filter */}
              <select
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                {teams.map(t => <option key={t}>{t}</option>)}
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>

              {/* Print button */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#6C0E0E] text-[#EBD5AA] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#8b1111] transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" />
                Print Cards
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto p-6 print:p-0 print:max-w-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-3">
            {filtered.map((participant) => {
              const catStyle = categoryColor(participant.category);
              const tmStyle = teamColor(participant.team);
              return (
                <div
                  key={participant.chestNo}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 print:rounded-lg print:shadow-none print:border print:break-inside-avoid"
                  style={{ pageBreakInside: 'avoid' }}
                >
                  {/* Top colored header */}
                  <div
                    className="px-3 py-2 flex items-center justify-between"
                    style={{ backgroundColor: tmStyle.bg }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: tmStyle.text }}>
                      {participant.team}
                    </span>
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full border"
                      style={{ backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
                    >
                      {participant.category === 'Sub Junior' ? 'SUB JR' : participant.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Name & Chest No */}
                  <div className="px-3 pt-2 pb-1">
                    <div className="text-[8px] text-gray-400 font-semibold uppercase tracking-widest">Chest No.</div>
                    <div className="text-2xl font-black text-gray-900 leading-none">{participant.chestNo}</div>
                    <div className="text-[10px] font-bold text-gray-700 mt-1 leading-tight uppercase tracking-wide line-clamp-2">
                      {participant.name}
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">
                      DOB: {participant.dob}
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="px-2 pb-2 mt-1">
                    <Barcode value={participant.chestNo} height={50} />
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 border-t border-gray-100 px-3 py-1 text-center">
                    <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-widest">
                      QUDWA 2026 · KUIA ARTS FEST
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-semibold">No participants match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 12mm; size: A4; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
