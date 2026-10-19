import React, { useEffect, useRef, useState } from 'react';
import { Compass, Wind, Sparkles } from 'lucide-react';
import { ThemeConfig } from '@/config/siteConfig';

interface MaritimeHeritageHeroAnimationProps {
  theme: ThemeConfig;
  brand: {
    eventName: string;
    edition?: string;
    year: string;
    venue: string;
    dates: string;
    organization?: string;
  };
}

export const MaritimeHeritageHeroAnimation: React.FC<MaritimeHeritageHeroAnimationProps> = ({
  theme,
  brand,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelDomRef = useRef<HTMLDivElement | null>(null);
  const [isHoveringWheel, setIsHoveringWheel] = useState(false);
  const wheelRef = useRef({
    targetRotation: 0,
    currentRotation: 0,
    isDragging: false,
    startY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const setupDimensions = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    setupDimensions();
    window.addEventListener('resize', setupDimensions);

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
        r: parseInt(clean.substring(0, 2), 16) || 59,
        g: parseInt(clean.substring(2, 4), 16) || 130,
        b: parseInt(clean.substring(4, 6), 16) || 246,
      };
    };

    const pRgb = hexToRgb(theme.primary);
    const sRgb = hexToRgb(theme.secondary);
    const goldRgb = { r: 245, g: 158, b: 11 };
    const goldLight = { r: 254, g: 240, b: 138 };

    // Stars in the night sky (steady, calm illumination - no blinking)
    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * (width || window.innerWidth),
      y: Math.random() * ((height || window.innerHeight) * 0.65),
      size: Math.random() * 2 + 0.6,
      alpha: Math.random() * 0.35 + 0.25,
    }));

    // Floating water spray / bioluminescent particles
    const sprays = Array.from({ length: 25 }, () => ({
      x: Math.random() * (width || window.innerWidth),
      y: (height || window.innerHeight) * 0.7 + Math.random() * 80,
      size: Math.random() * 2.2 + 1,
      speedX: -(Math.random() * 1.5 + 0.8),
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let lastTimestamp = performance.now();
    let elapsedVoyageTime = 0;

    const render = (currentTimestamp: number) => {
      const dt = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = currentTimestamp;
      elapsedVoyageTime += dt;
      const time = elapsedVoyageTime;
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      // Continuous sailing voyage: ship smoothly flows across the waves from left to right in a grand loop
      const cycleDuration = isMobile ? 22 : 28; // seconds to cross screen smoothly
      const cycleProgress = (elapsedVoyageTime % cycleDuration) / cycleDuration;
      const voyageStartX = isMobile ? -140 : -220;
      const voyageEndX = width + (isMobile ? 140 : 220);
      const shipX = voyageStartX + cycleProgress * (voyageEndX - voyageStartX);

      // Atmospheric mist fade-in when emerging on left and fade-out on right
      const shipAlpha =
        cycleProgress < 0.08
          ? cycleProgress / 0.08
          : cycleProgress > 0.92
          ? (1 - cycleProgress) / 0.08
          : 1;

      // ================= 1. SKY & CELESTIAL AMBIENCE =================
      // Crescent Moon in top left (Celestial navigation reference)
      const moonX = isMobile ? width * 0.16 : width * 0.12;
      const moonY = isMobile ? height * 0.18 : height * 0.22;
      const moonR = isMobile ? 28 : 34;

      // Moon halo
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 120);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      moonGlow.addColorStop(0.4, `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.12)`);
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon Body
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2, true);
      ctx.fill();
      // Cutout to make graceful crescent
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(moonX + 13, moonY - 6, moonR * 0.95, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();

      // Calm, non-blinking navigational stars
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Astrolabe Constellation Navigation Lines (Geometric Arabesque Constellations)
      ctx.strokeStyle = `rgba(${goldRgb.r}, ${goldRgb.g}, ${goldRgb.b}, 0.12)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(moonX + 60, moonY + 40);
      ctx.lineTo(moonX + 160, moonY + 10);
      ctx.lineTo(moonX + 220, moonY + 70);
      ctx.lineTo(moonX + 310, moonY + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // ================= 2. OCEAN WAVES SIMULATION =================
      const seaBaseY = isMobile ? height * 0.63 : height * 0.68;

      // Layer A: Deep Horizon Ocean (Back Wave)
      ctx.fillStyle = '#040b17';
      ctx.beginPath();
      ctx.moveTo(0, seaBaseY);
      for (let x = 0; x <= width; x += 15) {
        const y = seaBaseY - 18 + Math.sin(x * 0.007 + time * 1.0) * 12 + Math.cos(x * 0.012 - time * 0.6) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Layer B: Mid Ocean (Carrying the Ship)
      const midWaveY = (xPos: number) => {
        return seaBaseY + Math.sin(xPos * 0.009 + time * 1.4) * 16 + Math.cos(xPos * 0.016 + time * 0.9) * 9;
      };

      const midGrad = ctx.createLinearGradient(0, seaBaseY - 20, 0, height);
      midGrad.addColorStop(0, '#06162a');
      midGrad.addColorStop(0.5, '#040e1b');
      midGrad.addColorStop(1, '#02060d');

      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.moveTo(0, seaBaseY);
      for (let x = 0; x <= width; x += 15) {
        ctx.lineTo(x, midWaveY(x));
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // ================= 3. HISTORIC ISLAMIC HERITAGE MODEL SHIP (DHOW / ഖൽബത്ത്) =================
      // Ship gently sways and pitches with the gentle ocean wave
      const shipWaveY = midWaveY(shipX);
      const shipWaveSlope =
        (midWaveY(shipX + 35) - midWaveY(shipX - 35)) / 70;
      const shipPitch = Math.atan(shipWaveSlope) * 0.65 + Math.sin(time * 1.6) * 0.04;
      const shipHeave = Math.sin(time * 2.0) * 4.0;

      ctx.save();
      ctx.globalAlpha = shipAlpha;
      // On mobile screens, elevate slightly so it rides the wave prominently above ribbons
      const yOffset = isMobile ? -8 : -14;
      ctx.translate(shipX, shipWaveY + shipHeave + yOffset);
      ctx.rotate(shipPitch);

      // Ship Scale - Responsive for mobile and desktop screens
      const shipScale = isMobile
        ? Math.min(Math.max(width / 390, 0.95), 1.25)
        : Math.min(Math.max(width / 950, 1.4), 2.2);
      ctx.scale(shipScale, shipScale);

      // (A) Wooden Carvel Hull (Dhow / Boom Boat Body)
      const hullGrad = ctx.createLinearGradient(-90, 0, 90, 25);
      hullGrad.addColorStop(0, '#78350f'); // Dark teak wood
      hullGrad.addColorStop(0.4, '#b45309');
      hullGrad.addColorStop(0.7, '#d97706'); // Warm timber highlight
      hullGrad.addColorStop(1, '#451a03');

      ctx.fillStyle = hullGrad;
      ctx.beginPath();
      // Curved traditional bow & high stern
      ctx.moveTo(-85, -6); // High Stern (Poop deck)
      ctx.quadraticCurveTo(-60, 28, 0, 32); // Keel bottom
      ctx.quadraticCurveTo(60, 30, 95, -12); // Long pointed prow / bowsprit (الصدر)
      ctx.lineTo(82, -2);
      ctx.quadraticCurveTo(30, 6, -65, -3); // Sheer line / deck line
      ctx.closePath();
      ctx.fill();

      // Hull wooden plank strakes / lines
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-75, 4);
      ctx.quadraticCurveTo(0, 18, 80, -2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-65, 14);
      ctx.quadraticCurveTo(0, 24, 60, 10);
      ctx.stroke();

      // Stern Castle / Cabin
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-78, -16, 26, 12);
      ctx.strokeStyle = `rgba(${goldLight.r}, ${goldLight.g}, ${goldLight.b}, 0.5)`;
      ctx.strokeRect(-78, -16, 26, 12);

      // Lantern on Stern (Fanous)
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.beginPath();
      ctx.arc(-82, -18, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // (B) Main Mast & Mizzen Mast (الصواري)
      ctx.fillStyle = '#451a03';
      // Main Mast (Slight forward rake characteristic of Arab Dhows)
      ctx.save();
      ctx.rotate(-0.08);
      ctx.fillRect(8, -135, 6, 140);
      ctx.restore();

      // Mizzen Mast (Smaller aft mast)
      ctx.save();
      ctx.rotate(-0.05);
      ctx.fillRect(-48, -95, 4, 100);
      ctx.restore();

      // (C) Lateen Sails (الشراع المثلث - Signature Triangular Lateen Rig)
      // Main Lateen Sail
      const mainSailGrad = ctx.createLinearGradient(-20, -145, 75, -20);
      mainSailGrad.addColorStop(0, 'rgba(255, 253, 245, 0.95)');
      mainSailGrad.addColorStop(0.5, 'rgba(245, 235, 215, 0.88)');
      mainSailGrad.addColorStop(1, 'rgba(215, 195, 165, 0.75)');

      // Main Yard / Spar (angled bamboo pole)
      ctx.strokeStyle = '#271202';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-35, -30);
      ctx.lineTo(65, -148);
      ctx.stroke();

      // Bilowing Main Canvas (Gentle breeze billow)
      const sailBillow = Math.sin(time * 1.5) * 5;
      ctx.fillStyle = mainSailGrad;
      ctx.beginPath();
      ctx.moveTo(-32, -30);
      ctx.lineTo(62, -145);
      ctx.quadraticCurveTo(35 + sailBillow, -60, 22, -8);
      ctx.closePath();
      ctx.fill();

      // Canvas stitching lines
      ctx.strokeStyle = 'rgba(120, 80, 40, 0.2)';
      ctx.lineWidth = 1;
      for (let sl = 0; sl < 3; sl++) {
        ctx.beginPath();
        ctx.moveTo(-15 + sl * 22, -50 - sl * 28);
        ctx.lineTo(0 + sl * 18, -15);
        ctx.stroke();
      }

      // Mizzen Lateen Sail (Aft)
      ctx.strokeStyle = '#271202';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-75, -20);
      ctx.lineTo(-22, -105);
      ctx.stroke();

      ctx.fillStyle = mainSailGrad;
      ctx.beginPath();
      ctx.moveTo(-72, -20);
      ctx.lineTo(-24, -102);
      ctx.quadraticCurveTo(-45 + sailBillow * 0.7, -45, -50, -8);
      ctx.closePath();
      ctx.fill();

      // Ropes & Rigging (الحبال)
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, -142);
      ctx.lineTo(92, -10); // Forestay to bow
      ctx.moveTo(-30, -28);
      ctx.lineTo(-65, -5); // Sheet to stern
      ctx.moveTo(-24, -100);
      ctx.lineTo(-78, -12); // Mizzen stay
      ctx.stroke();

      // Islamic Pennant / Flag atop main mast
      ctx.fillStyle = theme.secondary;
      ctx.beginPath();
      ctx.moveTo(12, -140);
      ctx.lineTo(38 + Math.sin(time * 3) * 5, -135);
      ctx.lineTo(12, -130);
      ctx.closePath();
      ctx.fill();

      // Bow Foaming Wave (water slicing at prow)
      ctx.fillStyle = `rgba(255, 255, 255, ${0.75 * shipAlpha})`;
      ctx.beginPath();
      ctx.ellipse(84, -2, 8 + Math.sin(time * 6) * 3, 3.5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Bow Spray
      ctx.fillStyle = `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, ${0.65 * shipAlpha})`;
      ctx.beginPath();
      ctx.arc(88 + Math.sin(time * 8) * 4, -4 + Math.cos(time * 7) * 3, 3, 0, Math.PI * 2);
      ctx.arc(94 + Math.cos(time * 9) * 5, -1 + Math.sin(time * 8) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Stern Frothing Wake
      ctx.strokeStyle = `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, ${0.45 * shipAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-82, 4);
      ctx.quadraticCurveTo(-110, 8, -145 - Math.sin(time * 3) * 15, 12);
      ctx.stroke();

      ctx.restore();

      // ================= 4. FOREGROUND CRASHING WAVES & BIOLUMINESCENT FOAM =================
      const fgGrad = ctx.createLinearGradient(0, seaBaseY + 15, 0, height);
      fgGrad.addColorStop(0, `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.18)`);
      fgGrad.addColorStop(0.3, '#07182c');
      fgGrad.addColorStop(1, '#030811');

      ctx.fillStyle = fgGrad;
      ctx.beginPath();
      ctx.moveTo(0, seaBaseY + 20);
      for (let x = 0; x <= width; x += 12) {
        const y = seaBaseY + 22 + Math.sin(x * 0.012 + time * 1.8) * 14 + Math.cos(x * 0.02 - time * 1.1) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Wave crest foam (White water & turquoise glow)
      ctx.strokeStyle = `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.45)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = seaBaseY + 22 + Math.sin(x * 0.012 + time * 1.8) * 14 + Math.cos(x * 0.02 - time * 1.1) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Floating water spray particles
      sprays.forEach((sp) => {
        sp.x += sp.speedX * 0.6;
        if (sp.x < 0) {
          sp.x = width;
          sp.y = seaBaseY + 10 + Math.random() * (height - seaBaseY - 10);
        }
        ctx.fillStyle = `rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, ${sp.alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Smooth auto-rotation / user drag of steering wheel on right side
      wheelRef.current.currentRotation +=
        (wheelRef.current.targetRotation - wheelRef.current.currentRotation) * 0.08;
      // Ambient gentle idle rotation (slow & steady)
      wheelRef.current.targetRotation += 0.05;
      if (wheelDomRef.current) {
        wheelDomRef.current.style.transform = `rotate(${wheelRef.current.currentRotation}deg)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupDimensions);
    };
  }, [theme]);

  // Interactive Drag on Ship Helm Wheel (Mouse & Mobile Touch)
  const handleWheelMouseDown = (e: React.MouseEvent) => {
    wheelRef.current.isDragging = true;
    wheelRef.current.startY = e.clientY;
  };

  const handleWheelMouseMove = (e: React.MouseEvent) => {
    if (!wheelRef.current.isDragging) return;
    const diff = e.clientY - wheelRef.current.startY;
    wheelRef.current.targetRotation += diff * 0.4;
    wheelRef.current.startY = e.clientY;
  };

  const handleWheelMouseUp = () => {
    wheelRef.current.isDragging = false;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Sea & Ship HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block absolute inset-0 pointer-events-none"
      />

      {/* Subtle Fog / Ocean Mist Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 80%, ${theme.primary}20 0%, transparent 70%)`,
        }}
      />

      {/* ================= RIGHT SIDE: OLD MODEL SHIP DRIVING WHEEL (HELM / سکّان السفينة) ================= */}
      <div
        className="pointer-events-none sm:pointer-events-auto absolute -right-6 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center group opacity-85 sm:opacity-100"
        onMouseEnter={() => setIsHoveringWheel(true)}
        onMouseLeave={() => {
          setIsHoveringWheel(false);
          handleWheelMouseUp();
        }}
        onMouseDown={handleWheelMouseDown}
        onMouseMove={handleWheelMouseMove}
        onMouseUp={handleWheelMouseUp}
      >
        {/* Wheel Aura Glow */}
        <div
          className="absolute -inset-4 sm:-inset-6 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none"
          style={{
            background: `radial-gradient(circle, #f59e0b 0%, ${theme.primary} 50%, transparent 80%)`,
          }}
        />

        {/* 3D Steering Wheel Helm Vessel */}
        <div
          ref={wheelDomRef}
          className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 cursor-grab active:cursor-grabbing transition-transform duration-75 group-hover:scale-105"
          style={{
            filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.95))',
          }}
        >
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Teak Wood Gradient */}
              <radialGradient id="woodGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="45%" stopColor="#b45309" />
                <stop offset="85%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              {/* Polished Brass Gradient */}
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Islamic Arabesque Inlay Shadow */}
              <filter id="helmShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* 8 Traditional Turned Handles / Spokes Spanning Outwards */}
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = (idx * 360) / 8;
              return (
                <g key={idx} transform={`rotate(${angle} 120 120)`}>
                  {/* Turned Wooden Spoke */}
                  <rect
                    x="116"
                    y="35"
                    width="8"
                    height="85"
                    fill="url(#woodGrad)"
                    stroke="#451a03"
                    strokeWidth="1"
                    rx="3"
                  />
                  {/* Spoke Brass Collar */}
                  <rect x="114" y="65" width="12" height="6" fill="url(#brassGrad)" rx="2" />
                  <rect x="114" y="42" width="12" height="5" fill="url(#brassGrad)" rx="2" />

                  {/* Outer Handle Peg (Turned Wood & Brass Knob) */}
                  <path
                    d="M 115 35 C 114 26, 112 15, 114 10 C 115 5, 125 5, 126 10 C 128 15, 126 26, 125 35 Z"
                    fill="url(#woodGrad)"
                    stroke="#271202"
                    strokeWidth="1.2"
                  />
                  {/* Handle Finial Brass Cap */}
                  <circle cx="120" cy="8" r="4.5" fill="url(#brassGrad)" />
                </g>
              );
            })}

            {/* Outer Felloe / Wooden Wheel Rim */}
            <circle
              cx="120"
              cy="120"
              r="76"
              stroke="url(#woodGrad)"
              strokeWidth="16"
              filter="url(#helmShadow)"
            />
            {/* Outer Brass Protective Ring */}
            <circle cx="120" cy="120" r="84" stroke="url(#brassGrad)" strokeWidth="2.5" />
            <circle cx="120" cy="120" r="68" stroke="url(#brassGrad)" strokeWidth="2.5" />

            {/* Brass Rivet Studs around Rim */}
            {Array.from({ length: 16 }).map((_, i) => {
              const rAng = (i * Math.PI * 2) / 16;
              const rx = 120 + Math.cos(rAng) * 76;
              const ry = 120 + Math.sin(rAng) * 76;
              return <circle key={i} cx={rx} cy={ry} r="2.2" fill="url(#brassGrad)" />;
            })}

            {/* Inner Brass Spoke Hub (الصرة النحاسية) */}
            <circle
              cx="120"
              cy="120"
              r="34"
              fill="url(#woodGrad)"
              stroke="url(#brassGrad)"
              strokeWidth="4"
              filter="url(#helmShadow)"
            />
            <circle cx="120" cy="120" r="26" fill="url(#brassGrad)" />

            {/* Islamic 8-Pointed Star (Rub el Hizb) Centerpiece */}
            <g transform="translate(120, 120)">
              <rect
                x="-12"
                y="-12"
                width="24"
                height="24"
                fill="#451a03"
                stroke="#fef08a"
                strokeWidth="1.4"
                rx="2"
              />
              <rect
                x="-12"
                y="-12"
                width="24"
                height="24"
                fill="#451a03"
                stroke="#fef08a"
                strokeWidth="1.4"
                rx="2"
                transform="rotate(45)"
              />
              {/* Emerald Center Jewel */}
              <circle cx="0" cy="0" r="4.5" fill="#10b981" stroke="#fef08a" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
