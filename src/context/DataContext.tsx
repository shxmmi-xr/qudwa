import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  MOCK_COMPETITIONS,
  MOCK_STANDINGS,
  MOCK_SCHEDULE,
  MOCK_GALLERY,
  MOCK_VIDEOS,
  MOCK_NEWS,
  DEMO_PARTICIPANTS,
  MOCK_PROGRAMS,
  CATEGORIES,
  Competition,
  TeamStanding,
  ScheduleItem,
  GalleryItem,
  MediaVideo,
  NewsItem,
  ProgramMaster,
  ProgramLimit,
  ProgramEntry,
  TeamPortalAccount,
  RegistrationSettings,
  DEFAULT_TEAM_ACCOUNTS,
  DEFAULT_REGISTRATION_SETTINGS,
  DEFAULT_PROGRAM_ENTRIES,
  FestivalNotification,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';
import { QUDWA_PROGRAMS, QUDWA_PROGRAM_LIMITS, QUDWA_SCHEDULE, QUDWA_COMPETITIONS } from '../data/qudwaCatalogue';
import { THEME_PRESETS, ThemePreset, siteConfig } from '../config/siteConfig';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface SiteBrand {
  eventName: string;
  year: string;
  dates: string;
  venue: string;
  themeBadge: string;
  themeTitle: string;
  themeSubtext: string;
  themeDescription: string;
  organization: string;
  subTitle: string;
  builtBy: string;
  hero3DStyle?: '1' | '2' | '3';
}

export interface DownloadItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  fileType: 'PDF' | 'DOC' | 'XLS' | 'IMG';
  url: string;
  date: string;
  color: 'amber' | 'emerald' | 'rose' | 'sky' | 'violet' | 'orange';
}

const DEFAULT_DOWNLOADS: DownloadItem[] = [
  {
    id: 'dl-word-games-manual',
    title: 'WORD GAMES - QUESTION & ANSWER MANUAL',
    subtitle: 'Jumbled Words, Missing Letters, Spelling, One Word Substitution (100 Q&A)',
    category: 'Study Material',
    fileType: 'PDF',
    url: '/downloads/word-games-manual.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-science-manual-en',
    title: 'SCIENCE MASTER MANUAL (English)',
    subtitle: 'Chemistry • Biology • Physics Comprehensive Question & Answer Manual',
    category: 'Study Material',
    fileType: 'PDF',
    url: '/downloads/science-master-manual-en.pdf',
    date: '2026-09-18',
    color: 'emerald',
  },
  {
    id: 'dl-science-manual-ml',
    title: 'SCIENCE MASTER MANUAL (Malayalam)',
    subtitle: 'രസതന്ത്രം • ജീവശാസ്ത്രം • ഭൗതികശാസ്ത്രം സമഗ്ര ചോദ്യോത്തര പഠന മാനുവൽ',
    category: 'Study Material',
    fileType: 'PDF',
    url: '/downloads/science-master-manual-ml.pdf',
    date: '2026-09-18',
    color: 'rose',
  },
  {
    id: 'dl-sub-junior-vocab',
    title: 'SUB-JUNIOR VOCABULARY MODULE',
    subtitle: 'English • Malayalam • العربية (Vocabulary Units & Model Question Sheets)',
    category: 'Study Material',
    fileType: 'PDF',
    url: '/downloads/sub-junior-vocabulary-module.pdf',
    date: '2026-09-18',
    color: 'sky',
  },
  {
    id: 'dl-1789707528034',
    title: 'MR.ENGLISH MODULE',
    subtitle: 'Official English Module',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/mr-english-module.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-1789707513604',
    title: 'MATH TALENT LEARNING MANUAL 1',
    subtitle: 'Math Talent Training Manual',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/math-talent-manual-1.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-1789707500354',
    title: 'LOGICAL REASONING MODULE',
    subtitle: 'Logical Reasoning Question Bank',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/logical-reasoning-module.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-1789707490146',
    title: 'GIO GIANT MODULE',
    subtitle: 'General Knowledge & Modules',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/gio-giant-module.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-1789707465428',
    title: 'GENERAL QUIZ FOCUS AREA',
    subtitle: 'Quiz Preparation & Focus Syllabus',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/general-quiz-focus-area.pdf',
    date: '2026-09-18',
    color: 'amber',
  },
  {
    id: 'dl-1789707453819',
    title: 'ana arabi junior',
    category: 'General',
    subtitle: 'Arabic Junior Learning Module',
    fileType: 'PDF',
    url: '/downloads/ana-arabi-junior.pdf',
    date: '2026-09-18',
    color: 'emerald',
  },
  {
    id: 'dl-1789545936029',
    title: 'SPORTS MEET GNRL',
    subtitle: 'Sports Regulations and Schedule',
    category: 'General',
    fileType: 'PDF',
    url: '/downloads/sports-meet-gnrl.pdf',
    date: '2026-09-16',
    color: 'orange',
  },
];

interface DataContextType {
  // Theme & Brand
  currentTheme: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
  setCustomColors: (primary: string, secondary: string, background?: string) => void;
  brand: SiteBrand;
  updateBrand: (newBrand: Partial<SiteBrand>) => void;

  // Data Center / Master Programs & Categories
  programs: ProgramMaster[];
  addProgram: (p: ProgramMaster) => void;
  updateProgram: (id: string, p: Partial<ProgramMaster>) => void;
  deleteProgram: (id: string) => void;
  categories: string[];
  addCategory: (cat: string) => void;
  deleteCategory: (cat: string) => void;

  // Competitions & Results
  competitions: Competition[];
  addCompetition: (comp: Competition) => void;
  updateCompetition: (id: string, comp: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  clearAllCompetitions: () => void;

  // Standings
  standings: TeamStanding[];
  updateStanding: (idOrName: string, data: Partial<TeamStanding>) => void;
  addStanding: (standing: any) => void;
  deleteStanding: (idOrName: string) => void;
  syncStandingsWithResults: () => void;

  // Schedule
  schedule: ScheduleItem[];
  addScheduleItem: (item: ScheduleItem) => void;
  updateScheduleItem: (id: string, item: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Media Videos
  videos: MediaVideo[];
  addVideo: (video: MediaVideo) => void;
  deleteVideo: (id: string) => void;

  // News
  news: NewsItem[];
  addNewsItem: (item: NewsItem) => void;
  updateNewsItem: (id: string, item: Partial<NewsItem>) => void;
  deleteNewsItem: (id: string) => void;

  // Bulletins & Notifications
  notifications: FestivalNotification[];
  addNotification: (notif: FestivalNotification) => void;
  updateNotification: (id: string, notif: Partial<FestivalNotification>) => void;
  deleteNotification: (id: string) => void;
  togglePinNotification: (id: string) => void;

  // Participants
  participants: any[];
  addParticipant: (p: any) => void;
  updateParticipant: (chestNo: string, p: any) => void;
  deleteParticipant: (chestNo: string) => void;
  importParticipantsBulk: (newBatch: any[]) => void;

  // Program Limits & Entry Desk
  programLimits: ProgramLimit[];
  updateProgramLimit: (programId: string, limits: Partial<ProgramLimit>) => void;
  getProgramLimit: (programId: string) => ProgramLimit | undefined;
  getParticipantEventStats: (chestNo: string) => {
    stageCount: number;
    nonStageCount: number;
    totalCount: number;
    stagePrograms: string[];
    nonStagePrograms: string[];
    canAddStage: boolean;
    canAddNonStage: boolean;
    maxStage: number;
    maxNonStage: number;
    maxTotal: number;
  };

  programEntries: ProgramEntry[];
  addProgramEntry: (entry: ProgramEntry) => { success: boolean; message: string };
  addProgramEntriesBulk: (entries: ProgramEntry[]) => { success: boolean; message: string; count: number };
  deleteProgramEntry: (entryId: string) => void;
  importProgramEntriesBulk: (newEntries: ProgramEntry[]) => void;

  teamAccounts: TeamPortalAccount[];
  updateTeamAccount: (id: string, acc: Partial<TeamPortalAccount>) => void;
  teamLogin: (username: string, pass: string) => TeamPortalAccount | null;

  registrationSettings: RegistrationSettings;
  updateRegistrationSettings: (newSettings: Partial<RegistrationSettings>) => void;
  toggleEntranceLock: (isLocked?: boolean) => void;

  // Admin Auth & Credentials
  isAdminLoggedIn: boolean;
  adminCredentials: { username: string };
  updateAdminCredentials: (username: string, pass: string) => boolean;
  adminLogin: (id: string, pass: string) => boolean;
  adminLogout: () => void;

  // Downloads
  downloads: DownloadItem[];
  addDownload: (item: DownloadItem) => void;
  updateDownload: (id: string, item: Partial<DownloadItem>) => void;
  deleteDownload: (id: string) => void;

  // Live Festival Setup & Resets
  clearAllDemoData: (mode?: 'fresh_festival' | 'wipe_all') => void;
  resetAllToDefaults: () => void;

  // Cloud Database (Supabase)
  isSupabaseConnected: boolean;
  syncLocalToSupabase: () => Promise<{ success: boolean; message: string }>;
}

// Helper function to rank standings. FEST RULE: If a team has 0 points, they are NOT given a position / rank (rank = 0)
export const assignStandingsRanks = (
  list: { id: string; name: string; points: number; gold: number; silver: number; bronze: number; rank?: number }[]
): TeamStanding[] => {
  const sorted = [...list].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.bronze - a.bronze;
  });

  let currentRank = 0;
  return sorted.map((team, idx) => {
    const pts = Number(team.points) || 0;
    // Fest rule: strictly no rank/positioning if points are 0 or less
    if (pts <= 0) {
      return {
        ...team,
        points: 0,
        gold: Number(team.gold) || 0,
        silver: Number(team.silver) || 0,
        bronze: Number(team.bronze) || 0,
        rank: 0,
      };
    }

    // Tie-break: if points and all medals equal previous team, share same rank
    if (
      idx > 0 &&
      sorted[idx - 1].points === pts &&
      sorted[idx - 1].gold === team.gold &&
      sorted[idx - 1].silver === team.silver &&
      sorted[idx - 1].bronze === team.bronze
    ) {
      return {
        ...team,
        points: pts,
        gold: Number(team.gold) || 0,
        silver: Number(team.silver) || 0,
        bronze: Number(team.bronze) || 0,
        rank: currentRank,
      };
    } else {
      currentRank = idx + 1;
      return {
        ...team,
        points: pts,
        gold: Number(team.gold) || 0,
        silver: Number(team.silver) || 0,
        bronze: Number(team.bronze) || 0,
        rank: currentRank,
      };
    }
  });
};

// Helper function to calculate precise points for a winner based on competition rules
export const calculateWinnerPoints = (
  position: number | null | undefined,
  grade: string | undefined,
  category: string | undefined,
  type: string | undefined
): number => {
  // 1. Grade points: A grade (A+, A) = 5 points, B grade (B+, B) = 3 points
  let gradePoints = 0;
  const cleanGrade = (grade || '').trim().toUpperCase();
  if (cleanGrade.startsWith('A')) {
    gradePoints = 5;
  } else if (cleanGrade.startsWith('B')) {
    gradePoints = 3;
  }

  // 2. Position points:
  let positionPoints = 0;
  const isGeneral = category === 'General';
  const isGroup = type === 'Group';

  if (isGeneral) {
    // General program: 1st place = 10 pts, 2nd & 3rd = 0 pts
    if (position === 1) positionPoints = 10;
    else positionPoints = 0;
  } else if (isGroup) {
    // Group program: 1st place = 7 pts, 2nd place = 5 pts, 3rd place = 0 pts
    if (position === 1) positionPoints = 7;
    else if (position === 2) positionPoints = 5;
    else positionPoints = 0;
  } else {
    // Individual program: 1st = 3 pts, 2nd = 2 pts, 3rd = 1 pt
    if (position === 1) positionPoints = 3;
    else if (position === 2) positionPoints = 2;
    else if (position === 3) positionPoints = 1;
    else positionPoints = 0;
  }

  return positionPoints + gradePoints;
};

// Helper function to calculate precise team standings from published competition results
export const computeStandingsFromCompetitionsList = (
  comps: Competition[],
  existingStandings: TeamStanding[] = []
): TeamStanding[] => {
  const map = new Map<string, { id: string; name: string; points: number; gold: number; silver: number; bronze: number }>();

  // Ensure known teams from existing standings are initialized to 0 points & medals
  existingStandings.forEach((s) => {
    const trimmed = s.name?.trim();
    if (trimmed) {
      map.set(trimmed.toLowerCase(), {
        id: s.id || `team-${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
        name: trimmed,
        points: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
      });
    }
  });

  // Tally points and medals from all published competitions
  comps.forEach((comp) => {
    if (comp.status === 'Published' && comp.winners && Array.isArray(comp.winners)) {
      comp.winners.forEach((w) => {
        if (!w || (w as any).canceled) return;
        const teamName = (w.team || w.sector || '').trim();
        if (!teamName) return;
        const key = teamName.toLowerCase();

        if (!map.has(key)) {
          map.set(key, {
            id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: teamName,
            points: 0,
            gold: 0,
            silver: 0,
            bronze: 0,
          });
        }

        const team = map.get(key)!;
        const pts = w.points !== undefined && w.points !== null
          ? Number(w.points)
          : calculateWinnerPoints(w.position, w.grade, comp.category, comp.type);
        team.points += pts;

        if (w.position === 1) {
          team.gold += 1;
        } else if (w.position === 2) {
          team.silver += 1;
        } else if (w.position === 3) {
          team.bronze += 1;
        }
      });
    }
  });

  return assignStandingsRanks(Array.from(map.values()));
};

export const sanitizeBrand = (b?: any): SiteBrand => ({
  eventName: 'QUDWA',
  year: '2026',
  dates: 'OCT 12 13 14',
  venue: 'KANNIYATH USTHAD ISLAMIC ACADEMY',
  themeBadge: 'فبهداهم اقتده',
  themeTitle: 'QUDWA',
  themeSubtext: 'KUIA Arts Fest',
  themeDescription: b?.themeDescription || siteConfig.themeDescription,
  organization: 'KUIA ARTS FEST',
  subTitle: 'KUIA ARTS FEST',
  builtBy: b?.builtBy || 'Shxmmi',
  hero3DStyle: b?.hero3DStyle || '1',
});

export const syncAccountsWithStandingsList = (
  standingsList: TeamStanding[],
  existingAccounts: TeamPortalAccount[]
): TeamPortalAccount[] => {
  if (!standingsList || standingsList.length === 0) return existingAccounts || [];

  return standingsList.map((team, idx) => {
    const clean = team.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = existingAccounts?.find(
      (a) =>
        a.teamName.toLowerCase().trim() === team.name.toLowerCase().trim() ||
        a.id === team.id ||
        a.id === `team-acc-${clean}` ||
        (idx === 0 && (a.id === 'team-acc-a' || a.id === 'team-acc-dahfatahan')) ||
        (idx === 1 && (a.id === 'team-acc-b' || a.id === 'team-acc-badfathan'))
    );

    return {
      id: existing?.id || `team-acc-${clean || idx}`,
      teamName: team.name,
      username: existing?.username || clean || `team_${idx + 1}`,
      password: existing?.password || `${clean || 'team'}@2026`,
    };
  });
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Realtime Broadcast Channel reference for instant (<100ms) multi-device synchronization
  const realtimeChannelRef = useRef<any>(null);

  const broadcastChange = (table: string, action?: string) => {
    try {
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'festival_data_updated',
          payload: { table, action, timestamp: Date.now() },
        });
      }
    } catch (e) {
      console.warn('[Realtime Broadcast] Send error:', e);
    }
  };

  // Helpers to persist locally without triggering loop and update state only when data changed
  const persistLocalOnly = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // If full array exceeds browser localStorage quota (5MB limit),
      // keep full state in memory and store lightweight metadata locally
      try {
        if (Array.isArray(data)) {
          const safeData = data.map((item: any) => {
            if (key === 'sahitya_videos' && item.videoUrl?.startsWith('data:')) {
              return { ...item, videoUrl: '' };
            }
            if (key === 'sahitya_downloads' && item.url?.startsWith('data:')) {
              return { ...item, url: '' };
            }
            if (key === 'sahitya_gallery' && item.image?.startsWith('data:') && item.image.length > 250000) {
              return { ...item, image: '' };
            }
            return item;
          });
          localStorage.setItem(key, JSON.stringify(safeData));
        }
      } catch (inner) {
        console.warn('localStorage quota reached, preserved in-memory & cloud:', inner);
      }
    }
  };

  const updateStateIfChanged = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, nextVal: T, storageKey?: string) => {
    setter((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(nextVal)) return prev;
      return nextVal;
    });
    if (storageKey) {
      persistLocalOnly(storageKey, nextVal);
    }
  };

  const mapProgramEntryToRow = (e: ProgramEntry) => {
    const participants = Array.isArray(e.participants) ? e.participants : [];
    const firstP = participants[0];
    return {
      id: e.id,
      program_id: e.programId,
      team: e.team,
      candidate_chest_no: firstP?.chestNo || '',
      candidate_name: firstP?.name || '',
      candidate_category: e.category || '',
      group_members: participants.map((p) => ({
        chestNo: p.chestNo,
        name: p.name,
        team: p.team || e.team,
        category: p.category || e.category,
        _meta: {
          programId: e.programId,
          programCode: e.programCode || '',
          programName: e.programName,
          category: e.category,
          type: e.type,
          stageType: e.stageType || 'Stage',
        },
      })),
      set_number: e.setNumber || 1,
      submitted_at: e.registeredAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [brand, setBrand] = useState<SiteBrand>(() => sanitizeBrand());

  // Data Center Master Programs & Categories
  const [programs, setPrograms] = useState<ProgramMaster[]>(MOCK_PROGRAMS);
  const [categories, setCategories] = useState<string[]>(
    CATEGORIES.filter((c) => c !== 'All Categories')
  );

  // Content items (default to clean/live state)
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notifications, setNotifications] = useState<FestivalNotification[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // Program Limits & Program Entry State
  const [programLimits, setProgramLimits] = useState<ProgramLimit[]>(() => {
    return QUDWA_PROGRAM_LIMITS;
  });
  const [programEntries, setProgramEntries] = useState<ProgramEntry[]>(DEFAULT_PROGRAM_ENTRIES);
  const [teamAccounts, setTeamAccounts] = useState<TeamPortalAccount[]>(DEFAULT_TEAM_ACCOUNTS);
  const [registrationSettings, setRegistrationSettings] = useState<RegistrationSettings>(DEFAULT_REGISTRATION_SETTINGS);

  // Admin auth & credentials
  const DEFAULT_ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin@2026',
  };
  const [adminCredentials, setAdminCredentials] = useState<{ username: string; password: string }>(DEFAULT_ADMIN_CREDENTIALS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Initialize and load saved data from localStorage on client side
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('sahitya_theme');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed?.id !== 'qudwa-maroon-cream' || parsed?.primary !== '#6C0E0E') {
            setCurrentTheme(THEME_PRESETS[0]);
            localStorage.setItem('sahitya_theme', JSON.stringify(THEME_PRESETS[0]));
          } else {
            setCurrentTheme(parsed);
          }
        } catch {
          setCurrentTheme(THEME_PRESETS[0]);
        }
      }

      const savedBrand = localStorage.getItem('sahitya_brand');
      if (savedBrand) {
        try {
          const parsed = JSON.parse(savedBrand);
          setBrand(sanitizeBrand(parsed));
        } catch {
          setBrand(sanitizeBrand());
        }
      }

      const savedPrograms = localStorage.getItem('sahitya_programs');
      if (savedPrograms) setPrograms(JSON.parse(savedPrograms));

      const savedCategories = localStorage.getItem('sahitya_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedComps = localStorage.getItem('sahitya_competitions');
      const loadedComps: Competition[] = savedComps ? JSON.parse(savedComps) : [];
      setCompetitions(loadedComps);

      const savedStandings = localStorage.getItem('sahitya_standings');
      const rawStandings = savedStandings ? JSON.parse(savedStandings) : [];
      const syncedStandings = computeStandingsFromCompetitionsList(loadedComps, rawStandings);
      setStandings(syncedStandings);

      const savedSchedule = localStorage.getItem('sahitya_schedule');
      if (savedSchedule) setSchedule(JSON.parse(savedSchedule));

      const savedGallery = localStorage.getItem('sahitya_gallery');
      if (savedGallery) setGallery(JSON.parse(savedGallery));

      const savedVideos = localStorage.getItem('sahitya_videos');
      if (savedVideos !== null) {
        try {
          const parsed = JSON.parse(savedVideos);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.map((v: any) => {
              let url = v.videoUrl || '';
              if (v.title?.toUpperCase().includes('LOGO') && (!url || url.startsWith('data:'))) {
                url = '/media/logo-revealing.mp4';
              }
              return {
                ...v,
                videoUrl: url,
                thumbnail: v.thumbnail || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
              };
            });
            setVideos(cleaned);
          }
        } catch (e) {}
      }

      const savedNews = localStorage.getItem('sahitya_news');
      if (savedNews) setNews(JSON.parse(savedNews));

      const savedNotifs = localStorage.getItem('sahitya_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedParticipants = localStorage.getItem('sahitya_participants');
      if (savedParticipants) setParticipants(JSON.parse(savedParticipants));

      const savedLimits = localStorage.getItem('sahitya_program_limits');
      if (savedLimits) setProgramLimits(JSON.parse(savedLimits));

      const savedEntries = localStorage.getItem('sahitya_program_entries');
      if (savedEntries) {
        try {
          const parsed = JSON.parse(savedEntries);
          // Purge legacy demo entries
          const cleaned = Array.isArray(parsed)
            ? parsed.filter((e: any) => e.id !== 'entry-1' && e.id !== 'entry-2' && e.id !== 'entry-3')
            : [];
          setProgramEntries(cleaned);
          localStorage.setItem('sahitya_program_entries', JSON.stringify(cleaned));
        } catch {
          setProgramEntries([]);
        }
      } else {
        setProgramEntries([]);
      }

      const savedAccounts = localStorage.getItem('sahitya_team_accounts');
      if (savedAccounts) setTeamAccounts(JSON.parse(savedAccounts));

      const savedSettings = localStorage.getItem('sahitya_registration_settings');
      if (savedSettings) setRegistrationSettings(JSON.parse(savedSettings));

      // Downloads are always fetched fresh from Supabase — no localStorage restore needed

      const savedAdminCreds = localStorage.getItem('sahitya_admin_credentials');
      if (savedAdminCreds) {
        try {
          setAdminCredentials(JSON.parse(savedAdminCreds));
        } catch (e) {}
      }

      const savedAuth = localStorage.getItem('festival_admin_auth') || localStorage.getItem('sahitya_admin_auth');
      if (savedAuth === 'true') setIsAdminLoggedIn(true);
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  const isFetchingRef = useRef(false);

  // Fetch from Supabase Cloud Database (Parallel & Resilient)
  const fetchFromSupabase = async () => {
    if (!supabase || !isSupabaseConfigured() || isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      // Execute all independent table queries concurrently for ultra-fast load
      const [
        brandRes,
        compsRes,
        standingsRes,
        notifsRes,
        progsRes,
        catsRes,
        teamsRes,
        partsRes,
        dlRes,
        schedRes,
        galRes,
        vidRes,
        entriesRes,
        newsRes,
      ] = await Promise.allSettled([
        supabase.from('fest_brand').select('*').eq('id', 'active').maybeSingle(),
        supabase.from('fest_competitions').select('*').order('result_number', { ascending: false }),
        supabase.from('fest_standings').select('*').order('points', { ascending: false }),
        supabase.from('fest_notifications').select('*').order('timestamp', { ascending: false }),
        supabase.from('fest_programs').select('*'),
        supabase.from('fest_categories').select('*'),
        supabase.from('fest_team_accounts').select('*'),
        supabase.from('fest_participants').select('*'),
        supabase.from('fest_downloads').select('*'),
        supabase.from('fest_schedule').select('*').order('day', { ascending: true }),
        supabase.from('fest_gallery').select('*'),
        supabase.from('fest_videos').select('id, title, speaker, thumbnail, platform, youtube_id, instagram_url, video_url, duration, updated_at'),
        supabase.from('fest_program_entries').select('*'),
        supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle(),
      ]);

      // 1. Brand & Theme
      if (brandRes.status === 'fulfilled' && brandRes.value.data) {
        const brandRow = brandRes.value.data;
        if (brandRow?.brand_data && Object.keys(brandRow.brand_data).length > 0) {
          const cleanBrand = sanitizeBrand(brandRow.brand_data);
          updateStateIfChanged(setBrand, cleanBrand, 'sahitya_brand');
        }
        if (brandRow?.theme_data?.id) {
          updateStateIfChanged(setCurrentTheme, brandRow.theme_data, 'sahitya_theme');
        }
      }

      // 2. Competitions
      if (compsRes.status === 'fulfilled' && compsRes.value.data) {
        const compsData = compsRes.value.data;
        const mappedComps: Competition[] = compsData.map((c: any) => ({
          id: c.id,
          resultNumber: c.result_number,
          name: c.name,
          category: c.category,
          type: c.type,
          stageType: c.stage_type || 'Stage',
          stage: c.stage || 'Main Stage',
          status: c.status,
          winners: c.winners || [],
        }));
        updateStateIfChanged(setCompetitions, mappedComps, 'sahitya_competitions');
      }

      // 3. Standings
      let loadedStandingsFromCloud: TeamStanding[] = [];
      if (standingsRes.status === 'fulfilled' && standingsRes.value.data) {
        const standingsData = standingsRes.value.data;
        const mappedStandings = standingsData.map((s: any) => ({
          id: s.id,
          name: s.name,
          points: Number(s.points) || 0,
          gold: Number(s.gold) || 0,
          silver: Number(s.silver) || 0,
          bronze: Number(s.bronze) || 0,
        }));
        loadedStandingsFromCloud = assignStandingsRanks(mappedStandings);
        updateStateIfChanged(setStandings, loadedStandingsFromCloud, 'sahitya_standings');
      }

      // 4. Notifications
      if (notifsRes.status === 'fulfilled' && notifsRes.value.data) {
        const notifsData = notifsRes.value.data;
        const mappedNotifs: FestivalNotification[] = notifsData.map((n: any) => {
          let summary = n.message || '';
          let content: string[] = [n.message || ''];
          let targetAudience = n.target_audience || 'All Teams & Public';
          let date = n.date || '';

          if (typeof n.message === 'string' && n.message.startsWith('{') && n.message.endsWith('}')) {
            try {
              const parsed = JSON.parse(n.message);
              if (parsed.summary) summary = parsed.summary;
              if (Array.isArray(parsed.content)) content = parsed.content;
              else if (parsed.content) content = [parsed.content];
              if (parsed.targetAudience) targetAudience = parsed.targetAudience;
              if (parsed.date) date = parsed.date;
            } catch (e) {}
          }

          // Priority: check n.tag or n.priority
          let priority: 'Urgent' | 'High' | 'Normal' = 'Normal';
          const rawTag = (n.priority || n.tag || '').toString().toLowerCase();
          if (rawTag.includes('urgent')) priority = 'Urgent';
          else if (rawTag.includes('high')) priority = 'High';
          else priority = 'Normal';

          // Category: check n.category or n.type
          const category = n.category || n.type || 'General';

          return {
            id: n.id,
            title: n.title,
            summary: summary || n.title,
            description: summary,
            content: content.length > 0 && content[0] ? content : [summary || n.title],
            category: category as any,
            priority,
            targetAudience,
            date: date || (n.timestamp ? new Date(n.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Festival Day'),
            time: n.time || '',
            isPinned: Boolean(n.is_pinned),
            attachmentName: n.attachment_name,
            attachmentUrl: n.attachment_url,
            attachmentType: n.attachment_type || 'pdf',
            attachmentSize: n.attachment_size,
          };
        });
        updateStateIfChanged(setNotifications, mappedNotifs, 'sahitya_notifications');
      }

      // 5. Programs
      if (progsRes.status === 'fulfilled' && progsRes.value.data) {
        const progsData = progsRes.value.data;
        const mappedProgs: ProgramMaster[] = progsData.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          category: p.category,
          type: p.type,
          stageType: p.stage_type || 'Stage',
          maxScore: p.max_score,
        }));
        updateStateIfChanged(setPrograms, mappedProgs, 'sahitya_programs');
      }

      // 6. Categories
      if (catsRes.status === 'fulfilled' && catsRes.value.data) {
        const catData = catsRes.value.data;
        const cats = catData.map((c: any) => c.name);
        updateStateIfChanged(setCategories, cats, 'sahitya_categories');
      }

      // 7. Team Accounts
      let mappedTeams: TeamPortalAccount[] = [];
      if (teamsRes.status === 'fulfilled' && teamsRes.value.data) {
        const teamData = teamsRes.value.data;
        mappedTeams = teamData.map((t: any) => ({
          id: t.id,
          teamName: t.team_name,
          username: t.username,
          password: t.password,
        }));
      }
      const targetStandingsForTeams = loadedStandingsFromCloud.length > 0 ? loadedStandingsFromCloud : (standings.length > 0 ? standings : MOCK_STANDINGS);
      const syncedTeams = syncAccountsWithStandingsList(targetStandingsForTeams, mappedTeams);
      updateStateIfChanged(setTeamAccounts, syncedTeams, 'sahitya_team_accounts');

      // 8. Participants
      if (partsRes.status === 'fulfilled' && partsRes.value.data) {
        const partData = partsRes.value.data;
        const mappedParts = partData.map((p: any) => ({
          id: p.id,
          chestNo: p.chest_no,
          name: p.name,
          team: p.team,
          category: p.category,
          dob: p.dob,
          events: p.events || [],
          photo: p.photo,
          sector: p.sector,
        }));
        updateStateIfChanged(setParticipants, mappedParts, 'sahitya_participants');
      }

      // 9. Downloads
      if (dlRes.status === 'fulfilled' && dlRes.value.data) {
        const dlData = dlRes.value.data;
        const mappedDl: DownloadItem[] = dlData.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          category: d.category,
          fileType: d.file_type,
          url: d.url,
          date: d.date,
          color: d.color,
        }));
        updateStateIfChanged(setDownloads, mappedDl, 'sahitya_downloads');
      }

      // 10. Schedule
      if (schedRes.status === 'fulfilled' && schedRes.value.data) {
        const schedData = schedRes.value.data;
        const mappedSched: ScheduleItem[] = schedData.map((s: any) => ({
          id: s.id,
          day: s.day !== undefined && s.day !== null ? Number(s.day) : 1,
          date: s.date || '',
          time: s.time || '',
          title: s.title,
          category: s.category || 'General',
          stage: s.stage || 'Main Stage',
          status: s.status || 'Upcoming',
        }));
        updateStateIfChanged(setSchedule, mappedSched, 'sahitya_schedule');
      }

      // 11. Gallery (Multi-device instant synchronization)
      if (galRes.status === 'fulfilled' && Array.isArray(galRes.value.data)) {
        const galData = galRes.value.data;
        const mappedGal: GalleryItem[] = galData.map((g: any) => ({
          id: g.id,
          title: g.title || '',
          image: g.image,
          category: g.category || 'General',
        }));
        updateStateIfChanged(setGallery, mappedGal, 'sahitya_gallery');
      }

      // 12. Videos (Instant multi-device synchronization)
      if (vidRes.status === 'fulfilled' && Array.isArray(vidRes.value.data)) {
        const vidData = vidRes.value.data;
        const mappedVid: MediaVideo[] = vidData.map((v: any) => {
          let resolvedUrl = v.video_url || '';
          if (v.title?.toUpperCase().includes('LOGO') && (!resolvedUrl || resolvedUrl.startsWith('data:'))) {
            resolvedUrl = '/media/logo-revealing.mp4';
          }
          return {
            id: v.id,
            title: v.title,
            speaker: v.speaker || '',
            thumbnail: v.thumbnail || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            platform: v.platform || 'youtube',
            youtubeId: v.youtube_id,
            instagramUrl: v.instagram_url,
            videoUrl: resolvedUrl,
            duration: v.duration || '',
          };
        });
        updateStateIfChanged(setVideos, mappedVid, 'sahitya_videos');
      }

      // 13. Program Entries
      if (entriesRes.status === 'fulfilled' && entriesRes.value.data) {
        const entryData = entriesRes.value.data;
        const currentProgs = (progsRes.status === 'fulfilled' && Array.isArray(progsRes.value.data))
          ? progsRes.value.data
          : programs;

        const mappedEntries: ProgramEntry[] = entryData.map((e: any) => {
          const firstMember = Array.isArray(e.group_members) && e.group_members.length > 0 ? e.group_members[0] : null;
          const meta = firstMember?._meta || (typeof e.group_members === 'object' && !Array.isArray(e.group_members) ? (e.group_members as any)?._meta : null) || {};
          const prog = currentProgs.find(
            (p: any) => p.id === e.program_id || (p.code && p.code === e.program_id) || (p.name && meta.programName && p.name.toLowerCase() === meta.programName.toLowerCase())
          );

          let participants: { chestNo: string; name: string; team: string; category?: string }[] = [];
          if (Array.isArray(e.group_members) && e.group_members.length > 0) {
            participants = e.group_members.map((m: any) => ({
              chestNo: String(m.chestNo || '').trim(),
              name: m.name || (m.chestNo ? `Candidate #${m.chestNo}` : `${e.team} Participant`),
              team: m.team || e.team,
              category: m.category || e.candidate_category || prog?.category || 'General',
            }));
          } else if (e.candidate_chest_no) {
            participants = [{
              chestNo: String(e.candidate_chest_no).trim(),
              name: e.candidate_name || `Candidate #${e.candidate_chest_no}`,
              team: e.team,
              category: e.candidate_category || prog?.category || 'General',
            }];
          } else {
            participants = [{
              chestNo: '-',
              name: `${e.team} Submission`,
              team: e.team,
              category: e.candidate_category || prog?.category || 'General',
            }];
          }

          return {
            id: e.id,
            programId: e.program_id,
            programCode: meta.programCode || prog?.code || '',
            programName: meta.programName || prog?.name || 'Program',
            category: meta.category || e.candidate_category || prog?.category || 'General',
            type: meta.type || prog?.type || (participants.length > 1 ? 'Group' : 'Individual'),
            stageType: meta.stageType || prog?.stage_type || prog?.stageType || 'Stage',
            team: e.team,
            setNumber: e.set_number || 1,
            participants,
            registeredAt: e.submitted_at || e.updated_at || new Date().toLocaleString(),
          };
        });
        updateStateIfChanged(setProgramEntries, mappedEntries, 'sahitya_program_entries');
      }

      // 14. News Feed & Program Limits & Registration Settings (from fest_settings row 'news_feed')
      if (newsRes.status === 'fulfilled' && newsRes.value.data) {
        const newsRow = newsRes.value.data;
        const cloudNews: NewsItem[] = Array.isArray(newsRow.admin?.items) ? newsRow.admin.items : [];
        if (cloudNews.length > 0) {
          updateStateIfChanged(setNews, cloudNews, 'sahitya_news');
        } else {
          // If cloud is empty, check if this device has any locally uploaded news to auto-push
          if (typeof window !== 'undefined') {
            const savedNews = localStorage.getItem('sahitya_news');
            if (savedNews) {
              try {
                const parsed = JSON.parse(savedNews);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setNews(parsed);
                  syncNewsToCloud(parsed);
                }
              } catch (e) {}
            }
          }
        }

        // Program Limits (NM Rules)
        if (Array.isArray(newsRow.program_limits) && newsRow.program_limits.length > 0) {
          updateStateIfChanged(setProgramLimits, newsRow.program_limits, 'sahitya_program_limits');
        }

        // Registration Settings
        if (newsRow.registration) {
          updateStateIfChanged(setRegistrationSettings, newsRow.registration, 'sahitya_registration_settings');
        }
      }

      setIsSupabaseConnected(true);
    } catch (e) {
      console.warn('Supabase fetch failed; cached local state will be used:', e);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Realtime Supabase Sync Subscription & Fast Polling Fallback (Mobile-optimized)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    // Initial fetch on mount
    fetchFromSupabase();

    // 1. Realtime WebSocket subscription with Broadcast Channel (<100ms multi-device updates)
    const channel = supabase
      .channel('fest_realtime_stream')
      .on('broadcast', { event: 'festival_data_updated' }, (payload) => {
        console.log('[Realtime Broadcast] Received instant update:', payload);
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_competitions' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_standings' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_notifications' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_brand' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_programs' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_categories' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_team_accounts' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_participants' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_downloads' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_schedule' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_gallery' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_videos' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_program_entries' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fest_settings' }, () => {
        fetchFromSupabase();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSupabaseConnected(true);
        }
      });

    realtimeChannelRef.current = channel;

    // 2. Heartbeat Polling Fallback (Every 20 seconds)
    // Ensures mobile browsers where WebSockets may sleep or disconnect stay 100% up-to-date
    const pollInterval = setInterval(() => {
      fetchFromSupabase();
    }, 20000);

    // 3. Immediately refresh when user switches tabs or wakes up mobile phone
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFromSupabase();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-primary-glow', currentTheme.primaryGlow);
    root.style.setProperty('--color-secondary', currentTheme.secondary);
    root.style.setProperty('--color-secondary-glow', currentTheme.secondaryGlow);
    root.style.setProperty('--color-bg', currentTheme.background);
    root.style.setProperty('--color-surface', currentTheme.surface);
  }, [currentTheme]);

  // Automatic Background Cloud Sync Helper
  const autoSyncToSupabase = async (key: string, data: any) => {
    if (!supabase || !isSupabaseConfigured()) return;
    try {
      switch (key) {
        case 'sahitya_brand':
          await supabase.from('fest_brand').upsert({
            id: 'active',
            brand_data: data,
            theme_data: currentTheme,
            updated_at: new Date().toISOString(),
          });
          break;

        case 'sahitya_theme':
          await supabase.from('fest_brand').upsert({
            id: 'active',
            brand_data: brand,
            theme_data: data,
            updated_at: new Date().toISOString(),
          });
          break;

        case 'sahitya_competitions':
          if (Array.isArray(data)) {
            const compRows = data.map((c: any) => ({
              id: c.id,
              result_number: c.resultNumber,
              name: c.name,
              category: c.category,
              type: c.type,
              stage_type: c.stageType || 'Stage',
              stage: c.stage || 'Main Stage',
              status: c.status,
              winners: c.winners || [],
              updated_at: new Date().toISOString(),
            }));
            if (data.length === 0) {
              await supabase.from('fest_competitions').delete().neq('id', '___none___');
            } else {
              await supabase.from('fest_competitions').upsert(compRows);
            }
          }
          break;

        case 'sahitya_standings':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_standings').delete().neq('id', '___none___');
            } else {
              const ranked = assignStandingsRanks(data);
              const standRows = ranked.map((s: any) => ({
                id: s.id || `team-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                rank: (Number(s.points) || 0) > 0 ? (s.rank || 0) : 0,
                name: s.name,
                points: Number(s.points) || 0,
                gold: Number(s.gold) || 0,
                silver: Number(s.silver) || 0,
                bronze: Number(s.bronze) || 0,
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_standings').upsert(standRows, { onConflict: 'name' });
            }
          }
          break;

        case 'sahitya_notifications':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_notifications').delete().neq('id', '___none___');
            } else {
              const notifRows = data.map((n: any) => {
                const messagePayload = JSON.stringify({
                  summary: n.summary || n.title,
                  content: n.content && n.content.length > 0 ? n.content : [n.summary || n.title],
                  targetAudience: n.targetAudience || 'All Attendees',
                  date: n.date || '',
                });
                return {
                  id: n.id,
                  title: n.title,
                  message: messagePayload,
                  time: n.time || '',
                  timestamp: n.timestamp || Date.now(),
                  type: n.category || 'General',
                  tag: n.priority || 'Normal',
                  is_pinned: Boolean(n.isPinned),
                  link: n.attachmentUrl || '',
                  attachment_url: n.attachmentUrl || '',
                  attachment_name: n.attachmentName || '',
                  updated_at: new Date().toISOString(),
                };
              });
              await supabase.from('fest_notifications').upsert(notifRows);
            }
          }
          break;

        case 'sahitya_programs':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_programs').delete().neq('id', '___none___');
            } else {
              const progRows = data.map((p: any) => ({
                id: p.id,
                code: p.code || '',
                name: p.name,
                category: p.category,
                type: p.type,
                stage_type: p.stageType || 'Stage',
                max_score: p.maxScore || 100,
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_programs').upsert(progRows);
            }
          }
          break;

        case 'sahitya_categories':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_categories').delete().neq('id', '___none___');
            } else {
              const catRows = data.map((c: string) => ({
                id: `cat-${c.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: c,
              }));
              await supabase.from('fest_categories').upsert(catRows, { onConflict: 'name' });
            }
          }
          break;

        case 'sahitya_team_accounts':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_team_accounts').delete().neq('id', '___none___');
            } else {
              const teamRows = data.map((t: any) => ({
                id: t.id,
                team_name: t.teamName,
                username: t.username,
                password: t.password,
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_team_accounts').upsert(teamRows, { onConflict: 'team_name' });
            }
          }
          break;

        case 'sahitya_participants':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_participants').delete().neq('id', '___none___');
            } else {
              const partRows = data.map((p: any) => ({
                id: p.id || `part-${p.chestNo}`,
                chest_no: p.chestNo,
                name: p.name,
                team: p.team,
                category: p.category,
                dob: p.dob || '',
                events: p.events || [],
                photo: p.photo || '',
                sector: p.sector || '',
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_participants').upsert(partRows, { onConflict: 'chest_no' });
            }
          }
          break;

        case 'sahitya_downloads':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_downloads').delete().neq('id', '___none___');
            } else {
              const dlRows = data.map((d: any) => ({
                id: d.id,
                title: d.title,
                subtitle: d.subtitle || '',
                category: d.category || 'General',
                file_type: d.fileType || 'PDF',
                url: d.url,
                date: d.date || new Date().toISOString().slice(0, 10),
                color: d.color || 'amber',
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_downloads').upsert(dlRows);
            }
          }
          break;

        case 'sahitya_schedule':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_schedule').delete().neq('id', '___none___');
            } else {
              const schedRows = data.map((s: any) => ({
                id: s.id,
                day: s.day !== undefined && s.day !== null ? Number(s.day) : 1,
                date: s.date || '',
                time: s.time || '',
                title: s.title,
                category: s.category || 'General',
                stage: s.stage || 'Main Stage',
                status: s.status || 'Upcoming',
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_schedule').upsert(schedRows);
            }
          }
          break;

        case 'sahitya_gallery':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_gallery').delete().neq('id', '___none___');
            } else {
              const galRows = data.map((g: any) => ({
                id: g.id,
                title: g.title || '',
                image: g.image,
                category: g.category || 'General',
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_gallery').upsert(galRows);
            }
          }
          break;

        case 'sahitya_videos':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_videos').delete().neq('id', '___none___');
            } else {
              const vidRows = data.map((v: any) => ({
                id: v.id,
                title: v.title,
                speaker: v.speaker || '',
                thumbnail: v.thumbnail || '',
                platform: v.platform || 'youtube',
                youtube_id: v.youtubeId || null,
                instagram_url: v.instagramUrl || null,
                video_url: v.videoUrl || null,
                duration: v.duration || '',
                updated_at: new Date().toISOString(),
              }));
              await supabase.from('fest_videos').upsert(vidRows);
            }
          }
          break;
        case 'sahitya_program_entries':
          if (Array.isArray(data)) {
            if (data.length === 0) {
              await supabase.from('fest_program_entries').delete().neq('id', '___none___');
            } else {
              const entryRows = data.map(mapProgramEntryToRow);
              const { error } = await supabase.from('fest_program_entries').upsert(entryRows);
              if (error) console.error('[Supabase] Program entries upsert error:', error);
            }
          }
          break;

        case 'sahitya_news':
          if (Array.isArray(data)) {
            const { data: cur } = await supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle();
            await supabase.from('fest_settings').upsert({
              id: 'news_feed',
              admin: { items: data },
              registration: cur?.registration || { isLocked: false, lockMessage: '', maxStagePerCandidate: 4, maxNonStagePerCandidate: 4 },
              program_limits: cur?.program_limits || [],
              updated_at: new Date().toISOString(),
            });
          }
          break;

        case 'sahitya_program_limits':
          if (Array.isArray(data)) {
            const { data: cur } = await supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle();
            await supabase.from('fest_settings').upsert({
              id: 'news_feed',
              admin: cur?.admin || { items: [] },
              registration: cur?.registration || { isLocked: false, lockMessage: '', maxStagePerCandidate: 4, maxNonStagePerCandidate: 4 },
              program_limits: data,
              updated_at: new Date().toISOString(),
            });
          }
          break;

        case 'sahitya_registration_settings':
          if (data && typeof data === 'object') {
            const { data: cur } = await supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle();
            await supabase.from('fest_settings').upsert({
              id: 'news_feed',
              admin: cur?.admin || { items: [] },
              registration: data,
              program_limits: cur?.program_limits || [],
              updated_at: new Date().toISOString(),
            });
          }
          break;

        default:
          break;
      }
      // Broadcast instant update notification to all connected devices over WebSocket
      broadcastChange(key, 'update');
    } catch (syncErr) {
      console.warn(`[Supabase Auto-Sync] Sync failed for ${key}:`, syncErr);
    }
  };

  // Helper to persist data to localStorage safely & Auto-Sync to Supabase Cloud in background
  const persist = (key: string, data: any) => {
    persistLocalOnly(key, data);
    // Automatically replicate change to Supabase cloud database
    autoSyncToSupabase(key, data);
  };

  // Theme methods
  const setThemePreset = (preset: ThemePreset) => {
    setCurrentTheme(preset);
    persist('sahitya_theme', preset);
  };

  const setCustomColors = (primary: string, secondary: string, background = '#060306') => {
    const hexToRgba = (hex: string, alpha: number) => {
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (clean.length >= 6) {
        const r = parseInt(clean.substring(0, 2), 16) || 0;
        const g = parseInt(clean.substring(2, 4), 16) || 0;
        const b = parseInt(clean.substring(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return hex;
    };

    const custom: ThemePreset = {
      id: 'custom',
      name: 'Custom Palette',
      primary,
      secondary,
      background,
      surface: '#0f0810',
      primaryGlow: hexToRgba(primary, 0.45),
      secondaryGlow: hexToRgba(secondary, 0.45),
    };
    setCurrentTheme(custom);
    persist('sahitya_theme', custom);
  };

  const updateBrand = (newBrand: Partial<SiteBrand>) => {
    setBrand((prev) => {
      const updated = sanitizeBrand({ ...prev, ...newBrand });
      persist('sahitya_brand', updated);
      return updated;
    });
  };

  // Data Center (Programs & Categories) CRUD
  const addProgram = (p: ProgramMaster) => {
    setPrograms((prev) => {
      const updated = [p, ...prev];
      persist('sahitya_programs', updated);
      return updated;
    });
  };

  const updateProgram = (id: string, pData: Partial<ProgramMaster>) => {
    setPrograms((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...pData } : p));
      persist('sahitya_programs', updated);
      return updated;
    });
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      persist('sahitya_programs', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_programs').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('[Supabase] Delete program error:', error);
        broadcastChange('fest_programs', 'delete');
      });
    }
  };

  const addCategory = (cat: string) => {
    if (!cat || categories.includes(cat)) return;
    setCategories((prev) => {
      const updated = [...prev, cat];
      persist('sahitya_categories', updated);
      return updated;
    });
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c !== cat);
      persist('sahitya_categories', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_categories').delete().eq('name', cat).then(({ error }) => {
        if (error) console.error('[Supabase] Delete category error:', error);
        broadcastChange('fest_categories', 'delete');
      });
    }
  };

  // Accurate Dynamic Leaderboard Calculation from Published Results
  const syncStandingsWithResults = (customComps?: Competition[]) => {
    const targetComps = customComps || competitions;
    setStandings((prev) => {
      const updated = computeStandingsFromCompetitionsList(targetComps, prev);
      persist('sahitya_standings', updated);
      return updated;
    });
  };

  // Results / Competitions CRUD with Real-Time Leaderboard Point & Medal Sync
  const addCompetition = (comp: Competition) => {
    setCompetitions((prev) => {
      const updatedComps = [comp, ...prev];
      persist('sahitya_competitions', updatedComps);
      
      // Auto-recompute standings immediately
      setStandings((prevStandings) => {
        const synced = computeStandingsFromCompetitionsList(updatedComps, prevStandings);
        persist('sahitya_standings', synced);
        return synced;
      });

      return updatedComps;
    });
  };

  const updateCompetition = (id: string, compData: Partial<Competition>) => {
    setCompetitions((prev) => {
      const updatedComps = prev.map((c) => (c.id === id ? { ...c, ...compData } : c));
      persist('sahitya_competitions', updatedComps);

      // Auto-recompute standings immediately on update
      setStandings((prevStandings) => {
        const synced = computeStandingsFromCompetitionsList(updatedComps, prevStandings);
        persist('sahitya_standings', synced);
        return synced;
      });

      return updatedComps;
    });
  };

  const deleteCompetition = (id: string) => {
    setCompetitions((prev) => {
      const updatedComps = prev.filter((c) => c.id !== id);
      persist('sahitya_competitions', updatedComps);

      // Auto-recompute standings immediately on deletion
      setStandings((prevStandings) => {
        const synced = computeStandingsFromCompetitionsList(updatedComps, prevStandings);
        persist('sahitya_standings', synced);
        return synced;
      });

      return updatedComps;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_competitions').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('[Supabase] Delete competition error:', error);
        broadcastChange('fest_competitions', 'delete');
      });
    }
  };

  const clearAllCompetitions = () => {
    setCompetitions([]);
    persist('sahitya_competitions', []);

    // Auto-reset standings to 0
    setStandings((prevStandings) => {
      const synced = computeStandingsFromCompetitionsList([], prevStandings);
      persist('sahitya_standings', synced);
      return synced;
    });

    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_competitions').delete().neq('id', '___none___').then(({ error }) => {
        if (error) console.error('[Supabase] Clear all competitions error:', error);
        broadcastChange('fest_competitions', 'delete');
      });
      supabase.from('fest_standings').select('id').then(({ data }) => {
        if (data && data.length > 0) {
          for (const s of data) {
            supabase.from('fest_standings').update({ points: 0, gold: 0, silver: 0, bronze: 0 }).eq('id', s.id);
          }
          broadcastChange('fest_standings', 'update');
        }
      });
    }
  };

  // Standings CRUD with auto-re-ranking and cascading team name updates
  const updateStanding = (idOrName: string, data: Partial<TeamStanding>) => {
    setStandings((prev) => {
      const oldTeam = prev.find((s) => s.id === idOrName || s.name === idOrName);
      const oldName = oldTeam?.name;
      const updated = assignStandingsRanks(
        prev.map((s) => ((s.id === idOrName || s.name === idOrName) ? { ...s, ...data } : s))
      );
      persist('sahitya_standings', updated);

      // If team was renamed, cascade rename to teamAccounts, programEntries, participants, competitions
      if (oldName && data.name && data.name !== oldName) {
        const newName = data.name;
        setTeamAccounts((prevAccs) => {
          const synced = syncAccountsWithStandingsList(
            updated,
            prevAccs.map((a) => (a.teamName === oldName ? { ...a, teamName: newName } : a))
          );
          persist('sahitya_team_accounts', synced);
          return synced;
        });

        // Cascade to programEntries
        setProgramEntries((prevEntries) => {
          const cascadeEntries = prevEntries.map((pe) => {
            if (pe.team === oldName) {
              return {
                ...pe,
                team: newName,
                participants: pe.participants.map((p) => (p.team === oldName ? { ...p, team: newName } : p)),
              };
            }
            return pe;
          });
          persist('sahitya_program_entries', cascadeEntries);
          return cascadeEntries;
        });

        // Cascade to participants
        setParticipants((prevParts) => {
          const cascadeParts = prevParts.map((p) => (p.team === oldName ? { ...p, team: newName } : p));
          persist('sahitya_participants', cascadeParts);
          return cascadeParts;
        });

        // Cascade to competitions winners
        setCompetitions((prevComps) => {
          const cascadeComps = prevComps.map((c) => ({
            ...c,
            winners: c.winners?.map((w) => (w.team === oldName ? { ...w, team: newName } : w)) || [],
          }));
          persist('sahitya_competitions', cascadeComps);
          return cascadeComps;
        });
      }

      return updated;
    });
  };

  const addStanding = (standing: any) => {
    setStandings((prev) => {
      const newTeam = {
        id: standing.id || `team-${Date.now()}`,
        name: standing.name || `Team ${String.fromCharCode(65 + prev.length)}`,
        points: Number(standing.points) || 0,
        gold: Number(standing.gold) || 0,
        silver: Number(standing.silver) || 0,
        bronze: Number(standing.bronze) || 0,
      };
      const updated = assignStandingsRanks([...prev, newTeam]);
      persist('sahitya_standings', updated);

      setTeamAccounts((prevAccs) => {
        const synced = syncAccountsWithStandingsList(updated, prevAccs);
        persist('sahitya_team_accounts', synced);
        return synced;
      });

      return updated;
    });
  };

  const deleteStanding = (idOrName: string) => {
    setStandings((prev) => {
      const updated = assignStandingsRanks(
        prev.filter((s) => s.id !== idOrName && s.name !== idOrName)
      );
      persist('sahitya_standings', updated);

      setTeamAccounts((prevAccs) => {
        const synced = syncAccountsWithStandingsList(updated, prevAccs);
        persist('sahitya_team_accounts', synced);
        return synced;
      });

      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_standings').delete().or(`id.eq.${idOrName},name.eq.${idOrName}`).then(({ error }) => {
        if (error) console.error('[Supabase] Delete standing error:', error);
        broadcastChange('fest_standings', 'delete');
      });
    }
  };

  // Schedule CRUD
  const addScheduleItem = (item: ScheduleItem) => {
    setSchedule((prev) => {
      const updated = [...prev, item];
      persist('sahitya_schedule', updated);
      return updated;
    });
  };

  const updateScheduleItem = (id: string, itemData: Partial<ScheduleItem>) => {
    setSchedule((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...itemData } : s));
      persist('sahitya_schedule', updated);
      return updated;
    });
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      persist('sahitya_schedule', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_schedule').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('[Supabase] Delete schedule error:', error);
        broadcastChange('fest_schedule', 'delete');
      });
    }
  };

  // Gallery CRUD
  const addGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => {
      const updated = [item, ...prev.filter((g) => g.id !== item.id)];
      persistLocalOnly('sahitya_gallery', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_gallery').upsert([{
        id: item.id,
        title: item.title || '',
        image: item.image,
        category: item.category || 'General',
        updated_at: new Date().toISOString(),
      }]).then(({ error }) => {
        if (error) console.error('[Supabase] Add gallery error:', error);
        broadcastChange('fest_gallery', 'insert');
      });
    }
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      persistLocalOnly('sahitya_gallery', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_gallery').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('[Supabase] Delete gallery error:', error);
        broadcastChange('fest_gallery', 'delete');
      });
    }
  };

  // Video CRUD
  const addVideo = (video: MediaVideo) => {
    setVideos((prev) => {
      const updated = [video, ...prev.filter((v) => v.id !== video.id)];
      persistLocalOnly('sahitya_videos', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_videos').upsert([{
        id: video.id,
        title: video.title,
        speaker: video.speaker || '',
        thumbnail: video.thumbnail || '',
        platform: video.platform || 'youtube',
        youtube_id: video.youtubeId || null,
        instagram_url: video.instagramUrl || null,
        video_url: video.videoUrl || null,
        duration: video.duration || '',
        updated_at: new Date().toISOString(),
      }]).then(({ error }) => {
        if (error) console.error('[Supabase] Add video error:', error);
        broadcastChange('fest_videos', 'insert');
      });
    }
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      persistLocalOnly('sahitya_videos', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_videos').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('[Supabase] Delete video error:', error);
        broadcastChange('fest_videos', 'delete');
      });
    }
  };

  // Helper to sync news to fest_settings row 'news_feed'
  const syncNewsToCloud = async (newsList: NewsItem[]) => {
    if (!supabase || !isSupabaseConfigured()) return;
    try {
      // Clean and upload any base64 images to 'news' bucket in Supabase storage
      const cleanedItems = await Promise.all(
        newsList.map(async (item) => {
          if (item.image && item.image.startsWith('data:')) {
            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bucket: 'news',
                  path: `news_${item.id || Date.now()}.jpg`,
                  dataUrl: item.image,
                  mimeType: 'image/jpeg',
                }),
              });
              const json = await res.json();
              if (json.url) {
                return { ...item, image: json.url };
              }
            } catch (err) {
              console.warn('[News Sync] Failed to upload image to storage:', err);
            }
          }
          return item;
        })
      );

      await supabase.from('fest_settings').upsert({
        id: 'news_feed',
        admin: { items: cleanedItems },
        updated_at: new Date().toISOString(),
      });
      broadcastChange('sahitya_news', 'update');
    } catch (err) {
      console.error('[Supabase] syncNewsToCloud error:', err);
    }
  };

  // News CRUD
  const addNewsItem = async (item: NewsItem) => {
    let finalItem = { ...item };
    // If cover image is base64, upload to news storage bucket
    if (finalItem.image && finalItem.image.startsWith('data:')) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bucket: 'news',
            path: `news_${finalItem.id || Date.now()}.jpg`,
            dataUrl: finalItem.image,
            mimeType: 'image/jpeg',
          }),
        });
        const json = await res.json();
        if (json.url) {
          finalItem.image = json.url;
        }
      } catch (err) {
        console.warn('[addNewsItem] Failed to upload image to storage:', err);
      }
    }

    setNews((prev) => {
      const updated = [finalItem, ...prev.filter((n) => n.id !== finalItem.id)];
      persistLocalOnly('sahitya_news', updated);
      syncNewsToCloud(updated);
      return updated;
    });
  };

  const updateNewsItem = async (id: string, itemData: Partial<NewsItem>) => {
    setNews((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, ...itemData } : n));
      persistLocalOnly('sahitya_news', updated);
      syncNewsToCloud(updated);
      return updated;
    });
  };

  const deleteNewsItem = async (id: string) => {
    setNews((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persistLocalOnly('sahitya_news', updated);
      syncNewsToCloud(updated);
      return updated;
    });
  };

  // Bulletins & Notifications CRUD
  const addNotification = (notif: FestivalNotification) => {
    setNotifications((prev) => {
      const updated = [notif, ...prev.filter((n) => n.id !== notif.id)];
      persistLocalOnly('sahitya_notifications', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      const messagePayload = JSON.stringify({
        summary: notif.summary || notif.title,
        content: notif.content && notif.content.length > 0 ? notif.content : [notif.summary || notif.title],
        targetAudience: notif.targetAudience || 'All Attendees',
        date: notif.date || '',
      });
      supabase.from('fest_notifications').upsert([{
        id: notif.id,
        title: notif.title,
        message: messagePayload,
        time: notif.time || '',
        timestamp: Date.now(),
        type: notif.category || 'General',
        tag: notif.priority || 'Normal',
        is_pinned: Boolean(notif.isPinned),
        link: notif.attachmentUrl || '',
        attachment_url: notif.attachmentUrl || '',
        attachment_name: notif.attachmentName || '',
        updated_at: new Date().toISOString(),
      }]).then(({ error }) => {
        if (error) console.error('[Supabase] Add notification error:', error);
        broadcastChange('fest_notifications', 'insert');
      });
    }
  };

  const updateNotification = (id: string, notifData: Partial<FestivalNotification>) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, ...notifData } : n));
      persistLocalOnly('sahitya_notifications', updated);
      const targetNotif = updated.find(n => n.id === id);
      if (targetNotif && supabase && isSupabaseConfigured()) {
        const messagePayload = JSON.stringify({
          summary: targetNotif.summary || targetNotif.title,
          content: targetNotif.content && targetNotif.content.length > 0 ? targetNotif.content : [targetNotif.summary || targetNotif.title],
          targetAudience: targetNotif.targetAudience || 'All Attendees',
          date: targetNotif.date || '',
        });
        supabase.from('fest_notifications').upsert([{
          id: targetNotif.id,
          title: targetNotif.title,
          message: messagePayload,
          time: targetNotif.time || '',
          timestamp: Date.now(),
          type: targetNotif.category || 'General',
          tag: targetNotif.priority || 'Normal',
          is_pinned: Boolean(targetNotif.isPinned),
          link: targetNotif.attachmentUrl || '',
          attachment_url: targetNotif.attachmentUrl || '',
          attachment_name: targetNotif.attachmentName || '',
          updated_at: new Date().toISOString(),
        }]).then(({ error }) => {
          if (error) console.error('[Supabase] Update notification error:', error);
          broadcastChange('fest_notifications', 'update');
        });
      }
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persistLocalOnly('sahitya_notifications', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase
        .from('fest_notifications')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Delete notification error:', error);
          broadcastChange('fest_notifications', 'delete');
        });
    }
  };

  const togglePinNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      persistLocalOnly('sahitya_notifications', updated);
      const target = updated.find(n => n.id === id);
      if (target && supabase && isSupabaseConfigured()) {
        supabase.from('fest_notifications').update({
          is_pinned: target.isPinned,
          updated_at: new Date().toISOString(),
        }).eq('id', id).then(() => {
          broadcastChange('fest_notifications', 'update');
        });
      }
      return updated;
    });
  };

  // Participants CRUD
  const addParticipant = (p: any) => {
    setParticipants((prev) => {
      const updated = [p, ...prev];
      persist('sahitya_participants', updated);
      return updated;
    });
  };

  const updateParticipant = (chestNo: string, pData: any) => {
    setParticipants((prev) => {
      const updated = prev.map((p) => (p.chestNo === chestNo ? { ...p, ...pData } : p));
      persist('sahitya_participants', updated);
      return updated;
    });
  };

  const deleteParticipant = (chestNo: string) => {
    setParticipants((prev) => {
      const updated = prev.filter((p) => p.chestNo !== chestNo);
      persist('sahitya_participants', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_participants').delete().eq('chest_no', chestNo).then(({ error }) => {
        if (error) console.error('[Supabase] Delete participant error:', error);
        broadcastChange('fest_participants', 'delete');
      });
    }
  };

  const importParticipantsBulk = (newBatch: any[]) => {
    setParticipants((prev) => {
      const updated = [...prev];
      newBatch.forEach((item) => {
        const queryChest = String(item.chestNo).trim();
        if (!queryChest) return;
        const idx = updated.findIndex((p) => String(p.chestNo).trim() === queryChest);
        const participantObj = {
          chestNo: queryChest,
          name: item.name ? String(item.name).trim() : `Candidate #${queryChest}`,
          team: item.team ? String(item.team).trim() : 'Team A',
          category: item.category ? String(item.category).trim() : 'Senior',
          dob: item.dob ? String(item.dob).trim() : '2005-04-15',
          events: item.events || [
            { name: 'Literary & Arts Program', stage: 'Stage 1', time: 'Jul 2, 10:00 AM', result: 'Registered', grade: 'A', points: 5 },
          ],
        };

        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...participantObj };
        } else {
          updated.push(participantObj);
        }
      });

      // Sort numerically by chest number
      updated.sort((a, b) => (Number(a.chestNo) || 0) - (Number(b.chestNo) || 0));
      persist('sahitya_participants', updated);
      return updated;
    });
  };

  // Program Limits CRUD
  const updateProgramLimit = (programId: string, limits: Partial<ProgramLimit>) => {
    setProgramLimits((prev) => {
      const cleanId = String(programId).trim().toLowerCase();
      const exists = prev.some((l) =>
        l.programId.toLowerCase() === cleanId ||
        l.programCode.toLowerCase() === cleanId ||
        l.programName.toLowerCase() === cleanId
      );
      let updated: ProgramLimit[];
      if (exists) {
        updated = prev.map((l) =>
          (l.programId.toLowerCase() === cleanId ||
           l.programCode.toLowerCase() === cleanId ||
           l.programName.toLowerCase() === cleanId)
            ? { ...l, ...limits }
            : l
        );
      } else {
        const prog = programs.find((p) =>
          p.id.toLowerCase() === cleanId ||
          p.code.toLowerCase() === cleanId ||
          p.name.toLowerCase() === cleanId
        );
        const newLimit: ProgramLimit = {
          programId: prog?.id || programId,
          programCode: prog?.code || programId,
          programName: prog?.name || 'Program',
          category: prog?.category || 'General',
          type: prog?.type || 'Group',
          stageType: prog?.stageType || 'Stage',
          maxEntriesPerTeam: 1,
          groupSetsPerTeam: 1,
          participantsPerSet: 4,
          noMembersRequired: false,
          ...limits,
        };
        updated = [...prev, newLimit];
      }
      persist('sahitya_program_limits', updated);
      return updated;
    });
  };

  const getProgramLimit = (programId: string): ProgramLimit | undefined => {
    const cleanId = String(programId).trim().toLowerCase();
    const found = programLimits.find((l) =>
      l.programId.toLowerCase() === cleanId ||
      l.programCode?.toLowerCase() === cleanId ||
      l.programName.toLowerCase() === cleanId
    );
    if (found) return found;
    const prog = programs.find((p) =>
      p.id.toLowerCase() === cleanId ||
      p.code?.toLowerCase() === cleanId ||
      p.name.toLowerCase() === cleanId
    );
    if (prog) {
      return {
        programId: prog.id,
        programCode: prog.code,
        programName: prog.name,
        category: prog.category,
        type: prog.type,
        stageType: prog.stageType || 'Stage',
        maxEntriesPerTeam: 1,
        groupSetsPerTeam: 1,
        participantsPerSet: prog.type === 'Group' ? (prog.category === 'General' ? 6 : 4) : 1,
        noMembersRequired: false,
      };
    }
    return undefined;
  };

  // Calculate participant event participation stats based on admin registrationSettings
  const getParticipantEventStats = (chestNo: string): {
    stageCount: number;
    nonStageCount: number;
    totalCount: number;
    stagePrograms: string[];
    nonStagePrograms: string[];
    canAddStage: boolean;
    canAddNonStage: boolean;
    maxStage: number;
    maxNonStage: number;
    maxTotal: number;
  } => {
    const cleanChest = String(chestNo || '').trim();
    const maxStage = Number(registrationSettings.maxStagePerCandidate) || 4;
    const maxNonStage = Number(registrationSettings.maxNonStagePerCandidate) || 4;
    const maxTotal = maxStage + maxNonStage;

    if (!cleanChest || cleanChest === '-') {
      return {
        stageCount: 0,
        nonStageCount: 0,
        totalCount: 0,
        stagePrograms: [],
        nonStagePrograms: [],
        canAddStage: true,
        canAddNonStage: true,
        maxStage,
        maxNonStage,
        maxTotal,
      };
    }

    let stageCount = 0;
    let nonStageCount = 0;
    const stagePrograms: string[] = [];
    const nonStagePrograms: string[] = [];

    programEntries.forEach((entry) => {
      if (entry.type === 'Individual') {
        const hasCandidate = entry.participants.some(
          (p) => String(p.chestNo).trim() === cleanChest
        );
        if (hasCandidate) {
          const progMeta = programs.find(
            (p) =>
              p.id === entry.programId ||
              (p.code && p.code === entry.programCode) ||
              p.name.toLowerCase() === entry.programName.toLowerCase()
          );
          const stageType = entry.stageType || progMeta?.stageType || 'Stage';
          if (stageType === 'Stage') {
            stageCount += 1;
            stagePrograms.push(entry.programName);
          } else {
            nonStageCount += 1;
            nonStagePrograms.push(entry.programName);
          }
        }
      }
    });

    return {
      stageCount,
      nonStageCount,
      totalCount: stageCount + nonStageCount,
      stagePrograms,
      nonStagePrograms,
      canAddStage: stageCount < maxStage,
      canAddNonStage: nonStageCount < maxNonStage,
      maxStage,
      maxNonStage,
      maxTotal,
    };
  };

  // Program Entries CRUD
  const addProgramEntry = (entry: ProgramEntry): { success: boolean; message: string } => {
    if (registrationSettings.isLocked) {
      return { success: false, message: 'Entrance is currently locked by festival administrators.' };
    }

    const limit = programLimits.find(
      (l) => l.programId === entry.programId || (l.programCode && l.programCode === entry.programCode)
    );
    const progMeta = programs.find(
      (p) =>
        p.id === entry.programId ||
        (p.code && p.code === entry.programCode) ||
        p.name.toLowerCase() === entry.programName.toLowerCase()
    );
    const entryStageType: 'Stage' | 'Non Stage' =
      entry.stageType || progMeta?.stageType || limit?.stageType || 'Stage';

    const maxStage = Number(registrationSettings.maxStagePerCandidate) || 4;
    const maxNonStage = Number(registrationSettings.maxNonStagePerCandidate) || 4;
    const maxTotal = maxStage + maxNonStage;

    // Filter existing entries for this team & program
    const teamEntries = programEntries.filter(
      (e) =>
        (e.programId === entry.programId ||
          (e.programCode && e.programCode === entry.programCode) ||
          e.programName.toLowerCase() === entry.programName.toLowerCase()) &&
        e.team === entry.team
    );

    if (entry.type === 'Individual') {
      const maxAllowed = limit?.maxEntriesPerTeam || 1;
      if (teamEntries.length >= maxAllowed) {
        return {
          success: false,
          message: `Team Quota Limit Reached: ${entry.team} has already registered ${teamEntries.length}/${maxAllowed} slot(s) for this program.`,
        };
      }

      // Check per-participant limits (Stage limit, Non-Stage limit, Total limit)
      for (const p of entry.participants) {
        const cleanChest = String(p.chestNo || '').trim();
        if (cleanChest && cleanChest !== '-') {
          // Check if candidate is already in this program
          const alreadyInThisProgram = programEntries.some(
            (e) =>
              (e.programId === entry.programId ||
                (e.programCode && e.programCode === entry.programCode) ||
                e.programName.toLowerCase() === entry.programName.toLowerCase()) &&
              e.participants.some((ep) => String(ep.chestNo).trim() === cleanChest)
          );
          if (alreadyInThisProgram) {
            return {
              success: false,
              message: `Candidate #${cleanChest} (${p.name || ''}) is already registered for "${entry.programName}".`,
            };
          }

          const stats = getParticipantEventStats(cleanChest);
          if (entryStageType === 'Stage' && stats.stageCount >= maxStage) {
            return {
              success: false,
              message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has already joined ${stats.stageCount} Stage individual programs (Max allowed is ${maxStage} Stage). [Registered in: ${stats.stagePrograms.join(', ')}]`,
            };
          }
          if (entryStageType === 'Non Stage' && stats.nonStageCount >= maxNonStage) {
            return {
              success: false,
              message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has already joined ${stats.nonStageCount} Non Stage individual programs (Max allowed is ${maxNonStage} Non Stage). [Registered in: ${stats.nonStagePrograms.join(', ')}]`,
            };
          }
          if (stats.totalCount >= maxTotal) {
            return {
              success: false,
              message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has reached the maximum total limit of ${maxTotal} individual programs (${maxStage} Stage + ${maxNonStage} Non Stage).`,
            };
          }
        }
      }
    } else {
      // Group item
      const maxSetsAllowed = limit?.groupSetsPerTeam || 1;
      if (teamEntries.length >= maxSetsAllowed) {
        return {
          success: false,
          message: `Team Limit Exceeded: ${entry.team} has already registered ${teamEntries.length}/${maxSetsAllowed} group set(s) for this program.`,
        };
      }
    }

    const newEntry: ProgramEntry = {
      ...entry,
      stageType: entryStageType,
      id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      registeredAt: entry.registeredAt || new Date().toLocaleString(),
    };

    setProgramEntries((prev) => {
      const updated = [newEntry, ...prev];
      persist('sahitya_program_entries', updated);
      return updated;
    });

    if (supabase && isSupabaseConfigured()) {
      const row = mapProgramEntryToRow(newEntry);
      supabase.from('fest_program_entries').upsert(row).then(({ error }) => {
        if (error) console.error('[Supabase] addProgramEntry error:', error);
        broadcastChange('fest_program_entries', 'insert');
      });
    }

    return { success: true, message: `Successfully registered for "${entry.programName}"!` };
  };

  const addProgramEntriesBulk = (entries: ProgramEntry[]): { success: boolean; message: string; count: number } => {
    if (registrationSettings.isLocked) {
      return { success: false, message: 'Entrance is currently locked by festival administrators.', count: 0 };
    }
    if (!entries || entries.length === 0) {
      return { success: false, message: 'No entries to add.', count: 0 };
    }

    const maxStage = Number(registrationSettings.maxStagePerCandidate) || 4;
    const maxNonStage = Number(registrationSettings.maxNonStagePerCandidate) || 4;
    const maxTotal = maxStage + maxNonStage;

    // Validate participant limits in the batch
    for (const entry of entries) {
      if (entry.type === 'Individual') {
        const progMeta = programs.find(
          (p) =>
            p.id === entry.programId ||
            (p.code && p.code === entry.programCode) ||
            p.name.toLowerCase() === entry.programName.toLowerCase()
        );
        const stageType: 'Stage' | 'Non Stage' =
          entry.stageType || progMeta?.stageType || 'Stage';

        for (const p of entry.participants) {
          const cleanChest = String(p.chestNo || '').trim();
          if (cleanChest && cleanChest !== '-') {
            const stats = getParticipantEventStats(cleanChest);
            if (stageType === 'Stage' && stats.stageCount >= maxStage) {
              return {
                success: false,
                message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has already joined ${stats.stageCount} Stage individual programs (Max ${maxStage} Stage).`,
                count: 0,
              };
            }
            if (stageType === 'Non Stage' && stats.nonStageCount >= maxNonStage) {
              return {
                success: false,
                message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has already joined ${stats.nonStageCount} Non Stage individual programs (Max ${maxNonStage} Non Stage).`,
                count: 0,
              };
            }
            if (stats.totalCount >= maxTotal) {
              return {
                success: false,
                message: `Limit Reached: Candidate #${cleanChest} (${p.name || ''}) has reached the maximum total limit of ${maxTotal} individual programs.`,
                count: 0,
              };
            }
          }
        }
      }
    }

    const timestamp = new Date().toLocaleString();
    const formatted: ProgramEntry[] = entries.map((entry, idx) => {
      const progMeta = programs.find(
        (p) =>
          p.id === entry.programId ||
          (p.code && p.code === entry.programCode) ||
          p.name.toLowerCase() === entry.programName.toLowerCase()
      );
      return {
        ...entry,
        stageType: entry.stageType || progMeta?.stageType || 'Stage',
        id: entry.id || `entry-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        registeredAt: entry.registeredAt || timestamp,
      };
    });

    setProgramEntries((prev) => {
      const updated = [...formatted, ...prev];
      persist('sahitya_program_entries', updated);
      return updated;
    });

    if (supabase && isSupabaseConfigured()) {
      const rows = formatted.map(mapProgramEntryToRow);
      supabase.from('fest_program_entries').upsert(rows).then(({ error }) => {
        if (error) console.error('[Supabase] addProgramEntriesBulk error:', error);
        broadcastChange('fest_program_entries', 'insert');
      });
    }

    return {
      success: true,
      message: `Successfully registered ${formatted.length} participant entry/entries!`,
      count: formatted.length,
    };
  };

  const deleteProgramEntry = (entryId: string) => {
    setProgramEntries((prev) => {
      const updated = prev.filter((e) => e.id !== entryId);
      persist('sahitya_program_entries', updated);
      return updated;
    });
    if (supabase && isSupabaseConfigured()) {
      supabase.from('fest_program_entries').delete().eq('id', entryId).then(({ error }) => {
        if (error) console.error('[Supabase] Delete program entry error:', error);
        broadcastChange('fest_program_entries', 'delete');
      });
    }
  };

  const importProgramEntriesBulk = (newEntries: ProgramEntry[]) => {
    setProgramEntries((prev) => {
      const updated = [...newEntries, ...prev];
      persist('sahitya_program_entries', updated);
      return updated;
    });
  };

  // Team Portal Accounts
  const updateTeamAccount = (id: string, acc: Partial<TeamPortalAccount>) => {
    setTeamAccounts((prev) => {
      const updated = prev.map((a) => (a.id === id || a.teamName === id ? { ...a, ...acc } : a));
      persist('sahitya_team_accounts', updated);
      return updated;
    });
  };

  const teamLogin = (username: string, pass: string): TeamPortalAccount | null => {
    const cleanUser = username.trim().toLowerCase().replace(/[\s_-]/g, '');
    const cleanPass = pass.trim();
    if (!cleanUser || !cleanPass) return null;

    // Direct match with teamAccounts
    const directFound = teamAccounts.find((a) => {
      const aUser = a.username.toLowerCase().replace(/[\s_-]/g, '');
      const aName = a.teamName.toLowerCase().replace(/[\s_-]/g, '');
      const aId = a.id.toLowerCase().replace(/[\s_-]/g, '');
      const userMatches = aUser === cleanUser || aName === cleanUser || aId === cleanUser;
      const passMatches = a.password === cleanPass;
      return userMatches && passMatches;
    });
    if (directFound) return directFound;

    // Fallback: match by team in standings
    const teamInStandings = standings.find((s) => {
      const sClean = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return sClean === cleanUser || s.name.toLowerCase() === username.trim().toLowerCase();
    });
    if (teamInStandings) {
      const cleanName = teamInStandings.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanPass === `${cleanName}@2026` || cleanPass === 'team@2026') {
        return {
          id: `team-acc-${teamInStandings.id}`,
          teamName: teamInStandings.name,
          username: cleanName,
          password: cleanPass,
        };
      }
    }

    return null;
  };

  // Entrance Lock & Registration Settings
  const updateRegistrationSettings = (newSettings: Partial<RegistrationSettings>) => {
    setRegistrationSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      persist('sahitya_registration_settings', updated);
      return updated;
    });
  };

  const toggleEntranceLock = (isLocked?: boolean) => {
    setRegistrationSettings((prev) => {
      const newLocked = typeof isLocked === 'boolean' ? isLocked : !prev.isLocked;
      const updated = { ...prev, isLocked: newLocked };
      persist('sahitya_registration_settings', updated);
      return updated;
    });
  };

  // Admin Auth & Credentials Management
  const updateAdminCredentials = (newUsername: string, newPass: string): boolean => {
    const trimmedUser = newUsername.trim() || 'admin';
    const trimmedPass = newPass.trim();
    if (!trimmedPass) return false;

    const updated = {
      username: trimmedUser,
      password: trimmedPass,
    };
    setAdminCredentials(updated);
    persist('sahitya_admin_credentials', updated);
    return true;
  };

  const adminLogin = (id: string, pass: string): boolean => {
    const cleanId = id.trim().toLowerCase();
    const cleanPass = pass.trim();
    const activeUser = adminCredentials.username.trim().toLowerCase();
    const activePass = adminCredentials.password.trim();

    if (cleanId === activeUser && cleanPass === activePass) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('festival_admin_auth', 'true');
        localStorage.setItem('sahitya_admin_auth', 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('festival_admin_auth');
      localStorage.removeItem('sahitya_admin_auth');
    } catch (e) {}
  };

  // Live Festival Setup: Clear all demo/mock data
  const clearAllDemoData = (mode: 'fresh_festival' | 'wipe_all' = 'fresh_festival') => {
    // Clear mock competitions and published winners
    setCompetitions([]);
    persist('sahitya_competitions', []);

    // Reset standings points and medal tallies to 0
    if (mode === 'fresh_festival') {
      setStandings((prev) => {
        const resetStandings = prev.map((s) => ({
          ...s,
          rank: 0,
          points: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        }));
        persist('sahitya_standings', resetStandings);
        return resetStandings;
      });
    } else {
      setStandings([]);
      persist('sahitya_standings', []);
      setPrograms([]);
      persist('sahitya_programs', []);
      setDownloads([]);
      persist('sahitya_downloads', []);
    }

    // Clear demo participants & chest records
    setParticipants([]);
    persist('sahitya_participants', []);

    // Clear team registrations/submissions
    setProgramEntries([]);
    persist('sahitya_program_entries', []);

    // Clear demo announcements/bulletins
    setNotifications([]);
    persist('sahitya_notifications', []);

    // Clear demo schedule
    setSchedule([]);
    persist('sahitya_schedule', []);

    // Clear demo news releases
    setNews([]);
    persist('sahitya_news', []);

    // Clear demo media/gallery
    setGallery([]);
    persist('sahitya_gallery', []);

    setVideos([]);
    persist('sahitya_videos', []);

    // Clear in Supabase if active
    if (supabase && isSupabaseConfigured()) {
      (async () => {
        try {
          await supabase.from('fest_competitions').delete().neq('id', '___none___');
          await supabase.from('fest_participants').delete().neq('id', '___none___');
          await supabase.from('fest_program_entries').delete().neq('id', '___none___');
          await supabase.from('fest_notifications').delete().neq('id', '___none___');
          await supabase.from('fest_schedule').delete().neq('id', '___none___');
          await supabase.from('fest_gallery').delete().neq('id', '___none___');
          await supabase.from('fest_videos').delete().neq('id', '___none___');
          if (mode === 'fresh_festival') {
            await supabase.from('fest_standings').update({ points: 0, gold: 0, silver: 0, bronze: 0 }).neq('id', '___none___');
          } else {
            await supabase.from('fest_standings').delete().neq('id', '___none___');
            await supabase.from('fest_programs').delete().neq('id', '___none___');
            await supabase.from('fest_downloads').delete().neq('id', '___none___');
          }
        } catch (err) {
          console.error('Error clearing Supabase data:', err);
        }
      })();
    }
  };

  // 1-Click Sync Local Datasets to Supabase Cloud Database
  const syncLocalToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials are not configured yet in .env.local or Vercel Environment Variables.',
      };
    }

    try {
      // 1. Sync Brand & Theme
      await supabase.from('fest_brand').upsert({
        id: 'active',
        brand_data: brand,
        theme_data: currentTheme,
        updated_at: new Date().toISOString(),
      });

      // 2. Sync Categories
      if (categories.length > 0) {
        const catRows = categories.map((c) => ({
          id: `cat-${c.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: c,
        }));
        await supabase.from('fest_categories').upsert(catRows, { onConflict: 'name' });
      }

      // 3. Sync Programs
      if (programs.length > 0) {
        const progRows = programs.map((p) => ({
          id: p.id,
          code: p.code || '',
          name: p.name,
          category: p.category,
          type: p.type,
          stage_type: p.stageType || 'Stage',
          max_score: p.maxScore || 100,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_programs').upsert(progRows);
      }

      // 4. Sync Competitions
      if (competitions.length > 0) {
        const compRows = competitions.map((c) => ({
          id: c.id,
          result_number: c.resultNumber,
          name: c.name,
          category: c.category,
          type: c.type,
          stage_type: c.stageType || 'Stage',
          stage: c.stage || 'Main Stage',
          status: c.status,
          winners: c.winners || [],
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_competitions').upsert(compRows);
      }

      // 5. Sync Standings
      if (standings.length > 0) {
        const rankedStandings = assignStandingsRanks(standings);
        const standRows = rankedStandings.map((s) => ({
          id: s.id || `team-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          rank: (Number(s.points) || 0) > 0 ? (s.rank || 0) : 0,
          name: s.name,
          points: Number(s.points) || 0,
          gold: Number(s.gold) || 0,
          silver: Number(s.silver) || 0,
          bronze: Number(s.bronze) || 0,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_standings').upsert(standRows, { onConflict: 'name' });
      }

      // 6. Sync Team Accounts
      if (teamAccounts.length > 0) {
        const teamRows = teamAccounts.map((t) => ({
          id: t.id,
          team_name: t.teamName,
          username: t.username,
          password: t.password,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_team_accounts').upsert(teamRows, { onConflict: 'team_name' });
      }

      // 7. Sync Notifications
      if (notifications.length > 0) {
        const notifRows = notifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.summary || n.description || '',
          time: n.time || '',
          timestamp: Date.now(),
          type: n.category || 'announcement',
          tag: n.priority || 'Official',
          is_pinned: Boolean(n.isPinned),
          link: n.attachmentUrl || '',
          attachment_url: n.attachmentUrl || '',
          attachment_name: n.attachmentName || '',
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_notifications').upsert(notifRows);
      }

      // 8. Sync Downloads
      if (downloads.length > 0) {
        const dlRows = downloads.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle || '',
          category: d.category || 'General',
          file_type: d.fileType || 'PDF',
          url: d.url,
          date: d.date || new Date().toISOString().slice(0, 10),
          color: d.color || 'amber',
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_downloads').upsert(dlRows);
      }

      // 9. Sync Schedule
      if (schedule.length > 0) {
        const schedRows = schedule.map((s) => ({
          id: s.id,
          day: s.day !== undefined && s.day !== null ? Number(s.day) : 1,
          date: s.date || '',
          time: s.time || '',
          title: s.title,
          category: s.category || 'General',
          stage: s.stage || 'Main Stage',
          status: s.status || 'Upcoming',
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_schedule').upsert(schedRows);
      }

      // 10. Sync Gallery
      if (gallery.length > 0) {
        const galRows = gallery.map((g) => ({
          id: g.id,
          title: g.title || '',
          image: g.image,
          category: g.category || 'General',
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_gallery').upsert(galRows);
      }

      // 11. Sync Videos
      if (videos.length > 0) {
        const vidRows = videos.map((v) => ({
          id: v.id,
          title: v.title,
          speaker: v.speaker || '',
          thumbnail: v.thumbnail || '',
          platform: v.platform || 'youtube',
          youtube_id: v.youtubeId || null,
          instagram_url: v.instagramUrl || null,
          video_url: v.videoUrl || null,
          duration: v.duration || '',
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('fest_videos').upsert(vidRows);
      }

      setIsSupabaseConnected(true);
      return {
        success: true,
        message: 'All local festival datasets successfully uploaded and synced with Supabase Cloud Database!',
      };
    } catch (err: any) {
      console.error('Error syncing to Supabase:', err);
      return {
        success: false,
        message: err.message || 'Error occurred while syncing with Supabase.',
      };
    }
  };

  // Reset to default mock data
  const resetAllToDefaults = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    setCurrentTheme(THEME_PRESETS[0]);
    setBrand({
      eventName: siteConfig.eventName,
      year: siteConfig.year,
      dates: siteConfig.dates,
      venue: siteConfig.venue,
      themeBadge: siteConfig.themeBadge,
      themeTitle: siteConfig.themeTitle,
      themeSubtext: siteConfig.themeSubtext,
      themeDescription: siteConfig.themeDescription,
      organization: siteConfig.organization,
      subTitle: siteConfig.subTitle,
      builtBy: siteConfig.builtBy,
    });
    setPrograms(MOCK_PROGRAMS);
    setCategories(CATEGORIES.filter((c) => c !== 'All Categories'));
    setCompetitions(MOCK_COMPETITIONS);
    setStandings(MOCK_STANDINGS);
    setSchedule(MOCK_SCHEDULE);
    setGallery(MOCK_GALLERY);
    setVideos(MOCK_VIDEOS);
    setNews(MOCK_NEWS);
    setNotifications(MOCK_NOTIFICATIONS);
    setParticipants(DEMO_PARTICIPANTS);
    setProgramLimits(
      MOCK_PROGRAMS.map((p) => ({
        programId: p.id,
        programCode: p.code,
        programName: p.name,
        category: p.category,
        type: p.type,
        maxEntriesPerTeam: 1,
        groupSetsPerTeam: 1,
        participantsPerSet: p.type === 'Group' ? (p.category === 'General' ? 6 : 4) : 1,
      }))
    );
    setProgramEntries(DEFAULT_PROGRAM_ENTRIES);
    setTeamAccounts(DEFAULT_TEAM_ACCOUNTS);
    setRegistrationSettings(DEFAULT_REGISTRATION_SETTINGS);
    setDownloads(DEFAULT_DOWNLOADS);
    setAdminCredentials(DEFAULT_ADMIN_CREDENTIALS);
  };

  return (
    <DataContext.Provider
      value={{
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
        updateNewsItem,
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
        teamLogin,

        registrationSettings,
        updateRegistrationSettings,
        toggleEntranceLock,

        isAdminLoggedIn,
        adminCredentials: { username: adminCredentials.username },
        updateAdminCredentials,
        adminLogin,
        adminLogout,

        clearAllDemoData,
        resetAllToDefaults,

        isSupabaseConnected,
        syncLocalToSupabase,

        downloads,
        addDownload: (item: DownloadItem) => {
          setDownloads((prev) => {
            const updated = [item, ...prev.filter((d) => d.id !== item.id)];
            persistLocalOnly('sahitya_downloads', updated);
            return updated;
          });
          if (supabase && isSupabaseConfigured()) {
            supabase.from('fest_downloads').upsert([{
              id: item.id,
              title: item.title,
              subtitle: item.subtitle || '',
              category: item.category || 'General',
              file_type: item.fileType || 'PDF',
              url: item.url,
              date: item.date || new Date().toISOString().slice(0, 10),
              color: item.color || 'amber',
              updated_at: new Date().toISOString(),
            }]).then(({ error }) => {
              if (error) console.error('[Supabase] Add download error:', error);
              broadcastChange('fest_downloads', 'insert');
            });
          }
        },
        updateDownload: (id: string, item: Partial<DownloadItem>) => {
          setDownloads((prev) => {
            const updated = prev.map((d) => (d.id === id ? { ...d, ...item } : d));
            persistLocalOnly('sahitya_downloads', updated);
            return updated;
          });
          if (supabase && isSupabaseConfigured()) {
            const target = downloads.find((d) => d.id === id);
            if (target) {
              const merged = { ...target, ...item };
              supabase.from('fest_downloads').upsert([{
                id: merged.id,
                title: merged.title,
                subtitle: merged.subtitle || '',
                category: merged.category || 'General',
                file_type: merged.fileType || 'PDF',
                url: merged.url,
                date: merged.date || new Date().toISOString().slice(0, 10),
                color: merged.color || 'amber',
                updated_at: new Date().toISOString(),
              }]).then(({ error }) => {
                if (error) console.error('[Supabase] Update download error:', error);
                broadcastChange('fest_downloads', 'update');
              });
            }
          }
        },
        deleteDownload: (id: string) => {
          setDownloads((prev) => {
            const updated = prev.filter((d) => d.id !== id);
            persistLocalOnly('sahitya_downloads', updated);
            return updated;
          });
          if (supabase && isSupabaseConfigured()) {
            supabase.from('fest_downloads').delete().eq('id', id).then(({ error }) => {
              if (error) console.error('[Supabase] Delete download error:', error);
              broadcastChange('fest_downloads', 'delete');
            });
          }
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
