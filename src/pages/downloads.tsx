import React, { useState } from 'react';
import Head from 'next/head';
import { FileText, Download, Search, BookOpen, Calendar, FileCheck, ArrowUpRight, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { downloadOrOpenFile, getDirectDownloadUrl } from '@/lib/downloadHelper';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-300',   border: 'border-amber-500/30',   icon: 'from-amber-500/40 to-amber-500/70' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', icon: 'from-emerald-500/40 to-emerald-500/70' },
  rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-300',    border: 'border-rose-500/30',    icon: 'from-rose-500/40 to-rose-500/70' },
  sky:     { bg: 'bg-sky-500/10',     text: 'text-sky-300',     border: 'border-sky-500/30',     icon: 'from-sky-500/40 to-sky-500/70' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-300',  border: 'border-violet-500/30',  icon: 'from-violet-500/40 to-violet-500/70' },
  orange:  { bg: 'bg-orange-500/10',  text: 'text-orange-300',  border: 'border-orange-500/30',  icon: 'from-orange-500/40 to-orange-500/70' },
};

const CATEGORY_ICONS: Record<string, any> = {
  Schedule: Calendar,
  General: Layers,
  Circulars: FileCheck,
  'By-Laws': BookOpen,
  'Study Material': BookOpen,
};

export default function DownloadsPage() {
  const { downloads } = useData();
  const { currentTheme, brand } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(downloads.map((d) => d.category)))];

  const filtered = downloads.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const allCategories = Array.from(new Set(downloads.map((d) => d.category)));
  const grouped = allCategories
    .map((cat) => ({ category: cat, items: filtered.filter((d) => d.category === cat) }))
    .filter((g) => g.items.length > 0);

  const displayItems =
    activeCategory === 'All' ? grouped : grouped.filter((g) => g.category === activeCategory);

  return (
    <>
      <Head>
        <title>Downloads — {brand.eventName}</title>
        <meta name="description" content={`Official documents, schedules, and circulars for ${brand.eventName}.`} />
      </Head>

      <div className="min-h-screen bg-[#060306] text-white">
        {/* Hero Section */}
        <section className="relative pt-28 pb-12 px-4 overflow-hidden">
          <div
            className="absolute top-10 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <div
            className="absolute top-20 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ backgroundColor: currentTheme.secondary }}
          />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ backgroundColor: `${currentTheme.primary}15`, borderColor: `${currentTheme.primary}30`, color: currentTheme.secondary }}
            >
              <Download className="w-3.5 h-3.5" />
              Official Documents
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-none">Downloads</h1>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto">
              Official PDFs, schedules, circulars, and by-laws for {brand.eventName} {brand.year}.
            </p>
          </div>
        </section>

        {/* Scrolling Marquee Banner */}
        <div className="overflow-hidden opacity-40 py-3 border-y border-white/5 mb-10">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
            {['Downloads', 'Schedules', 'Circulars', 'By-Laws', 'Programme List', 'Official Documents', 'Downloads', 'Schedules', 'Circulars', 'By-Laws', 'Programme List', 'Official Documents'].map((word, i) => (
              <span key={i} className="text-lg font-bold uppercase tracking-widest shrink-0" style={{ color: i % 2 === 0 ? currentTheme.primary : currentTheme.secondary }}>
                {word} •
              </span>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto px-4 mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    activeCategory === cat ? 'text-white border-transparent' : 'text-white/50 border-white/10 hover:border-white/25 hover:text-white/80'
                  }`}
                  style={activeCategory === cat ? { backgroundColor: currentTheme.primary, borderColor: currentTheme.primary } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Groups */}
        <main className="max-w-5xl mx-auto px-4 pb-24 space-y-16">
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-4">
              <FileText className="w-12 h-12" />
              <p className="text-lg font-bold">No documents available yet.</p>
              <p className="text-sm">The admin will publish downloads soon.</p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-4">
              <Search className="w-12 h-12" />
              <p className="text-lg font-bold">No results for &quot;{search}&quot;</p>
            </div>
          ) : (
            displayItems.map(({ category, items }) => {
              const CatIcon = CATEGORY_ICONS[category] || FileText;
              return (
                <section key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.primary}20` }}>
                      <CatIcon className="w-4 h-4" style={{ color: currentTheme.secondary }} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-white">{category}</h2>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/40 font-bold">{items.length} file{items.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((doc) => {
                      const colors = COLOR_MAP[doc.color] || COLOR_MAP.amber;
                      const isDataUrl = doc.url && doc.url.startsWith('data:');
                      const ext = doc.fileType?.toLowerCase() || 'pdf';
                      const defaultExt = ext === 'img' ? 'png' : ext === 'xls' ? 'xlsx' : ext === 'doc' ? 'docx' : 'pdf';
                      const safeTitle = (doc.title || 'document').replace(/[/\\?%*:|"<>]/g, '_').trim();
                      const downloadName = safeTitle.toLowerCase().endsWith(`.${defaultExt}`)
                        ? safeTitle
                        : `${safeTitle}.${defaultExt}`;
                      const downloadUrl = getDirectDownloadUrl(doc.url, downloadName);

                      return (
                        <a
                          key={doc.id}
                          href={downloadUrl}
                          download={downloadName}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (isDataUrl) {
                              e.preventDefault();
                              downloadOrOpenFile(doc.url, downloadName, doc.fileType === 'PDF' ? 'application/pdf' : undefined);
                            }
                          }}
                          className={`group relative flex flex-col text-left gap-3 p-5 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${colors.bg} ${colors.border}`}
                        >
                          <div className={`flex-1 rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center min-h-[80px] text-white font-black text-2xl tracking-tight transition-all duration-300 group-hover:opacity-90`}>
                            {doc.fileType}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <h3 className={`font-bold text-sm leading-tight ${colors.text}`}>
                                <span className="text-[10px] block opacity-70 mb-0.5">{brand.eventName} {brand.year}</span>
                                {doc.title}
                              </h3>
                              <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <p className={`text-[11px] opacity-60 leading-tight ${colors.text}`}>{doc.subtitle}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>
    </>
  );
}
