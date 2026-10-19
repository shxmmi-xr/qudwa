import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, Award, Star, Trophy, Feather } from 'lucide-react';
import { ThemeConfig } from '@/config/siteConfig';

interface Interactive3DHeroElementProps {
  theme: ThemeConfig;
  brand: {
    eventName: string;
    edition?: string;
    year: string;
    venue: string;
    themeTitle?: string;
    organization?: string;
  };
}

export const Interactive3DHeroElement: React.FC<Interactive3DHeroElementProps> = ({
  theme,
  brand,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking state for 3D physics
  const mousePosRef = useRef({
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
  });

  // 3D Parallax Mouse Physics without React state re-rendering churn
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mousePosRef.current.targetRotX = -((y - centerY) / centerY) * 18;
    mousePosRef.current.targetRotY = ((x - centerX) / centerX) * 18;
    mousePosRef.current.targetX = (x - centerX) * 0.002;
    mousePosRef.current.targetY = (y - centerY) * 0.002;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    mousePosRef.current.isHovered = true;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mousePosRef.current.isHovered = false;
    mousePosRef.current.targetRotX = 0;
    mousePosRef.current.targetRotY = 0;
    mousePosRef.current.targetX = 0;
    mousePosRef.current.targetY = 0;
  };

  // ================= 3D TRADITIONAL NILAVILAKKU & SAHITYA JYOTHI CANVAS ENGINE =================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const size = 360;
    canvas.width = size;
    canvas.height = size;

    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        return {
          r: parseInt(clean[0] + clean[0], 16),
          g: parseInt(clean[1] + clean[1], 16),
          b: parseInt(clean[2] + clean[2], 16),
        };
      }
      return {
        r: parseInt(clean.substring(0, 2), 16) || 245,
        g: parseInt(clean.substring(2, 4), 16) || 158,
        b: parseInt(clean.substring(4, 6), 16) || 11,
      };
    };

    const pRgb = hexToRgb(theme.primary);
    const sRgb = hexToRgb(theme.secondary);
    const goldLight = { r: 254, g: 240, b: 138 };
    const goldBrass = { r: 245, g: 158, b: 11 };
    const copperWarm = { r: 217, g: 119, b: 6 };

    let rotY = 0;
    let rotX = 0;
    let time = 0;

    // Traditional floating golden deepam embers (കണികകൾ)
    const embers = Array.from({ length: 32 }, (_, i) => ({
      angle: (i / 32) * Math.PI * 2,
      radius: Math.random() * 85 + 20,
      y: Math.random() * size,
      speedY: Math.random() * 0.8 + 0.3,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? goldLight : (i % 3 === 1 ? goldBrass : copperWarm),
    }));

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.024;

      // Mouse smooth influence
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.08;

      rotY += 0.012 + mousePosRef.current.x;
      rotX = mousePosRef.current.y * 0.6;

      const cx = size / 2;
      const cy = size / 2;

      // ================= 1. TRADITIONAL SACRED GLOW & AURA (പ്രഭാവലയം) =================
      const flamePulse = 1 + Math.sin(time * 4) * 0.08;
      const auraGrad = ctx.createRadialGradient(cx, cy - 25, 5, cx, cy - 25, 140 * flamePulse);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      auraGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.28)');
      auraGrad.addColorStop(0.6, `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.12)`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 25, 140 * flamePulse, 0, Math.PI * 2);
      ctx.fill();

      // ================= 2. ROTATING PADMA MANDALA (പത്മ മണ്ഡലം - Traditional Lotus Rings) =================
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotY * 0.3);

      // Outer ornamental brass ring with traditional petal notches
      const ringRadius = 128;
      ctx.strokeStyle = `rgba(${goldBrass.r}, ${goldBrass.g}, ${goldBrass.b}, 0.3)`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner filigree ring
      ctx.strokeStyle = `rgba(${goldLight.r}, ${goldLight.g}, ${goldLight.b}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius - 16, 0, Math.PI * 2);
      ctx.stroke();

      // 12 Traditional Lotus Petals (പത്മ ദളങ്ങൾ)
      const petals = 12;
      for (let i = 0; i < petals; i++) {
        const pAngle = (i / petals) * Math.PI * 2;
        const px1 = Math.cos(pAngle) * (ringRadius - 16);
        const py1 = Math.sin(pAngle) * (ringRadius - 16);
        const px2 = Math.cos(pAngle + Math.PI / petals) * ringRadius;
        const py2 = Math.sin(pAngle + Math.PI / petals) * ringRadius;
        const px3 = Math.cos(pAngle + (Math.PI * 2) / petals) * (ringRadius - 16);
        const py3 = Math.sin(pAngle + (Math.PI * 2) / petals) * (ringRadius - 16);

        ctx.strokeStyle = `rgba(${goldBrass.r}, ${goldBrass.g}, ${goldBrass.b}, 0.25)`;
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.quadraticCurveTo(px2 * 1.08, py2 * 1.08, px3, py3);
        ctx.stroke();

        // Golden ornamental jewel node at petal apex
        ctx.fillStyle = `rgba(${goldLight.r}, ${goldLight.g}, ${goldLight.b}, 0.7)`;
        ctx.beginPath();
        ctx.arc(px2, py2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Counter-rotating Inner Traditional Sun/Chakra Wheel
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rotY * 0.45);
      const innerRing = 88;
      ctx.strokeStyle = `rgba(${copperWarm.r}, ${copperWarm.g}, ${copperWarm.b}, 0.22)`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, innerRing, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ================= 3. TRADITIONAL BRASS NILAVILAKKU 3D METALLIC BODY (നിലവിളക്ക് രൂപം) =================
      ctx.save();
      ctx.translate(cx, cy + 30);
      ctx.rotate(rotX);

      // (A) Stepped Brass Base (ആധാരത്തറ / പീഠം)
      // Base Ring 1 (Lowest)
      const baseGrad = ctx.createLinearGradient(-60, 0, 60, 0);
      baseGrad.addColorStop(0, '#92400e');
      baseGrad.addColorStop(0.25, '#d97706');
      baseGrad.addColorStop(0.5, '#fef08a');
      baseGrad.addColorStop(0.75, '#d97706');
      baseGrad.addColorStop(1, '#78350f');

      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.ellipse(0, 65, 58, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Base Ring 2 (Middle Tier)
      ctx.beginPath();
      ctx.ellipse(0, 56, 42, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Base Ring 3 (Lotus Carving Plate)
      ctx.beginPath();
      ctx.ellipse(0, 48, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // (B) Turned Brass Pillar / Stem (തണ്ട്) with Traditional Ridges
      const pillarGrad = ctx.createLinearGradient(-12, 0, 12, 0);
      pillarGrad.addColorStop(0, '#78350f');
      pillarGrad.addColorStop(0.3, '#d97706');
      pillarGrad.addColorStop(0.5, '#fef08a');
      pillarGrad.addColorStop(0.7, '#d97706');
      pillarGrad.addColorStop(1, '#451a03');

      // Lower pillar shaft
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(-7, 10, 14, 38);

      // Central Decorative Brass Knop (മണി ഉരുണ്ട തണ്ട്)
      ctx.beginPath();
      ctx.ellipse(0, 20, 15, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Upper pillar shaft
      ctx.fillRect(-6, -15, 12, 26);

      // (C) Sacred Oil Bowl Reservoir (വിളക്കു തട്ട് / തട്ട്)
      const thattuGrad = ctx.createLinearGradient(-50, 0, 50, 0);
      thattuGrad.addColorStop(0, '#78350f');
      thattuGrad.addColorStop(0.2, '#b45309');
      thattuGrad.addColorStop(0.5, '#fef08a');
      thattuGrad.addColorStop(0.8, '#b45309');
      thattuGrad.addColorStop(1, '#451a03');

      // Fluted Oil Pan (തട്ട്)
      ctx.fillStyle = thattuGrad;
      ctx.beginPath();
      ctx.ellipse(0, -16, 48, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inner Oil Reservoir Cavity
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(0, -17, 40, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Ghee / Sacred Oil Surface (നെയ്യ് തട്ട്)
      const oilGrad = ctx.createRadialGradient(0, -17, 2, 0, -17, 36);
      oilGrad.addColorStop(0, '#fef08a');
      oilGrad.addColorStop(0.5, '#d97706');
      oilGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = oilGrad;
      ctx.beginPath();
      ctx.ellipse(0, -17, 36, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // (D) Ornamental Brass Finial (മകുടം / പീഠം)
      ctx.fillStyle = pillarGrad;
      ctx.beginPath();
      ctx.moveTo(-7, -18);
      ctx.lineTo(7, -18);
      ctx.lineTo(4, -32);
      ctx.lineTo(0, -42);
      ctx.lineTo(-4, -32);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top Lotus Bud Finial (മകുടാഗ്രം)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -43, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // (E) 5 Multi-Wick Flame Positions on the Brass Thattu (പഞ്ചമുഖ ദീപം)
      const wickPositions = [
        { x: -38, y: -16, scale: 0.75 },
        { x: -20, y: -13, scale: 0.85 },
        { x: 0, y: -44, scale: 1.4, isCenter: true }, // Main Sahitya Jyothi
        { x: 20, y: -13, scale: 0.85 },
        { x: 38, y: -16, scale: 0.75 },
      ];

      wickPositions.forEach((wp, wIdx) => {
        const flameWave = Math.sin(time * 6 + wIdx) * 2.5;
        const flameHeight = (wp.isCenter ? 36 : 18) * flamePulse;
        const flameWidth = (wp.isCenter ? 14 : 7);

        // Outer Flame Amber Glow
        const flameOuterGrad = ctx.createRadialGradient(
          wp.x + flameWave * 0.3,
          wp.y - flameHeight * 0.5,
          2,
          wp.x,
          wp.y - flameHeight * 0.5,
          flameHeight * 0.9
        );
        flameOuterGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        flameOuterGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.85)');
        flameOuterGrad.addColorStop(0.7, 'rgba(234, 88, 12, 0.5)');
        flameOuterGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = flameOuterGrad;
        ctx.beginPath();
        ctx.moveTo(wp.x - flameWidth, wp.y);
        ctx.quadraticCurveTo(
          wp.x - flameWidth * 1.2 + flameWave,
          wp.y - flameHeight * 0.6,
          wp.x + flameWave,
          wp.y - flameHeight
        );
        ctx.quadraticCurveTo(
          wp.x + flameWidth * 1.2 + flameWave,
          wp.y - flameHeight * 0.6,
          wp.x + flameWidth,
          wp.y
        );
        ctx.closePath();
        ctx.fill();

        // Inner Sacred White-Hot Flame Core (ദീപ അന്തർജ്വാല)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.moveTo(wp.x - flameWidth * 0.4, wp.y);
        ctx.quadraticCurveTo(
          wp.x - flameWidth * 0.4 + flameWave * 0.5,
          wp.y - flameHeight * 0.4,
          wp.x + flameWave * 0.5,
          wp.y - flameHeight * 0.7
        );
        ctx.quadraticCurveTo(
          wp.x + flameWidth * 0.4 + flameWave * 0.5,
          wp.y - flameHeight * 0.4,
          wp.x + flameWidth * 0.4,
          wp.y
        );
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();

      // ================= 4. FLOATING GOLDEN FESTIVAL EMBERS (ദീപ പ്രസാദം / കണികകൾ) =================
      embers.forEach((em) => {
        em.y -= em.speedY;
        em.pulse += 0.05;
        if (em.y < 0) {
          em.y = size;
          em.radius = Math.random() * 85 + 20;
        }

        const emX = cx + Math.cos(em.angle + time * 0.3) * em.radius;
        const currentAlpha = em.alpha * (0.6 + Math.sin(em.pulse) * 0.4);

        ctx.fillStyle = `rgba(${em.color.r}, ${em.color.g}, ${em.color.b}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(emX, em.y, em.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Smooth core 3D tilt lerp
      mousePosRef.current.currentRotX += (mousePosRef.current.targetRotX - mousePosRef.current.currentRotX) * 0.08;
      mousePosRef.current.currentRotY += (mousePosRef.current.targetRotY - mousePosRef.current.currentRotY) * 0.08;

      if (coreRef.current) {
        const scaleVal = mousePosRef.current.isHovered ? 1.05 : 1;
        coreRef.current.style.transform = `rotateX(${mousePosRef.current.currentRotX.toFixed(2)}deg) rotateY(${mousePosRef.current.currentRotY.toFixed(2)}deg) scale3d(${scaleVal}, ${scaleVal}, ${scaleVal})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative my-6 sm:my-10 w-80 sm:w-[28rem] h-64 sm:h-72 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: '1400px' }}
    >
      {/* 3D Floating Traditional Monument Core */}
      <div
        ref={coreRef}
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform ${
          !isHovered ? 'animate-float' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* ================= 1. WARM GOLDEN VOLUMETRIC AURA GLOW (Z: -60px) ================= */}
        <div
          className="absolute w-64 sm:w-88 h-64 sm:h-88 rounded-full blur-[90px] opacity-75 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle, #f59e0b 0%, #d97706 35%, ${theme.primary} 70%, transparent 90%)`,
            transform: 'translateZ(-60px)',
          }}
        />

        {/* ================= 2. REAL 3D CANVAS NILAVILAKKU & SAHITYA JYOTHI (Z: 20px) ================= */}
        <div
          className="relative z-10 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(20px)' }}
        >
          <canvas ref={canvasRef} className="w-76 sm:w-88 h-76 sm:h-88" />
        </div>

        {/* ================= 3. TRADITIONAL GOLDEN TROPHY & DEEPAM SEAL (Z: 85px) ================= */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(85px)' }}
        >
          <div
            className="w-16 sm:w-18 h-16 sm:h-18 rounded-2xl p-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center justify-center border border-amber-400/60"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 45%, #fef08a 75%, #d97706 100%)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.7)',
            }}
          >
            <div className="w-full h-full rounded-[14px] bg-[#120602] flex items-center justify-center text-white border border-amber-500/30">
              <Flame className="w-8 sm:w-9 h-8 sm:h-9 text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.95)]" />
            </div>
          </div>
        </div>

        {/* ================= 4. FLOATING TRADITIONAL KERALA HERITAGE BADGES (Z: 105px & 115px) ================= */}
        {/* Top-Left Traditional Badge */}
        <div
          className="absolute -top-2 -left-2 sm:-left-6 pointer-events-none transition-transform duration-300"
          style={{ transform: 'translateZ(105px)' }}
        >
          <div
            className="px-4 py-2 rounded-2xl text-black font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 -rotate-6 border border-amber-300/60 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400"
            style={{
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.5)',
            }}
          >
            <Flame className="w-4 h-4 fill-black shrink-0" />
            <span>സാഹിത്യോത്സവം • Sahityotsav</span>
          </div>
        </div>

        {/* Top-Right Traditional Year & Heritage Badge */}
        <div
          className="absolute -top-3 -right-2 sm:-right-6 pointer-events-none transition-transform duration-300"
          style={{ transform: 'translateZ(115px)' }}
        >
          <div
            className="px-4 py-1.5 rounded-2xl bg-[#0f0402] text-amber-300 font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-1.5 rotate-6 border border-amber-500/40"
            style={{
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8)',
            }}
          >
            <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
            <span className="text-white">{brand.year}</span>
            <span className="text-amber-400 font-bold">കലോത്സവം</span>
          </div>
        </div>

        {/* Bottom-Center Traditional Cultural Flame Tag */}
        <div
          className="absolute -bottom-4 inset-x-0 flex justify-center pointer-events-none transition-transform duration-300"
          style={{ transform: 'translateZ(120px)' }}
        >
          <div
            className="px-4 py-2 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-amber-400/50 bg-gradient-to-r from-[#1c0803] via-[#2c0e05] to-[#1c0803] text-amber-300"
            style={{
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.45)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b] animate-pulse" />
            <span>Traditional Nilavilakku • ദീപം</span>
          </div>
        </div>

      </div>
    </div>
  );
};

