'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string; alpha: number;
  w: number; h: number;
  rotation: number; rotSpeed: number;
}

// Brand palette: blue, green, orange + lighter variants
const COLORS = ['#0052FE', '#3B7BF7', '#0FBA83', '#F7931A', '#FFFFFF'];
const DURATION = 2000;
const COUNT = 30;

function makeParticles(cx: number, cy: number): Particle[] {
  return Array.from({ length: COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.25,
    };
  });
}

interface ConfettiProps {
  /** Flip true → burst fires once; resetting to false re-arms for next trigger. */
  trigger: boolean;
  /** Origin point — defaults to viewport centre-bottom area */
  originX?: number;
  originY?: number;
}

export function Confetti({ trigger, originX, originY }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = originX ?? window.innerWidth  * 0.5;
    const cy = originY ?? window.innerHeight * 0.6;
    const particles = makeParticles(cx, cy);
    const startTime = performance.now();

    function tick(now: number) {
      const t = Math.min((now - startTime) / DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, 1 - t * 1.4);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
    />
  );
}
