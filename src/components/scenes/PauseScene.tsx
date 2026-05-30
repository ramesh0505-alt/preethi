import { useState, useEffect, useRef } from 'react';

interface PauseSceneProps {
  onComplete: () => void;
}

export function PauseScene({ onComplete }: PauseSceneProps) {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartScale, setHeartScale] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dramatic slow particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      targetX: number;
      targetY: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        size: 2 + Math.random() * 4,
        opacity: 0.1 + Math.random() * 0.3,
        speed: 0.1 + Math.random() * 0.2,
        targetX: x + (Math.random() - 0.5) * 100,
        targetY: y + (Math.random() - 0.5) * 100,
      });
    }

    // Radiating rings
    const rings: Array<{
      radius: number;
      opacity: number;
      speed: number;
    }> = [];

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep dark gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#0a0d15');
      gradient.addColorStop(0.5, '#050508');
      gradient.addColorStop(1, '#020203');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Central glow
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 250
      );
      centerGlow.addColorStop(0, 'rgba(255, 107, 157, 0.1)');
      centerGlow.addColorStop(0.5, 'rgba(255, 107, 157, 0.03)');
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Slow particles with trails
      time += 0.005;
      particles.forEach(p => {
        p.x += (p.targetX - p.x) * 0.005;
        p.y += (p.targetY - p.y) * 0.005;

        if (Math.abs(p.x - p.targetX) < 5) {
          p.targetX = p.x + (Math.random() - 0.5) * 100;
          p.targetY = p.y + (Math.random() - 0.5) * 100;
        }

        const pGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        pGlow.addColorStop(0, `rgba(255, 107, 157, ${p.opacity})`);
        pGlow.addColorStop(0.5, `rgba(255, 182, 193, ${p.opacity * 0.5})`);
        pGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = pGlow;
        ctx.fill();
      });

      // Radiating rings
      if (showHeart) {
        if (rings.length < 5) {
          rings.push({ radius: 60, opacity: 0.3, speed: 1.5 + Math.random() });
        }

        rings.forEach((ring, i) => {
          ring.radius += ring.speed;
          ring.opacity -= 0.005;

          if (ring.opacity <= 0) {
            rings.splice(i, 1);
            return;
          }

          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2 - 50, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 107, 157, ${ring.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [showHeart]);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setShowHeart(true);
        setHeartScale(1);
      }, 600),
      setTimeout(() => setShowText1(true), 1600),
      setTimeout(() => setShowText2(true), 2600),
      setTimeout(() => setShowText3(true), 3600),
      setTimeout(() => onComplete(), 6200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Pulsing heart with dramatic reveal */}
        <div
          className={`
            transition-all duration-1000 ease-out
            ${showHeart ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transform: `scale(${heartScale})` }}
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 100 100"
            className="animate-heart-pulse-glow"
          >
            <defs>
              <linearGradient id="pauseHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="50%" stopColor="#e8b4b8" />
                <stop offset="100%" stopColor="#ffd1dc" />
              </linearGradient>
              <filter id="pauseHeartGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
              fill="url(#pauseHeart)"
              filter="url(#pauseHeartGlow)"
            />
          </svg>
        </div>

        {/* Text phases */}
        <div className="flex flex-col items-center gap-5">
          <p
            className={`
              handwritten text-[#c9d6df] text-2xl tracking-widest
              transition-all duration-700
              ${showText1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            please clear ga cheppu…
          </p>

          <p
            className={`
              elegant-title text-[#ff6b9d] text-4xl tracking-wide
              transition-all duration-700 delay-100
              ${showText2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}
            `}
          >
            Yes or No.
          </p>

          <p
            className={`
              handwritten text-[#c9d6df] text-xl tracking-wide
              transition-all duration-700 delay-200
              ${showText3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            Anthe.
          </p>
        </div>
      </div>
    </div>
  );
}
