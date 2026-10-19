const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttttnhfpmyjasivanedt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dHRuaGZwbXlqYXNpdmFuZWR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI5NDcxMiwiZXhwIjoyMTA0ODcwNzEyfQ.qpBLXNTDW5w_2e4hqf_CqzypcOmeoNVY_rtFtr_0nno';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const cleanName = (str) => String(str || '').replace(/^(STG|NSTG)-\d+\s*[-–•:]\s*/i, '').trim();

async function runClean() {
  console.log('=== REMOVING ALL PROGRAMME CODES FROM DATABASE ===');

  // 1. Clean fest_competitions
  const { data: comps } = await supabase.from('fest_competitions').select('*');
  if (comps && comps.length > 0) {
    const updatedComps = comps.map((c) => ({
      ...c,
      name: cleanName(c.name),
      updated_at: new Date().toISOString(),
    }));
    const { error: compErr } = await supabase.from('fest_competitions').upsert(updatedComps);
    if (compErr) console.error('Error updating fest_competitions:', compErr);
    else console.log(`✓ Cleaned ${updatedComps.length} competition names in fest_competitions!`);
  }

  // 2. Clean fest_schedule
  const { data: sched } = await supabase.from('fest_schedule').select('*');
  if (sched && sched.length > 0) {
    const updatedSched = sched.map((s) => ({
      ...s,
      title: cleanName(s.title),
      updated_at: new Date().toISOString(),
    }));
    const { error: schedErr } = await supabase.from('fest_schedule').upsert(updatedSched);
    if (schedErr) console.error('Error updating fest_schedule:', schedErr);
    else console.log(`✓ Cleaned ${updatedSched.length} schedule titles in fest_schedule!`);
  }

  // 3. Clean fest_programs (remove code and clean name)
  const { data: progs } = await supabase.from('fest_programs').select('*');
  if (progs && progs.length > 0) {
    const updatedProgs = progs.map((p) => ({
      ...p,
      code: '',
      name: cleanName(p.name),
      updated_at: new Date().toISOString(),
    }));
    const { error: progErr } = await supabase.from('fest_programs').upsert(updatedProgs);
    if (progErr) console.error('Error updating fest_programs:', progErr);
    else console.log(`✓ Cleaned ${updatedProgs.length} programs in fest_programs (code cleared)!`);
  }

  // 4. Clean program_limits in fest_settings
  const { data: settings } = await supabase.from('fest_settings').select('*').eq('id', 'news_feed').maybeSingle();
  if (settings && Array.isArray(settings.program_limits)) {
    const cleanedLimits = settings.program_limits.map((l) => ({
      ...l,
      programCode: '',
      programName: cleanName(l.programName),
    }));
    const { error: setErr } = await supabase.from('fest_settings').upsert({
      ...settings,
      program_limits: cleanedLimits,
      updated_at: new Date().toISOString(),
    });
    if (setErr) console.error('Error updating program_limits in fest_settings:', setErr);
    else console.log(`✓ Cleaned ${cleanedLimits.length} program limits in fest_settings (code cleared)!`);
  }

  console.log('=== ALL PROGRAMME CODES REMOVED FROM DATABASE ===');
}

runClean();
