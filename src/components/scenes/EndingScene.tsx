import { useState, useEffect, useRef } from 'react';

interface EndingSceneProps {}

export function EndingScene({}: EndingSceneProps) {
  const [showText, setShowText] = useState(false);
  const [finalFadeOut, setFinalFadeOut] = useState(false);
  const [heartOpacity, setHeartOpacity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dissolving particles - starry effect
    const particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
    }> = [];

    const colors = ['#247, 231, 206', '#201, 214, 223', '#255, 255, 255'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 30;
      const targetDistance = 100 + Math.random() * 400;

      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        targetX: centerX + Math.cos(angle) * targetDistance,
        targetY: centerY + Math.sin(angle) * targetDistance,
        size: 1 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.4,
        speed: 0.008 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Background stars
    const bgStars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkle: number;
    }> = [];

    for (let i = 0; i < 200; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.4,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep black background
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background stars with subtle twinkle
      time += 0.01;
      bgStars.forEach(star => {
        star.twinkle += 0.02;
        const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 220, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Dissolving particles
      particles.forEach((p, i) => {
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;
        p.opacity *= 0.998;

        const pGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        pGlow.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
        pGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = pGlow;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setHeartOpacity(1), 500),
      setTimeout(() => setShowText(true), 1500),
      setTimeout(() => setFinalFadeOut(true), 4500),
      setTimeout(() => setHeartOpacity(0), 6500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-[#020204] flex items-center justify-center transition-opacity duration-2000"
      style={{ opacity: finalFadeOut ? 0 : 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Tiny glowing heart with ethereal effect */}
        <div
          className="transition-all duration-1000"
          style={{ opacity: heartOpacity }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            className="animate-heart-pulse"
          >
            <defs>
              <linearGradient id="endingHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#e8b4b8" />
              </linearGradient>
              <filter id="endingHeartGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
              fill="url(#endingHeart)"
              filter="url(#endingHeartGlow)"
            />
          </svg>
        </div>

        {/* Final text */}
        <p
          className={`
            absolute whitespace-nowrap
            left-1/2 -translate-x-1/2 top-full mt-6
            handwritten text-[#606070] text-base tracking-wide
            transition-all duration-1000
            ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          For someone who became unexpectedly special…
        </p>
      </div>
    </div>
  );
}
