'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

export default function FloatingBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number>(0);
  /* z-index -1 so it sits behind all page content, no pointer events */


  const initBubbles = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 20000);
    bubblesRef.current = Array.from({ length: Math.min(count, 55) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height + height,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 0.6 + 0.25,
      opacity: Math.random() * 0.4 + 0.15,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.025 + 0.012,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (bubblesRef.current.length === 0) {
        initBubbles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const wx = Math.sin(b.wobble) * 35;

        if (b.y < -20) {
          b.y = canvas.height + 20;
          b.x = Math.random() * canvas.width;
        }

        // Main bubble body - light blue with gradient
        ctx.beginPath();
        ctx.arc(b.x + wx, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 255, ${b.opacity * 0.75})`;
        ctx.fill();

        // Bright light blue core
        ctx.beginPath();
        ctx.arc(b.x + wx, b.y, b.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 240, 255, ${b.opacity * 0.55})`;
        ctx.fill();

        // Glow - vibrant aqua
        ctx.beginPath();
        ctx.arc(b.x + wx, b.y, b.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${b.opacity * 0.25})`;
        ctx.fill();

        // Bright highlight for depth
        ctx.beginPath();
        ctx.arc(b.x + wx - b.size * 0.35, b.y - b.size * 0.35, b.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 255, ${b.opacity * 0.7})`;
        ctx.fill();

        // Subtle darker edge for definition
        ctx.beginPath();
        ctx.arc(b.x + wx, b.y, b.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 150, 200, ${b.opacity * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initBubbles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, opacity: 0.35 }}
    />
  );
}
