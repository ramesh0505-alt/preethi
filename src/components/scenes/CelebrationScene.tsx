import { useState, useEffect, useRef } from 'react';

interface CelebrationSceneProps {
  herName: string;
  onComplete: () => void;
}

export function CelebrationScene({ herName, onComplete }: CelebrationSceneProps) {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Celebration particles
    const hearts: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
      rotation: number;
    }> = [];

    const heartColors = ['#ff6b9d', '#e8b4b8', '#ffd1dc', '#ff91a4', '#ffb6c1'];
    for (let i = 0; i < 60; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 150,
        size: 12 + Math.random() * 25,
        opacity: 0.2 + Math.random() * 0.5,
        speed: 1 + Math.random() * 2.5,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: Math.random() * Math.PI * 2,
      });
    }

    // Sparkles
    const sparkles: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      twinkle: number;
    }> = [];

    for (let i = 0; i < 100; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 3,
        opacity: Math.random() * 0.8,
        speed: 0.5 + Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // Radial bursts
    const bursts: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#ff6b9d', '#e8b4b8', '#ffd1dc'];
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        bursts.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 0,
          opacity: 0.6,
          color: colors[i],
        });
      }, i * 300);
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warm gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#0d1321');
      gradient.addColorStop(1, '#0a0e1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Warm glow
      const warmGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 400
      );
      warmGlow.addColorStop(0, 'rgba(255, 107, 157, 0.25)');
      warmGlow.addColorStop(0.3, 'rgba(232, 180, 184, 0.12)');
      warmGlow.addColorStop(0.6, 'rgba(255, 209, 220, 0.06)');
      warmGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = warmGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial bursts
      bursts.forEach((burst, i) => {
        burst.radius += 8;
        burst.opacity -= 0.008;

        if (burst.opacity > 0) {
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${burst.color}${Math.round(Math.max(0, burst.opacity) * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      // Sparkles with enhanced effect
      time += 0.02;
      sparkles.forEach(sparkle => {
        sparkle.twinkle += 0.05;
        const twinkle = Math.sin(sparkle.twinkle) * 0.5 + 0.5;
        sparkle.y -= sparkle.speed * 0.3;

        if (sparkle.y < -10) {
          sparkle.y = canvas.height + 10;
          sparkle.x = Math.random() * canvas.width;
        }

        const sGlow = ctx.createRadialGradient(
          sparkle.x, sparkle.y, 0,
          sparkle.x, sparkle.y, sparkle.size * 6
        );
        sGlow.addColorStop(0, `rgba(255, 255, 255, ${twinkle * sparkle.opacity})`);
        sGlow.addColorStop(0.5, `rgba(247, 231, 206, ${twinkle * sparkle.opacity * 0.5})`);
        sGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * 6 * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = sGlow;
        ctx.fill();
      });

      // Floating hearts with glow
      hearts.forEach(heart => {
        heart.y -= heart.speed;
        heart.x += Math.sin(time + heart.y * 0.01) * 1.5;
        heart.rotation += 0.02;

        if (heart.y < -40) {
          heart.y = canvas.height + 40;
          heart.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate(heart.rotation);

        const hGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, heart.size * 2);
        hGlow.addColorStop(0, heart.color);
        hGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(0, 0, heart.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = hGlow;
        ctx.globalAlpha = heart.opacity * 0.6;
        ctx.fill();

        ctx.beginPath();
        const scale = heart.size / 12;
        ctx.moveTo(0, -4 * scale);
        ctx.bezierCurveTo(-6 * scale, -10 * scale, -12 * scale, -4 * scale, -12 * scale, 3 * scale);
        ctx.bezierCurveTo(-12 * scale, 10 * scale, 0, 16 * scale, 0, 22 * scale);
        ctx.bezierCurveTo(0, 16 * scale, 12 * scale, 10 * scale, 12 * scale, 3 * scale);
        ctx.bezierCurveTo(12 * scale, -4 * scale, 6 * scale, -10 * scale, 0, -4 * scale);
        ctx.fillStyle = heart.color;
        ctx.globalAlpha = heart.opacity;
        ctx.fill();
        ctx.restore();
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
      setTimeout(() => setShowText1(true), 600),
      setTimeout(() => setShowText2(true), 2100),
      setTimeout(() => setShowText3(true), 3600),
      setTimeout(() => setShowButton(true), 5200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = () => {
    onComplete();
    window.open('https://www.instagram.com/pandu_05_05_/', '_blank');
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md px-6 text-center">
        {/* Large heart with glow */}
        <div className="animate-emotional-bloom">
          <svg
            width="110"
            height="110"
            viewBox="0 0 100 100"
            className="animate-heart-pulse-glow"
          >
            <defs>
              <linearGradient id="celebrationHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="50%" stopColor="#e8b4b8" />
                <stop offset="100%" stopColor="#ffd1dc" />
              </linearGradient>
              <filter id="celebHeartGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
              fill="url(#celebrationHeart)"
              filter="url(#celebHeartGlow)"
            />
          </svg>
        </div>

        {/* Messages with smooth animations */}
        <p
          className={`
            handwritten text-[#ff6b9d] text-2xl tracking-wide
            transition-all duration-700
            ${showText1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}
          `}
        >
          You just made this page my favorite memory
        </p>

        <p
          className={`
            letter-text text-center text-lg
            transition-all duration-700 delay-100
            ${showText2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          I'll probably remember this moment for a very long time.
        </p>

        <p
          className={`
            letter-text text-center transition-all duration-700 delay-200
            ${showText3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          Thank you for understanding my heart.
          <br />
          <span className="text-[#e8b4b8] text-lg">You became something beautiful in my life.</span>
        </p>

        {/* Continue button */}
        <div
          className={`
            mt-6 transition-all duration-700 delay-300
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={handleContinue}
            className="btn-emotional btn-yes animate-button-glow relative overflow-visible group"
          >
            <span className="relative z-10">Continue Our Story</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  );
}
