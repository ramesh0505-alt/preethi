import { useEffect, useState, useRef } from 'react';

interface PreloaderSceneProps {
  onComplete: () => void;
}

export function PreloaderScene({ onComplete }: PreloaderSceneProps) {
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [heartOpacity, setHeartOpacity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create heart shape function
    const getHeartPoint = (t: number, scale: number = 1) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return {
        x: centerX + x * scale,
        y: centerY + y * scale - 30,
      };
    };

    // Create initial scattered particles
    const colors = ['#ff6b9d', '#e8b4b8', '#ffd1dc', '#f7e7ce'];
    for (let i = 0; i < 80; i++) {
      const t = (i / 80) * Math.PI * 2;
      const heartPoint = getHeartPoint(t, 10);
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: heartPoint.x,
        targetY: heartPoint.y,
        size: 2 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationFrame: number;
    let phase = 0;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space background
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, canvas.width
      );
      gradient.addColorStop(0, '#0d1321');
      gradient.addColorStop(1, '#050508');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw magnificent moon with multiple layers
      const moonY = centerY - 80;
      const moonX = centerX;

      // Outer moon glow
      const outerGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 150);
      outerGlow.addColorStop(0, 'rgba(247, 231, 206, 0.3)');
      outerGlow.addColorStop(0.5, 'rgba(201, 214, 223, 0.1)');
      outerGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 150, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Moon core
      const moonGradient = ctx.createRadialGradient(moonX - 20, moonY - 20, 0, moonX, moonY, 50);
      moonGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      moonGradient.addColorStop(0.5, 'rgba(247, 231, 206, 0.95)');
      moonGradient.addColorStop(1, 'rgba(201, 214, 223, 0.8)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
      ctx.fillStyle = moonGradient;
      ctx.fill();

      // Moonlight rays
      time += 0.01;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.5;
        const rayLength = 120 + Math.sin(time * 2 + i) * 20;
        ctx.save();
        ctx.translate(moonX, moonY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(rayLength, -3);
        ctx.lineTo(rayLength, 3);
        ctx.closePath();
        ctx.fillStyle = 'rgba(247, 231, 206, 0.1)';
        ctx.fill();
        ctx.restore();
      }

      // Background stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 97.3) % canvas.height;
        const twinkle = Math.sin(time * 3 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 231, 206, ${0.2 + twinkle * 0.3})`;
        ctx.fill();
      }

      if (phase === 0) {
        // Drifting phase
        particlesRef.current.forEach(p => {
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;

          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glow.addColorStop(0, p.color);
          glow.addColorStop(0.5, `${p.color}88`);
          glow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.globalAlpha = p.opacity * 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      } else if (phase === 1) {
        // Gathering phase
        particlesRef.current.forEach(p => {
          p.x += (p.targetX - p.x) * 0.04;
          p.y += (p.targetY - p.y) * 0.04;

          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Trail effect
          ctx.beginPath();
          ctx.arc(p.x - (p.targetX - p.x) * 0.1, p.y - (p.targetY - p.y) * 0.1, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}44`;
          ctx.fill();
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Phase transitions
    const timer1 = setTimeout(() => {
      phase = 1;
      setShowHeart(true);
    }, 2500);

    const timer2 = setTimeout(() => {
      setHeartOpacity(1);
    }, 4000);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 6000);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0e1a] flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Heart SVG with enhanced glow */}
      <div
        className="relative z-10 transition-opacity duration-1000"
        style={{ opacity: heartOpacity, marginTop: '80px' }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="animate-heart-pulse-glow"
        >
          <defs>
            <linearGradient id="preloaderHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="50%" stopColor="#e8b4b8" />
              <stop offset="100%" stopColor="#ffd1dc" />
            </linearGradient>
            <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
            fill="url(#preloaderHeart)"
            filter="url(#heartGlow)"
          />
        </svg>
      </div>

      {/* Loading text with elegant animation */}
      <div className="absolute bottom-16 flex flex-col items-center gap-5">
        <p className="handwritten text-[#c9d6df] text-2xl tracking-widest animate-pulse">
          loading feelings…
        </p>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff6b9d] via-[#e8b4b8] to-[#b8a9c9] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[#c9d6df]/40 text-xs tracking-widest">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
