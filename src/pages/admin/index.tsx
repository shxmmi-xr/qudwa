import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShieldCheck,
  Palette,
  Trophy,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Video,
  Newspaper,
  User,
  MapPin,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  ExternalLink,
  LogOut,
  Save,
  Database,
  Search,
  Tag,
  Eye,
  EyeOff,
  AlertTriangle,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  FileText,
  Lock,
  Unlock,
  Copy,
  UserCheck,
  KeyRound,
  Users,
  Instagram,
  Youtube,
  Film,
  Play,
  Zap,
  AlertCircle,
  X,
  Edit2,
  PenTool,
  Mic,
  Bell,
  Megaphone,
  Pin,
  Radio,
  FileDown,
  Monitor,
  Tv,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData, calculateWinnerPoints } from '@/context/DataContext';
import type { DownloadItem } from '@/context/DataContext';
import { Winner, ProgramEntry, ProgramLimit, ProgramMaster, FestivalNotification, Competition } from '@/data/mockData';
import { THEME_PRESETS } from '@/config/siteConfig';
import { downloadOrOpenFile } from '@/lib/downloadHelper';
import { uploadToStorage } from '@/lib/uploadHelper';

// ──────────────────────────────────────────────────────────────
// Downloads Manager: add-new form (sub-component)
// ──────────────────────────────────────────────────────────────
function DownloadAdminForm({ onAdd, currentTheme }: { onAdd: (item: DownloadItem) => void; currentTheme: any }) {
  const [sourceMode, setSourceMode] = React.useState<'local' | 'url'>('local');
  const [selectedFile, setSelectedFile] = React.useState<{ name: string; size: string; file: File } | null>(null);
  const [isReading, setIsReading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [form, setForm] = React.useState<Omit<DownloadItem, 'id'>>({
    title: '', subtitle: '', category: 'General', fileType: 'PDF', url: '', date: new Date().toISOString().slice(0, 10), color: 'amber',
  });
  const [open, setOpen] = React.useState(false);
  const COLORS = ['amber', 'emerald', 'rose', 'sky', 'violet', 'orange'] as const;
  const FILE_TYPES = ['PDF', 'DOC', 'XLS', 'IMG'] as const;
  const CATEGORIES = ['Schedule', 'General', 'Circulars', 'By-Laws', 'Study Material'] as const;

  const processFile = (file: File) => {
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let detectedType: 'PDF' | 'DOC' | 'XLS' | 'IMG' = 'PDF';
    if (['doc', 'docx'].includes(ext)) detectedType = 'DOC';
    else if (['xls', 'xlsx', 'csv'].includes(ext)) detectedType = 'XLS';
    else if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) detectedType = 'IMG';

    const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();

    setSelectedFile({ name: file.name, size: sizeStr, file });
    setForm((f) => ({
      ...f,
      title: f.title ? f.title : rawTitle,
      subtitle: f.subtitle ? f.subtitle : `${detectedType} Document (${sizeStr})`,
      fileType: detectedType,
      url: '', // Will be set after upload
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setForm((f) => ({ ...f, url: '' }));
    setUploadProgress('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL mode
    if (sourceMode === 'url') {
      if (!form.title || !form.url) {
        alert('Please enter a title and a valid file URL.');
        return;
      }
      let finalUrl = form.url.trim();
      const gdriveMatch = finalUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
      if (gdriveMatch) {
        finalUrl = `https://drive.google.com/uc?export=download&id=${gdriveMatch[1]}`;
      } else if (finalUrl.includes('dropbox.com') && finalUrl.includes('dl=0')) {
        finalUrl = finalUrl.replace('dl=0', 'raw=1');
      }
      onAdd({ ...form, url: finalUrl, id: `dl-${Date.now()}` });
      setForm({ title: '', subtitle: '', category: 'General', fileType: 'PDF', url: '', date: new Date().toISOString().slice(0, 10), color: 'amber' });
      setOpen(false);
      return;
    }

    // Local file upload mode — upload to Supabase Storage
    if (!selectedFile?.file) {
      alert('Please choose a file to upload.');
      return;
    }
    if (!form.title) {
      alert('Please enter a title for this download.');
      return;
    }

    try {
      setIsReading(true);
      setUploadProgress('Uploading file to cloud storage…');
      const publicUrl = await uploadToStorage(selectedFile.file, 'downloads');
      setUploadProgress('Upload complete! Saving to database…');
      onAdd({ ...form, url: publicUrl, id: `dl-${Date.now()}` });
      setForm({ title: '', subtitle: '', category: 'General', fileType: 'PDF', url: '', date: new Date().toISOString().slice(0, 10), color: 'amber' });
      setSelectedFile(null);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setOpen(false);
    } catch (err: any) {
      setIsReading(false);
      setUploadProgress('');
      alert(`Upload failed: ${err.message || 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setIsReading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-all text-sm font-bold bg-white/[0.02] hover:bg-white/[0.05]"
        style={{ borderColor: `${currentTheme.primary}50` }}
      >
        <Plus className="w-4 h-4" style={{ color: currentTheme.primary }} />
        Add New Download Item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-white">Add New Download Item</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xs"><X className="w-4 h-4" /></button>
      </div>

      {/* Source Mode Switcher */}
      <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 gap-1">
        <button
          type="button"
          onClick={() => setSourceMode('local')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            sourceMode === 'local' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
          }`}
          style={sourceMode === 'local' ? { backgroundColor: currentTheme.primary, color: '#fff' } : {}}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload From Device / Storage
        </button>
        <button
          type="button"
          onClick={() => setSourceMode('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            sourceMode === 'url' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
          }`}
          style={sourceMode === 'url' ? { backgroundColor: currentTheme.primary, color: '#fff' } : {}}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          External Link / Cloud URL
        </button>
      </div>

      {/* File Upload Dropzone (Local Storage Mode) */}
      {sourceMode === 'local' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] rounded-2xl p-6 text-center cursor-pointer transition-all group"
              style={{ borderColor: `${currentTheme.primary}40` }}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" style={{ color: currentTheme.primary }} />
              <p className="text-sm font-bold text-white">Click or drag & drop file from your device</p>
              <p className="text-[11px] text-white/40 mt-1">Supports PDF, Word (.docx), Excel (.xlsx), Images (.png, .jpg)</p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs text-white/50">{selectedFile.size} • Loaded from local storage</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* External URL Mode */}
      {sourceMode === 'url' && (
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">File URL * (Google Drive / Direct Link)</label>
          <input
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            required={sourceMode === 'url'}
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            placeholder="e.g. Festival By-Laws 2026"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Subtitle</label>
          <input
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="Short description"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">File Type</label>
          <select
            value={form.fileType}
            onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value as any }))}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none"
          >
            {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Card Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize border transition-all ${
                form.color === c ? 'text-white' : 'text-white/40 border-white/10 hover:border-white/25'
              }`}
              style={form.color === c ? { backgroundColor: currentTheme.primary, borderColor: currentTheme.primary } : {}}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {uploadProgress && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
          {uploadProgress}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isReading}
          className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="w-4 h-4" />
          {isReading ? 'Uploading to Cloud…' : 'Publish Download'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2.5 rounded-xl bg-white/5 text-white/50 font-bold text-sm hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentTheme,
    setThemePreset,
    setCustomColors,
    brand,
    updateBrand,

    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    categories,
    addCategory,
    deleteCategory,

    competitions,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    clearAllCompetitions,

    standings,
    updateStanding,
    addStanding,
    deleteStanding,
    syncStandingsWithResults,

    schedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,

    gallery,
    addGalleryItem,
    deleteGalleryItem,

    videos,
    addVideo,
    deleteVideo,

    news,
    addNewsItem,
    deleteNewsItem,

    notifications,
    addNotification,
    updateNotification,
    deleteNotification,
    togglePinNotification,

    participants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    importParticipantsBulk,

    programLimits,
    updateProgramLimit,
    getProgramLimit,
    getParticipantEventStats,

    programEntries,
    addProgramEntry,
    addProgramEntriesBulk,
    deleteProgramEntry,
    importProgramEntriesBulk,

    teamAccounts,
    updateTeamAccount,

    registrationSettings,
    updateRegistrationSettings,
    toggleEntranceLock,

    isAdminLoggedIn,
    adminCredentials,
    updateAdminCredentials,
    adminLogout,
    clearAllDemoData,
    resetAllToDefaults,

    isSupabaseConnected,
    syncLocalToSupabase,

    downloads,
    addDownload,
    updateDownload,
    deleteDownload,
  } = useData();

  const [activeTab, setActiveTab] = useState<
    'arenatv' | 'brand' | 'datacenter' | 'entries' | 'bulletins' | 'results' | 'standings' | 'schedule' | 'gallery' | 'media' | 'news' | 'participants' | 'downloads' | 'security'
  >('arenatv');

  const [successMessage, setSuccessMessage] = useState<string>('');

  // Admin Credentials Form State
  const [newAdminUser, setNewAdminUser] = useState<string>(adminCredentials?.username || 'admin');
  const [newAdminPass, setNewAdminPass] = useState<string>('');
  const [confirmAdminPass, setConfirmAdminPass] = useState<string>('');
  const [showAdminPass, setShowAdminPass] = useState<boolean>(false);
  const [adminCredStatus, setAdminCredStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState<boolean>(false);

  useEffect(() => {
    if (adminCredentials?.username) {
      setNewAdminUser(adminCredentials.username);
    }
  }, [adminCredentials?.username]);

  // Limit Settings State (Stage & Non Stage)
  const [settingMaxStage, setSettingMaxStage] = useState<number>(registrationSettings.maxStagePerCandidate ?? 4);
  const [settingMaxNonStage, setSettingMaxNonStage] = useState<number>(registrationSettings.maxNonStagePerCandidate ?? 4);
  const [isEditingLimits, setIsEditingLimits] = useState<boolean>(false);

  useEffect(() => {
    if (registrationSettings.maxStagePerCandidate !== undefined) {
      setSettingMaxStage(registrationSettings.maxStagePerCandidate);
    }
    if (registrationSettings.maxNonStagePerCandidate !== undefined) {
      setSettingMaxNonStage(registrationSettings.maxNonStagePerCandidate);
    }
  }, [registrationSettings.maxStagePerCandidate, registrationSettings.maxNonStagePerCandidate]);

  // Program Entry Desk State
  const [selectedEntryProgramId, setSelectedEntryProgramId] = useState<string>('');
  const [selectedEntryTeam, setSelectedEntryTeam] = useState<string>('');
  const [entryIndividualSlots, setEntryIndividualSlots] = useState<{ chestNo: string; name: string }[]>([{ chestNo: '', name: '' }]);
  const [entryGroupMembers, setEntryGroupMembers] = useState<{ chestNo: string; name: string }[]>([]);
  const [entryGroupSetNum, setEntryGroupSetNum] = useState<number>(1);
  const [entrySearchQuery, setEntrySearchQuery] = useState<string>('');
  const [entryTeamFilter, setEntryTeamFilter] = useState<string>('All');
  const [entryCatFilter, setEntryCatFilter] = useState<string>('All');
  const [entryFormTab, setEntryFormTab] = useState<'links' | 'manual' | 'excel'>('links');

  // Auto-sync selected team with active standings
  useEffect(() => {
    if (standings && standings.length > 0) {
      const firstTeam = standings[0].name;
      const secondTeam = standings[1]?.name || firstTeam;
      if (!selectedEntryTeam || !standings.some((s) => s.name.toLowerCase() === selectedEntryTeam.toLowerCase())) {
        setSelectedEntryTeam(firstTeam);
      }
      if (!newParticipant.team || !standings.some((s) => s.name.toLowerCase() === newParticipant.team.toLowerCase())) {
        setNewParticipant((prev) => ({ ...prev, team: firstTeam }));
      }
      if (!newResult.w1Team || !standings.some((s) => s.name.toLowerCase() === newResult.w1Team.toLowerCase())) {
        setNewResult((prev) => ({ ...prev, w1Team: firstTeam, w2Team: secondTeam }));
      }
    }
  }, [standings]);

  // Branding Form State
  const [brandForm, setBrandForm] = useState({ ...brand });
  const [primaryHex, setPrimaryHex] = useState(currentTheme.primary);
  const [secondaryHex, setSecondaryHex] = useState(currentTheme.secondary);

  useEffect(() => {
    setBrandForm({ ...brand });
  }, [brand]);

  useEffect(() => {
    setPrimaryHex(currentTheme.primary);
    setSecondaryHex(currentTheme.secondary);
  }, [currentTheme]);

  // Data Center Form State
  const [newProgName, setNewProgName] = useState('');
  const [newProgStageType, setNewProgStageType] = useState<'Stage' | 'Non Stage'>('Stage');
  const [newProgCategory, setNewProgCategory] = useState('General');
  const [newProgType, setNewProgType] = useState<'Individual' | 'Group'>('Individual');
  const [newProgMaxEntries, setNewProgMaxEntries] = useState<number>(1);
  const [newProgGroupSets, setNewProgGroupSets] = useState<number>(1);
  const [newProgParticipantsPerSet, setNewProgParticipantsPerSet] = useState<number>(4);
  const [newProgNoMembersRequired, setNewProgNoMembersRequired] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [progSearch, setProgSearch] = useState('');
  const [progCatFilter, setProgCatFilter] = useState('All');
  const [progStageFilter, setProgStageFilter] = useState<'All' | 'Stage' | 'Non Stage'>('All');

  // New Result Form State
  const [showNewResultModal, setShowNewResultModal] = useState(false);
  const [newResult, setNewResult] = useState({
    name: '',
    category: 'General',
    type: 'Individual' as 'Individual' | 'Group',
    resultNumber: competitions.length > 0 ? Math.max(...competitions.map((c) => c.resultNumber)) + 1 : 1,
    w1Active: true,
    w1Name: '',
    w1Chest: '',
    w1Team: '',
    w1Set: 1,
    w1Grade: 'A' as 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None',
    w1Points: 8,
    w2Active: true,
    w2Name: '',
    w2Chest: '',
    w2Team: '',
    w2Set: 1,
    w2Grade: 'A' as 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None',
    w2Points: 7,
    w3Active: true,
    w3Name: '',
    w3Chest: '',
    w3Team: '',
    w3Set: 1,
    w3Grade: 'B' as 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None',
    w3Points: 4,
  });

  // Edit Result State
  const [editingResult, setEditingResult] = useState<{
    id: string;
    name: string;
    category: string;
    type: 'Individual' | 'Group';
    resultNumber: number;
    w1Active: boolean;
    w1Name: string;
    w1Chest: string;
    w1Team: string;
    w1Grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None';
    w1Points: number;
    w2Active: boolean;
    w2Name: string;
    w2Chest: string;
    w2Team: string;
    w2Grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None';
    w2Points: number;
    w3Active: boolean;
    w3Name: string;
    w3Chest: string;
    w3Team: string;
    w3Grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None';
    w3Points: number;
  } | null>(null);
  const [showEditResultModal, setShowEditResultModal] = useState(false);

  // Results Tab Filter & Sorting
  const [resultSortBy, setResultSortBy] = useState<'resultNumber' | 'chestNo'>('resultNumber');
  const [resultSearch, setResultSearch] = useState('');

  // Participants Tab Search & Filter
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantFilter, setParticipantFilter] = useState<'All' | 'Unregistered' | 'Registered' | 'StageMax' | 'NonStageMax' | 'FullBooked'>('All');
  const [participantSort, setParticipantSort] = useState<'chestNo' | 'mostRegistered' | 'leastRegistered' | 'name'>('chestNo');
  const [participantTeamFilter, setParticipantTeamFilter] = useState<string>('All');

  // New Schedule Item State
  const [newSchedule, setNewSchedule] = useState({
    day: 1,
    date: '2026-09-04',
    time: '10:00 AM',
    title: '',
    category: 'General',
    stage: 'Main Stage (Stage 1)',
    status: 'Upcoming' as 'Live' | 'Upcoming' | 'Completed',
  });

  // New Gallery Item State
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Stages',
    image: '',
  });

  // New Video Item State
  const [newVideo, setNewVideo] = useState({
    title: '',
    speaker: '@artsfest_official',
    platform: 'instagram' as 'instagram' | 'youtube' | 'direct',
    youtubeId: '',
    instagramUrl: '',
    videoUrl: '',
    duration: 'Reel',
    thumbnail: '',
  });

  // New News Item State
  const [newNews, setNewNews] = useState({
    titleMalayalam: '',
    titleEnglish: '',
    date: 'Jul 5, 2026',
    category: 'Updates',
    image: '',
    summary: '',
    content: '',
  });

  // New Bulletin / Notification State
  const [newBulletin, setNewBulletin] = useState({
    title: '',
    category: 'Circular' as 'By-Laws & Regulations' | 'Urgent Alert' | 'Circular' | 'Schedule Notice' | 'Result Bulletin' | 'General',
    priority: 'High' as 'Urgent' | 'High' | 'Normal',
    targetAudience: 'All Attendees & Teams',
    summary: '',
    content: '',
    attachmentName: '',
    attachmentUrl: '',
    attachmentSize: '',
    attachmentType: 'pdf' as 'pdf' | 'doc' | 'image',
    isPinned: false,
    showOnLiveScreen: true,
  });
  const [bulletinSearch, setBulletinSearch] = useState('');
  const [bulletinCatFilter, setBulletinCatFilter] = useState('All');

  // Helper for document/PDF upload
  const handleDocumentUpload = (
    file: File | null,
    onSuccess: (data: { url: string; name: string; size: string; type: 'pdf' | 'doc' | 'image' }) => void
  ) => {
    if (!file) return;
    const name = file.name;
    const sizeInMB = file.size / (1024 * 1024);
    const sizeStr = sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(file.size / 1024)} KB`;

    let fileType: 'pdf' | 'doc' | 'image' = 'doc';
    if (file.type === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (file.type.startsWith('image/')) {
      fileType = 'image';
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onSuccess({
          url: e.target.result as string,
          name,
          size: sizeStr,
          type: fileType,
        });
        notify(`File "${name}" attached successfully (${sizeStr})!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preload By-Laws Document Helper
  const preloadByLawsDocument = () => {
    setNewBulletin({
      title: 'Festival Official By-Laws, Rules & Stage Regulations 2026',
      category: 'By-Laws & Regulations',
      priority: 'Urgent',
      targetAudience: 'All Teams, Participants & Judges',
      summary: 'Complete festival rulebook, stage timing parameters, code of conduct, scoring metrics, and appeal committee procedures.',
      content: 'The Festival Directorate issues the formal By-Laws 2026. All competing units, managers, and contestants must adhere strictly to the guidelines.\n\nKey Highlights:\n1. Participant maximum participation quota rules must be verified prior to stage entry.\n2. Time limits on stage will be strictly tracked by official digital clocks.\n3. Disciplinary inquiries and appeals must be lodged within 30 minutes of result declaration.',
      attachmentName: 'Sahityotsav_Festival_ByLaws_2026.pdf',
      attachmentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago=',
      attachmentSize: '2.4 MB',
      attachmentType: 'pdf',
      isPinned: true,
      showOnLiveScreen: true,
    });
    notify('Preloaded Official Festival By-Laws template!');
  };

  // New Participant State
  const [newParticipant, setNewParticipant] = useState({
    chestNo: '',
    name: '',
    team: 'DAHFATAHAN',
    category: 'Senior',
  });

  // New Team State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPoints, setNewTeamPoints] = useState<number>(0);
  const [newTeamGold, setNewTeamGold] = useState<number>(0);
  const [newTeamSilver, setNewTeamSilver] = useState<number>(0);
  const [newTeamBronze, setNewTeamBronze] = useState<number>(0);

  // Helper for device image file browsing — compresses then uploads to Supabase Storage
  const handleImageUpload = (
    file: File | null,
    onSuccess: (url: string) => void,
    bucket: 'gallery' | 'videos' | 'downloads' | 'news' = 'gallery'
  ) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      if (!rawData) return;
      const img = new Image();
      img.onload = async () => {
        const MAX_WIDTH = 1080;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const compressedDataUrl = ctx
          ? (ctx.drawImage(img, 0, 0, width, height), canvas.toDataURL('image/jpeg', 0.80))
          : rawData;

        // Upload compressed image to Supabase Storage via /api/upload
        try {
          notify(`Uploading photo to ${bucket} storage…`);
          const { uploadDataUrlToStorage } = await import('@/lib/uploadHelper');
          const ext = file.name.split('.').pop() || 'jpg';
          const publicUrl = await uploadDataUrlToStorage(compressedDataUrl, bucket, `photo_${Date.now()}.${ext}`);
          onSuccess(publicUrl);
          notify('Photo uploaded & ready to publish across all devices!');
        } catch (err: any) {
          // Fallback: store as base64 if upload fails
          console.warn('[handleImageUpload] Storage upload failed, using base64 fallback:', err);
          onSuccess(compressedDataUrl);
          notify('Photo loaded (offline fallback — check internet connection)');
        }
      };
      img.onerror = () => {
        onSuccess(rawData);
        notify('Photo loaded!');
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  // Helper for device video file browsing — uploads to Supabase Storage
  const handleVideoFileUpload = (file: File | null, onSuccess: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (.mp4, .webm, .mov)');
      return;
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 50) {
      alert(`The selected video is ${sizeMb.toFixed(1)}MB. Maximum size is 50MB. For larger videos, upload to YouTube or Instagram Reels and paste the link!`);
      return;
    }

    (async () => {
      try {
        notify(`Uploading video (${sizeMb.toFixed(1)}MB) to cloud storage…`);
        const { uploadToStorage: uploadVid } = await import('@/lib/uploadHelper');
        const publicUrl = await uploadVid(file, 'videos');
        onSuccess(publicUrl);
        notify(`Video uploaded successfully (${sizeMb.toFixed(1)}MB) — live on all devices!`);
      } catch (err: any) {
        alert(`Video upload failed: ${err.message || 'Unknown error'}. Please try YouTube/Instagram link instead.`);
      }
    })();
  };

  // Excel Bulk Import State
  const [excelUploadStatus, setExcelUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setExcelUploadStatus('Reading Excel file...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rows || rows.length === 0) {
          setExcelUploadStatus('Excel file is empty or no valid rows found.');
          setIsUploading(false);
          return;
        }

        const parsedBatch = rows
          .map((row) => {
            const chestKey = Object.keys(row).find((k) =>
              /chest/i.test(k) || /no/i.test(k) || /id/i.test(k)
            );
            const nameKey = Object.keys(row).find((k) =>
              /name/i.test(k) || /student/i.test(k) || /candidate/i.test(k) || /participant/i.test(k)
            );
            const teamKey = Object.keys(row).find((k) =>
              /team/i.test(k) || /sector/i.test(k) || /group/i.test(k)
            );
            const catKey = Object.keys(row).find((k) =>
              /cat/i.test(k) || /category/i.test(k) || /section/i.test(k) || /class/i.test(k)
            );

            const rawChest = chestKey ? String(row[chestKey]).trim() : '';
            if (!rawChest) return null;

            return {
              chestNo: rawChest,
              name: nameKey && row[nameKey] ? String(row[nameKey]).trim() : `Candidate #${rawChest}`,
              team: teamKey && row[teamKey] ? String(row[teamKey]).trim() : 'Team A',
              category: catKey && row[catKey] ? String(row[catKey]).trim() : 'Senior',
            };
          })
          .filter(Boolean);

        if (parsedBatch.length === 0) {
          setExcelUploadStatus('No participants found. Please ensure column "Chest No" exists.');
          setIsUploading(false);
          return;
        }

        importParticipantsBulk(parsedBatch);
        setExcelUploadStatus(`Successfully imported ${parsedBatch.length} participants!`);
        notify(`Successfully imported ${parsedBatch.length} participants from Excel!`);
        setIsUploading(false);
        e.target.value = '';
      } catch (err: any) {
        console.error('Error parsing Excel file', err);
        setExcelUploadStatus(`Error parsing file: ${err.message || 'Invalid format'}`);
        setIsUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadSampleExcel = () => {
    const team1 = standings[0]?.name || 'DAHFATAHAN';
    const team2 = standings[1]?.name || 'BADFATHAN';
    const sampleData = [
      { 'Chest No': '101', 'Full Name': 'Salman Faris', Team: team1, Category: 'Senior' },
      { 'Chest No': '102', 'Full Name': 'Muhammad Bilal', Team: team2, Category: 'Junior' },
      { 'Chest No': '103', 'Full Name': 'Ahmad Rayan', Team: team1, Category: 'Sub Junior' },
      { 'Chest No': '104', 'Full Name': 'Zayan Ali', Team: team2, Category: 'General' },
      { 'Chest No': '74', 'Full Name': 'Farhan A', Team: team1, Category: 'Senior' },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, 'participants_sample_template.xlsx');
    notify('Sample Excel template downloaded!');
  };

  // Filtered Programs for Data Center
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(progSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(progSearch.toLowerCase());
      const matchCat = progCatFilter === 'All' || p.category === progCatFilter;
      const progStage = p.stageType || 'Stage';
      const matchStage = progStageFilter === 'All' || progStage === progStageFilter;
      return matchSearch && matchCat && matchStage;
    });
  }, [programs, progSearch, progCatFilter, progStageFilter]);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center bg-[#060306]">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="w-12 h-12 mx-auto text-rose-500" />
          <h2 className="text-2xl font-black text-white">Admin Access Required</h2>
          <p className="text-white/60 text-sm">
            Please log in with your administrator credentials to access the management control center.
          </p>
          <Link
            href="/login"
            className="w-full inline-block py-3 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-white/90 transition-all shadow-lg"
          >
            Go to Admin Login Portal
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand(brandForm);
    setCustomColors(primaryHex, secondaryHex);
    notify('Branding and Color codes updated successfully!');
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgName.trim()) return;

    const finalType = newProgCategory === 'General' ? 'Group' : newProgType;
    const progId = `p-${Date.now()}`;
    const progName = newProgName.trim();

    addProgram({
      id: progId,
      name: progName,
      category: newProgCategory,
      type: finalType,
      stageType: newProgStageType,
    });

    // Save Program Quotas & Limits defined at creation time
    updateProgramLimit(progId, {
      programId: progId,
      programCode: progId,
      programName: progName,
      category: newProgCategory,
      type: finalType,
      stageType: newProgStageType,
      maxEntriesPerTeam: finalType === 'Individual' ? (Number(newProgMaxEntries) || 1) : (Number(newProgGroupSets) || 1),
      groupSetsPerTeam: Number(newProgGroupSets) || 1,
      participantsPerSet: finalType === 'Group' ? (Number(newProgParticipantsPerSet) || (newProgCategory === 'General' ? 6 : 4)) : 1,
      noMembersRequired: newProgNoMembersRequired,
    });

    setNewProgName('');
    setNewProgStageType('Stage');
    setNewProgMaxEntries(1);
    setNewProgGroupSets(1);
    setNewProgParticipantsPerSet(4);
    setNewProgNoMembersRequired(false);
    notify(`Program "${progName}" (${newProgStageType === 'Stage' ? 'Stage' : 'Non-Stage'}) registered in Data Center!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    addCategory(newCategoryInput.trim());
    setNewCategoryInput('');
    notify(`Category "${newCategoryInput.trim()}" added to Data Center!`);
  };

  const handleChestLookup = (place: 1 | 2 | 3, chestVal: string) => {
    const defaultTeam1 = standings[0]?.name || 'DAHFATAHAN';
    const defaultTeam2 = standings[1]?.name || 'BADFATHAN';
    const candidate = participants.find((p) => String(p.chestNo).trim() === chestVal.trim());
    if (place === 1) {
      setNewResult((prev) => ({
        ...prev,
        w1Chest: chestVal,
        w1Name: candidate ? candidate.name : prev.w1Name,
        w1Team: candidate ? (candidate.team || defaultTeam1) : prev.w1Team,
      }));
    } else if (place === 2) {
      setNewResult((prev) => ({
        ...prev,
        w2Chest: chestVal,
        w2Name: candidate ? candidate.name : prev.w2Name,
        w2Team: candidate ? (candidate.team || defaultTeam2) : prev.w2Team,
      }));
    } else if (place === 3) {
      setNewResult((prev) => ({
        ...prev,
        w3Chest: chestVal,
        w3Name: candidate ? candidate.name : prev.w3Name,
        w3Team: candidate ? (candidate.team || defaultTeam1) : prev.w3Team,
      }));
    }
  };

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResult.name) return;

    const defaultTeam1 = standings[0]?.name || 'DAHFATAHAN';
    const defaultTeam2 = standings[1]?.name || 'BADFATHAN';
    const isGroupProg = newResult.type === 'Group';

    // Helper to build group members for winning team entry
    const parseGroupMembers = (team: string, chestStr: string) => {
      // 1. If chest string is provided, look up each candidate
      const chests = chestStr.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
      if (chests.length > 0) {
        return chests.map((c) => {
          const found = participants.find((p) => String(p.chestNo).trim() === c);
          return {
            chestNo: c,
            name: found ? found.name : `Candidate #${c}`,
          };
        });
      }

      // 2. Check if there is a registered ProgramEntry in database for this program & team
      const matchingEntry = programEntries.find(
        (entry) =>
          entry.programName.toLowerCase() === newResult.name.toLowerCase() &&
          entry.team.toLowerCase() === team.toLowerCase()
      );
      if (matchingEntry && matchingEntry.participants && matchingEntry.participants.length > 0) {
        return matchingEntry.participants.map((p) => ({
          chestNo: String(p.chestNo).trim(),
          name: p.name || `Candidate #${p.chestNo}`,
        }));
      }

      return [];
    };

    const winners: Winner[] = isGroupProg
      ? [
          ...(newResult.w1Active && (newResult.w1Team || defaultTeam1)
            ? [
                {
                  position: 1 as const,
                  name: newResult.w1Team || defaultTeam1,
                  chestNo: newResult.w1Chest || '',
                  team: newResult.w1Team || defaultTeam1,
                  groupMembers: parseGroupMembers(newResult.w1Team || defaultTeam1, newResult.w1Chest || ''),
                  grade: newResult.w1Grade,
                  points: Number(newResult.w1Points),
                },
              ]
            : []),
          ...(newResult.w2Active && (newResult.w2Team || defaultTeam2)
            ? [
                {
                  position: 2 as const,
                  name: newResult.w2Team || defaultTeam2,
                  chestNo: newResult.w2Chest || '',
                  team: newResult.w2Team || defaultTeam2,
                  groupMembers: parseGroupMembers(newResult.w2Team || defaultTeam2, newResult.w2Chest || ''),
                  grade: newResult.w2Grade,
                  points: Number(newResult.w2Points),
                },
              ]
            : []),
          ...(newResult.w3Active && newResult.w3Team
            ? [
                {
                  position: 3 as const,
                  name: newResult.w3Team,
                  chestNo: newResult.w3Chest || '',
                  team: newResult.w3Team,
                  groupMembers: parseGroupMembers(newResult.w3Team, newResult.w3Chest || ''),
                  grade: newResult.w3Grade,
                  points: Number(newResult.w3Points),
                },
              ]
            : []),
        ]
      : [
          ...(newResult.w1Active && (newResult.w1Name || newResult.w1Chest)
            ? [
                {
                  position: 1 as const,
                  name: newResult.w1Name || 'Winner 1',
                  chestNo: newResult.w1Chest || '101',
                  team: newResult.w1Team || defaultTeam1,
                  grade: newResult.w1Grade,
                  points: Number(newResult.w1Points),
                },
              ]
            : []),
          ...(newResult.w2Active && (newResult.w2Name || newResult.w2Chest)
            ? [
                {
                  position: 2 as const,
                  name: newResult.w2Name || 'Winner 2',
                  chestNo: newResult.w2Chest || '102',
                  team: newResult.w2Team || defaultTeam2,
                  grade: newResult.w2Grade,
                  points: Number(newResult.w2Points),
                },
              ]
            : []),
          ...(newResult.w3Active && (newResult.w3Name || newResult.w3Chest)
            ? [
                {
                  position: 3 as const,
                  name: newResult.w3Name || 'Winner 3',
                  chestNo: newResult.w3Chest || '103',
                  team: newResult.w3Team || defaultTeam1,
                  grade: newResult.w3Grade,
                  points: Number(newResult.w3Points),
                },
              ]
            : []),
        ];

    addCompetition({
      id: `comp-${Date.now()}`,
      resultNumber: Number(newResult.resultNumber),
      name: newResult.name,
      category: newResult.category,
      type: isGroupProg ? 'Group' : newResult.type,
      status: 'Published',
      winners,
    });

    setShowNewResultModal(false);
    setNewResult({
      name: '',
      category: 'General',
      type: 'Individual',
      resultNumber: Number(newResult.resultNumber) + 1,
      w1Active: true,
      w1Name: '',
      w1Chest: '',
      w1Team: '',
      w1Set: 1,
      w1Grade: 'A',
      w1Points: 8,
      w2Active: true,
      w2Name: '',
      w2Chest: '',
      w2Team: '',
      w2Set: 1,
      w2Grade: 'A',
      w2Points: 7,
      w3Active: true,
      w3Name: '',
      w3Chest: '',
      w3Team: '',
      w3Set: 1,
      w3Grade: 'B',
      w3Points: 4,
    });
    notify(`New Competition Result #${newResult.resultNumber} published! Leaderboard synchronized.`);
  };

  const handleOpenEditResult = (comp: Competition) => {
    const w1 = comp.winners?.find((w) => w.position === 1);
    const w2 = comp.winners?.find((w) => w.position === 2);
    const w3 = comp.winners?.find((w) => w.position === 3);

    const defaultTeam1 = standings[0]?.name || '';
    const defaultTeam2 = standings[1]?.name || defaultTeam1;
    const defaultTeam3 = standings[2]?.name || defaultTeam1;

    setEditingResult({
      id: comp.id,
      name: comp.name,
      category: comp.category,
      type: comp.type,
      resultNumber: comp.resultNumber,
      w1Active: Boolean(w1 && !(w1 as any).canceled),
      w1Name: w1?.name || '',
      w1Chest: w1?.chestNo || '',
      w1Team: w1?.team || defaultTeam1,
      w1Grade: (w1?.grade as any) || 'A',
      w1Points: w1?.points !== undefined ? Number(w1.points) : calculateWinnerPoints(1, w1?.grade, comp.category, comp.type),
      w2Active: Boolean(w2 && !(w2 as any).canceled),
      w2Name: w2?.name || '',
      w2Chest: w2?.chestNo || '',
      w2Team: w2?.team || defaultTeam2,
      w2Grade: (w2?.grade as any) || 'A',
      w2Points: w2?.points !== undefined ? Number(w2.points) : calculateWinnerPoints(2, w2?.grade, comp.category, comp.type),
      w3Active: Boolean(w3 && !(w3 as any).canceled),
      w3Name: w3?.name || '',
      w3Chest: w3?.chestNo || '',
      w3Team: w3?.team || defaultTeam3,
      w3Grade: (w3?.grade as any) || 'B',
      w3Points: w3?.points !== undefined ? Number(w3.points) : calculateWinnerPoints(3, w3?.grade, comp.category, comp.type),
    });
    setShowEditResultModal(true);
  };

  const handleSaveEditResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    const winners: Winner[] = [];
    if (editingResult.w1Active && (editingResult.w1Name || editingResult.w1Team)) {
      winners.push({
        position: 1,
        name: editingResult.w1Name || editingResult.w1Team,
        chestNo: editingResult.w1Chest,
        team: editingResult.w1Team,
        grade: editingResult.w1Grade,
        points: Number(editingResult.w1Points),
      });
    }
    if (editingResult.w2Active && (editingResult.w2Name || editingResult.w2Team)) {
      winners.push({
        position: 2,
        name: editingResult.w2Name || editingResult.w2Team,
        chestNo: editingResult.w2Chest,
        team: editingResult.w2Team,
        grade: editingResult.w2Grade,
        points: Number(editingResult.w2Points),
      });
    }
    if (editingResult.w3Active && (editingResult.w3Name || editingResult.w3Team)) {
      winners.push({
        position: 3,
        name: editingResult.w3Name || editingResult.w3Team,
        chestNo: editingResult.w3Chest,
        team: editingResult.w3Team,
        grade: editingResult.w3Grade,
        points: Number(editingResult.w3Points),
      });
    }

    updateCompetition(editingResult.id, {
      name: editingResult.name,
      category: editingResult.category,
      type: editingResult.type,
      resultNumber: Number(editingResult.resultNumber),
      winners,
    });

    setShowEditResultModal(false);
    setEditingResult(null);
    notify(`Saved Result #${editingResult.resultNumber} - Scores synchronized!`);
  };

  return (
    <div className="min-h-screen bg-[#060306] text-white flex flex-col">
      <Head>
        <title>{`Admin Control Panel | ${brand.eventName}`}</title>
      </Head>

      {/* TOP ADMIN HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a040b]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-14 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/images/qudwa-logo.png"
                alt="QUDWA"
                className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase leading-none font-sans">
                  QUDWA
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  Admin
                </span>
              </div>
              <span className="text-xs text-white/50 block mt-0.5 font-medium">
                {brand.eventName} • Management Dashboard
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bulletin?mode=tv"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Launch Arena Live TV (4K)</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={() => {
              adminLogout();
              router.push('/login');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* SUCCESS NOTIFICATION TOAST */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-[100] bg-emerald-500 text-black px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* MAIN ADMIN CONTENT WITH SIDEBAR */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR TABS */}
        <div className="space-y-3 lg:col-span-1">
          {/* Qudwa Branding Card on Left Side */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl shadow-xl flex items-center gap-3.5">
            <div className="w-12 h-16 p-1 flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 shrink-0 shadow-inner">
              <img
                src="/images/qudwa-logo.png"
                alt="Qudwa Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-white tracking-wide">QUDWA</span>
                <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
                  {brand.year || '2026'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white/70 truncate">{brand.organization || 'KUIA ARTS FEST'}</span>
              <span className="text-[11px] text-emerald-400 font-sans font-medium mt-0.5" style={{ direction: 'rtl' }}>
                فبهداهم اقتده
              </span>
            </div>
          </div>

          {/* DASHBOARD TABS - KEPT ASIDE / INTACT */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-3 backdrop-blur-xl shadow-xl space-y-1">
            <span className="block px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Content Managers
            </span>

            {[
              { id: 'arenatv', label: 'Arena Live TV (4K)', icon: Tv },
              { id: 'security', label: 'Security & Live Launch', icon: ShieldCheck },
              { id: 'downloads', label: `Downloads Manager (${downloads.length})`, icon: Download },
              { id: 'brand', label: 'Theme & Brand Info', icon: Palette },
              { id: 'datacenter', label: `Data Center (${programs.length})`, icon: Database },
              { id: 'entries', label: `Program Entry Desk (${programEntries.length})`, icon: UserCheck },
              { id: 'bulletins', label: `Updates Desk (${notifications.length})`, icon: Megaphone },
              { id: 'results', label: `Results Manager (${competitions.length})`, icon: Trophy },
              { id: 'standings', label: `Team Standings (${standings.length})`, icon: BarChart3 },
              { id: 'schedule', label: `Schedule & Timeline (${schedule.length})`, icon: Calendar },
              { id: 'gallery', label: `Photo Gallery (${gallery.length})`, icon: ImageIcon },
              { id: 'media', label: `Video Hub (${videos.length})`, icon: Video },
              { id: 'news', label: `News Releases (${news.length})`, icon: Newspaper },
              { id: 'participants', label: `Participants (${participants.length})`, icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-white/15 text-white shadow-md'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${currentTheme.primary}30`,
                          color: '#ffffff',
                          borderLeft: `4px solid ${currentTheme.primary}`,
                        }
                      : {}
                  }
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isSelected ? currentTheme.secondary : currentTheme.primary }}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Festival Launch & Master Reset */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 text-center space-y-3">
            <div>
              <span className="text-[11px] text-emerald-400 font-bold block mb-1.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Production Ready
              </span>
              <button
                onClick={() => {
                  if (
                    confirm(
                      '🚀 PREPARE FOR LIVE FESTIVAL LAUNCH?\n\nThis will clear all mock competition results, published winners, demo candidate registrations, and demo bulletin announcements, resetting team standings to 0 points.\n\nYour program list, categories, team accounts, and festival branding will remain 100% intact.\n\nProceed?'
                    )
                  ) {
                    clearAllDemoData('fresh_festival');
                    notify('All demo data cleared! Festival is now 100% fresh and live-ready.');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clean Demo Data</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] text-white/40 block mb-1">Testing / Demo Reset</span>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all site data to default demo data?')) {
                    resetAllToDefaults();
                    notify('All content and theme colors reset to defaults!');
                  }
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Demo Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN TAB CONTENT AREA */}
        <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* TAB 0: DEDICATED ARENA LIVE TV (4K) BROADCAST HUB */}
          {activeTab === 'arenatv' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Tv className="w-3 h-3 text-amber-400 animate-pulse" /> 4K Broadcast Center
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3" /> ON AIR READY
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">Arena Live TV (4K UHD)</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Election-channel style dynamic 3D broadcast stream for auditorium screens, stage monitors, and live arena displays.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/bulletin?mode=tv"
                    target="_blank"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all"
                  >
                    <Tv className="w-4 h-4" />
                    <span>Launch 4K TV Screen</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </Link>
                </div>
              </div>

              {/* Master TV Hero Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-purple-950/20 to-black/60 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-500/40 text-amber-300 text-xs font-black">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>REAL-TIME MULTI-SCENE CYCLE ENGINE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      Arena Mode 4K Live Broadcast Screen
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed max-w-xl">
                      Displays continuous real-time 3D podium result reveals with candidate chest numbers and stage types, dynamic election-style team leaderboard races with progress bars, and high-impact 3D festival logo stinger animations recurring every 10 seconds.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href="/bulletin?mode=tv"
                        target="_blank"
                        className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        <span>Open Arena Display (Full Screen)</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          syncStandingsWithResults();
                          notify('Synchronized leaderboard scores with Data Center results!');
                        }}
                        className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Force Score Sync</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}/bulletin?mode=tv`;
                          navigator.clipboard.writeText(url);
                          notify('Copied Arena TV URL to clipboard!');
                        }}
                        className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-xs flex items-center gap-2 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Broadcast Diagnostics Box */}
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90 block">
                      Live Feed Diagnostics
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-white/50">3D Stinger Cycle</span>
                        <span className="font-mono font-bold text-amber-300">Every 10s</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-white/50">Results In Feed</span>
                        <span className="font-mono font-bold text-white">{competitions.length} Published</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-white/50">Leaderboard Race</span>
                        <span className="font-mono font-bold text-emerald-400">{standings.length} Teams Live</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/50">Public Screen Access</span>
                        <span className="font-bold text-emerald-400">Admin Launched</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Multi-Scene Preview Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                  Arena TV Active Scene Rotations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-xs">
                        1
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">3D Podium</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">New Results Reveal</h5>
                    <p className="text-[11px] text-white/50">
                      Shows 1st, 2nd, 3rd podium positions with chest numbers, team flags, grades, and stage badges.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-xs">
                        2
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Points Race</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">Election-Style Standings</h5>
                    <p className="text-[11px] text-white/50">
                      Dynamic progress bars and live point tallies showing real-time team championship standing.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-xs">
                        3
                      </span>
                      <span className="text-[10px] font-bold text-purple-400 uppercase">10s Stinger</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">3D Festival Brand Stinger</h5>
                    <p className="text-[11px] text-white/50">
                      Full-screen 3D spinning festival logo with dynamic lighting, venue dates, and edition branding.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-cyan-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs">
                        4
                      </span>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">Live Radar</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">Stage & Non-Stage Hub</h5>
                    <p className="text-[11px] text-white/50">
                      Category progress gauges displaying stage/non-stage competition statuses in real time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOWNLOADS MANAGER TAB */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Downloads Manager</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Manage downloadable files shown at <strong className="text-white/70">/downloads</strong> — schedules, circulars, by-laws, etc.
                  </p>
                </div>
                <a
                  href="/downloads"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/25 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Public Page
                </a>
              </div>

              {/* Add New Download Form */}
              <DownloadAdminForm
                onAdd={(item) => { addDownload(item); notify('Download item added!'); }}
                currentTheme={currentTheme}
              />

              {/* Downloads List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white/80 uppercase tracking-widest">Published Downloads ({downloads.length})</h3>
                </div>
                {downloads.length === 0 ? (
                  <div className="py-12 text-center text-white/30">
                    <Download className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No downloads yet. Add one above.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {downloads.map((doc) => {
                      const isDataUrl = doc.url && doc.url.startsWith('data:');
                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-white/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white text-sm truncate">{doc.title}</p>
                              {isDataUrl && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase shrink-0">
                                  Device File
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/50 truncate">{doc.category} • {doc.subtitle}</p>
                            <p className="text-[10px] text-white/30 truncate mt-0.5">
                              {doc.url === '#' ? 'No URL set' : (isDataUrl ? '📁 Direct file attached from local storage' : doc.url)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-bold">{doc.fileType}</span>
                            {doc.url && doc.url !== '#' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const ext = doc.fileType?.toLowerCase() || 'pdf';
                                  const defaultExt = ext === 'img' ? 'png' : ext === 'xls' ? 'xlsx' : ext === 'doc' ? 'docx' : 'pdf';
                                  const downloadName = doc.title.toLowerCase().includes('.') ? doc.title : `${doc.title}.${defaultExt}`;
                                  downloadOrOpenFile(doc.url, downloadName, doc.fileType === 'PDF' ? 'application/pdf' : undefined);
                                }}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
                                title="Download / Test View"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => { deleteDownload(doc.id); notify('Download removed.'); }}
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                              title="Delete download"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: ADMIN SECURITY & PRODUCTION LIVE LAUNCH */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Production Security Hub
                    </span>
                    <span className="text-[10px] text-white/50 font-bold">
                      Control Access & Live State
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">Admin Security & Live Launch</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Update administrator credentials, manage team access codes, and initialize clean festival databases for production hosting.
                  </p>
                </div>
              </div>

              {/* SECTION 0: SUPABASE CLOUD DATABASE CONNECTION */}
              <div className="bg-gradient-to-br from-emerald-950/20 via-black/40 to-black/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-md">
                      <Database className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Supabase Cloud Database</h3>
                      <p className="text-xs text-white/50">Centralized database & live WebSocket broadcast across all devices</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-md ${
                        isSupabaseConnected
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{isSupabaseConnected ? 'Supabase Live Realtime Active' : 'Local Fallback (Cloud Not Connected)'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Automatic Realtime Sync</span>
                    </p>
                    <p className="text-white/60 text-[11px] leading-relaxed">
                      All changes you make (publishing results, editing scores, adding bulletins, changing theme or branding) are automatically synchronized with Supabase Cloud in the background without needing to click any button!
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Live WebSocket Broadcast</span>
                    </p>
                    <p className="text-white/60 text-[11px] leading-relaxed">
                      Connected to Supabase Realtime channel. All public viewer devices, mobiles, and arena displays update live and instantly within milliseconds.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                  <div className="text-[11px] text-emerald-400/90 flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Auto-Sync is running in background. Manual sync button below is optional.</span>
                  </div>

                  <button
                    type="button"
                    disabled={syncingSupabase}
                    onClick={async () => {
                      setSyncingSupabase(true);
                      const res = await syncLocalToSupabase();
                      setSyncingSupabase(false);
                      if (res.success) {
                        notify(res.message);
                      } else {
                        alert(res.message);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-600/20 hover:from-emerald-500/40 hover:to-teal-500/40 border border-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all shrink-0 disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    <span>{syncingSupabase ? 'Syncing...' : 'Force Full Resync to Cloud'}</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: ADMIN CREDENTIALS MANAGER */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: `${currentTheme.primary}20`,
                        borderColor: `${currentTheme.primary}40`,
                      }}
                    >
                      <KeyRound className="w-5 h-5" style={{ color: currentTheme.primary }} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Administrator Credentials</h3>
                      <p className="text-xs text-white/50">Change your administrator login username and secret password</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px] font-mono font-bold">
                    Active ID: <span className="text-white font-bold">{adminCredentials?.username || 'admin'}</span>
                  </span>
                </div>

                {adminCredStatus && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                      adminCredStatus.isError
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {adminCredStatus.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                    <span>{adminCredStatus.text}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAdminCredStatus(null);
                    if (!newAdminUser.trim()) {
                      setAdminCredStatus({ text: 'Admin username cannot be empty.', isError: true });
                      return;
                    }
                    if (!newAdminPass.trim()) {
                      setAdminCredStatus({ text: 'Please enter a new password.', isError: true });
                      return;
                    }
                    if (newAdminPass.length < 4) {
                      setAdminCredStatus({ text: 'Password must be at least 4 characters long.', isError: true });
                      return;
                    }
                    if (newAdminPass !== confirmAdminPass) {
                      setAdminCredStatus({ text: 'Passwords do not match. Please re-type to confirm.', isError: true });
                      return;
                    }

                    updateAdminCredentials(newAdminUser.trim(), newAdminPass.trim());
                    setAdminCredStatus({ text: 'Admin credentials updated and securely saved!', isError: false });
                    notify('Administrator username & password updated successfully!');
                    setNewAdminPass('');
                    setConfirmAdminPass('');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                      Admin Username / ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      placeholder="e.g. admin or festivalhead"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        required
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-white/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3 top-2.5 text-white/40 hover:text-white"
                      >
                        {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      required
                      value={confirmAdminPass}
                      onChange={(e) => setConfirmAdminPass(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-[11px] text-white/40">
                      Keep your credentials safe. You will need these to log in at <code className="text-white/70">/login</code>.
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-xl"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Admin Credentials</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 2: PRODUCTION LIVE LAUNCH DATA CLEANER */}
              <div className="bg-gradient-to-br from-emerald-950/30 via-black/40 to-black/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Live Festival Initialization</h3>
                      <p className="text-xs text-white/50">Clean demo test records before public launch</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                    One-Click Live Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>What will be cleared:</span>
                    </div>
                    <ul className="text-white/60 space-y-1 pl-4 list-disc text-[11px]">
                      <li>All mock competition results and published demo winners</li>
                      <li>Leaderboard standings scores & medal tallies reset to 0 points</li>
                      <li>Sample mock participants & digital chest cards</li>
                      <li>Demo team registrations & stage entries</li>
                      <li>Sample announcements & bulletin updates</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      <span>What will be preserved:</span>
                    </div>
                    <ul className="text-white/60 space-y-1 pl-4 list-disc text-[11px]">
                      <li>Festival branding, title, venue, dates & theme badges</li>
                      <li>Color palettes, background glows & styles</li>
                      <li>Master list of program items & categories (PRG-101, etc.)</li>
                      <li>Team login accounts & custom credentials</li>
                      <li>Candidate registration limits & rules</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                  <p className="text-[11px] text-white/50 max-w-lg">
                    Recommended before sharing your live domain with teams, judges, and the public. After clearing, you can publish authentic competition results in real-time.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          '🚀 INITIALIZE LIVE FESTIVAL?\n\nThis will wipe all demo winners, sample candidate registrations, and reset team standings points to 0.\n\nAll programs, categories, branding, and team accounts will be preserved.\n\nAre you sure you are ready for Live Launch?'
                        )
                      ) {
                        clearAllDemoData('fresh_festival');
                        notify('Live Festival initialized! All demo data wiped clean.');
                      }
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Demo Data & Launch Live</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: TEAM PASSWORDS QUICK ACCESS */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: `${currentTheme.secondary}20`,
                        borderColor: `${currentTheme.secondary}40`,
                      }}
                    >
                      <Users className="w-5 h-5" style={{ color: currentTheme.secondary }} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Team Access Credentials</h3>
                      <p className="text-xs text-white/50">View and update access passwords for each competing team</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/40">
                    {teamAccounts.length} Registered Teams
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamAccounts.map((acc) => (
                    <div key={acc.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{acc.teamName}</span>
                        <Link
                          href={`/team-entry?team=${encodeURIComponent(acc.teamName)}`}
                          target="_blank"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Open Desk</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Username</label>
                          <input
                            type="text"
                            value={acc.username}
                            onChange={(e) => updateTeamAccount(acc.id, { username: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Password</label>
                          <input
                            type="text"
                            value={acc.password}
                            onChange={(e) => updateTeamAccount(acc.id, { password: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: THEME & BRAND MANAGER */}
          {activeTab === 'brand' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Theme & Festival Branding</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Customize the event name, venue, dates, and color codes across the whole website.
                  </p>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60">
                  Select Pre-Configured Palette
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_PRESETS.map((p) => {
                    const isCur = currentTheme.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setThemePreset(p);
                          setPrimaryHex(p.primary);
                          setSecondaryHex(p.secondary);
                          notify(`Applied theme: ${p.name}`);
                        }}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                          isCur
                            ? 'bg-white/10 border-white/30 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-1.5">
                            <div
                              className="w-5 h-5 rounded-full border border-black/50"
                              style={{ backgroundColor: p.primary }}
                            />
                            <div
                              className="w-5 h-5 rounded-full border border-black/50"
                              style={{ backgroundColor: p.secondary }}
                            />
                          </div>
                          <span className="text-xs font-bold text-white">{p.name}</span>
                        </div>
                        {isCur && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Form */}
              <form onSubmit={handleSaveBranding} className="space-y-5 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                      Primary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryHex}
                        onChange={(e) => setPrimaryHex(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={primaryHex}
                        onChange={(e) => setPrimaryHex(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                      Secondary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryHex}
                        onChange={(e) => setSecondaryHex(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={secondaryHex}
                        onChange={(e) => setSecondaryHex(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Festival / Event Name
                    </label>
                    <input
                      type="text"
                      value={brandForm.eventName}
                      onChange={(e) => setBrandForm({ ...brandForm, eventName: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Organization / Committee
                    </label>
                    <input
                      type="text"
                      value={brandForm.organization}
                      onChange={(e) => setBrandForm({ ...brandForm, organization: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Venue Location
                    </label>
                    <input
                      type="text"
                      value={brandForm.venue}
                      onChange={(e) => setBrandForm({ ...brandForm, venue: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Festival Dates
                    </label>
                    <input
                      type="text"
                      value={brandForm.dates}
                      onChange={(e) => setBrandForm({ ...brandForm, dates: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Year / Edition
                    </label>
                    <input
                      type="text"
                      value={brandForm.year}
                      onChange={(e) => setBrandForm({ ...brandForm, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Built By / Credit
                    </label>
                    <input
                      type="text"
                      value={brandForm.builtBy || 'Shxmmi'}
                      onChange={(e) => setBrandForm({ ...brandForm, builtBy: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Theme Badge / Top Tagline
                    </label>
                    <input
                      type="text"
                      value={brandForm.themeBadge || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, themeBadge: e.target.value })}
                      placeholder="e.g. فبهداهم اقتده"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                      Sub-Title / Edition Label
                    </label>
                    <input
                      type="text"
                      value={brandForm.subTitle || ''}
                      onChange={(e) => setBrandForm({ ...brandForm, subTitle: e.target.value })}
                      placeholder="e.g. Arts Fest"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                {/* 3D Element Animation Style Selection Area (Option 1 / 2 / 3) */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                        <span>Hero 3D Centerpiece Animation Style</span>
                      </label>
                      <p className="text-xs text-white/50 mt-0.5">
                        Choose which interactive 3D model appears on your public landing hero page.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black uppercase text-amber-400">
                      Option {brandForm.hero3DStyle || '1'} Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* OPTION 1 */}
                    <button
                      type="button"
                      onClick={() => {
                        setBrandForm({ ...brandForm, hero3DStyle: '1' });
                        updateBrand({ ...brandForm, hero3DStyle: '1' });
                        notify('Activated Option 1: Holographic 3D Glass Trophy & Orbit Rings!');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        (brandForm.hero3DStyle || '1') === '1'
                          ? 'bg-gradient-to-br from-[#ec1c62]/25 to-black border-[#ec1c62] shadow-[0_0_25px_rgba(236,28,98,0.35)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#ec1c62]/20 border border-[#ec1c62]/40 text-[#ec1c62] font-black text-[10px] uppercase">
                            Option 1
                          </span>
                          {(brandForm.hero3DStyle || '1') === '1' && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <h3 className="text-sm font-black text-white">Holographic 3D Trophy</h3>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Frosted glassmorphic card with dynamic mouse tilt, gold trophy emblem, and counter-rotating celestial rings.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-[#78e8d2]">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Interactive 3D Tilt & Rings</span>
                      </div>
                    </button>

                    {/* OPTION 2 */}
                    <button
                      type="button"
                      onClick={() => {
                        setBrandForm({ ...brandForm, hero3DStyle: '2' });
                        updateBrand({ ...brandForm, hero3DStyle: '2' });
                        notify('Activated Option 2: Heritage Islamic Arch & Glowing Lantern!');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        brandForm.hero3DStyle === '2'
                          ? 'bg-gradient-to-br from-amber-600/30 to-black border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-[10px] uppercase">
                            Option 2
                          </span>
                          {brandForm.hero3DStyle === '2' && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <h3 className="text-sm font-black text-amber-200">Heritage Islamic Arch</h3>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Traditional illuminated Mihrab arch, 8-point Rub el Hizb sacred star, and warm candle-lit Fanous lantern.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sacred Cultural Illumination</span>
                      </div>
                    </button>

                    {/* OPTION 3 */}
                    <button
                      type="button"
                      onClick={() => {
                        setBrandForm({ ...brandForm, hero3DStyle: '3' });
                        updateBrand({ ...brandForm, hero3DStyle: '3' });
                        notify('Activated Option 3: Cyber 3D Crystal Gemstone & Neon Matrix!');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        brandForm.hero3DStyle === '3'
                          ? 'bg-gradient-to-br from-cyan-600/30 to-black border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-black text-[10px] uppercase">
                            Option 3
                          </span>
                          {brandForm.hero3DStyle === '3' && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <h3 className="text-sm font-black text-cyan-200">Cyber 3D Crystal Core</h3>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Futuristic facet gemstone prism, quantum laser matrix backdrop, and rotating cyber gyroscopic orbitals.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-cyan-300">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Futuristic Quantum Matrix</span>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs md:text-sm text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: currentTheme.secondary }}
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Save All Branding & Color Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: DATA CENTER (PROGRAMS & CATEGORIES MASTER) */}
          {activeTab === 'datacenter' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Database className="w-6 h-6 text-emerald-400" />
                    <span>Data Center (Program & Category Master)</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Central repository of all festival competition programs, categories, codes, and participation types.
                  </p>
                </div>
              </div>

              {/* Stats Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Total Programs</span>
                  <span className="text-2xl font-black text-white">{programs.length}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Categories</span>
                  <span className="text-2xl font-black text-emerald-400">{categories.length}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Individual</span>
                  <span className="text-2xl font-black text-amber-400">
                    {programs.filter((p) => p.type === 'Individual').length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Group Items</span>
                  <span className="text-2xl font-black text-sky-400">
                    {programs.filter((p) => p.type === 'Group').length}
                  </span>
                </div>
              </div>

              {/* Section 0: Candidate Program Participation Limits (Stage vs Non Stage) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-black/60 to-amber-950/40 border border-white/20 shadow-2xl space-y-4 transition-all">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center text-black font-black text-base shadow-md">
                      {isEditingLimits ? <Sparkles className="w-5 h-5 text-black" /> : <Lock className="w-5 h-5 text-black" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white leading-tight">
                          Participant Program Limit Rules (Stage & Non-Stage)
                        </h3>
                        {!isEditingLimits && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Active & Protected</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/60">
                        {isEditingLimits
                          ? 'Modify candidate limits. After saving, changes are locked to prevent accidental clicks.'
                          : 'Candidate quota limits are currently locked and enforced across the entire festival system.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-black text-white flex items-center gap-2 shrink-0">
                      <span>Total Limit:</span>
                      <span className="text-amber-400 font-mono text-sm">
                        {(isEditingLimits ? settingMaxStage + settingMaxNonStage : (registrationSettings.maxStagePerCandidate ?? 4) + (registrationSettings.maxNonStagePerCandidate ?? 4))} Programs
                      </span>
                    </div>

                    {!isEditingLimits && (
                      <button
                        type="button"
                        onClick={() => {
                          setSettingMaxStage(registrationSettings.maxStagePerCandidate ?? 4);
                          setSettingMaxNonStage(registrationSettings.maxNonStagePerCandidate ?? 4);
                          setIsEditingLimits(true);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Limit Rules</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content: Locked Summary Mode vs Active Editing Mode */}
                {!isEditingLimits ? (
                  /* LOCKED SUMMARY VIEW */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-purple-300 block">Stage Limit</span>
                          <span className="text-sm font-black text-white">
                            {registrationSettings.maxStagePerCandidate ?? 4} Programs Max
                          </span>
                        </div>
                      </div>
                      <span className="text-xl font-black font-mono text-purple-400">
                        {registrationSettings.maxStagePerCandidate ?? 4}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <PenTool className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-300 block">Non-Stage Limit</span>
                          <span className="text-sm font-black text-white">
                            {registrationSettings.maxNonStagePerCandidate ?? 4} Programs Max
                          </span>
                        </div>
                      </div>
                      <span className="text-xl font-black font-mono text-amber-400">
                        {registrationSettings.maxNonStagePerCandidate ?? 4}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/50 block">Combined Total</span>
                          <span className="text-sm font-black text-white">
                            {(registrationSettings.maxStagePerCandidate ?? 4) + (registrationSettings.maxNonStagePerCandidate ?? 4)} Individual Programs
                          </span>
                        </div>
                      </div>
                      <span className="text-xl font-black font-mono text-emerald-400">
                        {(registrationSettings.maxStagePerCandidate ?? 4) + (registrationSettings.maxNonStagePerCandidate ?? 4)}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* EDITING MODE */
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Max Stage Programs */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5" />
                            <span>Max Stage Programs per Candidate</span>
                          </label>
                          <span className="text-lg font-black text-purple-400 font-mono">{settingMaxStage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSettingMaxStage(Math.max(1, settingMaxStage - 1))}
                            className="w-9 h-9 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-black text-base flex items-center justify-center transition-all"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={settingMaxStage}
                            onChange={(e) => setSettingMaxStage(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="flex-1 bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 text-center text-white font-mono font-black text-base focus:border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => setSettingMaxStage(settingMaxStage + 1)}
                            className="w-9 h-9 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-black text-base flex items-center justify-center transition-all"
                          >
                            +
                          </button>
                        </div>
                        {/* Quick Presets */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-white/40 uppercase font-bold">Quick Presets:</span>
                          {[2, 3, 4, 5, 6, 8].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSettingMaxStage(num)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                settingMaxStage === num
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Max Non-Stage Programs */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Max Non-Stage Programs per Candidate</span>
                          </label>
                          <span className="text-lg font-black text-amber-400 font-mono">{settingMaxNonStage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSettingMaxNonStage(Math.max(1, settingMaxNonStage - 1))}
                            className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 font-black text-base flex items-center justify-center transition-all"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={settingMaxNonStage}
                            onChange={(e) => setSettingMaxNonStage(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="flex-1 bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-center text-white font-mono font-black text-base focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => setSettingMaxNonStage(settingMaxNonStage + 1)}
                            className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 font-black text-base flex items-center justify-center transition-all"
                          >
                            +
                          </button>
                        </div>
                        {/* Quick Presets */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-white/40 uppercase font-bold">Quick Presets:</span>
                          {[2, 3, 4, 5, 6, 8].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSettingMaxNonStage(num)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                settingMaxNonStage === num
                                  ? 'bg-amber-600 text-white shadow-md'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <span className="text-xs text-white/70">
                        Every candidate will be limited to <strong>{settingMaxStage} Stage</strong> + <strong>{settingMaxNonStage} Non-Stage</strong> (Max <strong>{settingMaxStage + settingMaxNonStage} Total</strong>).
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSettingMaxStage(registrationSettings.maxStagePerCandidate ?? 4);
                            setSettingMaxNonStage(registrationSettings.maxNonStagePerCandidate ?? 4);
                            setIsEditingLimits(false);
                          }}
                          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateRegistrationSettings({
                              maxStagePerCandidate: settingMaxStage,
                              maxNonStagePerCandidate: settingMaxNonStage,
                            });
                            setIsEditingLimits(false);
                            notify(`Saved & Locked: ${settingMaxStage} Stage + ${settingMaxNonStage} Non-Stage = ${settingMaxStage + settingMaxNonStage} Total Max Limit!`);
                          }}
                          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-amber-500 text-black font-black uppercase text-xs tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                        >
                          Save & Lock Rules
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 1: Add New Program Form */}
              <form
                onSubmit={handleAddProgram}
                className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Register New Program in Data Center</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase tracking-wider">Stage Type</label>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 border border-white/15 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewProgStageType('Stage')}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                          newProgStageType === 'Stage'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <span>Stage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProgStageType('Non Stage')}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                          newProgStageType === 'Non Stage'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <span>Non-Stage</span>
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-white/60 mb-1">Program / Competition Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. English Elocution, Mappila Song, Quiz, Essay Writing..."
                      value={newProgName}
                      onChange={(e) => setNewProgName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 mb-1">Category</label>
                    <select
                      value={newProgCategory}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setNewProgCategory(cat);
                        if (cat === 'General') {
                          setNewProgType('Group');
                        }
                      }}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Program Type & Quota Limit Settings Block */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[10px] uppercase font-bold text-white/60">Program Type:</span>
                      {newProgCategory !== 'General' ? (
                        <>
                          <label className="flex items-center gap-1.5 cursor-pointer text-white">
                            <input
                              type="radio"
                              name="progType"
                              checked={newProgType === 'Individual'}
                              onChange={() => setNewProgType('Individual')}
                              className="text-emerald-500"
                            />
                            <span>Individual</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-white">
                            <input
                              type="radio"
                              name="progType"
                              checked={newProgType === 'Group'}
                              onChange={() => setNewProgType('Group')}
                              className="text-emerald-500"
                            />
                            <span>Group</span>
                          </label>
                        </>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px] uppercase">
                          Group (General Category)
                        </span>
                      )}
                    </div>

                    {/* Whole-Team / No members flag */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="checkbox"
                        checked={newProgNoMembersRequired}
                        onChange={(e) => setNewProgNoMembersRequired(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-emerald-500"
                      />
                      <span className="text-[11px] font-bold text-emerald-300">
                        Whole-Team (No member chest numbers needed / e.g. Magazine)
                      </span>
                    </label>
                  </div>

                  {/* Quota & Limit Configuration */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {(newProgType === 'Individual' && newProgCategory !== 'General' && !newProgNoMembersRequired) ? (
                      <div>
                        <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                          Max Entries per Team:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={newProgMaxEntries}
                          onChange={(e) => setNewProgMaxEntries(parseInt(e.target.value, 10) || 1)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold"
                          placeholder="e.g. 1 or 2"
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                            Sets per Team:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={newProgGroupSets}
                            onChange={(e) => setNewProgGroupSets(parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold"
                            placeholder="e.g. 1"
                          />
                        </div>

                        {!newProgNoMembersRequired && (
                          <div>
                            <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                              Participants per Set:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={newProgParticipantsPerSet}
                              onChange={(e) => setNewProgParticipantsPerSet(parseInt(e.target.value, 10) || 1)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-white font-bold"
                              placeholder="e.g. 4"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    + Save Program & Limits to Data Center
                  </button>
                </div>
              </form>

              {/* Section 2: Category Management (Add & Delete) */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4">
                <form
                  onSubmit={handleAddCategory}
                  className="flex flex-col sm:flex-row items-center gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-white font-bold shrink-0">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Add New Category:</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sub Junior, Primary, Open Contest..."
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-black uppercase text-xs tracking-wider shrink-0 shadow-lg hover:scale-105 transition-all"
                  >
                    + Add Category
                  </button>
                </form>

                {/* Active Categories with 1-click Delete Badges */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider shrink-0">
                    Active Categories ({categories.length}):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white group hover:border-rose-400/50 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete category "${cat}"?`)) {
                              deleteCategory(cat);
                              notify(`Deleted category "${cat}"`);
                            }
                          }}
                          className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[10px] ml-1 transition-all"
                          title={`Delete ${cat}`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Programs Search & Filter */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search program by name..."
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  {/* Stage Type Filter Pills */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setProgStageFilter('All')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        progStageFilter === 'All' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      type="button"
                      onClick={() => setProgStageFilter('Stage')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        progStageFilter === 'Stage' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Stage
                    </button>
                    <button
                      type="button"
                      onClick={() => setProgStageFilter('Non Stage')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        progStageFilter === 'Non Stage' ? 'bg-amber-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Non-Stage
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-white/50 uppercase shrink-0">Category:</span>
                  <select
                    value={progCatFilter}
                    onChange={(e) => setProgCatFilter(e.target.value)}
                    className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="All">All Categories ({programs.length})</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 4: Master Programs Table with Inline Edit, Limits & Delete */}
              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {filteredPrograms.map((p) => {
                  const pLimit = getProgramLimit(p.id) || {
                    programId: p.id,
                    programCode: p.code || p.id,
                    programName: p.name,
                    category: p.category,
                    type: p.type,
                    stageType: p.stageType || 'Stage',
                    maxEntriesPerTeam: 1,
                    groupSetsPerTeam: 1,
                    participantsPerSet: p.type === 'Group' ? (p.category === 'General' ? 6 : 4) : 1,
                    noMembersRequired: false,
                  };

                  const stageTypeVal = p.stageType || pLimit.stageType || 'Stage';

                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-all hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Interactive Stage Type Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextStage = stageTypeVal === 'Stage' ? 'Non Stage' : 'Stage';
                            updateProgram(p.id, { stageType: nextStage });
                            updateProgramLimit(p.id, { stageType: nextStage });
                            notify(`Updated "${p.name}" to ${nextStage === 'Stage' ? 'Stage' : 'Non-Stage'}`);
                          }}
                          title="Click to toggle between Stage and Non-Stage"
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all hover:scale-105 shrink-0 flex items-center gap-1.5 ${
                            stageTypeVal === 'Stage'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {stageTypeVal === 'Stage' ? 'Stage' : 'Non-Stage'}
                        </button>



                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => updateProgram(p.id, { name: e.target.value })}
                            className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-emerald-400 text-sm font-extrabold text-white focus:outline-none transition-colors"
                            title="Click to edit program name"
                          />
                        </div>
                      </div>

                      {/* Category, Type & Quota / Limits Controls */}
                      <div className="flex items-center gap-2.5 text-xs flex-wrap shrink-0">
                        {/* Inline Category Selector */}
                        <select
                          value={p.category}
                          onChange={(e) => updateProgram(p.id, { category: e.target.value })}
                          className="bg-black/40 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white/80 font-medium"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            p.type === 'Individual'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                          }`}
                        >
                          {p.type}
                        </span>

                        {/* Inline Quota / Limit editor badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                          {p.type === 'Individual' && !pLimit.noMembersRequired ? (
                            <div className="flex items-center gap-1">
                              <span className="text-white/50 text-[10px]">Quota:</span>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={pLimit.maxEntriesPerTeam ?? 1}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value, 10);
                                  updateProgramLimit(p.id, { maxEntriesPerTeam: isNaN(v) ? 1 : v });
                                }}
                                className="w-10 bg-black/50 border border-white/15 rounded px-1 text-center text-emerald-400 font-bold"
                                title="Max Entries per Team"
                              />
                              <span className="text-white/50 text-[10px]">/team</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-white/50 text-[10px]">Sets:</span>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={pLimit.groupSetsPerTeam ?? 1}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value, 10);
                                  updateProgramLimit(p.id, { groupSetsPerTeam: isNaN(v) ? 1 : v });
                                }}
                                className="w-10 bg-black/50 border border-white/15 rounded px-1 text-center text-sky-400 font-bold"
                                title="Group Sets per Team"
                              />
                              {!pLimit.noMembersRequired && (
                                <>
                                  <span className="text-white/50 text-[10px]">Mem:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={pLimit.participantsPerSet ?? 4}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      updateProgramLimit(p.id, { participantsPerSet: isNaN(v) ? 1 : v });
                                    }}
                                    className="w-10 bg-black/50 border border-white/15 rounded px-1 text-center text-amber-300 font-bold"
                                    title="Members per Set"
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(`Delete program "${p.name}" from Data Center?`)) {
                              deleteProgram(p.id);
                              notify(`Deleted program "${p.name}"`);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors ml-1"
                          title="Delete Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: PROGRAM ENTRY DESK */}
          {activeTab === 'entries' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header with Master Entrance Lock Toggle */}
              <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <UserCheck className="w-6 h-6 text-emerald-400" />
                    <span>Program Entry Desk & Team Management</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Configure program limits, manage team login credentials & links, bulk import Excel entries, and lock entrance.
                  </p>
                </div>

                {/* Master Entrance Lock / Unlock Switch */}
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                      registrationSettings.isLocked
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {registrationSettings.isLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                    <span>Status: {registrationSettings.isLocked ? 'LOCKED / CLOSED' : 'OPEN FOR ENTRIES'}</span>
                  </div>

                  <button
                    onClick={() => {
                      const newLock = !registrationSettings.isLocked;
                      toggleEntranceLock(newLock);
                      notify(newLock ? 'Entrance LOCKED. Team portals are now closed.' : 'Entrance OPENED. Teams can now submit registrations.');
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 ${
                      registrationSettings.isLocked
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                        : 'bg-rose-500 hover:bg-rose-400 text-white'
                    }`}
                  >
                    {registrationSettings.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{registrationSettings.isLocked ? 'Open Entrance' : 'Lock Entrance'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs font-bold">
                {[
                  { id: 'links', label: 'Team Portals & Links', icon: Users },
                  { id: 'manual', label: 'Quick Single Entry', icon: Plus },
                  { id: 'excel', label: 'Excel Bulk Import', icon: FileSpreadsheet },
                ].map((sub) => {
                  const Icon = sub.icon;
                  const isCur = entryFormTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setEntryFormTab(sub.id as any)}
                      className={`whitespace-nowrap px-4 py-2 rounded-2xl transition-all flex items-center gap-2 ${
                        isCur
                          ? 'bg-emerald-500 text-black font-black shadow-lg'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUBTAB 1: TEAM PORTALS & PUBLIC LINKS */}
              {entryFormTab === 'links' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-white block">Dedicated Team Registration Links & Credentials</span>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Share these links with each team manager. Each team can log in using their credentials to register their participants within the allowed limits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamAccounts.map((teamAcc) => {
                      const portalUrl = typeof window !== 'undefined'
                        ? `${window.location.origin}/team-entry?team=${encodeURIComponent(teamAcc.teamName)}`
                        : `/team-entry?team=${encodeURIComponent(teamAcc.teamName)}`;
                      const entriesCount = programEntries.filter((e) => e.team === teamAcc.teamName).length;

                      return (
                        <div
                          key={teamAcc.id}
                          className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/15 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-md"
                                style={{ backgroundColor: currentTheme.primary }}
                              >
                                {teamAcc.teamName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-base font-black text-white">{teamAcc.teamName}</h3>
                                <span className="text-[11px] text-emerald-400 font-bold">
                                  {entriesCount} Registered Submissions
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/team-entry?team=${encodeURIComponent(teamAcc.teamName)}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Portal</span>
                            </Link>
                          </div>

                          {/* Credentials Grid */}
                          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-white/50 font-bold mb-1">Username</label>
                              <input
                                type="text"
                                value={teamAcc.username}
                                onChange={(e) => updateTeamAccount(teamAcc.id, { username: e.target.value })}
                                className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/50 font-bold mb-1">Access Password</label>
                              <input
                                type="text"
                                value={teamAcc.password}
                                onChange={(e) => updateTeamAccount(teamAcc.id, { password: e.target.value })}
                                className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold text-xs"
                              />
                            </div>
                          </div>

                          {/* Public Link Copy Area */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] text-white/50 font-bold uppercase tracking-wider">
                              Public Registration Link
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={portalUrl}
                                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white/80 font-mono"
                              />
                              <button
                                onClick={() => {
                                  if (navigator.clipboard) {
                                    navigator.clipboard.writeText(portalUrl);
                                    notify(`Copied public link for ${teamAcc.teamName}!`);
                                  }
                                }}
                                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                                title="Copy Link"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: MANUAL QUICK ENTRY DESK */}
              {entryFormTab === 'manual' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!selectedEntryProgramId) {
                      alert('Please select a program from Data Center.');
                      return;
                    }
                    const prog = programs.find((p) => p.id === selectedEntryProgramId);
                    if (!prog) return;

                    const progLimit = getProgramLimit(prog.id);

                    // Check if team already reached quota
                    const existingTeamEntries = programEntries.filter(
                      (pe) =>
                        (pe.programId === prog.id ||
                          pe.programCode.toLowerCase() === (prog.code || '').toLowerCase() ||
                          pe.programName.toLowerCase() === prog.name.toLowerCase()) &&
                        pe.team.toLowerCase() === selectedEntryTeam.toLowerCase()
                    );
                    const maxAllowed = prog.type === 'Individual'
                      ? (progLimit?.maxEntriesPerTeam || 1)
                      : (progLimit?.groupSetsPerTeam || 1);

                    if (existingTeamEntries.length >= maxAllowed) {
                      alert(`Quota Limit Reached: ${selectedEntryTeam} has already submitted ${existingTeamEntries.length}/${maxAllowed} entries for "${prog.name}".`);
                      return;
                    }

                    // Team-Wide / No Members Required Submission
                    if (progLimit?.noMembersRequired) {
                      const res = addProgramEntry({
                        id: `entry-${Date.now()}`,
                        programId: prog.id,
                        programCode: prog.code,
                        programName: prog.name,
                        category: prog.category,
                        type: prog.type,
                        team: selectedEntryTeam,
                        participants: [
                          {
                            chestNo: '-',
                            name: `${selectedEntryTeam} Official Team Submission`,
                            team: selectedEntryTeam,
                            category: prog.category,
                          },
                        ],
                        registeredAt: new Date().toLocaleString(),
                      });
                      if (res.success) {
                        notify(res.message);
                      } else {
                        alert(res.message);
                      }
                      return;
                    }

                    if (prog.type === 'Individual') {
                      // Filter valid filled candidate slots
                      const validSlots = entryIndividualSlots.filter((s) => s.chestNo.trim() || s.name.trim());
                      if (validSlots.length === 0) {
                        alert('Please enter at least 1 candidate chest number.');
                        return;
                      }

                      // Check if adding validSlots exceeds quota
                      const remainingSlots = maxAllowed - existingTeamEntries.length;
                      if (validSlots.length > remainingSlots) {
                        alert(`Quota Limit Exceeded: You can only add up to ${remainingSlots} more candidate(s) for ${selectedEntryTeam}.`);
                        return;
                      }

                      // Add all valid slots atomically
                      const newEntries: ProgramEntry[] = validSlots.map((slot, idx) => ({
                        id: `entry-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
                        programId: prog.id,
                        programCode: prog.code,
                        programName: prog.name,
                        category: prog.category,
                        type: 'Individual',
                        team: selectedEntryTeam,
                        participants: [
                          {
                            chestNo: slot.chestNo.trim(),
                            name: slot.name.trim() || `Candidate #${slot.chestNo.trim()}`,
                            team: selectedEntryTeam,
                            category: prog.category,
                          },
                        ],
                        registeredAt: new Date().toLocaleString(),
                      }));

                      const res = addProgramEntriesBulk(newEntries);
                      if (res.success) {
                        notify(res.message);
                        // Reset slots
                        const remaining = Math.max(1, remainingSlots - newEntries.length);
                        setEntryIndividualSlots(Array.from({ length: remaining }, () => ({ chestNo: '', name: '' })));
                      } else {
                        alert(res.message);
                      }
                    } else {
                      // Group entry
                      const validMembers = entryGroupMembers.filter((m) => m.chestNo.trim() || m.name.trim());
                      if (validMembers.length === 0) {
                        alert('Please enter at least 1 member for the group set.');
                        return;
                      }
                      const res = addProgramEntry({
                        id: `entry-${Date.now()}`,
                        programId: prog.id,
                        programCode: prog.code,
                        programName: prog.name,
                        category: prog.category,
                        type: 'Group',
                        team: selectedEntryTeam,
                        setNumber: entryGroupSetNum,
                        participants: validMembers.map((m) => ({
                          chestNo: m.chestNo.trim(),
                          name: m.name.trim() || `Candidate #${m.chestNo.trim()}`,
                          team: selectedEntryTeam,
                          category: prog.category,
                        })),
                        registeredAt: new Date().toLocaleString(),
                      });
                      if (res.success) {
                        notify(res.message);
                      } else {
                        alert(res.message);
                      }
                    }
                  }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-4 text-xs"
                >
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Manual Quick Entry Registration</span>
                    </div>
                    <span className="text-[11px] text-white/50 font-normal">
                      Options dynamically adapt to Program Quota Limits
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/60 mb-1 font-bold">Select Program (from Data Center)</label>
                      <select
                        required
                        value={selectedEntryProgramId}
                        onChange={(e) => {
                          const pId = e.target.value;
                          setSelectedEntryProgramId(pId);
                          const prog = programs.find((p) => p.id === pId);
                          if (prog) {
                            const limit = getProgramLimit(prog.id);
                            const existingForTeam = programEntries.filter(
                              (pe) =>
                                (pe.programId === prog.id ||
                                  pe.programCode.toLowerCase() === (prog.code || '').toLowerCase() ||
                                  pe.programName.toLowerCase() === prog.name.toLowerCase()) &&
                                pe.team.toLowerCase() === selectedEntryTeam.toLowerCase()
                            );
                            if (prog.type === 'Individual' && !limit?.noMembersRequired) {
                              const quotaCount = limit?.maxEntriesPerTeam || 1;
                              const remainingCount = Math.max(1, quotaCount - existingForTeam.length);
                              setEntryIndividualSlots(Array.from({ length: remainingCount }, () => ({ chestNo: '', name: '' })));
                            } else if (prog.type === 'Group' && !limit?.noMembersRequired) {
                              const count = limit?.participantsPerSet || (prog.category === 'General' ? 6 : 4);
                              setEntryGroupMembers(Array.from({ length: count }, () => ({ chestNo: '', name: '' })));
                            }
                          }
                        }}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        <option value="">-- Choose Data Center Program --</option>
                        {programs
                          .filter((p) => {
                            const lim = getProgramLimit(p.id);
                            const existingForTeam = programEntries.filter(
                              (pe) =>
                                (pe.programId === p.id ||
                                 pe.programCode.toLowerCase() === p.code.toLowerCase() ||
                                 pe.programName.toLowerCase() === p.name.toLowerCase()) &&
                                pe.team.toLowerCase() === selectedEntryTeam.toLowerCase()
                            );
                            const maxAllowed = p.type === 'Individual' ? (lim?.maxEntriesPerTeam || 1) : (lim?.groupSetsPerTeam || 1);
                            return existingForTeam.length < maxAllowed;
                          })
                          .map((p) => {
                            const lim = getProgramLimit(p.id);
                            const existingForTeam = programEntries.filter(
                              (pe) =>
                                (pe.programId === p.id ||
                                 pe.programCode.toLowerCase() === p.code.toLowerCase() ||
                                 pe.programName.toLowerCase() === p.name.toLowerCase()) &&
                                pe.team.toLowerCase() === selectedEntryTeam.toLowerCase()
                            );
                            const maxAllowed = p.type === 'Individual' ? (lim?.maxEntriesPerTeam || 1) : (lim?.groupSetsPerTeam || 1);

                            return (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.category} • {(p.stageType || lim?.stageType || 'Stage') === 'Stage' ? 'Stage' : 'Non-Stage'} • {p.type}) [Slots Left: {maxAllowed - existingForTeam.length}/{maxAllowed}]
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/60 mb-1 font-bold">Select Participating Team</label>
                      <select
                        value={selectedEntryTeam}
                        onChange={(e) => {
                          const tName = e.target.value;
                          setSelectedEntryTeam(tName);
                        }}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        {standings.map((t) => (
                          <option key={t.id || t.name} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Candidate Inputs based on settled Quota Limit */}
                  {selectedEntryProgramId && (() => {
                    const currentProg = programs.find((p) => p.id === selectedEntryProgramId);
                    if (!currentProg) return null;
                    const progLimit = getProgramLimit(currentProg.id);
                    const teamExistingEntries = programEntries.filter(
                      (pe) =>
                        (pe.programId === currentProg.id ||
                          pe.programCode.toLowerCase() === (currentProg.code || '').toLowerCase() ||
                          pe.programName.toLowerCase() === currentProg.name.toLowerCase()) &&
                        pe.team.toLowerCase() === selectedEntryTeam.toLowerCase()
                    );
                    const maxAllowed = currentProg.type === 'Individual'
                      ? (progLimit?.maxEntriesPerTeam || 1)
                      : (progLimit?.groupSetsPerTeam || 1);
                    const isLimitReached = teamExistingEntries.length >= maxAllowed;

                    return (
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                        {/* Datalist for candidate search with stage/non-stage count */}
                        <datalist id="admin-entry-chest-list">
                          {participants
                            .filter((p) => !p.team || p.team === selectedEntryTeam)
                            .map((p) => {
                              const stats = getParticipantEventStats(p.chestNo);
                              return (
                                <option key={p.chestNo} value={p.chestNo}>
                                  #{p.chestNo} • {p.name} ({p.category} • Stage: {stats.stageCount}/{stats.maxStage} | Non-Stage: {stats.nonStageCount}/{stats.maxNonStage})
                                </option>
                              );
                            })}
                        </datalist>

                        {/* Quota limit reached banner */}
                        {isLimitReached ? (
                          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 space-y-1">
                            <span className="font-black text-xs block flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                              <span>Quota Limit Reached for {selectedEntryTeam}</span>
                            </span>
                            <p className="text-[11px] text-white/70">
                              {selectedEntryTeam} has already filled all <strong>{maxAllowed}/{maxAllowed}</strong> allowed slots for "{currentProg.name}". To register different candidates, remove an existing entry from the database below.
                            </p>
                          </div>
                        ) : progLimit?.noMembersRequired ? (
                          /* Whole Team / No Members Required Notice */
                          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                            <span className="font-black text-xs block flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>Whole-Team / All-Members Event (e.g. Magazine / Team Submission)</span>
                            </span>
                            <p className="text-[11px] text-white/70">
                              No chest numbers or individual member names are required for this program. Clicking the submit button will register <strong>{selectedEntryTeam}</strong> directly.
                            </p>
                          </div>
                        ) : currentProg.type === 'Individual' ? (
                          /* Individual Slots generated according to Quota Limit */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-400 block uppercase tracking-wider">
                                Individual Candidate Slots (Quota Limit: {maxAllowed} Candidates per Team)
                              </span>
                              <span className="text-[11px] text-white/50">
                                {teamExistingEntries.length > 0 ? `${teamExistingEntries.length} already registered` : 'Fill candidate details below'}
                              </span>
                            </div>

                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                              {entryIndividualSlots.map((slot, slotIdx) => {
                                const pStats = slot.chestNo.trim() ? getParticipantEventStats(slot.chestNo) : null;
                                const progStage = currentProg.stageType || 'Stage';
                                const maxStg = pStats?.maxStage ?? 4;
                                const maxNonStg = pStats?.maxNonStage ?? 4;
                                const maxTot = pStats?.maxTotal ?? 8;
                                const isStageMax = progStage === 'Stage' && pStats && pStats.stageCount >= maxStg;
                                const isNonStageMax = progStage === 'Non Stage' && pStats && pStats.nonStageCount >= maxNonStg;
                                const isTotalMax = pStats && pStats.totalCount >= maxTot;

                                return (
                                  <div key={slotIdx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                      <div className="sm:col-span-2">
                                        <label className="block text-[9px] text-white/50 mb-0.5 font-bold uppercase">
                                          Candidate {slotIdx + 1} Chest No
                                        </label>
                                        <input
                                          type="text"
                                          list="admin-entry-chest-list"
                                          placeholder={`# Chest No (Slot ${slotIdx + 1})`}
                                          value={slot.chestNo}
                                          onChange={(e) => {
                                             const val = e.target.value;
                                             const updated = [...entryIndividualSlots];
                                             const found = participants.find((p) => String(p.chestNo).trim() === val.trim());
                                             updated[slotIdx] = { chestNo: val, name: found ? found.name : updated[slotIdx].name };
                                             setEntryIndividualSlots(updated);
                                          }}
                                          className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-xs"
                                        />
                                      </div>
                                      <div className="sm:col-span-3">
                                        <label className="block text-[9px] text-white/50 mb-0.5 font-bold uppercase">
                                          Candidate {slotIdx + 1} Full Name
                                        </label>
                                        <input
                                          type="text"
                                          placeholder={`Candidate ${slotIdx + 1} Name`}
                                          value={slot.name}
                                          onChange={(e) => {
                                            const updated = [...entryIndividualSlots];
                                            updated[slotIdx].name = e.target.value;
                                            setEntryIndividualSlots(updated);
                                          }}
                                          className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-white text-xs font-semibold"
                                        />
                                      </div>
                                    </div>

                                    {/* Real-time Participant Limit Status */}
                                    {pStats && (
                                      <div className="pt-1 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                                        {isStageMax ? (
                                          <span className="text-rose-400 font-bold flex items-center gap-1">
                                            Stage Limit Reached ({pStats.stageCount}/{maxStg} Stage programs filled: {pStats.stagePrograms.join(', ')})
                                          </span>
                                        ) : isNonStageMax ? (
                                          <span className="text-rose-400 font-bold flex items-center gap-1">
                                            Non-Stage Limit Reached ({pStats.nonStageCount}/{maxNonStg} Non-Stage programs filled: {pStats.nonStagePrograms.join(', ')})
                                          </span>
                                        ) : isTotalMax ? (
                                          <span className="text-rose-400 font-bold flex items-center gap-1">
                                            Total Limit Reached ({pStats.totalCount}/{maxTot} programs filled)
                                          </span>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                                              Stage: {pStats.stageCount}/{maxStg}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                                              Non-Stage: {pStats.nonStageCount}/{maxNonStg}
                                            </span>
                                            <span className="text-white/40 text-[10px]">
                                              (Total: {pStats.totalCount}/{maxTot})
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          /* Group Form Mode */
                          <div className="space-y-3">
                            <span className="text-xs font-bold text-white block">
                              Group Set Members ({progLimit?.participantsPerSet || 4} Members required per Set):
                            </span>
                            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                              {entryGroupMembers.map((m, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                  <div className="sm:col-span-2">
                                    <input
                                      type="text"
                                      list="admin-entry-chest-list"
                                      placeholder={`# Chest No (Member ${idx + 1})`}
                                      value={m.chestNo}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const updated = [...entryGroupMembers];
                                        const found = participants.find((p) => String(p.chestNo).trim() === val.trim());
                                        updated[idx] = { chestNo: val, name: found ? found.name : updated[idx].name };
                                        setEntryGroupMembers(updated);
                                      }}
                                      className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <input
                                      type="text"
                                      placeholder={`Member ${idx + 1} Name`}
                                      value={m.name}
                                      onChange={(e) => {
                                        const updated = [...entryGroupMembers];
                                        updated[idx].name = e.target.value;
                                        setEntryGroupMembers(updated);
                                      }}
                                      className="w-full bg-black/60 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-white text-xs font-semibold"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={(() => {
                        if (!selectedEntryProgramId) return false;
                        const prog = programs.find((p) => p.id === selectedEntryProgramId);
                        if (!prog) return false;
                        const progLimit = getProgramLimit(prog.id);
                        const teamExistingEntries = programEntries.filter(
                          (pe) => (pe.programId === prog.id || pe.programCode === prog.code) && pe.team === selectedEntryTeam
                        );
                        const maxAllowed = prog.type === 'Individual' ? (progLimit?.maxEntriesPerTeam || 1) : (progLimit?.groupSetsPerTeam || 1);
                        return teamExistingEntries.length >= maxAllowed;
                      })()}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-black font-black uppercase tracking-wider text-xs shadow-lg transition-all"
                    >
                      + Submit Program Registration
                    </button>
                  </div>
                </form>
              )}

              {/* SUBTAB 4: EXCEL BULK IMPORTER */}
              {entryFormTab === 'excel' && (
                <div className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>Excel Batch Entry Importer</span>
                      </h3>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        Import program participant assignments in bulk using an Excel (.xlsx / .csv) spreadsheet.
                      </p>
                    </div>

                    {/* Download Sample Template */}
                    <button
                      type="button"
                      onClick={() => {
                        const team1 = standings[0]?.name || 'DAHFATAHAN';
                        const team2 = standings[1]?.name || 'BADFATHAN';
                        const sampleRows = [
                          {
                            Program_Code: programs[0]?.code || 'PRG-101',
                            Chest_No: '1042',
                            Team: team1,
                            Candidate_Name: 'Muhammad Farhan',
                            Set_Number: 1,
                          },
                          {
                            Program_Code: programs[1]?.code || 'PRG-102',
                            Chest_No: '2050',
                            Team: team2,
                            Candidate_Name: 'Ahmad Zayan',
                            Set_Number: 1,
                          },
                        ];

                        const ws = XLSX.utils.json_to_sheet(sampleRows);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Program_Entries');
                        XLSX.writeFile(wb, 'Program_Entries_Template.xlsx');
                        notify('Downloaded Program Entries Template!');
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Sample Excel Template</span>
                    </button>
                  </div>

                  {/* Upload Drop Area */}
                  <label className="border-2 border-dashed border-white/20 hover:border-emerald-400/60 rounded-3xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white">Click or Drag & Drop Excel File (.xlsx, .csv)</span>
                    <span className="text-[10px] text-white/40">Columns: Program_Code, Chest_No, Team, Candidate_Name, Set_Number</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          try {
                            const bstr = evt.target?.result;
                            const wb = XLSX.read(bstr, { type: 'binary' });
                            const wsname = wb.SheetNames[0];
                            const ws = wb.Sheets[wsname];
                            const data: any[] = XLSX.utils.sheet_to_json(ws);

                            if (!data || data.length === 0) {
                              alert('Excel file is empty!');
                              return;
                            }

                            const fallbackTeam = standings[0]?.name || 'DAHFATAHAN';
                            const importedList: ProgramEntry[] = [];
                            data.forEach((row, i) => {
                              const pCode = String(row.Program_Code || row.Code || row.program_code || '').trim();
                              const cNo = String(row.Chest_No || row.Chest || row.chest_no || '').trim();
                              const tName = String(row.Team || row.team || fallbackTeam).trim();
                              const cName = String(row.Candidate_Name || row.Name || row.name || `Candidate #${cNo}`).trim();
                              const sNum = Number(row.Set_Number || row.Set || 1);

                              if (!pCode || !cNo) return;

                              const progMatch = programs.find((p) => p.code.toLowerCase() === pCode.toLowerCase());

                              importedList.push({
                                id: `entry-excel-${Date.now()}-${i}`,
                                programId: progMatch ? progMatch.id : `p-${pCode}`,
                                programCode: pCode,
                                programName: progMatch ? progMatch.name : `Program ${pCode}`,
                                category: progMatch ? progMatch.category : 'General',
                                type: progMatch ? progMatch.type : 'Individual',
                                team: tName,
                                setNumber: sNum,
                                participants: [
                                  {
                                    chestNo: cNo,
                                    name: cName,
                                    team: tName,
                                    category: progMatch ? progMatch.category : 'General',
                                  },
                                ],
                                registeredAt: new Date().toLocaleString(),
                              });
                            });

                            if (importedList.length > 0) {
                              importProgramEntriesBulk(importedList);
                              notify(`Successfully imported ${importedList.length} program entries!`);
                            } else {
                              alert('No valid program entry rows found. Check column headers.');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Error reading Excel file.');
                          }
                        };
                        reader.readAsBinaryString(file);
                      }}
                    />
                  </label>
                </div>
              )}

              {/* MASTER REGISTERED PROGRAM ENTRIES TABLE - UNIFIED TILES BY PROGRAM */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Master Registration Database ({programEntries.length} Submissions Across Programs)
                    </h3>
                    <p className="text-[11px] text-white/50">
                      Unified by Program Name showing all Team submissions together in single clean tiles.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search entries..."
                        value={entrySearchQuery}
                        onChange={(e) => setEntrySearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      />
                    </div>

                    <select
                      value={entryTeamFilter}
                      onChange={(e) => setEntryTeamFilter(e.target.value)}
                      className="bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="All">All Teams</option>
                      {standings.map((t) => (
                        <option key={t.id || t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={entryCatFilter}
                      onChange={(e) => setEntryCatFilter(e.target.value)}
                      className="bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {programEntries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete all ${programEntries.length} program entry submission(s)? This cannot be undone.`)) {
                            programEntries.forEach((e) => deleteProgramEntry(e.id));
                            notify('All program entries deleted.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                        title="Clear all registrations"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All Entries</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Unified Program Entry Tiles */}
                {(() => {
                  // Group entries by program
                  const groupedPrograms: { [progName: string]: ProgramEntry[] } = {};
                  programEntries.forEach((entry) => {
                    const key = entry.programName;
                    if (!groupedPrograms[key]) groupedPrograms[key] = [];
                    groupedPrograms[key].push(entry);
                  });

                  const filteredGroupKeys = Object.keys(groupedPrograms).filter((progName) => {
                    const entries = groupedPrograms[progName];
                    const matchesSearch =
                      progName.toLowerCase().includes(entrySearchQuery.toLowerCase()) ||
                      entries.some((e) =>
                        e.programCode.toLowerCase().includes(entrySearchQuery.toLowerCase()) ||
                        e.participants.some((p) => p.name.toLowerCase().includes(entrySearchQuery.toLowerCase()) || p.chestNo.includes(entrySearchQuery))
                      );
                    const matchesTeam = entryTeamFilter === 'All' || entries.some((e) => e.team === entryTeamFilter);
                    const matchesCat = entryCatFilter === 'All' || entries.some((e) => e.category === entryCatFilter);
                    return matchesSearch && matchesTeam && matchesCat;
                  });

                  return (
                    <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                      {filteredGroupKeys.length > 0 ? (
                        filteredGroupKeys.map((progName) => {
                          const entriesForProg = groupedPrograms[progName];
                          const firstEntry = entriesForProg[0];
                          const progLimit = getProgramLimit(firstEntry.programId);

                          return (
                            <div
                              key={progName}
                              className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3 transition-all hover:bg-white/[0.08]"
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-white/10">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="text-base font-black text-white">{progName}</h4>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                                      (firstEntry.stageType || progLimit?.stageType || 'Stage') === 'Stage'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    }`}
                                  >
                                    {(firstEntry.stageType || progLimit?.stageType || 'Stage') === 'Stage' ? 'Stage' : 'Non-Stage'}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#291705] text-[#f59e0b] text-[10px] font-black uppercase">
                                    {firstEntry.category}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white font-bold text-[10px] uppercase">
                                    {firstEntry.type}
                                  </span>
                                  {progLimit?.noMembersRequired && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                                      Whole Team
                                    </span>
                                  )}
                                </div>

                                <span className="text-xs text-white/50">
                                  {entriesForProg.length} Team Submission(s)
                                </span>
                              </div>

                              {/* Display all team entries inside this single tile */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {entriesForProg.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                                  >
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                                          {entry.team}
                                        </span>
                                        <span className="text-[10px] text-white/40">{entry.registeredAt}</span>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {entry.participants.map((p, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-1 font-mono"
                                          >
                                            <span className="text-emerald-400 font-bold">#{p.chestNo}</span>
                                            <span className="font-sans font-semibold text-white/90">{p.name}</span>
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete entry for ${entry.programName} (${entry.team})?`)) {
                                          deleteProgramEntry(entry.id);
                                          notify('Program entry deleted.');
                                        }
                                      }}
                                      className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors shrink-0"
                                      title="Delete Entry"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-10 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs">
                          No program entries match your filter criteria.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB: BULLETINS & NOTIFICATIONS MANAGER */}
          {activeTab === 'bulletins' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">Official Updates Desk</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      Live Broadcast Ready
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Issue circulars, attach festival by-law PDFs, and broadcast breaking alerts to public screens.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={preloadByLawsDocument}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preload By-Laws PDF</span>
                  </button>

                  <Link
                    href="/bulletin?mode=tv"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Arena TV Mode</span>
                  </Link>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/50 block font-bold uppercase">Total Bulletins</span>
                    <span className="text-xl font-black text-white">{notifications.length}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-rose-300/70 block font-bold uppercase">Urgent Alerts</span>
                    <span className="text-xl font-black text-rose-400">
                      {notifications.filter((n) => n.priority === 'Urgent').length}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-300">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-300/70 block font-bold uppercase">Pinned Notices</span>
                    <span className="text-xl font-black text-amber-400">
                      {notifications.filter((n) => n.isPinned).length}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                    <Pin className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-300/70 block font-bold uppercase">Official Circulars</span>
                    <span className="text-xl font-black text-purple-400">
                      {notifications.filter((n) => !!n.attachmentName).length}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Form to Publish New Bulletin */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBulletin.title.trim()) return;

                  const now = new Date();
                  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  addNotification({
                    id: `notif-${Date.now()}`,
                    title: newBulletin.title.trim(),
                    category: newBulletin.category,
                    priority: newBulletin.priority,
                    targetAudience: newBulletin.targetAudience.trim() || 'All Attendees',
                    date: dateStr,
                    time: timeStr,
                    summary: newBulletin.summary.trim() || newBulletin.title.trim(),
                    content: newBulletin.content.trim() ? newBulletin.content.trim().split('\n\n') : [newBulletin.summary || newBulletin.title],
                    attachmentName: newBulletin.attachmentName || undefined,
                    attachmentUrl: newBulletin.attachmentUrl || undefined,
                    attachmentSize: newBulletin.attachmentSize || undefined,
                    attachmentType: newBulletin.attachmentType || undefined,
                    isPinned: newBulletin.isPinned,
                    showOnLiveScreen: newBulletin.showOnLiveScreen,
                  });

                  setNewBulletin({
                    title: '',
                    category: 'Circular',
                    priority: 'High',
                    targetAudience: 'All Attendees & Teams',
                    summary: '',
                    content: '',
                    attachmentName: '',
                    attachmentUrl: '',
                    attachmentSize: '',
                    attachmentType: 'pdf',
                    isPinned: false,
                    showOnLiveScreen: true,
                  });

                  notify('Official Bulletin published successfully!');
                }}
                className="p-5 rounded-3xl bg-white/5 border border-white/15 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-emerald-400" />
                    <span>Publish Official Circular or By-Law</span>
                  </h3>
                  <span className="text-[10px] text-white/40">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                      Bulletin Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Festival By-Laws, Stage Rules & Guidelines 2026"
                      value={newBulletin.title}
                      onChange={(e) => setNewBulletin({ ...newBulletin, title: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                      Category
                    </label>
                    <select
                      value={newBulletin.category}
                      onChange={(e) => setNewBulletin({ ...newBulletin, category: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-semibold"
                    >
                      <option value="By-Laws & Regulations">By-Laws & Regulations</option>
                      <option value="Urgent Alert">Urgent Alert</option>
                      <option value="Circular">Circular</option>
                      <option value="Schedule Notice">Schedule Notice</option>
                      <option value="Result Bulletin">Result Bulletin</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                      Priority Level
                    </label>
                    <select
                      value={newBulletin.priority}
                      onChange={(e) => setNewBulletin({ ...newBulletin, priority: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-semibold"
                    >
                      <option value="Urgent">Urgent (Red Alert)</option>
                      <option value="High">High Priority</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-white/60 mb-1 font-bold uppercase">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. All Teams, Participants & General Public"
                      value={newBulletin.targetAudience}
                      onChange={(e) => setNewBulletin({ ...newBulletin, targetAudience: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-amber-300 mb-1 font-black uppercase tracking-wider">
                      Subtitle / Brief Overview (Shown on Card & Header)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mandatory guidelines for stage entries and scoring by-laws"
                      value={newBulletin.summary}
                      onChange={(e) => setNewBulletin({ ...newBulletin, summary: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block text-[10px] text-emerald-300 mb-1 font-black uppercase tracking-wider">
                      Detailed Explanation / Circular Body (Shown when user clicks &quot;Read More&quot;)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write full explanation, rules, guidelines, notes or detailed instructions..."
                      value={newBulletin.content}
                      onChange={(e) => setNewBulletin({ ...newBulletin, content: e.target.value })}
                      className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white resize-y min-h-[90px]"
                    />
                  </div>
                </div>

                {/* Pin Option */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newBulletin.isPinned}
                        onChange={(e) => setNewBulletin({ ...newBulletin, isPinned: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-black/50 border-white/20"
                      />
                      <span className="font-bold text-white text-xs flex items-center gap-1">
                        <Pin className="w-3.5 h-3.5 text-amber-400" /> Pin to Top / Breaking Alert
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider shadow-lg transition-all"
                  >
                    + Publish Official Bulletin
                  </button>
                </div>
              </form>

              {/* Published Bulletins Directory */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                  <span className="text-xs text-white/70 font-bold">
                    Official Published Bulletins & Circulars ({notifications.length})
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search bulletins..."
                        value={bulletinSearch}
                        onChange={(e) => setBulletinSearch(e.target.value)}
                        className="bg-black/40 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40"
                      />
                    </div>

                    <select
                      value={bulletinCatFilter}
                      onChange={(e) => setBulletinCatFilter(e.target.value)}
                      className="bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="All">All Categories</option>
                      <option value="By-Laws & Regulations">By-Laws & Regulations</option>
                      <option value="Urgent Alert">Urgent Alert</option>
                      <option value="Circular">Circular</option>
                      <option value="Schedule Notice">Schedule Notice</option>
                      <option value="Result Bulletin">Result Bulletin</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                {/* Bulletin List Items */}
                {(() => {
                  const filtered = notifications.filter((n) => {
                    const matchesSearch =
                      n.title.toLowerCase().includes(bulletinSearch.toLowerCase()) ||
                      n.summary.toLowerCase().includes(bulletinSearch.toLowerCase()) ||
                      n.targetAudience.toLowerCase().includes(bulletinSearch.toLowerCase());
                    const matchesCat = bulletinCatFilter === 'All' || n.category === bulletinCatFilter;
                    return matchesSearch && matchesCat;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs">
                        No bulletins found matching your filter.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {filtered.map((item) => {
                        const isUrgent = item.priority === 'Urgent';
                        const isHigh = item.priority === 'High';
                        const isPinned = Boolean(item.isPinned);

                        let adminCardBg = '';
                        let adminBadgeStyle = '';

                        if (isUrgent) {
                          adminCardBg = 'bg-gradient-to-br from-rose-950/60 via-red-950/30 to-black/80 border-rose-500/50 shadow-md shadow-rose-950/20';
                          adminBadgeStyle = 'bg-rose-600 text-white font-black border border-rose-400/50';
                        } else if (isHigh) {
                          adminCardBg = 'bg-gradient-to-br from-amber-950/60 via-orange-950/30 to-black/80 border-amber-500/50 shadow-md shadow-amber-950/20';
                          adminBadgeStyle = 'bg-amber-500 text-black font-black border border-amber-300/50';
                        } else if (isPinned) {
                          adminCardBg = 'bg-gradient-to-br from-yellow-950/40 to-black/80 border-yellow-500/40';
                          adminBadgeStyle = 'bg-yellow-500 text-black font-black';
                        } else if (item.category === 'By-Laws & Regulations' || item.category === 'Circular') {
                          adminCardBg = 'bg-gradient-to-br from-sky-950/50 to-black/80 border-sky-500/40';
                          adminBadgeStyle = 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold';
                        } else {
                          adminCardBg = 'bg-white/5 border-white/10 hover:bg-white/[0.08]';
                          adminBadgeStyle = 'bg-white/10 text-white/70 border-white/15 font-bold';
                        }

                        return (
                          <div
                            key={item.id}
                            className={`p-5 rounded-3xl border transition-all ${adminCardBg}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-2.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {item.isPinned && (
                                    <span className="px-2.5 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                                      <Pin className="w-2.5 h-2.5" /> Pinned
                                    </span>
                                  )}

                                  <span
                                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${adminBadgeStyle}`}
                                  >
                                    {isUrgent ? '🚨 URGENT' : isHigh ? '⚡ HIGH' : 'NORMAL'}
                                  </span>

                                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                    {item.category}
                                  </span>

                                  <span className="text-[10px] text-white/40 font-mono">
                                    {item.date} • {item.time}
                                  </span>
                                </div>

                                <div>
                                  <h4 className="text-base sm:text-lg font-black text-white leading-tight">{item.title}</h4>
                                  {item.summary && (
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-200/90 mt-1.5 leading-relaxed">
                                      <span className="text-[9px] text-amber-400 font-black uppercase tracking-widest block mb-0.5">Subtitle / Overview:</span>
                                      {item.summary}
                                    </div>
                                  )}
                                  {item.content && item.content.length > 0 && item.content[0] !== item.summary && (
                                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/70 mt-1.5 space-y-1">
                                      <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-0.5">Full Explanation:</span>
                                      {item.content.map((p, pIdx) => (
                                        <p key={pIdx} className="line-clamp-2">{p}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-white/50 pt-1">
                                  <span>Audience: <strong className="text-white/80">{item.targetAudience}</strong></span>

                                  {item.attachmentName && (
                                    <a
                                      href={item.attachmentUrl}
                                      download={item.attachmentName}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 font-bold transition-all border border-white/10 text-xs"
                                    >
                                      <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Download {item.attachmentName}</span>
                                      {item.attachmentSize && (
                                        <span className="text-[10px] text-white/50">({item.attachmentSize})</span>
                                      )}
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    togglePinNotification(item.id);
                                    notify(item.isPinned ? 'Unpinned bulletin' : 'Pinned bulletin to top!');
                                  }}
                                  className={`p-2 rounded-xl transition-all ${
                                    item.isPinned
                                      ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                  }`}
                                  title={item.isPinned ? 'Unpin bulletin' : 'Pin bulletin'}
                                >
                                  <Pin className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete bulletin "${item.title}"?`)) {
                                      deleteNotification(item.id);
                                      notify('Bulletin deleted successfully.');
                                    }
                                  }}
                                  className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                                  title="Delete Bulletin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS MANAGER */}
          {activeTab === 'results' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">Live Results Manager</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Auto-Sync Active
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Add or edit published results. Team scores and leaderboard medals sync dynamically across the entire portal.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      syncStandingsWithResults();
                      notify('Standings and scores fully synchronized with live results!');
                    }}
                    className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all shadow-sm"
                    title="Recalculate Leaderboard Standings from Results"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync Scores</span>
                  </button>

                  {competitions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ALL ${competitions.length} published results? This will also reset team standings and scores to 0.`)) {
                          clearAllCompetitions();
                          notify('All published results removed successfully!');
                        }
                      }}
                      className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 hover:bg-rose-500/30 transition-all shadow-sm"
                      title="Remove All Published Results"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Remove All Results ({competitions.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowNewResultModal(true)}
                    className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
                    style={{ backgroundColor: currentTheme.secondary }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Result</span>
                  </button>
                </div>
              </div>

              {/* Add New Result Form Modal */}
              {showNewResultModal && (
                <form
                  onSubmit={handleAddResult}
                  className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-lg font-black text-white">Publish Competition Result</h3>
                    <button
                      type="button"
                      onClick={() => setShowNewResultModal(false)}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Quick Pick from Data Center */}
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-2 text-xs">
                    <select
                      onChange={(e) => {
                        const prog = programs.find((p) => p.name === e.target.value);
                        if (prog) {
                          setNewResult({
                            ...newResult,
                            name: prog.name,
                            category: prog.category,
                            type: prog.type,
                            w1Points: calculateWinnerPoints(1, newResult.w1Grade, prog.category, prog.type),
                            w2Points: calculateWinnerPoints(2, newResult.w2Grade, prog.category, prog.type),
                            w3Points: calculateWinnerPoints(3, newResult.w3Grade, prog.category, prog.type),
                          });
                        }
                      }}
                      className="flex-1 w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="">-- Select Registered Program --</option>
                      {programs
                        .filter((p) => !competitions.some((c) => c.name.trim().toLowerCase() === p.name.trim().toLowerCase()))
                        .map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.category} • {p.stageType || 'Stage'} • {p.type})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 mb-1">
                        Result Number
                      </label>
                      <input
                        type="number"
                        required
                        value={newResult.resultNumber}
                        onChange={(e) => setNewResult({ ...newResult, resultNumber: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 mb-1">
                        Competition Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mappila Song"
                        value={newResult.name}
                        onChange={(e) => setNewResult({ ...newResult, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 mb-1">
                        Category
                      </label>
                      <select
                        required
                        value={newResult.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setNewResult({
                            ...newResult,
                            category: cat,
                            w1Points: calculateWinnerPoints(1, newResult.w1Grade, cat, newResult.type),
                            w2Points: calculateWinnerPoints(2, newResult.w2Grade, cat, newResult.type),
                            w3Points: calculateWinnerPoints(3, newResult.w3Grade, cat, newResult.type),
                          });
                        }}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 mb-1">
                        Program Type
                      </label>
                      <select
                        required
                        value={newResult.type}
                        onChange={(e) => {
                          const t = e.target.value as 'Individual' | 'Group';
                          setNewResult({
                            ...newResult,
                            type: t,
                            w1Points: calculateWinnerPoints(1, newResult.w1Grade, newResult.category, t),
                            w2Points: calculateWinnerPoints(2, newResult.w2Grade, newResult.category, t),
                            w3Points: calculateWinnerPoints(3, newResult.w3Grade, newResult.category, t),
                          });
                        }}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Group">Group</option>
                      </select>
                    </div>
                  </div>

                  {/* Registered Candidates Datalist for Chest Auto-fill */}
                  <datalist id="registered-chest-list">
                    {[...participants]
                      .sort((a, b) => Number(a.chestNo) - Number(b.chestNo))
                      .map((p) => (
                        <option key={p.chestNo} value={p.chestNo}>
                          #{p.chestNo} • {p.name} ({p.team || 'Team A'})
                        </option>
                      ))}
                  </datalist>

                  {/* Dynamic Winner Selection: Group Program (Team & Members) vs Individual (1st, 2nd, 3rd) */}
                  {newResult.type === 'Group' ? (
                    <div className="space-y-4">
                      {/* Helper registered team submissions for this program */}
                      {(() => {
                        const matchingEntries = programEntries.filter(
                          (e) => e.programName.toLowerCase() === newResult.name.toLowerCase() && e.type === 'Group'
                        );
                        return (
                          matchingEntries.length > 0 && (
                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/25 rounded-2xl text-[11px] text-cyan-200 space-y-1.5">
                              <span className="font-bold block">
                                {matchingEntries.length} Registered Team Submissions found in Data Center for "{newResult.name}":
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {matchingEntries.map((me) => (
                                  <span
                                    key={me.id}
                                    className="px-2 py-0.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-[10px]"
                                  >
                                    {me.team}: {me.participants.map((p) => `#${p.chestNo}`).join(', ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        );
                      })()}

                      {/* 1st Place Group Team */}
                      <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-400 text-xs flex items-center gap-1.5">
                            {newResult.w1Active ? '1st Position Team' : '🚫 1st Position (Canceled / Withheld)'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setNewResult({ ...newResult, w1Active: !newResult.w1Active })}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                                newResult.w1Active
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              {newResult.w1Active ? '✕ Cancel 1st Prize' : '✓ Restore 1st Prize'}
                            </button>
                            {newResult.w1Active && (
                              <select
                                onChange={(e) => {
                                  const entryId = e.target.value;
                                  const found = programEntries.find((pe) => pe.id === entryId);
                                  if (found) {
                                    setNewResult({
                                      ...newResult,
                                      w1Team: found.team,
                                      w1Chest: found.participants.map((p) => p.chestNo).join(', '),
                                    });
                                  }
                                }}
                                className="bg-black/60 border border-amber-500/40 rounded-lg px-2 py-1 text-[10px] text-amber-300 font-bold"
                              >
                                <option value="">-- Quick Pick Registered Team --</option>
                                {programEntries
                                  .filter((pe) => pe.programName.toLowerCase() === newResult.name.toLowerCase() && pe.type === 'Group')
                                  .map((pe) => (
                                    <option key={pe.id} value={pe.id}>
                                      {pe.team} • {pe.participants.map((p) => `#${p.chestNo} ${p.name}`).join(', ')}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </div>
                        {newResult.w1Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winning Team</label>
                              <input
                                type="text"
                                required={newResult.w1Active}
                                placeholder="e.g. Team A"
                                value={newResult.w1Team || 'Team A'}
                                onChange={(e) => setNewResult({ ...newResult, w1Team: e.target.value })}
                                className="w-full bg-black/40 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-bold text-xs"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Member Chest Nos (comma-separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. 101, 102, 103"
                                value={newResult.w1Chest}
                                onChange={(e) => setNewResult({ ...newResult, w1Chest: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-amber-400 font-black mb-0.5">Points & Grade</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  required={newResult.w1Active}
                                  value={newResult.w1Points}
                                  onChange={(e) => setNewResult({ ...newResult, w1Points: Number(e.target.value) })}
                                  className="w-1/2 bg-black/40 border border-amber-500/40 rounded-xl px-2 py-2 text-white font-black text-center text-xs"
                                />
                                <select
                                  value={newResult.w1Grade}
                                  onChange={(e) => {
                                    const gr = e.target.value as any;
                                    setNewResult({
                                      ...newResult,
                                      w1Grade: gr,
                                      w1Points: calculateWinnerPoints(1, gr, newResult.category, newResult.type),
                                    });
                                  }}
                                  className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-2 text-white font-bold text-xs text-center"
                                >
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="None">-</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            1st Prize canceled / withheld. No 1st prize or gold medal will be allocated.
                          </div>
                        )}
                      </div>

                      {/* 2nd Place Group Team */}
                      <div className="p-4 bg-slate-400/10 rounded-2xl border border-slate-400/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-300 text-xs flex items-center gap-1.5">
                            {newResult.w2Active ? '2nd Position Team' : '🚫 2nd Position (Canceled / Withheld)'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setNewResult({ ...newResult, w2Active: !newResult.w2Active })}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                                newResult.w2Active
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              {newResult.w2Active ? '✕ Cancel 2nd Prize' : '✓ Restore 2nd Prize'}
                            </button>
                            {newResult.w2Active && (
                              <select
                                onChange={(e) => {
                                  const entryId = e.target.value;
                                  const found = programEntries.find((pe) => pe.id === entryId);
                                  if (found) {
                                    setNewResult({
                                      ...newResult,
                                      w2Team: found.team,
                                      w2Chest: found.participants.map((p) => p.chestNo).join(', '),
                                    });
                                  }
                                }}
                                className="bg-black/60 border border-slate-400/40 rounded-lg px-2 py-1 text-[10px] text-slate-300 font-bold"
                              >
                                <option value="">-- Quick Pick Registered Team --</option>
                                {programEntries
                                  .filter((pe) => pe.programName.toLowerCase() === newResult.name.toLowerCase() && pe.type === 'Group')
                                  .map((pe) => (
                                    <option key={pe.id} value={pe.id}>
                                      {pe.team} • {pe.participants.map((p) => `#${p.chestNo} ${p.name}`).join(', ')}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </div>
                        {newResult.w2Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winning Team</label>
                              <input
                                type="text"
                                required={newResult.w2Active}
                                placeholder="e.g. Team B"
                                value={newResult.w2Team || 'Team B'}
                                onChange={(e) => setNewResult({ ...newResult, w2Team: e.target.value })}
                                className="w-full bg-black/40 border border-slate-400/40 focus:border-slate-300 rounded-xl px-3 py-2 text-white font-bold text-xs"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Member Chest Nos (comma-separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. 201, 202, 203"
                                value={newResult.w2Chest}
                                onChange={(e) => setNewResult({ ...newResult, w2Chest: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 focus:border-slate-300 rounded-xl px-3 py-2 text-white font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-300 font-black mb-0.5">Points & Grade</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  required={newResult.w2Active}
                                  value={newResult.w2Points}
                                  onChange={(e) => setNewResult({ ...newResult, w2Points: Number(e.target.value) })}
                                  className="w-1/2 bg-black/40 border border-slate-400/40 rounded-xl px-2 py-2 text-white font-black text-center text-xs"
                                />
                                <select
                                  value={newResult.w2Grade}
                                  onChange={(e) => {
                                    const gr = e.target.value as any;
                                    setNewResult({
                                      ...newResult,
                                      w2Grade: gr,
                                      w2Points: calculateWinnerPoints(2, gr, newResult.category, newResult.type),
                                    });
                                  }}
                                  className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-2 text-white font-bold text-xs text-center"
                                >
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="None">-</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            2nd Prize canceled / withheld. No 2nd prize or silver medal will be allocated.
                          </div>
                        )}
                      </div>

                      {/* 3rd Place Group Team */}
                      <div className="p-4 bg-amber-700/10 rounded-2xl border border-amber-700/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-600 text-xs flex items-center gap-1.5">
                            {newResult.w3Active ? '3rd Position Team (Optional)' : '🚫 3rd Position (Canceled / Withheld)'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setNewResult({ ...newResult, w3Active: !newResult.w3Active })}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                                newResult.w3Active
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              {newResult.w3Active ? '✕ Cancel 3rd Prize' : '✓ Restore 3rd Prize'}
                            </button>
                            {newResult.w3Active && (
                              <select
                                onChange={(e) => {
                                  const entryId = e.target.value;
                                  const found = programEntries.find((pe) => pe.id === entryId);
                                  if (found) {
                                    setNewResult({
                                      ...newResult,
                                      w3Team: found.team,
                                      w3Chest: found.participants.map((p) => p.chestNo).join(', '),
                                    });
                                  }
                                }}
                                className="bg-black/60 border border-amber-700/40 rounded-lg px-2 py-1 text-[10px] text-amber-500 font-bold"
                              >
                                <option value="">-- Quick Pick Registered Team --</option>
                                {programEntries
                                  .filter((pe) => pe.programName.toLowerCase() === newResult.name.toLowerCase() && pe.type === 'Group')
                                  .map((pe) => (
                                    <option key={pe.id} value={pe.id}>
                                      {pe.team} • {pe.participants.map((p) => `#${p.chestNo} ${p.name}`).join(', ')}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </div>
                        {newResult.w3Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winning Team</label>
                              <input
                                type="text"
                                placeholder="e.g. Team A"
                                value={newResult.w3Team}
                                onChange={(e) => setNewResult({ ...newResult, w3Team: e.target.value })}
                                className="w-full bg-black/40 border border-amber-700/40 focus:border-amber-600 rounded-xl px-3 py-2 text-white font-bold text-xs"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Member Chest Nos (comma-separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. 104, 105, 106"
                                value={newResult.w3Chest}
                                onChange={(e) => setNewResult({ ...newResult, w3Chest: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 focus:border-amber-600 rounded-xl px-3 py-2 text-white font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-amber-600 font-black mb-0.5">Points & Grade</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={newResult.w3Points}
                                  onChange={(e) => setNewResult({ ...newResult, w3Points: Number(e.target.value) })}
                                  className="w-1/2 bg-black/40 border border-amber-700/40 rounded-xl px-2 py-2 text-white font-black text-center text-xs"
                                />
                                <select
                                  value={newResult.w3Grade}
                                  onChange={(e) => {
                                    const gr = e.target.value as any;
                                    setNewResult({
                                      ...newResult,
                                      w3Grade: gr,
                                      w3Points: calculateWinnerPoints(3, gr, newResult.category, newResult.type),
                                    });
                                  }}
                                  className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-2 text-white font-bold text-xs text-center"
                                >
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="None">-</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            3rd Prize canceled / withheld. No 3rd prize or bronze medal will be allocated.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 1st Place */}
                      <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-400 text-xs flex items-center gap-1.5">
                            {newResult.w1Active ? '1st Place Winner' : '🚫 1st Place (Canceled / Withheld)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setNewResult({ ...newResult, w1Active: !newResult.w1Active })}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                              newResult.w1Active
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            {newResult.w1Active ? '✕ Cancel 1st Prize' : '✓ Restore 1st Prize'}
                          </button>
                        </div>
                        {newResult.w1Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                              <input
                                type="text"
                                required={newResult.w1Active}
                                list="registered-chest-list"
                                placeholder="e.g. 74"
                                value={newResult.w1Chest}
                                onChange={(e) => handleChestLookup(1, e.target.value)}
                                className="w-full bg-black/40 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-mono font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                              <input
                                type="text"
                                required={newResult.w1Active}
                                placeholder="Winner Name"
                                value={newResult.w1Name}
                                onChange={(e) => setNewResult({ ...newResult, w1Name: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                              <input
                                type="text"
                                placeholder="Team (Team A / B)"
                                value={newResult.w1Team}
                                onChange={(e) => setNewResult({ ...newResult, w1Team: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-amber-400 font-black mb-0.5">Score / Mark</label>
                              <input
                                type="number"
                                required={newResult.w1Active}
                                placeholder="8"
                                value={newResult.w1Points}
                                onChange={(e) => setNewResult({ ...newResult, w1Points: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-amber-500/50 focus:border-amber-400 rounded-xl px-3 py-2 text-white font-black text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Grade</label>
                              <select
                                value={newResult.w1Grade}
                                onChange={(e) => {
                                  const gr = e.target.value as any;
                                  setNewResult({
                                    ...newResult,
                                    w1Grade: gr,
                                    w1Points: calculateWinnerPoints(1, gr, newResult.category, newResult.type),
                                  });
                                }}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-2 text-white font-bold text-center text-xs"
                              >
                                <option value="A+">Grade A+</option>
                                <option value="A">Grade A</option>
                                <option value="B+">Grade B+</option>
                                <option value="B">Grade B</option>
                                <option value="C+">Grade C+</option>
                                <option value="C">Grade C</option>
                                <option value="D+">Grade D+</option>
                                <option value="D">Grade D</option>
                                <option value="None">None</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            1st Prize canceled / withheld. No 1st prize or gold medal will be allocated.
                          </div>
                        )}
                      </div>

                      {/* 2nd Place */}
                      <div className="p-4 bg-slate-400/10 rounded-2xl border border-slate-400/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-300 text-xs flex items-center gap-1.5">
                            {newResult.w2Active ? '2nd Place Winner' : '🚫 2nd Place (Canceled / Withheld)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setNewResult({ ...newResult, w2Active: !newResult.w2Active })}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                              newResult.w2Active
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            {newResult.w2Active ? '✕ Cancel 2nd Prize' : '✓ Restore 2nd Prize'}
                          </button>
                        </div>
                        {newResult.w2Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                              <input
                                type="text"
                                list="registered-chest-list"
                                placeholder="e.g. 102"
                                value={newResult.w2Chest}
                                onChange={(e) => handleChestLookup(2, e.target.value)}
                                className="w-full bg-black/40 border border-slate-400/40 focus:border-slate-300 rounded-xl px-3 py-2 text-white font-mono font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                              <input
                                type="text"
                                placeholder="Winner Name"
                                value={newResult.w2Name}
                                onChange={(e) => setNewResult({ ...newResult, w2Name: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                              <input
                                type="text"
                                placeholder="Team (Team A / B)"
                                value={newResult.w2Team}
                                onChange={(e) => setNewResult({ ...newResult, w2Team: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-300 font-black mb-0.5">Score / Mark</label>
                              <input
                                type="number"
                                placeholder="7"
                                value={newResult.w2Points}
                                onChange={(e) => setNewResult({ ...newResult, w2Points: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-slate-400/50 focus:border-slate-300 rounded-xl px-3 py-2 text-white font-black text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Grade</label>
                              <select
                                value={newResult.w2Grade}
                                onChange={(e) => {
                                  const gr = e.target.value as any;
                                  setNewResult({
                                    ...newResult,
                                    w2Grade: gr,
                                    w2Points: calculateWinnerPoints(2, gr, newResult.category, newResult.type),
                                  });
                                }}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-2 text-white font-bold text-center text-xs"
                              >
                                <option value="A+">Grade A+</option>
                                <option value="A">Grade A</option>
                                <option value="B+">Grade B+</option>
                                <option value="B">Grade B</option>
                                <option value="C+">Grade C+</option>
                                <option value="C">Grade C</option>
                                <option value="D+">Grade D+</option>
                                <option value="D">Grade D</option>
                                <option value="None">None</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            2nd Prize canceled / withheld. No 2nd prize or silver medal will be allocated.
                          </div>
                        )}
                      </div>

                      {/* 3rd Place */}
                      <div className="p-4 bg-amber-700/10 rounded-2xl border border-amber-700/30 space-y-2.5 text-xs shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-600 text-xs flex items-center gap-1.5">
                            {newResult.w3Active ? '3rd Place Winner' : '🚫 3rd Place (Canceled / Withheld)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setNewResult({ ...newResult, w3Active: !newResult.w3Active })}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                              newResult.w3Active
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            {newResult.w3Active ? '✕ Cancel 3rd Prize' : '✓ Restore 3rd Prize'}
                          </button>
                        </div>
                        {newResult.w3Active ? (
                          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                              <input
                                type="text"
                                list="registered-chest-list"
                                placeholder="e.g. 103"
                                value={newResult.w3Chest}
                                onChange={(e) => handleChestLookup(3, e.target.value)}
                                className="w-full bg-black/40 border border-amber-700/40 focus:border-amber-600 rounded-xl px-3 py-2 text-white font-mono font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                              <input
                                type="text"
                                placeholder="Winner Name"
                                value={newResult.w3Name}
                                onChange={(e) => setNewResult({ ...newResult, w3Name: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                              <input
                                type="text"
                                placeholder="Team (Team A / B)"
                                value={newResult.w3Team}
                                onChange={(e) => setNewResult({ ...newResult, w3Team: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-amber-600 font-black mb-0.5">Score / Mark</label>
                              <input
                                type="number"
                                placeholder="4"
                                value={newResult.w3Points}
                                onChange={(e) => setNewResult({ ...newResult, w3Points: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-amber-700/50 focus:border-amber-600 rounded-xl px-3 py-2 text-white font-black text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 font-bold mb-0.5">Grade</label>
                              <select
                                value={newResult.w3Grade}
                                onChange={(e) => {
                                  const gr = e.target.value as any;
                                  setNewResult({
                                    ...newResult,
                                    w3Grade: gr,
                                    w3Points: calculateWinnerPoints(3, gr, newResult.category, newResult.type),
                                  });
                                }}
                                className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-2 text-white font-bold text-center text-xs"
                              >
                                <option value="A+">Grade A+</option>
                                <option value="A">Grade A</option>
                                <option value="B+">Grade B+</option>
                                <option value="B">Grade B</option>
                                <option value="C+">Grade C+</option>
                                <option value="C">Grade C</option>
                                <option value="D+">Grade D+</option>
                                <option value="D">Grade D</option>
                                <option value="None">None</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
                            3rd Prize canceled / withheld. No 3rd prize or bronze medal will be allocated.
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-[1.01] transition-all"
                  >
                    Confirm & Publish Result
                  </button>
                </form>
              )}

              {/* Edit Result Modal */}
              {showEditResultModal && editingResult && (
                <form
                  onSubmit={handleSaveEditResult}
                  className="p-6 rounded-3xl bg-white/5 border border-purple-500/30 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-xs border border-purple-500/30">
                        #{editingResult.resultNumber}
                      </span>
                      <div>
                        <h3 className="text-lg font-black text-white">Edit Published Result</h3>
                        <p className="text-[11px] text-white/50">Changes will immediately recalculate team points & leaderboard standings.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditResultModal(false);
                        setEditingResult(null);
                      }}
                      className="text-xs text-white/50 hover:text-white px-2 py-1 rounded-lg bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-white/60 font-bold mb-1 uppercase">Program Name</label>
                      <input
                        type="text"
                        required
                        value={editingResult.name}
                        onChange={(e) => setEditingResult({ ...editingResult, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/60 font-bold mb-1 uppercase">Category</label>
                      <select
                        value={editingResult.category}
                        onChange={(e) => setEditingResult({ ...editingResult, category: e.target.value })}
                        className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/60 font-bold mb-1 uppercase">Type</label>
                      <select
                        value={editingResult.type}
                        onChange={(e) => setEditingResult({ ...editingResult, type: e.target.value as 'Individual' | 'Group' })}
                        className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Group">Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/60 font-bold mb-1 uppercase">Result #</label>
                      <input
                        type="number"
                        required
                        value={editingResult.resultNumber}
                        onChange={(e) => setEditingResult({ ...editingResult, resultNumber: Number(e.target.value) })}
                        className="w-full bg-black/50 border border-white/15 focus:border-purple-400 rounded-xl px-3 py-2 text-white font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* 1st Place Edit Card */}
                  <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="sm:col-span-5 font-black text-amber-400 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {editingResult.w1Active ? '1st Place (Gold Winner)' : '🚫 1st Place (Canceled / Removed)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingResult({ ...editingResult, w1Active: !editingResult.w1Active })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          editingResult.w1Active
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {editingResult.w1Active ? '✕ Cancel / Remove 1st Position' : '✓ Restore 1st Position'}
                      </button>
                    </div>
                    {editingResult.w1Active ? (
                      <>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                          <input
                            type="text"
                            value={editingResult.w1Chest}
                            onChange={(e) => setEditingResult({ ...editingResult, w1Chest: e.target.value })}
                            className="w-full bg-black/40 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                          <input
                            type="text"
                            required={editingResult.w1Active}
                            value={editingResult.w1Name}
                            onChange={(e) => setEditingResult({ ...editingResult, w1Name: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                          <input
                            type="text"
                            value={editingResult.w1Team}
                            onChange={(e) => setEditingResult({ ...editingResult, w1Team: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-amber-400 font-black mb-0.5">Points & Grade</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editingResult.w1Points}
                              onChange={(e) => setEditingResult({ ...editingResult, w1Points: Number(e.target.value) })}
                              className="w-1/2 bg-black/40 border border-amber-500/50 rounded-xl px-2 py-1.5 text-white font-black text-center"
                            />
                            <select
                              value={editingResult.w1Grade}
                              onChange={(e) => {
                                const gr = e.target.value as any;
                                setEditingResult({
                                  ...editingResult,
                                  w1Grade: gr,
                                  w1Points: calculateWinnerPoints(1, gr, editingResult.category, editingResult.type),
                                });
                              }}
                              className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-1.5 text-white font-bold text-xs text-center"
                            >
                              <option value="A+">A+</option>
                              <option value="A">A</option>
                              <option value="B+">B+</option>
                              <option value="B">B</option>
                              <option value="C+">C+</option>
                              <option value="C">C</option>
                              <option value="None">-</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-5 p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[11px] text-rose-300">
                        1st prize canceled / removed. Gold medal and points for 1st place will be removed from team standings upon saving.
                      </div>
                    )}
                  </div>

                  {/* 2nd Place Edit Card */}
                  <div className="p-3.5 bg-slate-400/10 rounded-2xl border border-slate-400/30 grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="sm:col-span-5 font-black text-slate-300 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {editingResult.w2Active ? '2nd Place (Silver Winner)' : '🚫 2nd Place (Canceled / Removed)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingResult({ ...editingResult, w2Active: !editingResult.w2Active })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          editingResult.w2Active
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {editingResult.w2Active ? '✕ Cancel / Remove 2nd Position' : '✓ Restore 2nd Position'}
                      </button>
                    </div>
                    {editingResult.w2Active ? (
                      <>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                          <input
                            type="text"
                            value={editingResult.w2Chest}
                            onChange={(e) => setEditingResult({ ...editingResult, w2Chest: e.target.value })}
                            className="w-full bg-black/40 border border-slate-400/40 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                          <input
                            type="text"
                            value={editingResult.w2Name}
                            onChange={(e) => setEditingResult({ ...editingResult, w2Name: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                          <input
                            type="text"
                            value={editingResult.w2Team}
                            onChange={(e) => setEditingResult({ ...editingResult, w2Team: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-300 font-black mb-0.5">Points & Grade</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editingResult.w2Points}
                              onChange={(e) => setEditingResult({ ...editingResult, w2Points: Number(e.target.value) })}
                              className="w-1/2 bg-black/40 border border-slate-400/50 rounded-xl px-2 py-1.5 text-white font-black text-center"
                            />
                            <select
                              value={editingResult.w2Grade}
                              onChange={(e) => {
                                const gr = e.target.value as any;
                                setEditingResult({
                                  ...editingResult,
                                  w2Grade: gr,
                                  w2Points: calculateWinnerPoints(2, gr, editingResult.category, editingResult.type),
                                });
                              }}
                              className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-1.5 text-white font-bold text-xs text-center"
                            >
                              <option value="A+">A+</option>
                              <option value="A">A</option>
                              <option value="B+">B+</option>
                              <option value="B">B</option>
                              <option value="C+">C+</option>
                              <option value="C">C</option>
                              <option value="None">-</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-5 p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[11px] text-rose-300">
                        2nd prize canceled / removed. Silver medal and points for 2nd place will be removed from team standings upon saving.
                      </div>
                    )}
                  </div>

                  {/* 3rd Place Edit Card */}
                  <div className="p-3.5 bg-amber-700/10 rounded-2xl border border-amber-700/30 grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="sm:col-span-5 font-black text-amber-600 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {editingResult.w3Active ? '3rd Place (Bronze Winner)' : '🚫 3rd Place (Canceled / Removed)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingResult({ ...editingResult, w3Active: !editingResult.w3Active })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          editingResult.w3Active
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {editingResult.w3Active ? '✕ Cancel / Remove 3rd Position' : '✓ Restore 3rd Position'}
                      </button>
                    </div>
                    {editingResult.w3Active ? (
                      <>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Chest No</label>
                          <input
                            type="text"
                            value={editingResult.w3Chest}
                            onChange={(e) => setEditingResult({ ...editingResult, w3Chest: e.target.value })}
                            className="w-full bg-black/40 border border-amber-700/40 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Winner Name</label>
                          <input
                            type="text"
                            value={editingResult.w3Name}
                            onChange={(e) => setEditingResult({ ...editingResult, w3Name: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/60 font-bold mb-0.5">Team</label>
                          <input
                            type="text"
                            value={editingResult.w3Team}
                            onChange={(e) => setEditingResult({ ...editingResult, w3Team: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-amber-600 font-black mb-0.5">Points & Grade</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editingResult.w3Points}
                              onChange={(e) => setEditingResult({ ...editingResult, w3Points: Number(e.target.value) })}
                              className="w-1/2 bg-black/40 border border-amber-700/50 rounded-xl px-2 py-1.5 text-white font-black text-center"
                            />
                            <select
                              value={editingResult.w3Grade}
                              onChange={(e) => {
                                const gr = e.target.value as any;
                                setEditingResult({
                                  ...editingResult,
                                  w3Grade: gr,
                                  w3Points: calculateWinnerPoints(3, gr, editingResult.category, editingResult.type),
                                });
                              }}
                              className="w-1/2 bg-black/40 border border-white/15 rounded-xl px-1 py-1.5 text-white font-bold text-xs text-center"
                            >
                              <option value="A+">A+</option>
                              <option value="A">A</option>
                              <option value="B+">B+</option>
                              <option value="B">B</option>
                              <option value="C+">C+</option>
                              <option value="C">C</option>
                              <option value="None">-</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-5 p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[11px] text-rose-300">
                        3rd prize canceled / removed. Bronze medal and points for 3rd place will be removed from team standings upon saving.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditResultModal(false);
                        setEditingResult(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs tracking-wider shadow-lg transition-all"
                    >
                      Save & Sync Leaderboard
                    </button>
                  </div>
                </form>
              )}

              {/* Results Filter & Search Bar */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search result or chest no..."
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Existing Competitions List */}
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                {[...competitions]
                  .filter((comp) => {
                    const term = resultSearch.toLowerCase();
                    const nameMatch = comp.name.toLowerCase().includes(term);
                    const chestMatch = comp.winners?.some((w) => String(w.chestNo).includes(term) || w.name.toLowerCase().includes(term));
                    const resMatch = String(comp.resultNumber).includes(term);
                    return nameMatch || chestMatch || resMatch;
                  })
                  .sort((a, b) => {
                    if (resultSortBy === 'chestNo') {
                      const chestA = Number(a.winners?.[0]?.chestNo) || 0;
                      const chestB = Number(b.winners?.[0]?.chestNo) || 0;
                      return chestA - chestB;
                    }
                    return b.resultNumber - a.resultNumber;
                  })
                  .map((comp) => {
                    const w1 = comp.winners?.find((w) => w.position === 1);
                    const w2 = comp.winners?.find((w) => w.position === 2);
                    const w3 = comp.winners?.find((w) => w.position === 3);

                    return (
                      <div
                        key={comp.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.07] transition-all"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-black"
                              style={{ backgroundColor: currentTheme.secondary }}
                            >
                              #{comp.resultNumber}
                            </span>
                            <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                              {comp.category}
                            </span>
                            <span className="text-xs text-white/50 font-medium">
                              {comp.type}
                            </span>
                          </div>
                          
                          <h4 className="text-base font-extrabold text-white">{comp.name}</h4>
                          
                          <div className="flex items-center gap-3 text-xs flex-wrap pt-0.5">
                            {w1 ? (
                              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                1st: {w1.name} ({w1.team}) • {w1.points} pts [{w1.grade}]
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30 text-[10px]">
                                🚫 1st Place Canceled
                              </span>
                            )}
                            {w2 && (
                              <span className="text-slate-300 font-medium bg-slate-400/10 px-2 py-0.5 rounded border border-slate-400/20">
                                2nd: {w2.name} ({w2.team}) • {w2.points} pts [{w2.grade}]
                              </span>
                            )}
                            {w3 && (
                              <span className="text-amber-600 font-medium bg-amber-700/10 px-2 py-0.5 rounded border border-amber-700/20">
                                3rd: {w3.name} ({w3.team}) • {w3.points} pts [{w3.grade}]
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditResult(comp)}
                            className="px-3 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors border border-purple-500/30"
                            title="Edit Result & Winners"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete result #${comp.resultNumber} - ${comp.name}?`)) {
                                deleteCompetition(comp.id);
                                notify(`Deleted result #${comp.resultNumber}`);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                            title="Delete Result"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM STANDINGS MANAGER */}
          {activeTab === 'standings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">Leaderboard & Team Standings</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Matched with {competitions.length} Results
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    Team points and medal counts match published competition results dynamically. Standings auto-rank by points.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    syncStandingsWithResults();
                    notify('All team standings synchronized with live results!');
                  }}
                  className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-2 hover:bg-emerald-500/30 transition-all shadow-lg shrink-0"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400 animate-spin-once" />
                  <span>Recalculate & Sync from Results</span>
                </button>
              </div>

              {/* Add New Team Form Card */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTeamName.trim()) return;
                  addStanding({
                    id: `team-${Date.now()}`,
                    name: newTeamName.trim(),
                    points: Number(newTeamPoints),
                    gold: Number(newTeamGold),
                    silver: Number(newTeamSilver),
                    bronze: Number(newTeamBronze),
                  });
                  setNewTeamName('');
                  setNewTeamPoints(0);
                  setNewTeamGold(0);
                  setNewTeamSilver(0);
                  setNewTeamBronze(0);
                  notify(`New team "${newTeamName.trim()}" added to leaderboard!`);
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/15 grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs shadow-xl"
              >
                <div className="sm:col-span-6 font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add New Team</span>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-white/60 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team G (Al-Huda)"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-amber-400 mb-1">Gold (1st)</label>
                  <input
                    type="number"
                    value={newTeamGold}
                    onChange={(e) => setNewTeamGold(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-300 mb-1">Silver (2nd)</label>
                  <input
                    type="number"
                    value={newTeamSilver}
                    onChange={(e) => setNewTeamSilver(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-amber-600 mb-1">Bronze (3rd)</label>
                  <input
                    type="number"
                    value={newTeamBronze}
                    onChange={(e) => setNewTeamBronze(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-400 mb-1">Total Pts</label>
                  <input
                    type="number"
                    value={newTeamPoints}
                    onChange={(e) => setNewTeamPoints(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>
                <div className="sm:col-span-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    + Add Team to Standings
                  </button>
                </div>
              </form>

              {/* Team Standings List with Inline Name Editing & Delete */}
              <div className="space-y-3">
                {standings.map((team) => (
                  <div
                    key={team.id || team.name}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          (Number(team.points) || 0) > 0 && (Number(team.rank) || 0) > 0
                            ? 'bg-white/10 text-white'
                            : 'bg-white/5 text-white/30'
                        }`}
                        title={(Number(team.points) || 0) > 0 ? `Rank #${team.rank}` : 'Unranked (0 Score)'}
                      >
                        {(Number(team.points) || 0) > 0 && (Number(team.rank) || 0) > 0
                          ? `#${team.rank}`
                          : '—'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                          Team Name (Click to edit inline)
                        </label>
                        <input
                          type="text"
                          value={team.name}
                          onChange={(e) =>
                            updateStanding(team.id || team.name, { name: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/15 hover:border-white/30 focus:border-emerald-400 rounded-xl px-3 py-1.5 text-sm font-black text-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <div className="flex items-center gap-1">
                        <label className="text-amber-400 font-bold text-[11px]">G:</label>
                        <input
                          type="number"
                          value={team.gold}
                          onChange={(e) =>
                            updateStanding(team.id || team.name, { gold: Number(e.target.value) })
                          }
                          className="w-12 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-white text-center text-xs"
                          title="Gold Medals"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <label className="text-slate-300 font-bold text-[11px]">S:</label>
                        <input
                          type="number"
                          value={team.silver}
                          onChange={(e) =>
                            updateStanding(team.id || team.name, { silver: Number(e.target.value) })
                          }
                          className="w-12 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-white text-center text-xs"
                          title="Silver Medals"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <label className="text-amber-600 font-bold text-[11px]">B:</label>
                        <input
                          type="number"
                          value={team.bronze}
                          onChange={(e) =>
                            updateStanding(team.id || team.name, { bronze: Number(e.target.value) })
                          }
                          className="w-12 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-white text-center text-xs"
                          title="Bronze Medals"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <label className="text-emerald-400 font-bold">Pts:</label>
                        <input
                          type="number"
                          value={team.points}
                          onChange={(e) =>
                            updateStanding(team.id || team.name, { points: Number(e.target.value) })
                          }
                          className="w-16 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-white text-center font-bold text-xs"
                          title="Total Points"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${team.name}" from the leaderboard?`)) {
                            deleteStanding(team.id || team.name);
                            notify(`Deleted team "${team.name}"`);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors ml-1"
                        title="Delete Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SCHEDULE & TIMELINE MANAGER */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">Festival Schedule & Timeline</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Manage stage lineups, program timings, and live status.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newSchedule.title) return;
                  addScheduleItem({
                    id: `sched-${Date.now()}`,
                    day: newSchedule.day !== undefined && newSchedule.day !== null ? Number(newSchedule.day) : 1,
                    date: newSchedule.date,
                    time: newSchedule.time,
                    title: newSchedule.title,
                    category: newSchedule.category,
                    stage: newSchedule.stage,
                    status: newSchedule.status,
                  });
                  setNewSchedule({ ...newSchedule, title: '' });
                  notify('Added program to schedule!');
                }}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/15 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs shadow-xl"
              >
                <div className="sm:col-span-4 font-black text-white text-base flex items-center justify-between">
                  <span>Add Program to Timeline Schedule</span>
                  <span className="text-xs text-white/50 font-normal">Connects directly to Public Schedule & Participant Dashboard</span>
                </div>

                {/* Quick Select from Data Center */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-emerald-400 font-bold mb-1">
                    Quick Pick from Data Center Programs
                  </label>
                  <select
                    onChange={(e) => {
                      const foundProg = programs.find((p) => p.id === e.target.value || p.name === e.target.value);
                      if (foundProg) {
                        setNewSchedule({
                          ...newSchedule,
                          title: foundProg.name,
                          category: foundProg.category,
                        });
                      }
                    }}
                    className="w-full bg-black/40 border border-emerald-500/40 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                  >
                    <option value="">-- Choose Program from Master List --</option>
                    {programs
                      .filter((p) => !schedule.some((s) => s.title.trim().toLowerCase() === p.name.trim().toLowerCase()))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category} • {p.stageType || 'Stage'} • {p.type})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Program Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-white/70 font-bold mb-1">
                    Program / Competition Title (Editable)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wall Painting, Malayalam Elocution..."
                    value={newSchedule.title}
                    onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">
                    Event Date (Pick or Type)
                  </label>
                  <input
                    type="date"
                    required
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white text-xs font-semibold [color-scheme:dark]"
                  />
                </div>

                {/* Day Number */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">Day Number (0 for Non-Stage)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold text-center text-xs"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM or 02:00 PM"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                  />
                </div>

                {/* Stage Location */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">Stage Location / Venue</label>
                  <input
                    type="text"
                    required
                    list="stage-venues-list"
                    placeholder="e.g. Main Arena (Stage 1)"
                    value={newSchedule.stage}
                    onChange={(e) => setNewSchedule({ ...newSchedule, stage: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                  />
                  <datalist id="stage-venues-list">
                    <option value="Main Arena (Stage 1)" />
                    <option value="Stage 2" />
                    <option value="Stage 3" />
                    <option value="Stage 4" />
                  </datalist>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">Category</label>
                  <select
                    value={newSchedule.category}
                    onChange={(e) => setNewSchedule({ ...newSchedule, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-1">Live Status</label>
                  <select
                    value={newSchedule.status}
                    onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live Now</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-xs shadow-lg transition-all"
                  >
                    + Publish Program to Schedule
                  </button>
                </div>
              </form>

              {/* Scheduled Items List with Live Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60 px-1 font-bold">
                  <span>Scheduled Programs ({schedule.length})</span>
                  <span>Real-time Status</span>
                </div>

                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 font-black text-white text-[11px]">
                          {item.day === 0 || item.date === '2026-10-11' ? 'NON STAGE' : `Day ${item.day}`} • {item.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                          {item.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[11px]">
                          {item.stage}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#291705] border border-[#d97706]/40 text-[#f59e0b] font-bold text-[10px] uppercase">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-white text-base mt-1">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateScheduleItem(item.id, { status: e.target.value as any })
                        }
                        className={`border rounded-xl px-3 py-1.5 text-xs font-bold ${
                          item.status === 'Live'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : item.status === 'Completed'
                            ? 'bg-white/10 text-white/50 border-white/15'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live Now</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Delete schedule item "${item.title}"?`)) {
                            deleteScheduleItem(item.id);
                            notify(`Deleted schedule item "${item.title}"`);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                        title="Delete from Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PHOTO GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">Photo Gallery Manager</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Add or remove high-resolution event photographs.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newGallery.image) return;
                  addGalleryItem({
                    id: `g-${Date.now()}`,
                    title: newGallery.title || 'Festival Highlight',
                    category: newGallery.category || 'Stages',
                    image: newGallery.image,
                  });
                  setNewGallery({ title: '', category: 'Stages', image: '' });
                  notify('New photo added to gallery!');
                }}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/15 space-y-4 text-xs"
              >
                <div className="font-bold text-white text-sm flex items-center justify-between">
                  <span>Add New Photo</span>
                  <span className="text-[11px] text-white/50 font-normal">Choose from device or enter URL</span>
                </div>

                {/* Photo Upload / Browse & URL Input Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* File Browser Area */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-white/70 font-bold mb-1.5 uppercase tracking-wider">
                      Browse Photo from File (Device)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Browse Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], (dataUrl) => {
                                setNewGallery({ ...newGallery, image: dataUrl });
                              });
                            }
                          }}
                        />
                      </label>

                      <span className="text-white/40 text-xs font-semibold">OR Enter Image URL:</span>

                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newGallery.image}
                        onChange={(e) => setNewGallery({ ...newGallery, image: e.target.value })}
                        className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs"
                      />
                    </div>

                    {/* Image Preview Thumbnail */}
                    {newGallery.image && (
                      <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={newGallery.image}
                            alt="Preview"
                            className="w-14 h-14 rounded-xl object-cover border border-white/20"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">Image Selected & Ready</span>
                            <span className="text-[10px] text-emerald-400 font-medium">Ready to save to gallery</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewGallery({ ...newGallery, image: '' })}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 mb-1 font-bold">Photo Title / Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. Stage 1 Grand Arena"
                      value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/60 mb-1 font-bold">Category Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Stages / Performances / Art"
                      value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-wider text-xs shadow-lg hover:scale-[1.02] transition-all"
                    >
                      + Save Photo to Gallery
                    </button>
                  </div>
                </div>
              </form>

              {gallery.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-white/40 text-xs">
                  No photos in gallery yet. Upload or browse photos above to publish.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="relative aspect-square rounded-2xl overflow-hidden group bg-white/5 border border-white/10 shadow-lg"
                    >
                      <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                      {/* Explicit Delete Button - Accessible on both touch screens and desktop */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete photo "${g.title || 'this photo'}" from gallery?`)) {
                            deleteGalleryItem(g.id);
                            notify(`Deleted photo "${g.title || ''}" & synced across all devices!`);
                          }
                        }}
                        className="absolute top-2.5 right-2.5 p-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white shadow-xl transition-all z-10 active:scale-95 flex items-center justify-center cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex flex-col justify-end pointer-events-none">
                        <span className="text-xs font-bold text-white truncate drop-shadow">{g.title || 'Festival Photo'}</span>
                        <span className="text-[10px] text-white/60 font-semibold">{g.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: VIDEO MANAGER */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">Video & Media Hub Manager</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Add and manage Instagram Reels, YouTube recordings, and uploaded video files.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newVideo.platform === 'instagram' && !newVideo.instagramUrl) {
                    alert('Please enter an Instagram Reel or Post link');
                    return;
                  }
                  if (newVideo.platform === 'youtube' && !newVideo.youtubeId) {
                    alert('Please enter a YouTube video ID or link');
                    return;
                  }
                  if (newVideo.platform === 'direct' && !newVideo.videoUrl) {
                    alert('Please upload or enter a video file URL');
                    return;
                  }

                  let cleanYoutubeId = '';
                  if (newVideo.youtubeId) {
                    const trimmed = newVideo.youtubeId.trim();
                    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
                    cleanYoutubeId = ytMatch ? ytMatch[1] : trimmed;
                  }

                  let cleanVideoUrl = newVideo.videoUrl ? newVideo.videoUrl.trim() : '';
                  const gdriveVid = cleanVideoUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
                  if (gdriveVid) {
                    cleanVideoUrl = `https://drive.google.com/uc?export=download&id=${gdriveVid[1]}`;
                  } else if (cleanVideoUrl.includes('dropbox.com') && cleanVideoUrl.includes('dl=0')) {
                    cleanVideoUrl = cleanVideoUrl.replace('dl=0', 'raw=1');
                  }

                  addVideo({
                    id: `v-${Date.now()}`,
                    title: newVideo.title || 'Festival Media Highlight',
                    speaker: newVideo.speaker || '@artsfest_official',
                    platform: newVideo.platform,
                    youtubeId: cleanYoutubeId,
                    instagramUrl: newVideo.instagramUrl,
                    videoUrl: cleanVideoUrl,
                    duration: newVideo.duration || (newVideo.platform === 'instagram' ? 'Reel' : '15:00'),
                    thumbnail:
                      newVideo.thumbnail ||
                      (newVideo.platform === 'youtube' && cleanYoutubeId
                        ? `https://img.youtube.com/vi/${cleanYoutubeId}/hqdefault.jpg`
                        : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'),
                  });

                  setNewVideo({
                    title: '',
                    speaker: '@artsfest_official',
                    platform: 'instagram',
                    youtubeId: '',
                    instagramUrl: '',
                    videoUrl: '',
                    duration: 'Reel',
                    thumbnail: '',
                  });
                  notify('Video published to Media Hub & synced across all devices in real-time!');
                }}
                className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/15 space-y-4 text-xs shadow-xl"
              >
                {/* Platform Selector Buttons */}
                <div>
                  <label className="block text-[10px] text-white/70 font-bold mb-2 uppercase tracking-wider">
                    Select Video Platform / Source
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewVideo({ ...newVideo, platform: 'instagram', duration: 'Reel' })}
                      className={`p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        newVideo.platform === 'instagram'
                          ? 'bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 text-white border-transparent shadow-lg scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram Reel / Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewVideo({ ...newVideo, platform: 'youtube', duration: '15:00' })}
                      className={`p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        newVideo.platform === 'youtube'
                          ? 'bg-red-600 text-white border-red-500 shadow-lg scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Youtube className="w-4 h-4" />
                      <span>YouTube Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewVideo({ ...newVideo, platform: 'direct', duration: 'Video' })}
                      className={`p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        newVideo.platform === 'direct'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>Direct Video File (MP4)</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Platform Inputs */}
                {newVideo.platform === 'instagram' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-rose-950/30 to-amber-950/20 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <Instagram className="w-4 h-4" />
                      <span>Instagram Reel or Post Configuration</span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/70 font-bold mb-1">
                        Instagram Reel / Video URL
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://www.instagram.com/reel/C7qXYZ123/ or https://www.instagram.com/p/..."
                        value={newVideo.instagramUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, instagramUrl: e.target.value })}
                        className="w-full bg-black/50 border border-rose-500/40 focus:border-rose-400 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs placeholder:text-white/30"
                      />
                      <p className="text-[10px] text-white/50 mt-1">
                        Paste any public Instagram Reel or Post link. It will automatically embed directly in the media player.
                      </p>
                    </div>
                  </div>
                )}

                {newVideo.platform === 'youtube' && (
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <Youtube className="w-4 h-4" />
                      <span>YouTube Video Configuration</span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/70 font-bold mb-1">
                        YouTube Video ID or Full Link
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PB-sceRwDGg or https://www.youtube.com/watch?v=..."
                        value={newVideo.youtubeId}
                        onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                        className="w-full bg-black/50 border border-red-500/40 focus:border-red-400 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {newVideo.platform === 'direct' && (
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Film className="w-4 h-4" />
                      <span>Direct Video Upload (.mp4, .webm, .mov)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Browse Video File from Device</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleVideoFileUpload(e.target.files[0], (dataUrl) => {
                                setNewVideo({ ...newVideo, videoUrl: dataUrl });
                              });
                            }
                          }}
                        />
                      </label>

                      <span className="text-white/40 text-xs font-semibold">OR Video URL:</span>

                      <input
                        type="text"
                        placeholder="https://example.com/festival_highlight.mp4"
                        value={newVideo.videoUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>

                    {newVideo.videoUrl && (
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Video source ready for playback</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Common Fields: Title, Speaker/Account, Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-white/70 font-bold mb-1">
                      Video Title / Reel Caption
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Finale Highlights / Keynote Speech"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 font-bold mb-1">
                      Speaker / Channel / Instagram Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @artsfest_official or Keynote Speaker"
                      value={newVideo.speaker}
                      onChange={(e) => setNewVideo({ ...newVideo, speaker: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 focus:border-emerald-400 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/70 font-bold mb-1">
                      Duration / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Reel, 0:45, 15:00"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  {/* Custom Thumbnail Browser */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-white/70 font-bold mb-1 uppercase tracking-wider">
                      Cover Thumbnail (Browse from Device or Paste Image URL)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5 text-white/70" />
                        <span>Browse Thumbnail from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], (dataUrl) => {
                                setNewVideo({ ...newVideo, thumbnail: dataUrl });
                              });
                            }
                          }}
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newVideo.thumbnail}
                        onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                        className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>

                    {newVideo.thumbnail && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={newVideo.thumbnail}
                          alt="Thumbnail preview"
                          className="w-12 h-8 rounded object-cover border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => setNewVideo({ ...newVideo, thumbnail: '' })}
                          className="text-[10px] text-rose-300 hover:underline"
                        >
                          Remove Thumbnail
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider shadow-lg transition-all"
                  >
                    + Publish Video to Media Hub
                  </button>
                </div>
              </form>

              {/* Published Videos List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60 px-1 font-bold">
                  <span>Published Videos & Reels ({videos.length})</span>
                  <span>Platform</span>
                </div>

                {videos.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-white/40 text-xs">
                    No videos published yet. Add an Instagram Reel, YouTube video, or video clip above.
                  </div>
                ) : (
                  videos.map((v) => {
                  const isInsta = v.platform === 'instagram' || Boolean(v.instagramUrl);
                  const isDirect = v.platform === 'direct' || Boolean(v.videoUrl);

                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail Preview */}
                        <div className="w-16 h-12 rounded-xl bg-black/60 overflow-hidden shrink-0 relative border border-white/15">
                          <img
                            src={v.thumbnail || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'}
                            alt={v.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {isInsta ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gradient-to-r from-purple-600 to-rose-600 text-white flex items-center gap-1">
                                <Instagram className="w-2.5 h-2.5" /> Instagram Reel
                              </span>
                            ) : isDirect ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-600 text-white flex items-center gap-1">
                                <Film className="w-2.5 h-2.5" /> MP4 Video
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white flex items-center gap-1">
                                <Youtube className="w-2.5 h-2.5" /> YouTube
                              </span>
                            )}
                            <span className="text-[10px] text-white/50">{v.duration}</span>
                          </div>

                          <h4 className="font-extrabold text-white text-sm truncate">{v.title}</h4>
                          <span className="text-xs text-white/50 font-semibold">{v.speaker}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete video "${v.title}" from Media Hub?`)) {
                            deleteVideo(v.id);
                            notify(`Deleted video "${v.title}" successfully!`);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 active:scale-95 shadow-md"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  );
                }))}
              </div>
            </div>
          )}

          {/* TAB 8: NEWS MANAGER */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">News & Bulletin Manager</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Publish official news, press releases, and announcements.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNews.titleMalayalam) return;
                  addNewsItem({
                    id: `news-${Date.now()}`,
                    titleMalayalam: newNews.titleMalayalam,
                    titleEnglish: newNews.titleEnglish || newNews.titleMalayalam,
                    date: newNews.date,
                    category: newNews.category,
                    image:
                      newNews.image ||
                      'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.5087088120933086.jpg',
                    summary: newNews.summary || 'Festival bulletin update.',
                    content: newNews.content
                      ? newNews.content.split('\n\n')
                      : ['Official report and updates from the Festival.'],
                  });
                  setNewNews({
                    titleMalayalam: '',
                    titleEnglish: '',
                    date: 'Jul 5, 2026',
                    category: 'Updates',
                    image: '',
                    summary: '',
                    content: '',
                  });
                  notify('News article published!');
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
              >
                <div className="sm:col-span-2 font-bold text-white text-sm">Publish News Release</div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">Malayalam Title</label>
                  <input
                    type="text"
                    required
                    placeholder="മലയാളം വാർത്താ തലക്കെട്ട്"
                    value={newNews.titleMalayalam}
                    onChange={(e) => setNewNews({ ...newNews, titleMalayalam: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">English Title</label>
                  <input
                    type="text"
                    placeholder="English headline"
                    value={newNews.titleEnglish}
                    onChange={(e) => setNewNews({ ...newNews, titleEnglish: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                {/* Cover Image Browser & URL */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-white/70 font-bold mb-1.5 uppercase tracking-wider">
                    Cover Photo (Browse File or Enter URL)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Browse Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (dataUrl) => {
                              setNewNews({ ...newNews, image: dataUrl });
                            }, 'news');
                          }
                        }}
                      />
                    </label>

                    <span className="text-white/40 text-xs font-semibold">OR Image URL:</span>

                    <input
                      type="text"
                      placeholder="https://..."
                      value={newNews.image}
                      onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                      className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  {/* Thumbnail preview */}
                  {newNews.image && (
                    <div className="mt-2.5 p-2.5 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={newNews.image}
                          alt="Cover Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-white/20"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Cover Image Attached</span>
                          <span className="text-[10px] text-emerald-400 font-medium">Ready for publication</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewNews({ ...newNews, image: '' })}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/30"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] text-white/60 mb-1 font-bold">Category</label>
                  <input
                    type="text"
                    placeholder="Grand Finale / Special Feature"
                    value={newNews.category}
                    onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-white/60 mb-1">Summary Lead</label>
                  <textarea
                    rows={2}
                    placeholder="Brief 1-2 sentence overview"
                    value={newNews.summary}
                    onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold uppercase tracking-wider"
                  >
                    Publish Article
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {news.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-white/50 uppercase">
                        {n.date} • {n.category}
                      </span>
                      <h4 className="font-extrabold text-white text-base leading-snug">
                        {n.titleMalayalam}
                      </h4>
                      <p className="text-xs text-white/50">{n.titleEnglish}</p>
                    </div>

                    <button
                      onClick={() => deleteNewsItem(n.id)}
                      className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: PARTICIPANTS MANAGER */}
          {activeTab === 'participants' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white">Participants & Chest Numbers</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Bulk import candidate database via Excel / CSV, or register individually.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    Total: <strong className="text-emerald-400">{participants.length} Candidates</strong>
                  </span>
                </div>
              </div>

              {/* Section 1: Excel / CSV Bulk Upload & Template Download */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-white/5 to-black border border-emerald-500/30 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shrink-0">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>Bulk Import via Excel / CSV File</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                          .XLSX / .XLS / .CSV
                        </span>
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        Import all candidates instantly with Chest No, Name, Team, and Category.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSampleExcel}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Sample Excel Template</span>
                  </button>
                </div>

                {/* Upload Action Row */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <label className="w-full sm:w-auto flex-1 cursor-pointer">
                    <div className="p-4 rounded-2xl bg-black/40 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 transition-all flex items-center justify-center gap-3 group text-center">
                      <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">
                          {isUploading ? 'Importing Excel Data...' : 'Choose Excel or CSV File (.xlsx, .xls, .csv)'}
                        </span>
                        <span className="text-[10px] text-white/40 block">
                          Click to browse from your computer
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleExcelFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Upload Status / Feedback message */}
                {excelUploadStatus && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{excelUploadStatus}</span>
                  </div>
                )}
              </div>

              {/* Section 2: Single Participant Manual Registration */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newParticipant.chestNo) return;
                  addParticipant({
                    chestNo: newParticipant.chestNo.trim(),
                    name: newParticipant.name.trim() || `Candidate #${newParticipant.chestNo.trim()}`,
                    team: newParticipant.team,
                    category: newParticipant.category,
                    events: [
                      { name: 'General Event', stage: 'Stage 1', time: 'Jul 2, 10:00 AM', result: 'Registered', grade: 'A', points: 5 },
                    ],
                  });
                  setNewParticipant({ chestNo: '', name: '', team: standings[0]?.name || 'DAHFATAHAN', category: 'Senior' });
                  notify(`Participant #${newParticipant.chestNo} added!`);
                }}
                className="p-5 rounded-2xl bg-white/5 border border-white/15 grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs shadow-xl"
              >
                <div className="sm:col-span-6 font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Manual Single Participant Registration</span>
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">Chest No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 74"
                    value={newParticipant.chestNo}
                    onChange={(e) => setNewParticipant({ ...newParticipant, chestNo: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-white/60 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Candidate Name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">Team</label>
                  <select
                    value={newParticipant.team}
                    onChange={(e) => setNewParticipant({ ...newParticipant, team: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    {standings.map((t) => (
                      <option key={t.id || t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/60 mb-1">Category</label>
                  <select
                    value={newParticipant.category}
                    onChange={(e) => setNewParticipant({ ...newParticipant, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-amber-400 mb-1 font-bold">Login Password</label>
                  <div className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs truncate">
                    kuia@{newParticipant.chestNo.trim() || 'chestno'}
                  </div>
                </div>
                <div className="sm:col-span-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    + Register Single Candidate
                  </button>
                </div>
              </form>

              {/* Section 3: Search, Filters & Registered Candidates List */}
              <div className="space-y-4">
                {/* Stats Breakdown Bar */}
                {(() => {
                  const globalMaxStage = Number(registrationSettings.maxStagePerCandidate) || 4;
                  const globalMaxNonStage = Number(registrationSettings.maxNonStagePerCandidate) || 4;
                  const globalMaxTotal = globalMaxStage + globalMaxNonStage;

                  const unregCount = participants.filter((p) => getParticipantEventStats(p.chestNo).totalCount === 0).length;
                  const regCount = participants.filter((p) => getParticipantEventStats(p.chestNo).totalCount > 0).length;
                  const stageMaxCount = participants.filter((p) => getParticipantEventStats(p.chestNo).stageCount >= globalMaxStage).length;
                  const nonStageMaxCount = participants.filter((p) => getParticipantEventStats(p.chestNo).nonStageCount >= globalMaxNonStage).length;
                  const fullBookedCount = participants.filter((p) => getParticipantEventStats(p.chestNo).totalCount >= globalMaxTotal).length;

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setParticipantFilter('All')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          participantFilter === 'All'
                            ? 'bg-white/15 border-white/40 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-white/50 block">All Candidates</span>
                        <span className="text-xl font-black text-white">{participants.length}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParticipantFilter('Unregistered')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          participantFilter === 'Unregistered'
                            ? 'bg-amber-500/25 border-amber-400 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-amber-300 block">Non-Registered</span>
                        <span className="text-xl font-black text-amber-400">{unregCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParticipantFilter('Registered')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          participantFilter === 'Registered'
                            ? 'bg-emerald-500/25 border-emerald-400 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">Registered</span>
                        <span className="text-xl font-black text-emerald-400">{regCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParticipantFilter('StageMax')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          participantFilter === 'StageMax'
                            ? 'bg-purple-500/25 border-purple-400 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-purple-300 block">{globalMaxStage} Stage Max</span>
                        <span className="text-xl font-black text-purple-400">{stageMaxCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParticipantFilter('NonStageMax')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          participantFilter === 'NonStageMax'
                            ? 'bg-amber-500/25 border-amber-400 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-amber-300 block">{globalMaxNonStage} Non-Stage Max</span>
                        <span className="text-xl font-black text-amber-400">{nonStageMaxCount}</span>
                      </button>
                    </div>
                  );
                })()}

                {/* Filter & Search Bar */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="relative w-full md:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search by chest no, name, team..."
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Team Filter */}
                    <select
                      value={participantTeamFilter}
                      onChange={(e) => setParticipantTeamFilter(e.target.value)}
                      className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="All">All Teams</option>
                      {standings.map((t) => (
                        <option key={t.id || t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    {/* Sorting Selector */}
                    {(() => {
                      const totalLimitNum = (Number(registrationSettings.maxStagePerCandidate) || 4) + (Number(registrationSettings.maxNonStagePerCandidate) || 4);
                      return (
                        <select
                          value={participantSort}
                          onChange={(e) => setParticipantSort(e.target.value as any)}
                          className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-semibold"
                        >
                          <option value="chestNo">Sort by Chest No</option>
                          <option value="leastRegistered">Non-Registered First (0 → {totalLimitNum})</option>
                          <option value="mostRegistered">Most Registered First ({totalLimitNum} → 0)</option>
                          <option value="name">Sort by Name (A-Z)</option>
                        </select>
                      );
                    })()}
                  </div>
                </div>

                {/* Candidates List with Stage & Non-Stage Badges */}
                {(() => {
                  const filteredCandidates = participants
                    .filter((p) => {
                      const term = participantSearch.toLowerCase();
                      const matchesSearch =
                        String(p.chestNo).toLowerCase().includes(term) ||
                        (p.name && p.name.toLowerCase().includes(term)) ||
                        (p.team && p.team.toLowerCase().includes(term)) ||
                        (p.category && p.category.toLowerCase().includes(term));

                      const matchesTeam = participantTeamFilter === 'All' || p.team === participantTeamFilter;

                      const stats = getParticipantEventStats(p.chestNo);
                      let matchesFilter = true;
                      if (participantFilter === 'Unregistered') {
                        matchesFilter = stats.totalCount === 0;
                      } else if (participantFilter === 'Registered') {
                        matchesFilter = stats.totalCount > 0;
                      } else if (participantFilter === 'StageMax') {
                        matchesFilter = stats.stageCount >= stats.maxStage;
                      } else if (participantFilter === 'NonStageMax') {
                        matchesFilter = stats.nonStageCount >= stats.maxNonStage;
                      } else if (participantFilter === 'FullBooked') {
                        matchesFilter = stats.totalCount >= stats.maxTotal;
                      }

                      return matchesSearch && matchesTeam && matchesFilter;
                    })
                    .sort((a, b) => {
                      const statsA = getParticipantEventStats(a.chestNo);
                      const statsB = getParticipantEventStats(b.chestNo);

                      if (participantSort === 'mostRegistered') {
                        return statsB.totalCount - statsA.totalCount;
                      }
                      if (participantSort === 'leastRegistered') {
                        return statsA.totalCount - statsB.totalCount;
                      }
                      if (participantSort === 'name') {
                        return (a.name || '').localeCompare(b.name || '');
                      }
                      return (Number(a.chestNo) || 0) - (Number(b.chestNo) || 0);
                    });

                  return (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((p) => {
                          const stats = getParticipantEventStats(p.chestNo);
                          const isUnregistered = stats.totalCount === 0;
                          const isStageMax = stats.stageCount >= stats.maxStage;
                          const isNonStageMax = stats.nonStageCount >= stats.maxNonStage;
                          const isFullBooked = stats.totalCount >= stats.maxTotal;

                          return (
                            <div
                              key={p.chestNo}
                              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                isUnregistered
                                  ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                                  : 'bg-white/5 border-white/15 hover:bg-white/[0.08]'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                                  <span className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 font-mono font-black text-sm flex items-center justify-center text-white shrink-0 shadow-md">
                                    #{p.chestNo}
                                  </span>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-extrabold text-white text-base leading-tight">
                                        {p.name}
                                      </h4>

                                      {/* Participation Status Badges */}
                                      {isUnregistered ? (
                                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                                          Not Registered (0/{stats.maxTotal})
                                        </span>
                                      ) : (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                                              isStageMax
                                                ? 'bg-purple-600/30 text-purple-200 border-purple-400'
                                                : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                            }`}
                                          >
                                            Stage: {stats.stageCount}/{stats.maxStage} {isStageMax ? '(MAX)' : ''}
                                          </span>
                                          <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                                              isNonStageMax
                                                ? 'bg-amber-600/30 text-amber-200 border-amber-400'
                                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            }`}
                                          >
                                            Non-Stage: {stats.nonStageCount}/{stats.maxNonStage} {isNonStageMax ? '(MAX)' : ''}
                                          </span>
                                          <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                              isFullBooked
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-white/10 text-white/70'
                                            }`}
                                          >
                                            Total: {stats.totalCount}/{stats.maxTotal}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-white/60 mt-1 flex-wrap">
                                      <span>
                                        Team: <strong className="text-emerald-400">{p.team || p.sector || 'Team A'}</strong>
                                      </span>
                                      <span>•</span>
                                      <span className="px-2 py-0.2 rounded bg-white/10 text-white/80 font-semibold text-[11px]">
                                        {p.category}
                                      </span>
                                    </div>

                                    {/* Registered Programs Chips */}
                                    {stats.totalCount > 0 && (
                                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-bold text-white/40 uppercase">Programs:</span>
                                        {stats.stagePrograms.map((prog, i) => (
                                          <span
                                            key={`s-${i}`}
                                            className="px-2 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold flex items-center gap-1"
                                          >
                                            <span>Stage:</span>
                                            <span>{prog}</span>
                                          </span>
                                        ))}
                                        {stats.nonStagePrograms.map((prog, i) => (
                                          <span
                                            key={`ns-${i}`}
                                            className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                                          >
                                            <span>Non-Stage:</span>
                                            <span>{prog}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-center">
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs font-bold" title="Candidate Login Password">
                                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                    <span>kuia@{p.chestNo}</span>
                                  </div>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete participant #${p.chestNo} (${p.name})?`)) {
                                        deleteParticipant(p.chestNo);
                                        notify(`Deleted participant #${p.chestNo}`);
                                      }
                                    }}
                                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                                    title="Delete Participant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs">
                          No candidates match your search and filter criteria.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
