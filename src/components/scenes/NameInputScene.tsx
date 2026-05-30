import { useState, useEffect, useRef } from 'react';

interface NameInputSceneProps {
  onComplete: (name: string) => void;
}

export function NameInputScene({ onComplete }: NameInputSceneProps) {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [typingHearts, setTypingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkle: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5,
        opacity: Math.random() * 0.8,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }> = [];

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#050508');
      gradient.addColorStop(0.5, '#0a0e1a');
      gradient.addColorStop(1, '#0d1321');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars with glow
      time += 0.015;
      stars.forEach(star => {
        star.twinkle += star.speed;
        const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));

        const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        starGlow.addColorStop(0, `rgba(247, 231, 206, ${twinkleOpacity})`);
        starGlow.addColorStop(0.5, `rgba(255, 255, 255, ${twinkleOpacity * 0.5})`);
        starGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = starGlow;
        ctx.fill();
      });

      // Occasional shooting star
      if (Math.random() < 0.002 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.3,
          length: 50 + Math.random() * 100,
          speed: 8 + Math.random() * 4,
          opacity: 0.8,
        });
      }

      shootingStars.forEach((star, index) => {
        star.x += star.speed;
        star.y += star.speed * 0.5;
        star.opacity -= 0.02;

        if (star.opacity <= 0) {
          shootingStars.splice(index, 1);
          return;
        }

        const shootingGradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.length, star.y - star.length * 0.5
        );
        shootingGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        shootingGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y - star.length * 0.5);
        ctx.strokeStyle = shootingGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw magnificent moon
      const moonX = canvas.width * 0.78;
      const moonY = canvas.height * 0.18;

      // Moon outer glow
      const outerGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 100);
      outerGlow.addColorStop(0, 'rgba(247, 231, 206, 0.4)');
      outerGlow.addColorStop(0.5, 'rgba(201, 214, 223, 0.15)');
      outerGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 100, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Moon core
      const moonGradient = ctx.createRadialGradient(moonX - 15, moonY - 15, 0, moonX, moonY, 45);
      moonGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      moonGradient.addColorStop(0.4, 'rgba(247, 231, 206, 0.95)');
      moonGradient.addColorStop(1, 'rgba(201, 214, 223, 0.85)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 45, 0, Math.PI * 2);
      ctx.fillStyle = moonGradient;
      ctx.fill();

      // Moon craters (subtle)
      ctx.beginPath();
      ctx.arc(moonX + 10, moonY + 5, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(169, 169, 169, 0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(moonX - 15, moonY + 15, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(169, 169, 169, 0.15)';
      ctx.fill();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (name.trim().length >= 2) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  }, [name]);

  useEffect(() => {
    if (name.length > 0 && name.length % 2 === 0) {
      setTypingHearts(prev => [
        ...prev.slice(-5),
        { id: Date.now(), x: 150 + Math.random() * 20, y: -10 },
      ]);
    }
  }, [name]);

  const handleSubmit = () => {
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1321] to-[#1a1a2e] flex flex-col items-center justify-center px-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full">
        {/* Title */}
        <div className="text-center animate-fadeInUp">
          <p className="handwritten text-[#c9d6df] text-xl tracking-wide mb-3">
            Before we begin…
          </p>
          <h1 className="elegant-title text-[#ff6b9d] text-4xl">
            Who is this for?
          </h1>
        </div>

        {/* Input with enhanced effects */}
        <div className="relative w-full animate-fadeInScale" style={{ animationDelay: '0.3s' }}>
          {/* Floating hearts on typing */}
          {typingHearts.map(heart => (
            <span
              key={heart.id}
              className="absolute pointer-events-none transition-all duration-1000 ease-out"
              style={{
                left: heart.x,
                top: -20,
                opacity: 0,
                transform: 'translateY(-20px)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 100 100">
                <path
                  d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
                  fill="#ff6b9d"
                />
              </svg>
            </span>
          ))}

          <div
            className={`
              relative glass rounded-3xl p-1 transition-all duration-700
              ${isFocused ? 'shadow-[0_0_60px_rgba(255,107,157,0.4)]' : 'shadow-[0_0_30px_rgba(255,107,157,0.1)]'}
            `}
          >
            {/* Glow effect on focus */}
            {isFocused && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ff6b9d]/20 via-[#e8b4b8]/20 to-[#ff6b9d]/20 animate-pulse" />
            )}

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your beautiful name…"
              className="input-emotional w-full text-xl relative z-10"
              autoFocus
            />
          </div>

          {/* Floating heart on input */}
          {name.length > 0 && (
            <div className="absolute -top-6 right-6 animate-gentle-bounce">
              <svg width="24" height="24" viewBox="0 0 100 100" className="text-[#ff6b9d]">
                <path
                  d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Continue button */}
        <div
          className={`
            transition-all duration-700
            ${showContinue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={handleSubmit}
            className="btn-emotional btn-yes flex items-center gap-2 relative group overflow-visible"
          >
            <span>Continue</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b9d]/0 via-[#ff6b9d]/30 to-[#ff6b9d]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
