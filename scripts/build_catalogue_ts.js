const fs = require('fs');

const seedContent = fs.readFileSync('./scripts/seed_qudwa_data.js', 'utf8');

const progMatch = seedContent.match(/const PROGRAMMES_CATALOGUE = (\[[\s\S]*?\]);/);
const schedMatch = seedContent.match(/const STAGE_SCHEDULE = (\[[\s\S]*?\]);/);

const parseNm = (nmStr, type) => {
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
};

const PROGRAMMES_CATALOGUE = eval(progMatch[1]);
const STAGE_SCHEDULE = eval(schedMatch[1]);

const tsContent = `// OFFICIAL QUDWA 2K26 PROGRAMME CATALOGUE & COMPETITION DIRECTORY
// Auto-generated from Official Directorate Catalogue PDF (117 Competitions)

import { ProgramMaster, ScheduleItem, ProgramLimit, Competition } from './mockData';

export const QUDWA_PROGRAMS: ProgramMaster[] = ${JSON.stringify(
  PROGRAMMES_CATALOGUE.map((p) => ({
    id: 'prog-' + p.code.toLowerCase(),
    code: '',
    name: p.name,
    category: p.category,
    type: p.type,
    stageType: p.stageType,
    maxScore: 100,
  })),
  null,
  2
)};

export const QUDWA_PROGRAM_LIMITS: ProgramLimit[] = ${JSON.stringify(
  PROGRAMMES_CATALOGUE.map((p) => {
    const nm = parseNm(p.nm, p.type);
    return {
      programId: 'prog-' + p.code.toLowerCase(),
      programCode: '',
      programName: p.name,
      category: p.category,
      type: p.type,
      stageType: p.stageType,
      maxEntriesPerTeam: nm.maxEntriesPerTeam,
      groupSetsPerTeam: nm.groupSetsPerTeam,
      participantsPerSet: nm.participantsPerSet,
      noMembersRequired: false,
    };
  }),
  null,
  2
)};

export const QUDWA_SCHEDULE: ScheduleItem[] = ${JSON.stringify(
  [
    ...PROGRAMMES_CATALOGUE.filter((p) => p.stageType === 'Non Stage').map((p) => ({
      id: 'sched-nonstage-' + p.code.toLowerCase(),
      day: 0,
      date: '2026-10-11',
      time: '10:00 AM - 05:00 PM',
      title: p.name,
      category: p.category,
      stage: p.venue || 'Smart Class Room',
      status: 'Completed',
    })),
    ...STAGE_SCHEDULE.map((s, idx) => ({
      id: 'sched-' + s.day + '-' + (idx + 1) + '-' + s.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      day: s.day,
      date: s.date,
      time: s.time,
      title: s.title,
      category: s.category,
      stage: s.stage,
      status: s.status,
    })),
  ],
  null,
  2
)};

export const QUDWA_COMPETITIONS: Competition[] = ${JSON.stringify(
  PROGRAMMES_CATALOGUE.map((p, idx) => ({
    id: 'comp-' + p.code.toLowerCase(),
    resultNumber: idx + 1,
    name: p.name,
    category: p.category,
    type: p.type,
    stageType: p.stageType,
    stage: p.venue || 'Main Stage',
    status: 'Upcoming',
    winners: [],
  })),
  null,
  2
)};
`;

fs.writeFileSync('src/data/qudwaCatalogue.ts', tsContent);
console.log('src/data/qudwaCatalogue.ts updated with pure program names and no codes!');
