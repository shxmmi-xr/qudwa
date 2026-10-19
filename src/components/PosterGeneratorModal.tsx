import React, { useRef, useEffect, useState } from 'react';
import { Download, X, Share2, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { Competition } from '@/data/mockData';
import { SiteBrand, useData } from '@/context/DataContext';

interface PosterGeneratorModalProps {
  competition: Competition;
  brand: SiteBrand;
  onClose: () => void;
}

export const PosterGeneratorModal: React.FC<PosterGeneratorModalProps> = ({
  competition,
  brand,
  onClose,
}) => {
  const { programs } = useData();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate high-resolution canvas poster
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution dimensions (1080 x 1350 for Instagram / WhatsApp status)
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0a030b');
    bgGradient.addColorStop(0.5, '#130616');
    bgGradient.addColorStop(1, '#080209');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Ambient Glow circles
    const glow1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 500);
    glow1.addColorStop(0, 'rgba(236, 28, 98, 0.25)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 50, width * 0.2, height * 0.8, 500);
    glow2.addColorStop(0, 'rgba(45, 212, 191, 0.15)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = 'rgba(236, 28, 98, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // 2. Header / Festival Branding
    ctx.textAlign = 'center';

    // Festival Subtitle
    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 24px sans-serif';
    ctx.letterSpacing = '6px';
    const orgText = (brand.organization || 'DISTRICT CULTURAL FESTIVAL').toUpperCase();
    ctx.fillText(orgText, width / 2, 110);

    // Main Festival Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px sans-serif';
    ctx.letterSpacing = '2px';
    const festTitle = `${brand.eventName || 'Arts Festival'} '${brand.year ? String(brand.year).slice(-2) : '26'}`;
    ctx.fillText(festTitle, width / 2, 185);

    // Header divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 220);
    ctx.lineTo(width - 150, 220);
    ctx.stroke();

    // Safe rounded rect helper
    const drawRoundRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      c.beginPath();
      if (typeof c.roundRect === 'function') {
        c.roundRect(x, y, w, h, r);
      } else {
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      }
    };

    // 3. Stage Type, Category & Type Badge Pill
    const matchedProg = programs?.find(
      (p) => p.name.toLowerCase() === competition.name.toLowerCase() || p.id === competition.id
    );
    const stageType = competition.stageType || matchedProg?.stageType || 'Stage';
    const badgeText = `${stageType.toUpperCase()} • ${competition.category.toUpperCase()} • ${competition.type.toUpperCase()}`;
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '3px';
    const badgeWidth = ctx.measureText(badgeText).width + 60;
    const badgeHeight = 44;
    const badgeX = (width - badgeWidth) / 2;
    const badgeY = 250;

    // Badge Background
    ctx.fillStyle = '#291705';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 22);
    ctx.fill();
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(badgeText, width / 2, badgeY + 30);

    // 4. Program Name Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(competition.name, width / 2, 360);

    // 5. Winners Cards Drawing
    const winners = competition.winners || [];
    const cardStartY = 420;
    const cardGap = 160;
    const cardWidth = 960;
    const cardHeight = 135;
    const cardX = (width - cardWidth) / 2;

    const rankStyles = [
      {
        bg: '#1c0a1f',
        border: '#ec1c62',
        medalBg: '#ec1c62',
        rankLabel: '1ST',
        ptsColor: '#ec1c62',
      },
      {
        bg: '#140d18',
        border: 'rgba(255, 255, 255, 0.15)',
        medalBg: '#64748b',
        rankLabel: '2ND',
        ptsColor: '#ffffff',
      },
      {
        bg: '#140d18',
        border: 'rgba(217, 119, 6, 0.3)',
        medalBg: '#d97706',
        rankLabel: '3RD',
        ptsColor: '#f59e0b',
      },
    ];

    winners.slice(0, 3).forEach((winner, idx) => {
      const styleIndex = winner.position ? winner.position - 1 : idx;
      const style = rankStyles[styleIndex] || rankStyles[Math.min(idx, 2)];
      const y = cardStartY + idx * cardGap;

      // Card Background
      ctx.fillStyle = style.bg;
      ctx.strokeStyle = style.border;
      ctx.lineWidth = idx === 0 ? 2 : 1.5;
      drawRoundRect(ctx, cardX, y, cardWidth, cardHeight, 24);
      ctx.fill();
      ctx.stroke();

      // Medal Box (Left)
      const medalBoxSize = 90;
      const medalBoxX = cardX + 25;
      const medalBoxY = y + (cardHeight - medalBoxSize) / 2;
      ctx.fillStyle = style.medalBg;
      drawRoundRect(ctx, medalBoxX, medalBoxY, medalBoxSize, medalBoxSize, 20);
      ctx.fill();

      // Medal Rank Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style.rankLabel, medalBoxX + medalBoxSize / 2, medalBoxY + 56);

      // Winner Name
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      const winnerName = winner.name || (winner.team ? `${winner.team} Team` : 'Participant');
      // Truncate if too long
      const displayName = winnerName.length > 25 ? `${winnerName.substring(0, 23)}...` : winnerName;
      ctx.fillText(displayName, medalBoxX + medalBoxSize + 30, y + 52);

      // Team / Sector / Set / Chest info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 20px sans-serif';
      ctx.letterSpacing = '1px';
      let subLabel = (winner.team || winner.sector || 'TEAM ENTRY').toUpperCase();
      if (winner.setNumber) {
        subLabel += ` • SET ${winner.setNumber}`;
      }
      if (winner.groupMembers && winner.groupMembers.length > 0) {
        const memberChests = winner.groupMembers.map((m) => `#${m.chestNo}`).join(' ');
        subLabel += ` (${memberChests})`;
      } else if (winner.chestNo) {
        subLabel += ` (CHEST #${winner.chestNo})`;
      }
      const displaySub = subLabel.length > 38 ? `${subLabel.substring(0, 36)}...` : subLabel;
      ctx.fillText(displaySub, medalBoxX + medalBoxSize + 30, y + 92);

      // Points Column (Right)
      const ptsX = cardX + cardWidth - 210;
      ctx.textAlign = 'center';
      ctx.fillStyle = style.ptsColor;
      ctx.font = '900 40px sans-serif';
      ctx.fillText(String(winner.points || 0), ptsX, y + 60);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 16px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('POINTS', ptsX, y + 90);

      // Grade Column (Far Right)
      const gradeX = cardX + cardWidth - 90;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 40px sans-serif';
      const gradeVal = winner.grade && winner.grade !== 'None' ? winner.grade : '-';
      ctx.fillText(gradeVal, gradeX, y + 60);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 16px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('GRADE', gradeX, y + 90);
    });

    // 6. Footer / Official Verified Badge
    const footerY = height - 140;

    // Verified Pill
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, width / 2 - 200, footerY - 40, 400, 46, 23);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('OFFICIAL VERIFIED RESULT', width / 2, footerY - 10);

    // Festival Dates & Venue Subtext
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '18px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      `${brand.venue || 'Festival Arena'} • Published by ${brand.builtBy || 'Shxmmi'}`,
      width / 2,
      footerY + 45
    );
  }, [competition, brand]);

  // Download Image Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Result_${competition.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // Copy Link / Share
  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f0710] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 my-8 text-center animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-[#ec1c62]/20 border border-[#ec1c62]/40 text-[#ec1c62] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Result Poster Generator</h3>
              <p className="text-[11px] text-white/50">{competition.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black max-h-[460px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[460px] object-contain rounded-2xl"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="py-3.5 px-5 rounded-2xl bg-[#ec1c62] hover:bg-[#d41555] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(236,28,98,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Downloading...' : 'Download Poster (PNG)'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Result'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
