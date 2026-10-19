const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttttnhfpmyjasivanedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dHRuaGZwbXlqYXNpdmFuZWR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI5NDcxMiwiZXhwIjoyMTA0ODcwNzEyfQ.qpBLXNTDW5w_2e4hqf_CqzypcOmeoNVY_rtFtr_0nno';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// All 117 Programmes from QUDWA 2K26 Catalogue
const PROGRAMMES_CATALOGUE = [
  // 1. STAGE PROGRAMMES — INDIVIDUAL (Sub Junior)
  { code: 'STG-101', name: 'QIRAAH', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 07:45 AM - 08:30 AM', nm: '3' },
  { code: 'STG-102', name: 'SPEECH MLM', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 07:00AM - 07:45 AM', nm: '4' },
  { code: 'STG-103', name: 'SPEECH ENG', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 07:00AM - 07:30 AM', nm: '3' },
  { code: 'STG-104', name: 'SPEECH ARB', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 11:30 AM - 12:00 PM', nm: '3' },
  { code: 'STG-105', name: 'SONG MLM', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 08:45 AM - 09:30 AM', nm: '4' },
  { code: 'STG-106', name: 'NASHEED ARB', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 07:00AM - 07:45 AM', nm: '3' },
  { code: 'STG-107', name: 'VAAZ', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 11:30PM - 12:30 PM', nm: '3' },
  { code: 'STG-108', name: 'STORY NARRATION', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '12/10/2026 • 07:00AM - 07:45 AM', nm: '3' },
  { code: 'STG-109', name: 'POEM RECITATION', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '12/10/2026 • 10:30 AM - 11:00AM', nm: '3' },
  { code: 'STG-110', name: 'NJAN ORU MALAYALI', type: 'Individual', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '12/10/2026 • 07:00 PM - 07:30 PM', nm: '4' },

  // 1. STAGE PROGRAMMES — INDIVIDUAL (Junior)
  { code: 'STG-201', name: 'QIRAAH', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '12/10/2026 • 07:45 AM - 08:30 AM', nm: '4' },
  { code: 'STG-202', name: 'SPEECH MLM', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 07:45 AM - 08:30 AM', nm: '4' },
  { code: 'STG-203', name: 'INSPIRATIONAL TALK', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 02:00 PM - 03:00 PM', nm: '4' },
  { code: 'STG-204', name: 'SPEECH ARB', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 12:00 PM - 12:30 PM', nm: '4' },
  { code: 'STG-205', name: 'SONG MLM', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 10:00 AM - 10:45AM', nm: '4' },
  { code: 'STG-206', name: 'NASHEED ARB', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 07:30 PM - 08:15 PM', nm: '4' },
  { code: 'STG-207', name: 'URDU NAAT', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 07:30 AM - 08:00 AM', nm: '3' },
  { code: 'STG-208', name: 'POEM RECITATION', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '13/10/2026 • 07:45 AM - 08:30 AM', nm: '4' },
  { code: 'STG-209', name: 'VA’AZ', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 04:00 PM - 04:30 PM', nm: '4' },
  { code: 'STG-210', name: 'NJAN ORU MALAYALI', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '12/10/2026 • 08:00 PM - 08:30PM', nm: '3' },
  { code: 'STG-211', name: 'STORY NARRATION', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '12/10/2026 • 08:30 AM - 09:15 AM', nm: '3' },
  { code: 'STG-212', name: 'PADAPPATTU', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 02:00 PM - 02:45 PM', nm: '4' },
  { code: 'STG-213', name: 'TEACHING', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '12/10/2026 • 03:30 PM - 04:30 PM', nm: '3' },
  { code: 'STG-214', name: 'TABLE TALK MLM', type: 'Individual', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '12/10/2026 • 11:30PM - 12:30 PM', nm: '3' },

  // 1. STAGE PROGRAMMES — INDIVIDUAL (Senior)
  { code: 'STG-301', name: 'QIRAAH', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 08:30 AM - 09:15 AM', nm: '4' },
  { code: 'STG-302', name: 'JUNCTION SPEECH', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 08:30 AM - 09:30 AM', nm: '4' },
  { code: 'STG-303', name: 'RADIO PRESENTATION', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Stage 2', schedule: '14/10/2026 • 07:00 AM - 08:00 AM', nm: '4' },
  { code: 'STG-304', name: 'SPEECH ARB', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Stage 2', schedule: '13/10/2026 • 02:00 PM - 02:45 PM', nm: '4' },
  { code: 'STG-305', name: 'SONG MLM', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 10:45 AM - 11:30AM', nm: '4' },
  { code: 'STG-306', name: 'NASHEED ARB', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 08:15 PM - 09:00 PM', nm: '4' },
  { code: 'STG-307', name: 'GHAZAL', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 08:00 AM - 08:45 AM', nm: '3' },
  { code: 'STG-308', name: 'KHUTBAH', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Tech Pavilion', schedule: '12/10/2026 • 07:00AM - 07:45 AM', nm: '3' },
  { code: 'STG-309', name: 'VAAZ', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 11:30 AM - 12:30 PM', nm: '3' },
  { code: 'STG-310', name: 'TADRIS', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Stage 2', schedule: '13/10/2026 • 10:00 AM - 11:00AM', nm: '3' },
  { code: 'STG-311', name: 'PADAPPATTU', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 02:45 PM - 03:30 PM', nm: '3' },
  { code: 'STG-312', name: 'INSPIRATIONAL TALK', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 03:00 PM - 04:00 PM', nm: '3' },
  { code: 'STG-313', name: 'REVERSE QUIZ', type: 'Individual', stageType: 'Stage', category: 'Senior', venue: 'Stage 2', schedule: '12/10/2026 • 02:00 PM - 03:00 PM', nm: '3' },

  // 2. STAGE PROGRAMMES — GROUP (Sub Junior)
  { code: 'STG-401', name: 'MASHUP', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 07:00 PM - 07:30 PM', nm: '1*4' },
  { code: 'STG-402', name: 'GROUP SONG', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 10:00 AM - 10:30AM', nm: '2*3' },
  { code: 'STG-403', name: 'CONVERSATION ENG', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '12/10/2026 • 03:00 PM - 03:30 PM', nm: '2*2' },
  { code: 'STG-404', name: 'CONVERSATION MLM', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '12/10/2026 • 11:00 AM - 11:30 PM', nm: '2*2' },
  { code: 'STG-405', name: 'WORD PLAY ARABIC', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '13/10/2026 • 08:30 AM - 09:30 AM', nm: '1*4' },
  { code: 'STG-406', name: 'WORD PLAY ENGLISH', type: 'Group', stageType: 'Stage', category: 'Sub Junior', venue: 'Stage 2', schedule: '13/10/2026 • 11:30 AM - 12:30 PM', nm: '1*4' },

  // 2. STAGE PROGRAMMES — GROUP (Junior)
  { code: 'STG-411', name: 'MASHUP', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 07:30 PM - 08:00 PM', nm: '1*4' },
  { code: 'STG-412', name: 'GROUP SONG', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 10:30 AM - 11:00AM', nm: '2*3' },
  { code: 'STG-413', name: 'WORD PLAY ARABIC', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '13/10/2026 • 07:30 PM - 08:30 PM', nm: '1*4' },
  { code: 'STG-414', name: 'WORD PLAY ENGLISH', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Stage 2', schedule: '14/10/2026 • 08:00 AM - 09:00 AM', nm: '1*4' },
  { code: 'STG-415', name: 'TRANSLATION ENG-MLM', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 10:00 AM - 10:30AM', nm: '2*2' },
  { code: 'STG-416', name: 'DEBATE ENGLISH', type: 'Group', stageType: 'Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2*2' },

  // 2. STAGE PROGRAMMES — GROUP (Senior)
  { code: 'STG-421', name: 'MASHUP', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 08:00 PM - 08:30PM', nm: '1*4' },
  { code: 'STG-422', name: 'GROUP SONG', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 11:00 AM - 11:30AM', nm: '2*3' },
  { code: 'STG-423', name: 'JALSATH USOOL AL-DEEN', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 10:30 AM - 11:30AM', nm: '1*4' },
  { code: 'STG-424', name: 'DEBATE ARB', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*4' },
  { code: 'STG-425', name: 'DEBATE ENG', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*4' },
  { code: 'STG-426', name: 'COMMENTARY ARB', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Stage 2', schedule: '13/10/2026 • 07:00AM - 07:45 AM', nm: '2*2' },
  { code: 'STG-427', name: 'AL-FAQIH', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2*2' },
  { code: 'STG-428', name: 'QURAN TALENT', type: 'Group', stageType: 'Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2*2' },

  // 3. GENERAL STAGE PROGRAMMES
  { code: 'STG-501', name: 'CAMPUS TALENT (INDIVIDUAL)', type: 'Individual', stageType: 'Stage', category: 'General', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 02:00 PM - 03:00 PM', nm: '3*1' },
  { code: 'STG-502', name: 'BURDA & QAWALI', type: 'Group', stageType: 'Stage', category: 'General', venue: 'Main Stage (Stage 1)', schedule: '14/10/2026 • 03:00 PM - 04:00 PM', nm: '1*5' },
  { code: 'STG-503', name: 'MUSHA\'RA', type: 'Group', stageType: 'Stage', category: 'General', venue: 'Main Stage (Stage 1)', schedule: '12/10/2026 • 09:30 PM - 10:30 PM', nm: '1*5' },
  { code: 'STG-504', name: 'ISHQ MAJLIS', type: 'Group', stageType: 'Stage', category: 'General', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 10:00 PM - 11:00 PM', nm: '1*4' },
  { code: 'STG-505', name: 'SUGI SANGEETHAM', type: 'Group', stageType: 'Stage', category: 'General', venue: 'Main Stage (Stage 1)', schedule: '13/10/2026 • 07:00 PM - 07:30 PM', nm: '1*4' },

  // 4. NON-STAGE PROGRAMMES — INDIVIDUAL (Sub Junior)
  { code: 'NSTG-101', name: 'LIVE CRAFT MAKING', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-102', name: 'MATH TALENT', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-103', name: 'SCIENCE MASTER', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-104', name: 'GIO-GIANT', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-105', name: 'PENCIL DRAWING', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-106', name: 'VOCABULARY', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-107', name: 'SPELLING BEE', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-108', name: 'WATER PAINTING', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-109', name: 'SHORT STORY MLM', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-110', name: 'JIGSAW PUZZLE', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-111', name: 'POEM WRITING MLM', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-112', name: 'GENERAL QUIZ', type: 'Individual', stageType: 'Non Stage', category: 'Sub Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },

  // 4. NON-STAGE PROGRAMMES — INDIVIDUAL (Junior)
  { code: 'NSTG-201', name: 'ESSAY MALAYALAM', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-202', name: 'ESSAY ENGLISH', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-203', name: 'WATER PAINTING', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-204', name: 'PENCIL DRAWING', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-205', name: 'CALLIGRAPHY', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-206', name: 'SHORT STORY MLM', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-207', name: 'SHORT STORY ARB', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-208', name: 'ESSAY ARB', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-209', name: 'NEWS REPORT MLM', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-210', name: 'MR. TRANSLATOR', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-211', name: 'TA\'LIM SUNNAH', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },
  { code: 'NSTG-212', name: 'ANA\' ARABI', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },
  { code: 'NSTG-213', name: 'GENERAL QUIZ', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-214', name: 'DIGITAL POSTER DESIGN', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-215', name: 'POEM WRITING MLM', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-216', name: 'GIO-GIANT', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-217', name: 'SHORT STORY ENG', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-218', name: 'TYPING ENG-ARB BILINGUAL', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-219', name: 'MR. ENGLISH', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-220', name: 'LOGICAL REASONING', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-221', name: 'SUDOKU', type: 'Individual', stageType: 'Non Stage', category: 'Junior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },

  // 4. NON-STAGE PROGRAMMES — INDIVIDUAL (Senior)
  { code: 'NSTG-301', name: 'ESSAY MALAYALAM', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-302', name: 'ESSAY ENGLISH', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-303', name: 'ESSAY ARABIC', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-304', name: 'PENCIL DRAWING', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },
  { code: 'NSTG-305', name: 'CALLIGRAPHY', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-306', name: 'TA\'LIM SUNNAH', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },
  { code: 'NSTG-307', name: 'SHORT STORY ARB', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-308', name: 'SHORT STORY MLM', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-309', name: 'SHORT STORY ENG', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-310', name: 'GENERAL QUIZ', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-311', name: 'TYPING ENG-ARB BILINGUAL', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-312', name: 'MR. TRANSLATOR', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-313', name: 'LOGICAL REASONING', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-314', name: 'POEM WRITING MLM', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '3' },
  { code: 'NSTG-315', name: 'THAHLEELUL IBARA', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },
  { code: 'NSTG-316', name: 'SCREEN PLAY', type: 'Individual', stageType: 'Non Stage', category: 'Senior', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2' },

  // 5. GENERAL & GROUP NON-STAGE PROGRAMMES
  { code: 'NSTG-501', name: 'REEL MAKING', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*3' },
  { code: 'NSTG-502', name: 'THEME SONG MAKING', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*3' },
  { code: 'NSTG-503', name: 'INSTALLATION', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*4' },
  { code: 'NSTG-504', name: 'PHOTOGRAPHY', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '2*1' },
  { code: 'NSTG-505', name: 'HACKATHON', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*4' },
  { code: 'NSTG-506', name: 'MAGAZINE', type: 'Group', stageType: 'Non Stage', category: 'General', venue: 'Smart Class Room', schedule: 'Oct 11 / Schedule TBA', nm: '1*5' },
];

function parseNm(nmStr, type) {
  const clean = String(nmStr || '').trim();
  if (clean.includes('*')) {
    const parts = clean.split('*').map((p) => parseInt(p.trim(), 10) || 1);
    return {
      maxEntriesPerTeam: parts[0] || 1,
      groupSetsPerTeam: parts[0] || 1,
      participantsPerSet: parts[1] || 1,
    };
  }
  const n = parseInt(clean, 10) || 1;
  if (type === 'Group') {
    return {
      maxEntriesPerTeam: 1,
      groupSetsPerTeam: 1,
      participantsPerSet: n,
    };
  }
  return {
    maxEntriesPerTeam: n,
    groupSetsPerTeam: 1,
    participantsPerSet: 1,
  };
}

// Stage Schedule from PDF 1 (63 Items across Day 1, Day 2, Day 3)
const STAGE_SCHEDULE = [
  // DAY 1: 12/10/2026 MONDAY
  { day: 1, date: '2026-10-12', time: '07:00 AM - 07:45 AM', title: 'NASHEED ARB', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:00 AM - 07:45 AM', title: 'STORY NARRATION', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:00 AM - 07:45 AM', title: 'KHUTBAH', category: 'Senior', stage: 'Tech Pavilion (Stage 3)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:45 AM - 08:30 AM', title: 'QIRAAH', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:45 AM - 08:30 AM', title: 'QIRAAH', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '08:30 AM - 09:15 AM', title: 'QIRAAH', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '08:30 AM - 09:15 AM', title: 'STORY NARRATION', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '10:00 AM - 10:30 AM', title: 'TRANSLATION ENG-MLM', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '10:30 AM - 11:30 AM', title: 'JALSATH USOOL AL-DEEN', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '10:30 AM - 11:00 AM', title: 'POEM RECITATION', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '11:00 AM - 11:30 AM', title: 'CONVERSATION MLM', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '11:30 AM - 12:30 PM', title: 'VA’AZ', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '11:30 AM - 12:30 PM', title: 'TABLE TALK MLM', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '01:30 PM - 02:00 PM', title: 'RESULT ANNOUNCEMENT', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '02:00 PM - 02:45 PM', title: 'PADAPPATTU', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '02:00 PM - 03:00 PM', title: 'REVERSE QUIZ', category: 'Senior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '02:45 PM - 03:30 PM', title: 'PADAPPATTU', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '03:00 PM - 03:30 PM', title: 'CONVERSATION ENG', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '03:30 PM - 04:30 PM', title: 'TEACHING', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '04:30 PM - 06:00 PM', title: 'INAUGURATION CEREMONY', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:00 PM - 07:30 PM', title: 'MASHUP', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:00 PM - 07:30 PM', title: 'NJAN ORU MALAYALI', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '07:30 PM - 08:00 PM', title: 'MASHUP', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '08:00 PM - 08:30 PM', title: 'MASHUP', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '08:00 PM - 08:30 PM', title: 'NJAN ORU MALAYALI', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 1, date: '2026-10-12', time: '09:30 PM - 10:30 PM', title: 'MUSHA\'RA', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },

  // DAY 2: 13/10/2026 TUESDAY
  { day: 2, date: '2026-10-13', time: '07:00 AM - 07:45 AM', title: 'SPEECH MLM', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:00 AM - 07:45 AM', title: 'COMMENTARY ARB', category: 'Senior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:45 AM - 08:30 AM', title: 'SPEECH MLM', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:45 AM - 08:30 AM', title: 'POEM RECITATION', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '08:30 AM - 09:30 AM', title: 'JUNCTION SPEECH', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '08:30 AM - 09:30 AM', title: 'WORD PLAY ARABIC', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '10:00 AM - 10:30 AM', title: 'GROUP SONG', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '10:00 AM - 11:00 AM', title: 'TADRIS', category: 'Senior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '10:30 AM - 11:00 AM', title: 'GROUP SONG', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '11:00 AM - 11:30 AM', title: 'GROUP SONG', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '11:30 AM - 12:00 PM', title: 'SPEECH ARB', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '11:30 AM - 12:30 PM', title: 'WORD PLAY ENGLISH', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '12:00 PM - 12:30 PM', title: 'SPEECH ARB', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '01:30 PM - 02:00 PM', title: 'RESULT ANNOUNCEMENT', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '02:00 PM - 03:00 PM', title: 'INSPIRATIONAL TALK', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '02:00 PM - 02:45 PM', title: 'SPEECH ARB', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '03:00 PM - 04:00 PM', title: 'INSPIRATIONAL TALK', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '04:00 PM - 04:30 PM', title: 'VAAZ', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:00 PM - 07:30 PM', title: 'SUGI SANGEETHAM', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:30 PM - 08:15 PM', title: 'NASHEED ARB', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '07:30 PM - 08:30 PM', title: 'WORD PLAY ARABIC', category: 'Sub Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '08:15 PM - 09:00 PM', title: 'NASHEED ARB', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 2, date: '2026-10-13', time: '10:00 PM - 11:00 PM', title: 'ISHQ MAJLIS', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },

  // DAY 3: 14/10/2026 WEDNESDAY
  { day: 3, date: '2026-10-14', time: '07:00 AM - 07:30 AM', title: 'SPEECH ENG', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '07:00 AM - 08:00 AM', title: 'RADIO PRESENTATION', category: 'Senior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '07:30 AM - 08:00 AM', title: 'URDU NAAT', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '08:00 AM - 08:45 AM', title: 'GHAZAL', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '08:00 AM - 09:00 AM', title: 'WORD PLAY ENGLISH', category: 'Junior', stage: 'Stage 2', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '08:45 AM - 09:30 AM', title: 'SONG MLM', category: 'Sub Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '10:00 AM - 10:45 AM', title: 'SONG MLM', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '10:45 AM - 11:30 AM', title: 'SONG MLM', category: 'Senior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '11:30 AM - 12:30 PM', title: 'VAAZ', category: 'Junior', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '01:30 PM - 02:00 PM', title: 'RESULT ANNOUNCEMENT', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '02:00 PM - 03:00 PM', title: 'CAMPUS TALENT', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '03:00 PM - 04:00 PM', title: 'BURDA & QAWALI', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '04:30 PM - 06:30 PM', title: 'PUBLIC SHOW - LIVE', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
  { day: 3, date: '2026-10-14', time: '07:00 PM - 10:00 PM', title: 'CLOSING CEREMONY', category: 'General', stage: 'Main Stage (Stage 1)', status: 'Upcoming' },
];

async function runSeed() {
  console.log('=== STARTING QUDWA 2K26 OFFICIAL DATA MIGRATION ===');

  // 1. Prepare Categories
  const categories = ['Sub Junior', 'Junior', 'Senior', 'General'];
  const catRows = categories.map((c) => ({
    id: `cat-${c.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: c,
  }));
  const { error: catErr } = await supabase.from('fest_categories').upsert(catRows, { onConflict: 'name' });
  if (catErr) console.error('Error upserting categories:', catErr);
  else console.log('✓ Categories synchronized:', categories.length);

  // 2. Prepare Programs Rows
  const progRows = PROGRAMMES_CATALOGUE.map((p, idx) => ({
    id: `prog-${p.code.toLowerCase()}`,
    code: p.code,
    name: p.name,
    category: p.category,
    type: p.type,
    stage_type: p.stageType,
    max_score: 100,
    updated_at: new Date().toISOString(),
  }));

  // Delete existing programs and replace with the 117 official programmes
  await supabase.from('fest_programs').delete().neq('id', '___none___');
  const { error: progErr } = await supabase.from('fest_programs').insert(progRows);
  if (progErr) console.error('Error inserting fest_programs:', progErr);
  else console.log(`✓ 117 Programs inserted into fest_programs table successfully!`);

  // 3. Prepare Program Limits (NM)
  const programLimits = PROGRAMMES_CATALOGUE.map((p) => {
    const parsed = parseNm(p.nm, p.type);
    return {
      programId: `prog-${p.code.toLowerCase()}`,
      programCode: p.code,
      programName: p.name,
      category: p.category,
      type: p.type,
      stageType: p.stageType,
      maxEntriesPerTeam: parsed.maxEntriesPerTeam,
      groupSetsPerTeam: parsed.groupSetsPerTeam,
      participantsPerSet: parsed.participantsPerSet,
      noMembersRequired: false,
    };
  });

  // Sync program_limits into fest_settings
  const { data: currentSettings } = await supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle();
  const updatedSettings = {
    id: 'news_feed',
    admin: currentSettings?.admin || { items: [] },
    registration: currentSettings?.registration || {
      isLocked: false,
      lockMessage: 'Registration is closed',
      maxStagePerCandidate: 4,
      maxNonStagePerCandidate: 4,
    },
    program_limits: programLimits,
    updated_at: new Date().toISOString(),
  };
  const { error: settingsErr } = await supabase.from('fest_settings').upsert(updatedSettings);
  if (settingsErr) console.error('Error updating program_limits in fest_settings:', settingsErr);
  else console.log(`✓ 117 Program limits (NM rules) saved to fest_settings!`);

  // 4. Prepare Competitions Rows (for Results & Scoring Directory)
  const compRows = PROGRAMMES_CATALOGUE.map((p, idx) => ({
    id: `comp-${p.code.toLowerCase()}`,
    result_number: idx + 1,
    name: `${p.code} - ${p.name}`,
    category: p.category,
    type: p.type,
    stage_type: p.stageType,
    stage: p.venue || 'Main Stage',
    status: 'Upcoming',
    winners: [],
    updated_at: new Date().toISOString(),
  }));
  await supabase.from('fest_competitions').delete().neq('id', '___none___');
  const { error: compErr } = await supabase.from('fest_competitions').insert(compRows);
  if (compErr) console.error('Error inserting fest_competitions:', compErr);
  else console.log(`✓ 117 Competitions initialized in fest_competitions!`);

  // 5. Prepare Schedule Rows (Day 1, 2, 3 Stage Programme Schedule + Non-Stage Completed Items)
  const nonStagePrograms = PROGRAMMES_CATALOGUE.filter((p) => p.stageType === 'Non Stage');
  const nonStageSchedRows = nonStagePrograms.map((p) => ({
    id: `sched-nonstage-${p.code.toLowerCase()}`,
    day: 0,
    date: '2026-10-11',
    time: '10:00 AM - 05:00 PM',
    title: `${p.code} - ${p.name}`,
    category: p.category,
    stage: p.venue || 'Smart Class Room',
    status: 'Completed',
    updated_at: new Date().toISOString(),
  }));

  const stageSchedRows = STAGE_SCHEDULE.map((s, idx) => ({
    id: `sched-${s.day}-${idx + 1}-${s.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    day: s.day,
    date: s.date,
    time: s.time,
    title: s.title,
    category: s.category,
    stage: s.stage,
    status: s.status,
    updated_at: new Date().toISOString(),
  }));

  const allSchedRows = [...nonStageSchedRows, ...stageSchedRows];
  await supabase.from('fest_schedule').delete().neq('id', '___none___');
  const { error: schedErr } = await supabase.from('fest_schedule').insert(allSchedRows);
  if (schedErr) console.error('Error inserting fest_schedule:', schedErr);
  else console.log(`✓ ${allSchedRows.length} Schedule events (${nonStageSchedRows.length} Non-Stage Completed + ${stageSchedRows.length} Stage) inserted into fest_schedule!`);

  console.log('=== DATA MIGRATION COMPLETE ===');
}

runSeed();
