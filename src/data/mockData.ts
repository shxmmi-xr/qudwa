export interface Winner {
  position: 1 | 2 | 3;
  name: string;
  chestNo: string;
  team: string;
  sector?: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'None';
  points: number;
  setNumber?: number;
  groupMembers?: { chestNo: string; name: string }[];
}

export interface ProgramMaster {
  id: string;
  code?: string;
  name: string;
  category: string;
  type: 'Individual' | 'Group';
  stageType: 'Stage' | 'Non Stage';
  maxScore?: number;
}

export interface Competition {
  id: string;
  resultNumber: number;
  name: string;
  category: string;
  type: 'Individual' | 'Group';
  stageType?: 'Stage' | 'Non Stage';
  stage?: string;
  status: 'Published' | 'In Progress' | 'Upcoming';
  winners?: Winner[];
}

export interface TeamStanding {
  id: string;
  rank: number;
  name: string;
  points: number;
  gold: number;
  silver: number;
  bronze: number;
}

export interface ScheduleItem {
  id: string;
  day: number;
  date: string;
  time: string;
  title: string;
  category: string;
  stage: string;
  status: 'Live' | 'Upcoming' | 'Completed';
}

export interface NewsItem {
  id: string;
  titleMalayalam: string;
  titleEnglish: string;
  date: string;
  category: string;
  image: string;
  summary: string;
  content: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface MediaVideo {
  id: string;
  title: string;
  speaker: string;
  thumbnail: string;
  platform?: 'youtube' | 'instagram' | 'direct';
  youtubeId?: string;
  instagramUrl?: string;
  videoUrl?: string;
  duration: string;
}

export const CATEGORIES = [
  'All Categories',
  'Senior',
  'Junior',
  'Sub Junior',
  'General',
];

import { QUDWA_PROGRAMS, QUDWA_SCHEDULE, QUDWA_COMPETITIONS } from './qudwaCatalogue';

export const MOCK_PROGRAMS: ProgramMaster[] = QUDWA_PROGRAMS;

export const MOCK_STANDINGS: TeamStanding[] = [
  { id: 'team-dahfatahan', rank: 0, name: 'DAHFATAHAN', points: 0, gold: 0, silver: 0, bronze: 0 },
  { id: 'team-badfathan', rank: 0, name: 'BADFATHAN', points: 0, gold: 0, silver: 0, bronze: 0 },
];

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    resultNumber: 173,
    name: 'Wall Painting',
    category: 'General',
    type: 'Group',
    stageType: 'Non Stage',
    status: 'Published',
    winners: [
      { position: 1, name: 'Najeem & Team', chestNo: '412', team: 'Team A', grade: 'A', points: 10 },
      { position: 2, name: 'Muhammad Sinan PK & Team', chestNo: '305', team: 'Team B', grade: 'A', points: 7 },
      { position: 3, name: 'Yaseen P & Team', chestNo: '519', team: 'Team A', grade: 'B', points: 5 },
    ],
  },
  {
    id: 'c2',
    resultNumber: 172,
    name: 'Podcast Contest',
    category: 'Junior',
    type: 'Group',
    status: 'Published',
    winners: [
      { position: 1, name: 'Zayan & Team', chestNo: '211', team: 'Team B', grade: 'A', points: 10 },
      { position: 2, name: 'Hisham & Team', chestNo: '189', team: 'Team A', grade: 'A', points: 7 },
      { position: 3, name: 'Naseef & Team', chestNo: '240', team: 'Team B', grade: 'B', points: 5 },
    ],
  },
  {
    id: 'c3',
    resultNumber: 171,
    name: 'AI Poetry Writing',
    category: 'Junior',
    type: 'Individual',
    status: 'Published',
    winners: [
      { position: 1, name: 'Adil Shareef', chestNo: '142', team: 'Team A', grade: 'A', points: 5 },
      { position: 2, name: 'Farhan KV', chestNo: '168', team: 'Team B', grade: 'A', points: 3 },
      { position: 3, name: 'Salmanul Faris', chestNo: '115', team: 'Team A', grade: 'B', points: 1 },
    ],
  },
  {
    id: 'c4',
    resultNumber: 170,
    name: 'Malayalam Elocution',
    category: 'Senior',
    type: 'Individual',
    status: 'Published',
    winners: [
      { position: 1, name: 'Voice of Wisdom', chestNo: '320', team: 'Team B', grade: 'A', points: 10 },
      { position: 2, name: 'Echo Crew', chestNo: '312', team: 'Team A', grade: 'A', points: 7 },
      { position: 3, name: 'Visionary Squad', chestNo: '345', team: 'Team B', grade: 'A', points: 5 },
    ],
  },
  {
    id: 'c5',
    resultNumber: 169,
    name: 'Story Telling',
    category: 'Sub Junior',
    type: 'Individual',
    status: 'Published',
    winners: [
      { position: 1, name: 'Ameen Farhan', chestNo: '480', team: 'Team A', grade: 'A', points: 10 },
      { position: 2, name: 'Nabeel KV', chestNo: '455', team: 'Team B', grade: 'A', points: 7 },
      { position: 3, name: 'Shakir Ali', chestNo: '492', team: 'Team A', grade: 'B', points: 5 },
    ],
  },
  {
    id: 'c6',
    resultNumber: 168,
    name: 'Pencil Drawing',
    category: 'Sub Junior',
    type: 'Individual',
    status: 'Published',
    winners: [
      { position: 1, name: 'Rayan Ahmed', chestNo: '501', team: 'Team B', grade: 'A', points: 10 },
      { position: 2, name: 'Muhammed Nihal', chestNo: '522', team: 'Team A', grade: 'A', points: 7 },
      { position: 3, name: 'Hamza K', chestNo: '510', team: 'Team B', grade: 'A', points: 5 },
    ],
  },
  {
    id: 'c7',
    resultNumber: 167,
    name: 'Arabic Calligraphy',
    category: 'Senior',
    type: 'Individual',
    status: 'Published',
    winners: [
      { position: 1, name: 'Fathima Lubna', chestNo: '601', team: 'Team B', grade: 'A', points: 10 },
      { position: 2, name: 'Aysha Nida', chestNo: '620', team: 'Team A', grade: 'A', points: 7 },
      { position: 3, name: 'Mariyam K', chestNo: '614', team: 'Team B', grade: 'B', points: 5 },
    ],
  },
  {
    id: 'c8',
    resultNumber: 166,
    name: 'Group Song',
    category: 'General',
    type: 'Group',
    status: 'Published',
    winners: [
      { position: 1, name: 'Harmony Choir', chestNo: '702', team: 'Team A', grade: 'A', points: 5 },
      { position: 2, name: 'Sufi Ensemble', chestNo: '715', team: 'Team B', grade: 'A', points: 3 },
      { position: 3, name: 'Melody Group', chestNo: '708', team: 'Team A', grade: 'A', points: 1 },
    ],
  },
];

export const MOCK_SCHEDULE: ScheduleItem[] = QUDWA_SCHEDULE;

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '18827c11-d375-49b6-84a6-86e0ab34b812',
    titleMalayalam: 'കലാമേള സമാപിച്ചു. ടീം എ ചാമ്പ്യൻമാർ',
    titleEnglish: 'Cultural Fest concludes; Team A emerges Champions',
    date: 'Jul 5, 2026',
    category: 'Grand Finale',
    image: 'https://supabase-cache.rabeehch82.workers.dev//storage/v1/object/public/gallery/news/1783262479447_0.12126031980874385.jpg',
    summary: 'The 5-day cultural festival concluded with a grand valedictory session. Team A lifted the golden championship trophy.',
    content: [
      'The Grand Cultural Festival concluded with thrilling celebrations as Team A secured the first position overall with an impressive points tally of 385.',
      'Team B secured the runner-up position with 342 points.',
      'Prominent cultural figures, educators, and leaders addressed the gathering, praising the creative excellence exhibited by the participants.',
    ],
  },
  {
    id: 'f8e73afc-43d1-40d0-bae2-0f13f6fa5013',
    titleMalayalam: 'പുതിയകാലത്തേക്ക് വാതിൽ തുറന്ന് വി ആർ, കരിയർ പവലിയനുകൾ',
    titleEnglish: 'VR & Career Pavilions open doors to the future at Cultural Fest',
    date: 'Jul 5, 2026',
    category: 'Special Feature',
    image: 'https://supabase-cache.rabeehch82.workers.dev//storage/v1/object/public/gallery/news/1783258474946_0.7053989849264486.jpg',
    summary: 'Cutting-edge tech exhibitions featuring Virtual Reality, Prompt Engineering, and Career guidance attracted massive audience engagement.',
    content: [
      'The festival hosted state-of-the-art tech zones demonstrating the creative intersection of heritage values with modern technologies like VR and AI prompting.',
      'Workshops led by domain experts offered students career roadmaps in technology, literature, and creative media.',
    ],
  },
  {
    id: 'b76a164b-76f5-46c5-be61-9c6bc5bfaae6',
    titleMalayalam: 'വേദിയിൽ വൻ ജനസഞ്ചയം',
    titleEnglish: 'Massive turnout witnesses Grand Qawwali & Cultural Night',
    date: 'Jul 4, 2026',
    category: 'Cultural Events',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.5087088120933086.jpg',
    summary: 'Thousands packed the main arena to witness spellbinding performances including classical Qawwali and revolutionary songs.',
    content: [
      'The festival grounds were illuminated by heartfelt expressions of devotion, heritage, and social unity.',
      'The festival theme continues to inspire attendees to preserve virtue and creative brilliance for future generations.',
    ],
  },
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Grand Stage & Atmosphere',
    category: 'Stages',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.5087088120933086.jpg',
  },
  {
    id: 'g2',
    title: 'Captivating Performance',
    category: 'Performances',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.537288477818013.jpg',
  },
  {
    id: 'g3',
    title: 'Audience and Crowds',
    category: 'Crowd',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.43222763305254575.jpg',
  },
  {
    id: 'g4',
    title: 'Youth Expression & Art',
    category: 'Art',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.9996384543314404.jpg',
  },
  {
    id: 'g5',
    title: 'Trophy Celebration',
    category: 'Awards',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.7668696353410143.jpg',
  },
  {
    id: 'g6',
    title: 'Interactive Tech Pavilions',
    category: 'Exhibitions',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.7431463581599278.jpg',
  },
  {
    id: 'g7',
    title: 'Dignitaries and Guests',
    category: 'Ceremony',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.9020333223921433.jpg',
  },
  {
    id: 'g8',
    title: 'Cultural Echoes',
    category: 'Moments',
    image: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/7553a389-c9d6-4b0d-b78d-268a675152e9/0.1402062751981965.jpg',
  },
];

export const MOCK_VIDEOS: MediaVideo[] = [
  {
    id: 'v-1789546103414',
    title: 'LOGO REVEALING',
    speaker: '@ifada_kuia',
    platform: 'direct',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    videoUrl: '/media/logo-revealing.mp4',
    duration: 'Video',
  },
  {
    id: 'v-insta-1',
    title: 'Grand Festival Anthem & Stage Celebrations',
    speaker: '@artsfest_official',
    platform: 'instagram',
    instagramUrl: 'https://www.instagram.com/reel/C7qXYZ123/',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    duration: 'Reel',
  },
  {
    id: 'v1',
    title: 'സാംസ്കാരിക പ്രഭാഷണം | അനസ് അമാനി',
    speaker: 'Anas Amani',
    platform: 'youtube',
    thumbnail: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/thumbnails/0.6444958067741247.jpg',
    youtubeId: 'PB-sceRwDGg',
    duration: '28:45',
  },
  {
    id: 'v2',
    title: 'ചരിത്രവും സാംസ്കാരിക മുന്നേറ്റവും | സി എൻ ജഅഫർ',
    speaker: 'CN Jafar',
    platform: 'youtube',
    thumbnail: 'https://ihqelxrpsmmjjxsobaqm.supabase.co/storage/v1/object/public/gallery/thumbnails/0.63445193397356.jpg',
    youtubeId: 'vrsAinR65Y8',
    duration: '42:10',
  },
];

export const DEMO_PARTICIPANTS = [
  // SUB JUNIOR (10)
  { chestNo: '101', name: 'ABDUL BASITH', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-05-10', events: [] },
  { chestNo: '102', name: 'NIHAL ABDULLAH', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-07-14', events: [] },
  { chestNo: '103', name: 'AHMMAD MISHAB K.M', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-03-22', events: [] },
  { chestNo: '104', name: 'MUHAMMEDSAHAL P', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-09-18', events: [] },
  { chestNo: '105', name: 'MUHAMMED RAFAN P.R', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-11-05', events: [] },
  { chestNo: '106', name: 'MUHAMMED HAZIM', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2013-01-12', events: [] },
  { chestNo: '107', name: 'UNAIS K', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2013-04-20', events: [] },
  { chestNo: '108', name: 'ABDUL FAMSHAD', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-08-30', events: [] },
  { chestNo: '109', name: 'MUHAMMED BADARUDHEEN', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2013-02-15', events: [] },
  { chestNo: '110', name: 'MUHAMMED KHALANDAR SHAH', team: 'DAHFATAHAN', category: 'Sub Junior', dob: '2012-12-01', events: [] },

  // JUNIOR (16)
  { chestNo: '201', name: 'MUHAMMED NAFIH', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-06-15', events: [] },
  { chestNo: '202', name: 'MUHAMMED SINAN K.S', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-08-20', events: [] },
  { chestNo: '203', name: 'WASEEM ABOOBACKER K.S', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-04-10', events: [] },
  { chestNo: '204', name: 'MUHAMMED NMISAL M', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-10-05', events: [] },
  { chestNo: '205', name: 'MOHAMMED ABDUNNAFIH', team: 'DAHFATAHAN', category: 'Junior', dob: '2010-01-18', events: [] },
  { chestNo: '206', name: 'ADIL MUBARAK H', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-03-25', events: [] },
  { chestNo: '207', name: 'MUHAMMED FAHIM K.S', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-11-12', events: [] },
  { chestNo: '208', name: 'MUHAMMED THANZEEH E', team: 'DAHFATAHAN', category: 'Junior', dob: '2010-02-28', events: [] },
  { chestNo: '209', name: 'IBRAHIM MUQTHAR', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-07-07', events: [] },
  { chestNo: '210', name: 'ABBAS ALI NAJAH K.J', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-09-14', events: [] },
  { chestNo: '211', name: 'MOHAMMED ASHIQ', team: 'DAHFATAHAN', category: 'Junior', dob: '2010-03-10', events: [] },
  { chestNo: '212', name: 'MUHAMMEDSAFWAN SIDIQ', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-12-04', events: [] },
  { chestNo: '213', name: 'MUHAMMED RAZAN P.R', team: 'DAHFATAHAN', category: 'Junior', dob: '2010-04-16', events: [] },
  { chestNo: '214', name: 'MUHAMMED SHEBEEB', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-05-22', events: [] },
  { chestNo: '215', name: 'JAMSHEER', team: 'DAHFATAHAN', category: 'Junior', dob: '2010-06-30', events: [] },
  { chestNo: '216', name: 'MOHAMMED NAJAD M.R', team: 'DAHFATAHAN', category: 'Junior', dob: '2009-08-08', events: [] },

  // SENIOR (11)
  { chestNo: '301', name: 'THANSEEH C.M', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-04-12', events: [] },
  { chestNo: '302', name: 'AHAMMED MASHOOD', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-09-24', events: [] },
  { chestNo: '303', name: 'MAHAMMAD MUSTHAFA', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-02-18', events: [] },
  { chestNo: '304', name: 'ABDUL SHUKOOR C.H', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-11-05', events: [] },
  { chestNo: '305', name: 'AHAMMAD ANWAR M.A', team: 'DAHFATAHAN', category: 'Senior', dob: '2007-01-20', events: [] },
  { chestNo: '306', name: 'MOOSA SHAHAD A', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-07-15', events: [] },
  { chestNo: '307', name: 'AHAMMED SINAN T.M', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-12-30', events: [] },
  { chestNo: '308', name: 'SHAMSUDDEN N.A', team: 'DAHFATAHAN', category: 'Senior', dob: '2007-03-14', events: [] },
  { chestNo: '309', name: 'MAHAMMAD FARIS', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-05-28', events: [] },
  { chestNo: '310', name: 'MUHAMMED MISWAR', team: 'DAHFATAHAN', category: 'Senior', dob: '2006-10-10', events: [] },
  { chestNo: '311', name: 'MOHAMMED JAFAR C', team: 'DAHFATAHAN', category: 'Senior', dob: '2007-02-02', events: [] },

  // ================= BADFATHAN ROSTER =================
  // SUB JUNIOR (9)
  { chestNo: '111', name: 'MUHAMMED MUNAZIR CM', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-06-10', events: [] },
  { chestNo: '112', name: 'MUHAMMED ZAYYAN K', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-08-14', events: [] },
  { chestNo: '113', name: 'ABDUL AMEEN', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-04-22', events: [] },
  { chestNo: '114', name: 'ISMAIL ASHFAR', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-10-18', events: [] },
  { chestNo: '115', name: 'ISMAIL SHAHIM', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-11-05', events: [] },
  { chestNo: '116', name: 'MUNAVVAR ALI K', team: 'BADFATHAN', category: 'Sub Junior', dob: '2013-02-12', events: [] },
  { chestNo: '117', name: 'MUHAMMED ASHIQUE A', team: 'BADFATHAN', category: 'Sub Junior', dob: '2013-05-20', events: [] },
  { chestNo: '118', name: 'ANEES K', team: 'BADFATHAN', category: 'Sub Junior', dob: '2012-09-30', events: [] },
  { chestNo: '119', name: 'ASHKAR ALI FARIS', team: 'BADFATHAN', category: 'Sub Junior', dob: '2013-03-15', events: [] },

  // JUNIOR (16)
  { chestNo: '217', name: 'MUHAMMED MUKTHAR', team: 'BADFATHAN', category: 'Junior', dob: '2009-05-15', events: [] },
  { chestNo: '218', name: 'MOHAMMED SAVAD M', team: 'BADFATHAN', category: 'Junior', dob: '2009-07-20', events: [] },
  { chestNo: '219', name: 'SUHAIL K', team: 'BADFATHAN', category: 'Junior', dob: '2009-03-10', events: [] },
  { chestNo: '220', name: 'MUHAMMED ALI K M', team: 'BADFATHAN', category: 'Junior', dob: '2009-09-05', events: [] },
  { chestNo: '221', name: 'MOHAMMED ARAFATH K', team: 'BADFATHAN', category: 'Junior', dob: '2010-02-18', events: [] },
  { chestNo: '222', name: 'ABDULLA SHAMMAS C H', team: 'BADFATHAN', category: 'Junior', dob: '2009-04-25', events: [] },
  { chestNo: '223', name: 'ABDUL SAMAD B H', team: 'BADFATHAN', category: 'Junior', dob: '2009-10-12', events: [] },
  { chestNo: '224', name: 'ABDUL KADHER ANSHATH', team: 'BADFATHAN', category: 'Junior', dob: '2010-01-28', events: [] },
  { chestNo: '225', name: 'MUHAMMED RAMEES', team: 'BADFATHAN', category: 'Junior', dob: '2009-08-07', events: [] },
  { chestNo: '226', name: 'ABDULLA MIRAS', team: 'BADFATHAN', category: 'Junior', dob: '2009-11-14', events: [] },
  { chestNo: '227', name: 'A N AJMAL', team: 'BADFATHAN', category: 'Junior', dob: '2010-04-10', events: [] },
  { chestNo: '228', name: 'IBRAHIM NOUFAL', team: 'BADFATHAN', category: 'Junior', dob: '2009-12-04', events: [] },
  { chestNo: '229', name: 'ABDULLA IYAS', team: 'BADFATHAN', category: 'Junior', dob: '2010-03-16', events: [] },
  { chestNo: '230', name: 'MOHAMMED MUNAVAR', team: 'BADFATHAN', category: 'Junior', dob: '2009-06-22', events: [] },
  { chestNo: '231', name: 'ZAQIR MUHAMMED ASLAM', team: 'BADFATHAN', category: 'Junior', dob: '2010-07-30', events: [] },
  { chestNo: '232', name: 'MUHAMMED AJMALUDHEEN', team: 'BADFATHAN', category: 'Junior', dob: '2009-09-08', events: [] },

  // SENIOR (11)
  { chestNo: '312', name: 'IBRAHIM KAEEL', team: 'BADFATHAN', category: 'Senior', dob: '2006-03-12', events: [] },
  { chestNo: '313', name: 'SUHAIL P A', team: 'BADFATHAN', category: 'Senior', dob: '2006-08-24', events: [] },
  { chestNo: '314', name: 'AHAMMED SHIBIN MAHROOF', team: 'BADFATHAN', category: 'Senior', dob: '2006-01-18', events: [] },
  { chestNo: '315', name: 'NA MUHAMMED SULTHAN NIZAMUDHEEN', team: 'BADFATHAN', category: 'Senior', dob: '2006-10-05', events: [] },
  { chestNo: '316', name: 'MUHAMMED SULAIM', team: 'BADFATHAN', category: 'Senior', dob: '2007-02-20', events: [] },
  { chestNo: '317', name: 'MOHAMMED MIQDAD', team: 'BADFATHAN', category: 'Senior', dob: '2006-06-15', events: [] },
  { chestNo: '318', name: 'SHAHUL HAMEED', team: 'BADFATHAN', category: 'Senior', dob: '2006-11-30', events: [] },
  { chestNo: '319', name: 'ABDULLA P', team: 'BADFATHAN', category: 'Senior', dob: '2007-04-14', events: [] },
  { chestNo: '320', name: 'ABDUL ABID K', team: 'BADFATHAN', category: 'Senior', dob: '2006-07-28', events: [] },
  { chestNo: '321', name: 'UMMERUL FAROOK', team: 'BADFATHAN', category: 'Senior', dob: '2006-09-10', events: [] },
  { chestNo: '322', name: 'ABDUL MUZAMMIL', team: 'BADFATHAN', category: 'Senior', dob: '2007-01-02', events: [] },
];

// PROGRAM ENTRY & REGISTRATION SYSTEM TYPES
export interface ProgramLimit {
  programId: string;
  programCode?: string;
  programName: string;
  category: string;
  type: 'Individual' | 'Group';
  stageType?: 'Stage' | 'Non Stage';
  maxEntriesPerTeam: number; // For Individual items
  groupSetsPerTeam: number;  // For Group items (how many sets / batches per team)
  participantsPerSet: number; // For Group items (how many members per set)
  noMembersRequired?: boolean; // When true: whole team participates / no individual chest numbers required (e.g. magazine)
}

export interface EntryParticipant {
  chestNo: string;
  name: string;
  team: string;
  category?: string;
}

export interface ProgramEntry {
  id: string;
  programId: string;
  programCode?: string;
  programName: string;
  category: string;
  type: 'Individual' | 'Group';
  stageType?: 'Stage' | 'Non Stage';
  team: string; // 'Team A' | 'Team B'
  setNumber?: number; // 1, 2 for Group items
  participants: EntryParticipant[];
  registeredAt: string;
}

export interface TeamPortalAccount {
  id: string;
  teamName: string;
  username: string;
  password: string;
}

export interface RegistrationSettings {
  isLocked: boolean; // Master Lock/Close switch
  lockMessage: string;
  maxStagePerCandidate: number; // Max individual Stage programs per candidate
  maxNonStagePerCandidate: number; // Max individual Non-Stage programs per candidate
}

export const DEFAULT_TEAM_ACCOUNTS: TeamPortalAccount[] = [
  {
    id: 'team-acc-dahfatahan',
    teamName: 'DAHFATAHAN',
    username: 'dahfatahan',
    password: 'dahfatahan@2026',
  },
  {
    id: 'team-acc-badfathan',
    teamName: 'BADFATHAN',
    username: 'badfathan',
    password: 'badfathan@2026',
  },
];

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  isLocked: false,
  lockMessage: 'Entrance and registration is currently closed by the festival administration.',
  maxStagePerCandidate: 4,
  maxNonStagePerCandidate: 4,
};

export const DEFAULT_PROGRAM_ENTRIES: ProgramEntry[] = [];

export interface FestivalNotification {
  id: string;
  title: string;
  summary: string;
  description?: string;
  content: string[];
  category: 'By-Laws & Regulations' | 'By-Law & Regulations' | 'Circular' | 'Urgent Alert' | 'Schedule Notice' | 'Result Bulletin' | 'General';
  priority: 'Urgent' | 'High' | 'Normal';
  targetAudience: string;
  target?: 'All' | 'Participants' | 'Teams' | 'Judges & Officials';
  date: string;
  time?: string;
  isPinned: boolean;
  showOnLiveScreen?: boolean;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'image' | 'doc';
  attachmentUrl?: string;
  attachmentSize?: string;
  byLawClauses?: { clause: string; text: string }[];
}

export const MOCK_NOTIFICATIONS: FestivalNotification[] = [
  {
    id: 'notif-1',
    title: 'Sahityotsav Festival Constitution & Official By-Laws 2026',
    summary: 'The complete official regulatory handbook, candidate eligibility criteria, quota allocations, stage codes, and appeal protocols approved by the Central Arts Committee.',
    description: 'The complete official regulatory handbook, candidate eligibility criteria, quota allocations, stage codes, and appeal protocols approved by the Central Arts Committee.',
    content: [
      'The Central Directorate has officially ratified and issued the complete Sahityotsav Festival By-Laws 2026.',
      'All participating teams, candidates, judges, and administrative officials are bound by the articles enclosed in this official gazette.',
      'Article 1.1: All registered candidates must hold an authorized chest number badge prior to stage entry.',
      'Article 2.3: Individual participation is strictly capped as configured in the administrative quota rules (Stage + Non-Stage limits).',
      'Article 4.8: Judges scores are tabulated digitally and ratified by the Central IT & Scrutiny Wing before final publication.'
    ],
    category: 'By-Laws & Regulations',
    priority: 'High',
    targetAudience: 'All Teams, Participants & Judges',
    target: 'All',
    date: '2026-06-26',
    time: '09:00 AM',
    isPinned: true,
    showOnLiveScreen: true,
    attachmentName: 'Sahityotsav_Official_ByLaws_2026.pdf',
    attachmentType: 'pdf',
    attachmentSize: '2.4 MB',
    attachmentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoK',
    byLawClauses: [
      { clause: 'Article 1.1', text: 'All registered candidates must hold an authorized chest number badge prior to stage entry.' },
      { clause: 'Article 2.3', text: 'Individual participation is strictly capped as configured in the administrative quota rules (Stage + Non-Stage limits).' },
      { clause: 'Article 4.8', text: 'Judges scores are tabulated digitally and ratified by the Central IT & Scrutiny Wing before final publication.' },
    ],
  },
  {
    id: 'notif-2',
    title: 'Urgent Stage Sync: Malayalam Elocution Call Time at Stage 2',
    summary: 'Senior Malayalam Elocution candidates are instructed to report to Stage 2 (Sahitya Mandapam) Green Room by 10:15 AM sharp for lot picking.',
    description: 'Senior Malayalam Elocution candidates are instructed to report to Stage 2 (Sahitya Mandapam) Green Room by 10:15 AM sharp for lot picking.',
    content: [
      'Senior Malayalam Elocution candidates must report directly to Stage 2 (Sahitya Mandapam) Green Room by 10:15 AM sharp.',
      'Lot numbers will be drawn in presence of the stage coordinator. Late reporting will result in forfeiture of order selection.'
    ],
    category: 'Urgent Alert',
    priority: 'Urgent',
    targetAudience: 'Senior Elocution Participants',
    target: 'Participants',
    date: '2026-06-28',
    time: '10:00 AM',
    isPinned: true,
    showOnLiveScreen: true,
    attachmentName: 'Stage2_Reporting_Schedule.pdf',
    attachmentType: 'pdf',
    attachmentSize: '480 KB',
  },
  {
    id: 'notif-3',
    title: 'Central Scrutiny & Appeals Committee Circular No. 04/2026',
    summary: 'Procedure and formal window for filing scoring appeals or evaluation re-checks following official result announcements.',
    description: 'Procedure and formal window for filing scoring appeals or evaluation re-checks following official result announcements.',
    content: [
      'Official guidelines for lodging result inquiries with the Central Scrutiny Committee.',
      'Appeals must be submitted through authorized Team Captain login within 30 minutes of result publication on the official digital board.'
    ],
    category: 'Circular',
    priority: 'Normal',
    targetAudience: 'Team Captains & Managers',
    target: 'Teams',
    date: '2026-06-27',
    time: '04:30 PM',
    isPinned: false,
    showOnLiveScreen: true,
    attachmentName: 'Scrutiny_Appeal_Form.pdf',
    attachmentType: 'pdf',
    attachmentSize: '1.1 MB',
  },
  {
    id: 'notif-4',
    title: 'Code of Conduct for Fine Arts & Calligraphy Hall (Stage 4)',
    summary: 'Guidelines on allowed drawing materials, paper specifications, and reporting timelines for Arabic Calligraphy and Water Color Painting competitions.',
    description: 'Guidelines on allowed drawing materials, paper specifications, and reporting timelines for Arabic Calligraphy and Water Color Painting competitions.',
    content: [
      'Standardized paper materials will be supplied at the venue stamped with festival seal.',
      'Participants must bring their own certified art mediums and brushes. Electronic references are strictly prohibited in the exam hall.'
    ],
    category: 'By-Laws & Regulations',
    priority: 'Normal',
    targetAudience: 'Fine Arts Participants',
    target: 'Participants',
    date: '2026-06-27',
    time: '02:00 PM',
    isPinned: false,
    showOnLiveScreen: true,
    attachmentName: 'FineArts_Code_of_Conduct.pdf',
    attachmentType: 'pdf',
    attachmentSize: '820 KB',
  },
];
