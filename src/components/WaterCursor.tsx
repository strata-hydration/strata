'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  hue: number;
}

export default function WaterCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const addRipple = useCallback((x: number, y: number) => {
    if (ripplesRef.current.length > 16) return;
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 140 + Math.random() * 80,
      opacity: 0.85,
      hue: 197,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current > 40) {
        addRipple(e.clientX, e.clientY);
        lastTimeRef.current = now;
      }
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripplesRef.current = ripplesRef.current.filter((r) => r.opacity > 0.01);
      ripplesRef.current.forEach((r) => {
        r.radius += 2.8;
        r.opacity *= 0.94;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue}, 100%, 65%, ${r.opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [addRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
