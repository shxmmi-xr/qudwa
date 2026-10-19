import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position state with lerp
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only run on devices with fine pointer (mouse/trackpad, not touchscreens)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('[role="button"]') ||
          target.getAttribute('data-cursor') === 'pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth RAF loop for the magnetic trailing ring
    let rafId: number;
    const updateRing = () => {
      // Lerp smooth follow
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(updateRing);
    };

    rafId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Core Glowing Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-200 ${
            isHovered
              ? 'w-3 h-3 bg-[#78e8d2] shadow-[0_0_15px_#78e8d2]'
              : isClicked
              ? 'w-1.5 h-1.5 bg-[#ec1c62]'
              : 'w-2 h-2 shadow-[0_0_10px_rgba(255,255,255,0.8)]'
          }`}
        />
      </div>

      {/* 2. Magnetic Trailing Laser Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
            isHovered
              ? 'w-14 h-14 border-[#ec1c62] bg-[#ec1c62]/10 scale-110 shadow-[0_0_25px_rgba(236,28,98,0.4)] backdrop-blur-[1px]'
              : isClicked
              ? 'w-7 h-7 border-[#78e8d2] scale-90 shadow-[0_0_15px_rgba(120,232,210,0.5)]'
              : 'w-9 h-9 border-white/40 bg-white/[0.02] shadow-[0_0_10px_rgba(255,255,255,0.1)]'
          }`}
        >
          {/* Subtle crosshair dot on hover */}
          {isHovered && (
            <div className="w-1 h-1 rounded-full bg-[#ec1c62] animate-ping" />
          )}
        </div>
      </div>
    </>
  );
};
