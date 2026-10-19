import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  User,
  Hash,
  Users,
  Calendar,
  Tag,
  ArrowLeft,
  Camera,
  CameraOff,
  Search,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { DEMO_PARTICIPANTS } from '@/data/mockData';
import { useData } from '@/context/DataContext';

type Participant = typeof DEMO_PARTICIPANTS[number];

const categoryColor = (cat: string) => {
  switch (cat) {
    case 'Sub Junior': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Junior':     return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Senior':     return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    default:           return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const teamBg = (team: string) => {
  if (team === 'DAHFATAHAN') return 'from-[#6C0E0E] to-[#8b1111]';
  if (team === 'BADFATHAN')  return 'from-[#1e3a5f] to-[#1e40af]';
  return 'from-gray-700 to-gray-900';
};

export default function ScannerPage() {
  const { brand, currentTheme } = useData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<any>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [result, setResult] = useState<Participant | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanHistory, setScanHistory] = useState<{ participant: Participant; time: string }[]>([]);
  const [lastScanned, setLastScanned] = useState<string>('');

  const findParticipant = useCallback((chestNo: string): Participant | null => {
    return DEMO_PARTICIPANTS.find(p => p.chestNo === chestNo.trim()) ?? null;
  }, []);

  const handleFound = useCallback((chestNo: string) => {
    const clean = chestNo.trim();
    // Debounce — don't re-scan same code within 2 seconds
    if (clean === lastScanned) return;
    setLastScanned(clean);
    setTimeout(() => setLastScanned(''), 2000);

    const participant = findParticipant(clean);
    if (participant) {
      setResult(participant);
      setNotFound(false);
      setScanHistory(prev => {
        const entry = { participant, time: new Date().toLocaleTimeString('en-IN') };
        return [entry, ...prev].slice(0, 20); // keep last 20
      });
    } else {
      setResult(null);
      setNotFound(true);
    }
  }, [findParticipant, lastScanned]);

  const startScanner = useCallback(async () => {
    setCameraError(null);
    setScanning(true);
    setResult(null);
    setNotFound(false);

    try {
      const Quagga = (await import('@ericblade/quagga2')).default;
      scannerRef.current = Quagga;

      await Quagga.init(
        {
          inputStream: {
          type: 'LiveStream',
          target: videoRef.current!,
          constraints: {
            facingMode: 'environment', // rear camera on phones
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
          decoder: {
            readers: ['code_128_reader', 'code_39_reader', 'ean_reader'],
          },
          locate: true,
          frequency: 10,
        },
        (err: any) => {
          if (err) {
            console.error('Quagga init error:', err);
            setCameraError('Could not access camera. Please allow camera permission and try again.');
            setScanning(false);
          }
        }
      );

      Quagga.start();

      Quagga.onDetected((data: any) => {
        const code = data?.codeResult?.code;
        if (code) handleFound(code);
      });
    } catch (e: any) {
      console.error(e);
      setCameraError('Camera not available. Use manual lookup below.');
      setScanning(false);
    }
  }, [handleFound]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.offDetected();
      } catch (_) {}
    }
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleFound(manualInput);
    setManualInput('');
  };

  const resetResult = () => {
    setResult(null);
    setNotFound(false);
  };

  return (
    <>
      <Head>
        <title>Barcode Scanner – {brand?.eventName || 'QUDWA'} 2026</title>
      </Head>

      <div className="min-h-screen bg-[#060306] text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#060306]/90 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                  <ScanLine className="w-5 h-5" style={{ color: currentTheme.primary }} />
                  Barcode Scanner
                </h1>
                <p className="text-xs text-white/40">Scan a participant's barcode card</p>
              </div>
            </div>
            <Link
              href="/barcodes"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border"
              style={{ borderColor: `${currentTheme.primary}50`, color: currentTheme.secondary, backgroundColor: `${currentTheme.primary}20` }}
            >
              <Printer className="w-3.5 h-3.5" />
              Print Cards
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* Camera Scanner */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <div className="relative bg-black aspect-video w-full flex items-center justify-center">
              {/* Video element for Quagga */}
              <div ref={videoRef as any} className={`w-full h-full ${scanning ? 'block' : 'hidden'}`} />

              {/* Scanning overlay */}
              {scanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-40">
                    {/* Corner guides */}
                    {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
                      <div
                        key={i}
                        className={`absolute w-7 h-7 border-[3px] border-[#EBD5AA] ${pos} ${i < 2 ? 'border-b-0' : 'border-t-0'} ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'}`}
                      />
                    ))}
                    {/* Scanning laser line */}
                    <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan-line top-1/2" />
                  </div>
                </div>
              )}

              {/* Idle state */}
              {!scanning && (
                <div className="flex flex-col items-center justify-center gap-3 text-white/30 py-10">
                  <CameraOff className="w-12 h-12" />
                  <p className="text-sm font-semibold">Camera is off</p>
                </div>
              )}
            </div>

            {/* Camera controls */}
            <div className="p-4 flex items-center justify-between gap-3">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: currentTheme.primary, color: currentTheme.secondary }}
                >
                  <Camera className="w-5 h-5" />
                  Start Camera Scanner
                </button>
              ) : (
                <>
                  <button
                    onClick={stopScanner}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                  >
                    <CameraOff className="w-4 h-4" />
                    Stop Camera
                  </button>
                  <button
                    onClick={() => { stopScanner(); setTimeout(startScanner, 300); }}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                    title="Restart scanner"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {cameraError && (
              <div className="mx-4 mb-4 px-4 py-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-xs">
                ⚠️ {cameraError}
              </div>
            )}
          </div>

          {/* Manual Lookup */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-wide">Manual Chest No. Lookup</p>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  placeholder="Enter chest number (e.g. 101)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: currentTheme.primary, color: currentTheme.secondary }}
              >
                <Search className="w-4 h-4" />
                Find
              </button>
            </form>
          </div>

          {/* Result Display */}
          {result && (
            <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Success header */}
              <div className={`px-5 py-4 bg-gradient-to-r ${teamBg(result.team)} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-white/90" />
                  <div>
                    <p className="text-xs text-white/70 font-semibold uppercase tracking-widest">Participant Found</p>
                    <p className="text-base font-black text-white">{result.team}</p>
                  </div>
                </div>
                <button onClick={resetResult} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <XCircle className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Participant Details */}
              <div className="bg-[#0d0508] p-5 space-y-3">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border"
                    style={{ backgroundColor: `${currentTheme.primary}30`, borderColor: `${currentTheme.primary}50`, color: currentTheme.secondary }}
                  >
                    {result.chestNo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black text-white uppercase leading-snug">{result.name}</p>
                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border mt-1 ${categoryColor(result.category)}`}>
                      {result.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">
                      <Hash className="w-3 h-3" /> Chest No.
                    </div>
                    <p className="text-2xl font-black text-white">{result.chestNo}</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">
                      <Tag className="w-3 h-3" /> Category
                    </div>
                    <p className="text-sm font-bold text-white">{result.category}</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">
                      <Users className="w-3 h-3" /> Team
                    </div>
                    <p className="text-sm font-bold text-white">{result.team}</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">
                      <Calendar className="w-3 h-3" /> Date of Birth
                    </div>
                    <p className="text-sm font-bold text-white">{result.dob}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Not Found */}
          {notFound && !result && (
            <div className="rounded-2xl border border-red-800/40 bg-red-950/30 px-5 py-6 text-center animate-in fade-in duration-300">
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 font-bold text-base">Participant Not Found</p>
              <p className="text-red-400/70 text-xs mt-1">No participant matched that barcode or chest number.</p>
              <button
                onClick={resetResult}
                className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  Recent Scans ({scanHistory.length})
                </p>
                <button
                  onClick={() => setScanHistory([])}
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                {scanHistory.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border shrink-0"
                        style={{ backgroundColor: `${currentTheme.primary}25`, borderColor: `${currentTheme.primary}40`, color: currentTheme.secondary }}
                      >
                        {entry.participant.chestNo}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{entry.participant.name}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          {entry.participant.team} · {entry.participant.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-white/30 shrink-0 ml-2">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-line {
          0%   { top: 10%; }
          50%  { top: 90%; }
          100% { top: 10%; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
          position: absolute;
        }
      `}</style>
    </>
  );
}
