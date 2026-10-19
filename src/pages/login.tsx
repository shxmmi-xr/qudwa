import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  User,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Lock,
  Trophy,
  Clock,
  MapPin,
  LogOut,
  Award,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useData, calculateWinnerPoints } from '@/context/DataContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentTheme, brand, participants, competitions, programEntries, schedule, standings, adminLogin, isAdminLoggedIn, adminLogout } = useData();

  const [activeTab, setActiveTab] = useState<'participant' | 'admin'>('participant');

  // Participant Form
  const [chestNo, setChestNo] = useState('');
  const [participantPassword, setParticipantPassword] = useState('');
  const [participantError, setParticipantError] = useState('');
  const [loggedInParticipant, setLoggedInParticipant] = useState<any | null>(null);

  // Admin Form
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Helper to cross-reference program schedule for exact date, time, and venue
  const lookupSchedule = (pName: string) => {
    if (!pName) return { stage: 'Venue to be announced', time: 'Schedule to be announced' };
    const clean = pName.toLowerCase().trim();
    const sched = schedule.find(
      (s) =>
        s.title.toLowerCase().trim() === clean ||
        s.title.toLowerCase().includes(clean) ||
        clean.includes(s.title.toLowerCase())
    );
    if (sched) {
      return {
        stage: sched.stage || 'Main Arena',
        time: `${sched.date} • ${sched.time}`,
      };
    }
    return {
      stage: 'Venue to be announced',
      time: 'Time to be announced',
    };
  };

  const handleParticipantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setParticipantError('');
    const queryChest = chestNo.trim();
    const queryPassword = participantPassword.trim();

    if (!queryChest) {
      setParticipantError('Please enter your Username.');
      return;
    }

    const expectedPassword = `kuia@${queryChest}`.toLowerCase();
    if (queryPassword.toLowerCase() !== expectedPassword) {
      setParticipantError('Invalid Username or Password. Please try again.');
      return;
    }

    const found = participants.find((p) => String(p.chestNo).trim() === queryChest);

    // Cross-reference all published competitions in database for this chest number (from Admin Center)
    const matchedResults = competitions.flatMap((comp) => {
      const winnerMatch = comp.winners?.find((w) => {
        if (!w) return false;
        // Direct chest match or comma list
        const chestList = (w.chestNo || '').split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
        if (chestList.includes(queryChest)) return true;

        // Group members array match
        if (w.groupMembers && w.groupMembers.some((m) => String(m.chestNo).trim() === queryChest)) return true;

        // Cross-reference with program entry registered set
        if (comp.type === 'Group') {
          const registeredEntry = programEntries.find(
            (e) =>
              e.programName.toLowerCase() === comp.name.toLowerCase() &&
              e.team.toLowerCase() === w.team.toLowerCase() &&
              (e.setNumber || 1) === (w.setNumber || 1) &&
              e.participants.some((p) => String(p.chestNo).trim() === queryChest)
          );
          if (registeredEntry) return true;
        }

        return false;
      });

      if (winnerMatch) {
        const schedInfo = lookupSchedule(comp.name);
        const posText = winnerMatch.position === 1 ? '1st Place' : winnerMatch.position === 2 ? '2nd Place' : '3rd Place';
        const isGeneral = comp.category === 'General';
        const isGroup = comp.type === 'Group' || isGeneral;
        const pts = winnerMatch.points !== undefined && winnerMatch.points !== null
          ? Number(winnerMatch.points)
          : calculateWinnerPoints(winnerMatch.position, winnerMatch.grade, comp.category, comp.type);
        return [
          {
            name: comp.name,
            category: comp.category,
            type: comp.type || (isGroup ? 'Group' : 'Individual'),
            isGroup,
            stage: comp.stage || schedInfo.stage,
            time: schedInfo.time,
            position: winnerMatch.position,
            result: isGroup ? `${posText} (${isGeneral ? 'General' : 'Group'})` : posText,
            grade: winnerMatch.grade || 'A',
            points: pts,
          },
        ];
      }
      return [];
    });

    // Cross-reference all Program Entry registrations for this chest number
    const registeredPrograms = programEntries
      .filter((entry) => entry.participants.some((p) => String(p.chestNo).trim() === queryChest))
      .map((entry) => {
        const schedInfo = lookupSchedule(entry.programName);
        const isGroup = entry.type === 'Group';
        return {
          name: entry.programName,
          category: entry.category,
          type: entry.type,
          isGroup,
          stage: schedInfo.stage,
          time: schedInfo.time,
          result: 'Registered',
          grade: 'Scheduled',
          points: 0,
        };
      });

    if (found) {
      // Build candidate events directly from real Admin registrations and published results
      const combinedEvents: any[] = [];

      registeredPrograms.forEach((rp) => {
        combinedEvents.push(rp);
      });

      matchedResults.forEach((mr) => {
        const idx = combinedEvents.findIndex((ce: any) => ce.name === mr.name);
        if (idx >= 0) {
          combinedEvents[idx] = { ...combinedEvents[idx], ...mr };
        } else {
          combinedEvents.push(mr);
        }
      });

      setLoggedInParticipant({
        ...found,
        events: combinedEvents,
      });
    } else {
      // Dynamic candidate generated from chest number with real cross-referenced program entries & marks
      const combined = [...registeredPrograms];
      matchedResults.forEach((mr) => {
        const idx = combined.findIndex((ce) => ce.name === mr.name);
        if (idx >= 0) {
          combined[idx] = { ...combined[idx], ...mr };
        } else {
          combined.push(mr);
        }
      });

      const matchedTeam = programEntries.find((e) => e.participants.some((p) => String(p.chestNo).trim() === queryChest))?.team || (standings && standings[0]?.name) || 'DAHFATAHAN';

      setLoggedInParticipant({
        chestNo: queryChest,
        name: `Participant #${queryChest}`,
        team: matchedTeam,
        category: 'Senior',
        events: combined,
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const success = adminLogin(adminId.trim(), adminPassword.trim());
    if (success) {
      router.push('/admin');
    } else {
      setAdminError('Invalid Admin ID or Password. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden bg-[#060306] flex items-center justify-center">
      <Head>
        <title>{`Portal Login | ${brand.eventName} ${brand.year}`}</title>
      </Head>

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.primary }}
      />
      <div
        className="pointer-events-none absolute bottom-10 left-0 w-[500px] h-[500px] blur-[160px] rounded-full opacity-20"
        style={{ backgroundColor: currentTheme.secondary }}
      />

      <div className="container max-w-lg mx-auto relative z-10">
        {!loggedInParticipant ? (
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 space-y-6">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('participant')}
                className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'participant'
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
                style={
                  activeTab === 'participant'
                    ? {
                        backgroundColor: `${currentTheme.primary}35`,
                        color: '#ffffff',
                        border: `1px solid ${currentTheme.primary}60`,
                      }
                    : {}
                }
              >
                <User className="w-4 h-4" />
                <span>Participant Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
                style={
                  activeTab === 'admin'
                    ? {
                        backgroundColor: `${currentTheme.secondary}35`,
                        color: '#ffffff',
                        border: `1px solid ${currentTheme.secondary}60`,
                      }
                    : {}
                }
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            </div>

            {/* TAB 1: PARTICIPANT LOGIN */}
            {activeTab === 'participant' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border mb-4 rotate-3 shadow-lg"
                    style={{
                      backgroundColor: `${currentTheme.primary}20`,
                      borderColor: `${currentTheme.primary}50`,
                      boxShadow: `0 0 25px ${currentTheme.primaryGlow}`,
                    }}
                  >
                    <User className="w-8 h-8 -rotate-3" style={{ color: currentTheme.primary }} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Participant Access
                  </h1>
                  <p className="text-white/50 text-xs sm:text-sm mt-1">
                    Enter your Username and Password
                  </p>
                </div>

                {participantError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{participantError}</span>
                  </div>
                )}

                <form onSubmit={handleParticipantLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={chestNo}
                        onChange={(e) => setChestNo(e.target.value)}
                        placeholder="Username"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/20 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        required
                        value={participantPassword}
                        onChange={(e) => setParticipantPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/20 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs md:text-sm text-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                    style={{
                      backgroundColor: currentTheme.secondary,
                      boxShadow: `0 0 25px ${currentTheme.secondaryGlow}`,
                    }}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ADMIN PORTAL LOGIN */}
            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border mb-4 -rotate-3 shadow-lg"
                    style={{
                      backgroundColor: `${currentTheme.secondary}20`,
                      borderColor: `${currentTheme.secondary}50`,
                      boxShadow: `0 0 25px ${currentTheme.secondaryGlow}`,
                    }}
                  >
                    <KeyRound className="w-8 h-8 rotate-3" style={{ color: currentTheme.secondary }} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Admin Control Login
                  </h1>
                  <p className="text-white/50 text-xs sm:text-sm mt-1">
                    Sign in to edit results, schedule, standings & colors
                  </p>
                </div>

                {adminError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">
                      Admin ID / Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        placeholder="admin"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/20 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">
                      Admin Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/20 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs md:text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                    style={{
                      backgroundColor: currentTheme.primary,
                      boxShadow: `0 0 25px ${currentTheme.primaryGlow}`,
                    }}
                  >
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* PARTICIPANT DASHBOARD */
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  #{loggedInParticipant.chestNo}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{loggedInParticipant.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-0.5">
                    <span className="text-emerald-400 font-bold">
                      Team: {loggedInParticipant.team || loggedInParticipant.sector}
                    </span>
                    <span>•</span>
                    <span
                      className="font-bold px-2 py-0.5 rounded text-[10px] text-black uppercase"
                      style={{ backgroundColor: currentTheme.secondary }}
                    >
                      {loggedInParticipant.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLoggedInParticipant(null)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Candidate Performance Summary Badges: Gold, Silver, Bronze & Total Individual Score */}
            {(() => {
              const allEvents = loggedInParticipant.events || [];
              
              // Only individual programs count toward Individual Score
              // Group and General points go to Team score, not Individual score
              const individualEvents = allEvents.filter((e: any) => !e.isGroup && e.type !== 'Group' && e.category !== 'General');
              
              const totalIndScore = individualEvents.reduce((acc: number, e: any) => acc + (Number(e.points) || 0), 0);

              // Calculate Medals (from published wins)
              const goldCount = allEvents.filter((e: any) => e.position === 1 || e.result?.startsWith('1st')).length;
              const silverCount = allEvents.filter((e: any) => e.position === 2 || e.result?.startsWith('2nd')).length;
              const bronzeCount = allEvents.filter((e: any) => e.position === 3 || e.result?.startsWith('3rd')).length;

              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    {/* Gold Count */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                        Gold (1st)
                      </span>
                      <span className="text-2xl font-black text-amber-400 mt-0.5">
                        {goldCount}
                      </span>
                      <span className="text-[8px] text-white/40 block">1st Places</span>
                    </div>

                    {/* Silver Count */}
                    <div className="p-3 rounded-2xl bg-slate-300/10 border border-slate-300/25 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-wider">
                        Silver (2nd)
                      </span>
                      <span className="text-2xl font-black text-slate-200 mt-0.5">
                        {silverCount}
                      </span>
                      <span className="text-[8px] text-white/40 block">2nd Places</span>
                    </div>

                    {/* Bronze Count */}
                    <div className="p-3 rounded-2xl bg-amber-700/10 border border-amber-700/25 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                        Bronze (3rd)
                      </span>
                      <span className="text-2xl font-black text-amber-500 mt-0.5">
                        {bronzeCount}
                      </span>
                      <span className="text-[8px] text-white/40 block">3rd Places</span>
                    </div>

                    {/* Total Individual Score */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                        Total Ind. Score
                      </span>
                      <span className="text-2xl font-black text-white mt-0.5">
                        {totalIndScore}
                      </span>
                      <span className="text-[8px] text-white/40 block">Solo Points</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span>Enrolled Programs, Schedule & Results</span>
              </h3>

              {loggedInParticipant.events && loggedInParticipant.events.length > 0 ? (
                <div className="space-y-3">
                  {loggedInParticipant.events.map((evt: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                          {evt.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-white/60 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {evt.stage}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-300 font-semibold">
                            <Clock className="w-3.5 h-3.5 shrink-0" /> {evt.time}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-semibold uppercase">
                            {evt.type || (evt.isGroup ? 'Group' : 'Individual')}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 flex sm:block items-center justify-between">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-black uppercase text-black inline-block shadow-sm"
                          style={{ backgroundColor: currentTheme.secondary }}
                        >
                          {evt.result}
                        </span>
                        <span className="block text-[10px] text-white/50 font-bold uppercase mt-1">
                          {evt.result?.includes('Place')
                            ? `Grade ${evt.grade} (+${evt.points} pts)`
                            : 'Status: Registered'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                  <Trophy className="w-8 h-8 mx-auto text-white/30" />
                  <h4 className="text-white font-bold text-sm">No Enrolled Programs Yet</h4>
                  <p className="text-xs text-white/50">
                    Your team coordinator has not registered any competition items for Chest #{loggedInParticipant.chestNo} yet.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                alert(`Digital chest card for #${loggedInParticipant.chestNo} downloaded!`);
              }}
              className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Download Digital Chest Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
