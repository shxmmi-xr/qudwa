import React, { useEffect, useRef } from 'react';
import { ThemeConfig } from '@/config/siteConfig';

interface AnimatedBackgroundProps {
  theme: ThemeConfig;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color converters
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
        r: parseInt(clean.substring(0, 2), 16) || 236,
        g: parseInt(clean.substring(2, 4), 16) || 28,
        b: parseInt(clean.substring(4, 6), 16) || 98,
      };
    };

    const pRgb = hexToRgb(theme.primary);
    const sRgb = hexToRgb(theme.secondary);
    const goldRgb = { r: 245, g: 158, b: 11 }; // #f59e0b rich Islamic Gold
    const brassRgb = { r: 217, g: 119, b: 6 }; // #d97706 warm antique brass

    // Heritage & Islamic Geometric Objects
    interface HeritageObject {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      type: 'khatam8' | 'shamsa12' | 'crescent' | 'archMihrab' | 'fanousLantern' | 'arabesqueRosette' | 'girihStar';
      color: 'gold' | 'brass' | 'primary' | 'secondary';
      opacity: number;
      pulseSpeed: number;
      pulseVal: number;
      depth: number;
    }

    const objectCount = Math.min(36, Math.max(20, Math.floor(width / 45)));
    const objects: HeritageObject[] = [];

    const types: HeritageObject['type'][] = [
      'khatam8',
      'shamsa12',
      'crescent',
      'archMihrab',
      'fanousLantern',
      'arabesqueRosette',
      'girihStar',
    ];
    const colors: HeritageObject['color'][] = ['gold', 'brass', 'primary', 'secondary'];

    for (let i = 0; i < objectCount; i++) {
      objects.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 32 + 20,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.2, // serene upward float
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        type: types[i % types.length],
        color: colors[i % colors.length],
        opacity: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        pulseVal: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.8 + 0.3,
      });
    }

    // Golden Starlight Embers / Floating Heritage Particles
    const goldenEmbers = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.45 - 0.1, // floating up
      radius: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      shimmerSpeed: Math.random() * 0.04 + 0.02,
      shimmerVal: Math.random() * Math.PI * 2,
    }));

    // Mouse tracking for serene parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // DRAW HERITAGE & ISLAMIC GEOMETRIC MOTIFS
    const drawHeritageShape = (obj: HeritageObject) => {
      ctx.save();
      ctx.translate(obj.x, obj.y);
      ctx.rotate(obj.rotation);

      const scale = 1 + Math.sin(obj.pulseVal) * 0.1;
      ctx.scale(scale, scale);

      let baseRgb = goldRgb;
      if (obj.color === 'brass') baseRgb = brassRgb;
      else if (obj.color === 'primary') baseRgb = pRgb;
      else if (obj.color === 'secondary') baseRgb = sRgb;

      const alpha = obj.opacity * (0.85 + Math.sin(obj.pulseVal) * 0.2);
      ctx.strokeStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;
      ctx.fillStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha * 0.12})`;
      ctx.lineWidth = 1.4;

      const s = obj.size;

      switch (obj.type) {
        case 'khatam8': {
          // 8-Pointed Rub el Hizb (Two Intersecting Squares with inner octagon)
          const half = s * 0.7;
          // Square 1
          ctx.beginPath();
          ctx.rect(-half, -half, half * 2, half * 2);
          ctx.stroke();

          // Square 2 (Rotated 45 degrees)
          ctx.save();
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.rect(-half, -half, half * 2, half * 2);
          ctx.stroke();
          ctx.restore();

          // Inner Sacred Octagon
          ctx.beginPath();
          const rInner = s * 0.4;
          for (let k = 0; k < 8; k++) {
            const ang = (k * Math.PI) / 4;
            const px = Math.cos(ang) * rInner;
            const py = Math.sin(ang) * rInner;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Center radiating orb
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'shamsa12': {
          // 12-Pointed Islamic Rosette Sunburst (Antique Manuscript Illumination)
          const rOuter = s;
          const rInner = s * 0.45;
          ctx.beginPath();
          for (let p = 0; p < 24; p++) {
            const ang = (p * Math.PI) / 12;
            const rad = p % 2 === 0 ? rOuter : rInner;
            const px = Math.cos(ang) * rad;
            const py = Math.sin(ang) * rad;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Concentric geometric ring
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
          ctx.stroke();

          // Delicate radiating petal spokes
          for (let p = 0; p < 12; p++) {
            const ang = (p * Math.PI) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * s * 0.4, Math.sin(ang) * s * 0.4);
            ctx.stroke();
          }
          break;
        }

        case 'crescent': {
          // Heritage Islamic Crescent & Celestial 8-Point Star
          // Crescent Outer and Inner Arc
          ctx.beginPath();
          const crR = s * 0.8;
          ctx.arc(0, 0, crR, -Math.PI * 0.7, Math.PI * 0.7, false);
          ctx.quadraticCurveTo(crR * 0.4, 0, Math.cos(-Math.PI * 0.7) * crR, Math.sin(-Math.PI * 0.7) * crR);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing companion star nestled inside crescent
          const stX = s * 0.35;
          const stY = 0;
          const stR = s * 0.28;
          ctx.beginPath();
          for (let st = 0; st < 8; st++) {
            const ang = (st * Math.PI) / 4;
            const r = st % 2 === 0 ? stR : stR * 0.4;
            const px = stX + Math.cos(ang) * r;
            const py = stY + Math.sin(ang) * r;
            if (st === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'archMihrab': {
          // Classic Islamic Pointed Horseshoe / Ogee Arch
          const w = s * 0.8;
          const h = s * 1.1;
          ctx.beginPath();
          // Bottom base
          ctx.moveTo(-w * 0.5, h * 0.5);
          ctx.lineTo(-w * 0.5, 0);
          // Ogee pointed curve (left)
          ctx.bezierCurveTo(-w * 0.5, -h * 0.25, -w * 0.1, -h * 0.45, 0, -h * 0.55);
          // Ogee pointed curve (right)
          ctx.bezierCurveTo(w * 0.1, -h * 0.45, w * 0.5, -h * 0.25, w * 0.5, 0);
          ctx.lineTo(w * 0.5, h * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner decorative arch
          ctx.beginPath();
          ctx.moveTo(-w * 0.35, h * 0.5);
          ctx.lineTo(-w * 0.35, 0);
          ctx.bezierCurveTo(-w * 0.35, -h * 0.2, -w * 0.08, -h * 0.35, 0, -h * 0.42);
          ctx.bezierCurveTo(w * 0.08, -h * 0.35, w * 0.35, -h * 0.2, w * 0.35, 0);
          ctx.lineTo(w * 0.35, h * 0.5);
          ctx.stroke();

          // Hanging heritage lamp inside arch
          ctx.beginPath();
          ctx.moveTo(0, -h * 0.4);
          ctx.lineTo(0, -h * 0.1);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -h * 0.05, s * 0.08, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'fanousLantern': {
          // Traditional Islamic Heritage Lantern (Fanous)
          const lw = s * 0.6;
          const lh = s * 1.1;

          // Top ring
          ctx.beginPath();
          ctx.arc(0, -lh * 0.52, s * 0.1, 0, Math.PI * 2);
          ctx.stroke();

          // Dome cap
          ctx.beginPath();
          ctx.moveTo(-lw * 0.3, -lh * 0.35);
          ctx.lineTo(0, -lh * 0.48);
          ctx.lineTo(lw * 0.3, -lh * 0.35);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Main faceted glass body
          ctx.beginPath();
          ctx.moveTo(-lw * 0.45, -lh * 0.25);
          ctx.lineTo(-lw * 0.3, lh * 0.25);
          ctx.lineTo(lw * 0.3, lh * 0.25);
          ctx.lineTo(lw * 0.45, -lh * 0.25);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal geometric glass facets
          ctx.beginPath();
          ctx.moveTo(-lw * 0.15, -lh * 0.25);
          ctx.lineTo(-lw * 0.1, lh * 0.25);
          ctx.moveTo(lw * 0.15, -lh * 0.25);
          ctx.lineTo(lw * 0.1, lh * 0.25);
          ctx.stroke();

          // Base
          ctx.beginPath();
          ctx.rect(-lw * 0.35, lh * 0.25, lw * 0.7, lh * 0.12);
          ctx.fill();
          ctx.stroke();

          // Warm inner flame glow
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.8})`;
          ctx.fill();
          break;
        }

        case 'arabesqueRosette': {
          // Classic Arabesque 6-Petal Interlocking Flower (Islimi Motif)
          const r = s * 0.65;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI) / 3;
            const cx = Math.cos(ang) * r;
            const cy = Math.sin(ang) * r;
            ctx.beginPath();
            ctx.arc(cx, cy, r, ang + Math.PI * 0.66, ang + Math.PI * 1.33);
            ctx.stroke();
          }

          // Center floral nucleus
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'girihStar': {
          // 10-Pointed Girih Geometric Interlacing Tile
          const r10 = s * 0.8;
          ctx.beginPath();
          for (let g = 0; g < 10; g++) {
            const ang = (g * Math.PI) / 5;
            const nextAng = ((g + 3) * Math.PI) / 5;
            const x1 = Math.cos(ang) * r10;
            const y1 = Math.sin(ang) * r10;
            const x2 = Math.cos(nextAng) * r10;
            const y2 = Math.sin(nextAng) * r10;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        }
      }

      ctx.restore();
    };

    // ANIMATION RENDER LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp for interactive parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const mouseNormX = (mouseX - width / 2) / (width / 2);
      const mouseNormY = (mouseY - height / 2) / (height / 2);

      // 1. Draw Golden Starlight Embers / Heritage Stardust
      goldenEmbers.forEach((ember) => {
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.shimmerVal += ember.shimmerSpeed;

        if (ember.y < -10) {
          ember.y = height + 10;
          ember.x = Math.random() * width;
        }
        if (ember.x < 0) ember.x = width;
        if (ember.x > width) ember.x = 0;

        const currentAlpha = ember.alpha * (0.6 + Math.sin(ember.shimmerVal) * 0.4);
        ctx.fillStyle = `rgba(${goldRgb.r}, ${goldRgb.g}, ${goldRgb.b}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Heritage & Islamic Sacred Geometric Objects with Parallax
      objects.forEach((obj) => {
        obj.x += obj.speedX;
        obj.y += obj.speedY;
        obj.rotation += obj.rotationSpeed;
        obj.pulseVal += obj.pulseSpeed;

        const parallaxOffsetX = mouseNormX * 30 * obj.depth;
        const parallaxOffsetY = mouseNormY * 30 * obj.depth;

        const margin = 70;
        if (obj.x < -margin) obj.x = width + margin;
        if (obj.x > width + margin) obj.x = -margin;
        if (obj.y < -margin) obj.y = height + margin;
        if (obj.y > height + margin) obj.y = -margin;

        const origX = obj.x;
        const origY = obj.y;
        obj.x += parallaxOffsetX;
        obj.y += parallaxOffsetY;

        drawHeritageShape(obj);

        obj.x = origX;
        obj.y = origY;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 3D Islamic Heritage Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Deep Islamic Heritage Ambient Glows - Static with no color blinking */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[170px] opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute top-1/2 -right-32 w-[700px] h-[700px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ backgroundColor: '#f59e0b' }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full blur-[170px] opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.secondary }}
      />

      {/* Heritage Arabesque Silhouettes in Deep Corners */}
      <div className="absolute top-[12%] left-[6%] w-20 h-24 rounded-t-full border border-amber-500/15 bg-gradient-to-b from-amber-500/5 to-transparent backdrop-blur-[1px] rotate-6 animate-float pointer-events-none shadow-[0_0_30px_rgba(245,158,11,0.08)]" />
      <div className="absolute top-[38%] right-[8%] w-28 h-28 rounded-full border border-amber-500/20 bg-gradient-to-tr from-amber-500/[0.04] to-transparent backdrop-blur-[1px] animate-float-delayed pointer-events-none shadow-[0_0_40px_rgba(245,158,11,0.1)]" />
      <div className="absolute bottom-[20%] left-[10%] w-24 h-28 rounded-t-full border border-emerald-500/15 bg-gradient-to-b from-emerald-500/5 to-transparent -rotate-12 animate-float pointer-events-none shadow-[0_0_30px_rgba(45,212,191,0.08)]" />
      <div className="absolute bottom-[35%] right-[12%] w-16 h-16 rounded-full border border-amber-400/20 bg-amber-400/[0.03] animate-float-delayed pointer-events-none" />
    </div>
  );
};
