import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  LogOut,
  Trophy,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { ProgramMaster, ProgramEntry, ProgramLimit } from '@/data/mockData';

export default function TeamEntryPortal() {
  const router = useRouter();
  const {
    currentTheme,
    brand,
    programs,
    categories,
    participants,
    standings,
    programLimits,
    getProgramLimit,
    getParticipantEventStats,
    programEntries,
    addProgramEntry,
    addProgramEntriesBulk,
    deleteProgramEntry,
    teamAccounts,
    teamLogin,
    registrationSettings,
    isAdminLoggedIn,
  } = useData();

  // Authentication State
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Selected Program for Entry
  const [selectedProgram, setSelectedProgram] = useState<ProgramMaster | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [activeStageFilter, setActiveStageFilter] = useState<'All' | 'Stage' | 'Non Stage'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'programs' | 'entries'>('programs');

  // Modal / Form State for Entry
  const [chestInput, setChestInput] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [individualSlots, setIndividualSlots] = useState<{ chestNo: string; name: string }[]>([{ chestNo: '', name: '' }]);
  const [groupMembers, setGroupMembers] = useState<{ chestNo: string; name: string }[]>([]);
  const [groupSetNumber, setGroupSetNumber] = useState(1);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Auto-detect team from URL query if provided
  useEffect(() => {
    if (router.query.team) {
      const teamQuery = String(router.query.team).trim();
      const matched = teamAccounts.find(
        (a) =>
          a.teamName.toLowerCase() === teamQuery.toLowerCase() ||
          a.username.toLowerCase() === teamQuery.toLowerCase()
      );
      if (matched) {
        setLoginUsername(matched.username);
        // Only auto-open if logged in as administrator from admin panel
        if (isAdminLoggedIn) {
          setLoginPassword(matched.password);
          setActiveTeam(matched.teamName);
        }
      } else {
        const foundInStandings = standings.find((s) => s.name.toLowerCase() === teamQuery.toLowerCase());
        if (foundInStandings) {
          setLoginUsername(foundInStandings.name.toLowerCase().replace(/\s+/g, '_'));
          if (isAdminLoggedIn) {
            setActiveTeam(foundInStandings.name);
          }
        }
      }
    }
  }, [router.query, teamAccounts, standings, isAdminLoggedIn]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const account = teamLogin(loginUsername, loginPassword);
    if (account) {
      setActiveTeam(account.teamName);
    } else {
      setLoginError('Invalid Team Username or Password. Please verify your credentials with the Festival IT Desk.');
    }
  };

  const handleLogout = () => {
    setActiveTeam(null);
    setLoginPassword('');
    setSelectedProgram(null);
  };

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategoryFilter === 'All' || p.category === activeCategoryFilter;
      const progStage = p.stageType || 'Stage';
      const matchesStage = activeStageFilter === 'All' || progStage === activeStageFilter;
      return matchesSearch && matchesCategory && matchesStage;
    });
  }, [programs, searchTerm, activeCategoryFilter, activeStageFilter]);

  // Entries submitted by current team
  const myTeamEntries = useMemo(() => {
    if (!activeTeam) return [];
    return programEntries.filter((e) => e.team.toLowerCase() === activeTeam.toLowerCase());
  }, [programEntries, activeTeam]);

  // Open Entry Modal
  const openEntryModal = (prog: ProgramMaster) => {
    setSelectedProgram(prog);
    setFormError('');
    setFormSuccess('');
    setChestInput('');
    setCandidateName('');

    const limit = getProgramLimit(prog.id);
    const existingEntries = programEntries.filter(
      (e) =>
        (e.programId === prog.id ||
         e.programCode.toLowerCase() === prog.code.toLowerCase() ||
         e.programName.toLowerCase() === prog.name.toLowerCase()) &&
        e.team.toLowerCase() === (activeTeam || '').toLowerCase()
    );

    if (prog.type === 'Individual') {
      const maxAllowed = limit?.maxEntriesPerTeam || 1;
      const remainingSlots = Math.max(1, maxAllowed - existingEntries.length);
      setIndividualSlots(Array.from({ length: remainingSlots }, () => ({ chestNo: '', name: '' })));
    } else {
      const memberCount = limit?.participantsPerSet || (prog.category === 'General' ? 6 : 4);
      const initialMembers = Array.from({ length: memberCount }, () => ({
        chestNo: '',
        name: '',
      }));
      setGroupMembers(initialMembers);
      setGroupSetNumber(1);
    }
  };

  // Autofill individual candidate slot
  const handleIndividualSlotChange = (index: number, chest: string, nameVal?: string) => {
    const updated = [...individualSlots];
    if (nameVal !== undefined) {
      updated[index] = { ...updated[index], name: nameVal };
    } else {
      const cleanChest = chest.trim();
      const found = participants.find((p) => String(p.chestNo).trim() === cleanChest);
      updated[index] = {
        chestNo: chest,
        name: found ? found.name : updated[index]?.name || '',
      };
    }
    setIndividualSlots(updated);
  };

  // Autofill candidate by chest number
  const handleChestChange = (chest: string, index?: number) => {
    const cleanChest = chest.trim();
    const found = participants.find((p) => String(p.chestNo).trim() === cleanChest);

    if (typeof index === 'number') {
      const updated = [...groupMembers];
      updated[index] = {
        chestNo: chest,
        name: found ? found.name : updated[index]?.name || '',
      };
      setGroupMembers(updated);
    } else {
      setChestInput(chest);
      if (found) {
        setCandidateName(found.name);
      }
    }
  };

  // Submit Entry
  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!activeTeam || !selectedProgram) return;

    if (registrationSettings.isLocked) {
      setFormError('Entrance is locked by festival administration. Submissions are disabled.');
      return;
    }

    const progLimit = getProgramLimit(selectedProgram.id);

    // Whole Team Event (No individual members required)
    if (progLimit?.noMembersRequired) {
      const newEntry: ProgramEntry = {
        id: `entry-${Date.now()}`,
        programId: selectedProgram.id,
        programCode: selectedProgram.code || selectedProgram.id,
        programName: selectedProgram.name,
        category: selectedProgram.category,
        type: selectedProgram.type,
        stageType: selectedProgram.stageType || 'Stage',
        team: activeTeam,
        participants: [
          {
            chestNo: '-',
            name: `${activeTeam} Official Team Submission`,
            team: activeTeam,
            category: selectedProgram.category,
          },
        ],
        registeredAt: new Date().toLocaleString(),
      };

      const result = addProgramEntry(newEntry);
      if (!result.success) {
        setFormError(result.message);
      } else {
        setFormSuccess(result.message);
        setTimeout(() => setSelectedProgram(null), 1200);
      }
      return;
    }

    if (selectedProgram.type === 'Individual') {
      const validSlots = individualSlots.filter((s) => s.chestNo.trim() || s.name.trim());
      if (validSlots.length === 0) {
        setFormError('Please enter at least one candidate Chest Number or Name.');
        return;
      }

      const existingEntries = programEntries.filter(
        (e) =>
          (e.programId === selectedProgram.id ||
           e.programCode.toLowerCase() === (selectedProgram.code || '').toLowerCase() ||
           e.programName.toLowerCase() === selectedProgram.name.toLowerCase()) &&
          e.team.toLowerCase() === (activeTeam || '').toLowerCase()
      );
      const maxAllowed = progLimit?.maxEntriesPerTeam || 1;
      const remainingSlots = maxAllowed - existingEntries.length;

      if (validSlots.length > remainingSlots) {
        setFormError(`Quota limit exceeded: You can only register up to ${remainingSlots} more candidate(s).`);
        return;
      }

      const entriesToSubmit: ProgramEntry[] = validSlots.map((slot, idx) => ({
        id: `entry-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        programId: selectedProgram.id,
        programCode: selectedProgram.code || selectedProgram.id,
        programName: selectedProgram.name,
        category: selectedProgram.category,
        type: 'Individual',
        stageType: selectedProgram.stageType || 'Stage',
        team: activeTeam,
        participants: [
          {
            chestNo: slot.chestNo.trim(),
            name: slot.name.trim() || `Candidate #${slot.chestNo.trim()}`,
            team: activeTeam,
            category: selectedProgram.category,
          },
        ],
        registeredAt: new Date().toLocaleString(),
      }));

      const res = addProgramEntriesBulk(entriesToSubmit);
      if (res.success) {
        setFormSuccess(res.message);
        setTimeout(() => setSelectedProgram(null), 1200);
      } else {
        setFormError(res.message);
      }
    } else {
      // Group Item
      const validParticipants = groupMembers.filter((m) => m.chestNo.trim() || m.name.trim());
      if (validParticipants.length === 0) {
        setFormError('Please enter at least 1 group participant.');
        return;
      }

      const newEntry: ProgramEntry = {
        id: `entry-${Date.now()}`,
        programId: selectedProgram.id,
        programCode: selectedProgram.code || selectedProgram.id,
        programName: selectedProgram.name,
        category: selectedProgram.category,
        type: 'Group',
        stageType: selectedProgram.stageType || 'Stage',
        team: activeTeam,
        setNumber: groupSetNumber,
        participants: validParticipants.map((m) => ({
          chestNo: m.chestNo.trim(),
          name: m.name.trim() || `Candidate #${m.chestNo.trim()}`,
          team: activeTeam,
          category: selectedProgram.category,
        })),
        registeredAt: new Date().toLocaleString(),
      };

      const result = addProgramEntry(newEntry);
      if (!result.success) {
        setFormError(result.message);
      } else {
        setFormSuccess(result.message);
        setTimeout(() => setSelectedProgram(null), 1200);
      }
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden bg-[#060306] text-white">
      <Head>
        <title>{`Team Registration Portal | ${brand.eventName}`}</title>
      </Head>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div
        className="pointer-events-none absolute bottom-10 left-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* If Not Logged In — Show Team Login Card */}
        {!activeTeam ? (
          <div className="max-w-md mx-auto my-12">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0f0710]/95 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 text-center">
              <div
                className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center font-black text-2xl shadow-xl border border-white/10"
                style={{ backgroundColor: currentTheme.primary, color: '#ffffff' }}
              >
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Team Entry Portal</h1>
                <p className="text-xs text-white/50 mt-1">
                  {brand.eventName} • Official Team Registration Desk
                </p>
              </div>

              {/* Entrance status notice */}
              {registrationSettings.isLocked ? (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 text-left">
                  <Lock className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>Entrance is currently locked. Existing registrations can be viewed after login.</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 text-left">
                  <Unlock className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>Entrance is OPEN. Enter your team credentials to register participants.</span>
                </div>
              )}

              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] text-white/70 font-bold mb-1 uppercase tracking-wider">
                    Team Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. team_a or team_b"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-emerald-400 text-white text-sm font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/70 font-bold mb-1 uppercase tracking-wider">
                    Team Access Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-emerald-400 text-white text-sm font-bold transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs text-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentTheme.secondary }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Team Desk</span>
                </button>
              </form>

              <div className="pt-4 border-t border-white/10 text-center text-xs text-white/40 space-y-1">
                <p className="font-semibold text-white/60">Official Team Registration Access</p>
                <p className="text-[11px]">Enter the designated username and access password provided by the Festival General Convener or IT Committee.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Team Portal Dashboard */
          <div className="space-y-6">
            {/* Header / Team Bar */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0f0710]/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/15 shrink-0"
                  style={{ backgroundColor: currentTheme.primary, color: '#ffffff' }}
                >
                  {activeTeam.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-0.5 rounded-full bg-white/10 text-xs font-black text-white border border-white/15 uppercase">
                      {activeTeam}
                    </span>
                    {registrationSettings.isLocked ? (
                      <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase flex items-center gap-1 border border-rose-500/30">
                        <Lock className="w-3 h-3" /> Entrance Locked
                      </span>
                    ) : (
                      <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-500/30">
                        <Unlock className="w-3 h-3" /> Entrance Open
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-black text-white mt-1">
                    {activeTeam} Registration Desk
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <button
                    onClick={() => setActiveView('programs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeView === 'programs' ? 'bg-white/20 text-white shadow' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Programs Directory
                  </button>
                  <button
                    onClick={() => setActiveView('entries')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeView === 'entries' ? 'bg-white/20 text-white shadow' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    My Submissions ({myTeamEntries.length})
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* If Entrance Locked Banner */}
            {registrationSettings.isLocked && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-3">
                <Lock className="w-5 h-5 shrink-0 text-rose-400" />
                <span>
                  <strong>Entrance Closed:</strong> Registration submissions and modifications have been closed by the festival administration. You can view all previously registered participants below.
                </span>
              </div>
            )}

            {/* VIEW 1: PROGRAMS DIRECTORY */}
            {activeView === 'programs' && (
              <div className="space-y-6">
                {/* Search & Category / Stage Filter Pills */}
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search program by name or category..."
                      className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs font-medium focus:outline-none focus:border-emerald-400 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full flex-wrap">
                    {/* Stage Filter */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setActiveStageFilter('All')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeStageFilter === 'All' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        All Types
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStageFilter('Stage')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeStageFilter === 'Stage' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Stage
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStageFilter('Non Stage')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeStageFilter === 'Non Stage' ? 'bg-amber-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Non-Stage
                      </button>
                    </div>

                    {['All', ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          activeCategoryFilter === cat
                            ? 'bg-emerald-500 text-black border-emerald-500 shadow-md'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPrograms.map((prog) => {
                    const limit = getProgramLimit(prog.id);
                    const teamEntriesForProg = programEntries.filter(
                      (e) =>
                        (e.programId === prog.id ||
                         e.programCode.toLowerCase() === (prog.code || '').toLowerCase() ||
                         e.programName.toLowerCase() === prog.name.toLowerCase()) &&
                        e.team.toLowerCase() === (activeTeam || '').toLowerCase()
                    );

                    const isIndividual = prog.type === 'Individual';
                    const maxAllowed = isIndividual
                      ? limit?.maxEntriesPerTeam || 1
                      : limit?.groupSetsPerTeam || 1;
                    const filledCount = teamEntriesForProg.length;
                    const isLimitReached = filledCount >= maxAllowed;

                    return (
                      <div
                        key={prog.id}
                        className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                          isLimitReached
                            ? 'bg-white/[0.03] border-emerald-500/30'
                            : 'bg-[#0f0710]/90 border-white/10 hover:border-white/25 hover:bg-[#150a17]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="space-y-2">
                              <h3 className="text-xl font-black text-white leading-tight">
                                {prog.name}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                                    (prog.stageType || 'Stage') === 'Stage'
                                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  {(prog.stageType || 'Stage') === 'Stage' ? 'Stage' : 'Non-Stage'}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#291705] border border-[#d97706]/40 text-[#f59e0b] text-[10px] font-black uppercase">
                                  {prog.category}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#042628] border border-[#2dd4bf]/40 text-[#2dd4bf] text-[10px] font-black uppercase">
                                  {prog.type}
                                </span>
                                {limit?.noMembersRequired && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
                                    Whole Team
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Slot Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-black border shrink-0 ${
                                isLimitReached
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {limit?.noMembersRequired
                                ? `${filledCount}/${maxAllowed} Team Entry`
                                : isIndividual
                                ? `${filledCount}/${maxAllowed} Entry`
                                : `${filledCount}/${maxAllowed} Set (${limit?.participantsPerSet || 4} members)`}
                            </span>
                          </div>

                          {/* Existing entries brief list */}
                          {teamEntriesForProg.length > 0 && (
                            <div className="mt-3 space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/10">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                Registered Status:
                              </span>
                              {teamEntriesForProg.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between text-xs text-white/80"
                                >
                                  <span>
                                    {limit?.noMembersRequired
                                      ? `${activeTeam} Registered (Whole-Team Event)`
                                      : entry.participants.map((p) => `#${p.chestNo} ${p.name}`).join(', ')}
                                  </span>
                                  {!registrationSettings.isLocked && (
                                    <button
                                      onClick={() => deleteProgramEntry(entry.id)}
                                      className="text-rose-400 hover:text-rose-300 text-[10px] font-bold underline"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[11px] text-white/50">
                            {limit?.noMembersRequired
                              ? `Whole-team submission (No individual member names needed)`
                              : isIndividual
                              ? `Team quota: max ${maxAllowed} candidate`
                              : `Group set: ${limit?.participantsPerSet || 4} members per set`}
                          </span>

                          <button
                            disabled={isLimitReached || registrationSettings.isLocked}
                            onClick={() => openEntryModal(prog)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                              isLimitReached || registrationSettings.isLocked
                                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-emerald-500 text-black hover:scale-105 shadow-lg'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isLimitReached ? 'Quota Filled' : 'Enter Participant'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 2: MY TEAM ENTRIES */}
            {activeView === 'entries' && (
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      All Registered Submissions for {activeTeam}
                    </h2>
                    <p className="text-xs text-white/50">
                      Total {myTeamEntries.length} program entrance entries submitted.
                    </p>
                  </div>
                </div>

                {myTeamEntries.length > 0 ? (
                  <div className="space-y-3">
                    {myTeamEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-5 rounded-3xl bg-[#0f0710]/90 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-[#150a17]"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                                (entry.stageType || 'Stage') === 'Stage'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {(entry.stageType || 'Stage') === 'Stage' ? 'Stage' : 'Non-Stage'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#291705] text-[#f59e0b] text-[10px] font-black uppercase">
                              {entry.category}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#042628] text-[#2dd4bf] text-[10px] font-black uppercase">
                              {entry.type} {entry.setNumber ? `(Set ${entry.setNumber})` : ''}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-white">{entry.programName}</h3>

                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {entry.participants.map((p, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5"
                              >
                                <span className="font-mono text-emerald-400 font-bold">#{p.chestNo}</span>
                                <span>{p.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/40">{entry.registeredAt}</span>
                          {!registrationSettings.isLocked && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove entry for ${entry.programName}?`)) {
                                  deleteProgramEntry(entry.id);
                                }
                              }}
                              className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                    <Trophy className="w-10 h-10 mx-auto mb-2 text-white/30" />
                    <h3 className="text-base font-bold text-white">No Program Entries Submitted Yet</h3>
                    <p className="text-xs text-white/50 mt-1">
                      Switch to the Programs Directory to start registering your team candidates.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* REGISTRATION ENTRY MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#0f0710] border border-white/15 shadow-2xl space-y-5 text-left my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                      (selectedProgram.stageType || 'Stage') === 'Stage'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {(selectedProgram.stageType || 'Stage') === 'Stage' ? 'Stage' : 'Non-Stage'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#291705] text-[#f59e0b] text-[10px] font-black uppercase">
                    {selectedProgram.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#042628] text-[#2dd4bf] text-[10px] font-black uppercase">
                    {selectedProgram.type}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedProgram.name}</h2>
                <span className="text-xs text-emerald-400 font-bold">
                  Registering for: {activeTeam}
                </span>
              </div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Datalist for Chest Number Autofill with Stage/Non-Stage Breakdown */}
            <datalist id="team-participant-datalist">
              {participants
                .filter((p) => !p.team || p.team.toLowerCase() === (activeTeam || '').toLowerCase() || p.team.replace(/A/g, '').toLowerCase() === (activeTeam || '').replace(/A/g, '').toLowerCase())
                .map((p) => {
                  const stats = getParticipantEventStats(p.chestNo);
                  return (
                    <option key={p.chestNo} value={p.chestNo}>
                      #{p.chestNo} • {p.name} ({p.category} • Stage: {stats.stageCount}/{stats.maxStage} | Non-Stage: {stats.nonStageCount}/{stats.maxNonStage})
                    </option>
                  );
                })}
            </datalist>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleEntrySubmit} className="space-y-4">
              {/* Check if Whole-Team / No Members Needed Program */}
              {getProgramLimit(selectedProgram.id)?.noMembersRequired ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1.5">
                  <span className="font-black text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Whole-Team Program (e.g. Magazine / Team Event)</span>
                  </span>
                  <p className="text-[11px] text-white/70">
                    No individual member names or chest numbers are required for this program. All team members of <strong>{activeTeam}</strong> participate together. Click Confirm Registration to register your team entry directly.
                  </p>
                </div>
              ) : selectedProgram.type === 'Individual' ? (
                /* Individual Form Mode with Dynamic Slots based on Quota */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80">
                      Individual Candidate Slots ({individualSlots.length} slot{individualSlots.length > 1 ? 's' : ''} available)
                    </span>
                    <span className="text-[11px] text-white/50">
                      Type Chest No to autofill candidate name
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {individualSlots.map((slot, idx) => {
                      const pStats = slot.chestNo.trim() ? getParticipantEventStats(slot.chestNo) : null;
                      const progStage = selectedProgram.stageType || 'Stage';
                      const maxStg = pStats?.maxStage ?? 4;
                      const maxNonStg = pStats?.maxNonStage ?? 4;
                      const maxTot = pStats?.maxTotal ?? 8;
                      const isStageMax = progStage === 'Stage' && pStats && pStats.stageCount >= maxStg;
                      const isNonStageMax = progStage === 'Non Stage' && pStats && pStats.nonStageCount >= maxNonStg;
                      const isTotalMax = pStats && pStats.totalCount >= maxTot;

                      return (
                        <div key={idx} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/50 font-bold mb-1 uppercase">
                                Candidate {idx + 1} Chest No
                              </label>
                              <input
                                type="text"
                                list="team-participant-datalist"
                                placeholder={`# Chest No (Candidate ${idx + 1})`}
                                value={slot.chestNo}
                                onChange={(e) => handleIndividualSlotChange(idx, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-emerald-400 text-white font-mono font-bold text-xs"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] text-white/50 font-bold mb-1 uppercase">
                                Candidate {idx + 1} Full Name
                              </label>
                              <input
                                type="text"
                                placeholder={`Candidate ${idx + 1} Full Name`}
                                value={slot.name}
                                onChange={(e) => handleIndividualSlotChange(idx, slot.chestNo, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-emerald-400 text-white font-bold text-xs"
                              />
                            </div>
                          </div>

                          {/* Real-time Participant Limit Status Feedback */}
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
                /* Group Form Mode (Multi-Member Set) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80">
                      Group Set Members ({groupMembers.length} participants required)
                    </span>
                    <span className="text-[11px] text-white/50">
                      Type Chest No to autofill candidate name
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {groupMembers.map((member, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            list="team-participant-datalist"
                            placeholder={`# Chest No (Member ${idx + 1})`}
                            value={member.chestNo}
                            onChange={(e) => handleChestChange(e.target.value, idx)}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-white text-xs font-mono font-bold"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder={`Member ${idx + 1} Name`}
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...groupMembers];
                              updated[idx].name = e.target.value;
                              setGroupMembers(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-emerald-400 text-white text-xs font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
