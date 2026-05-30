import { useState, useEffect, useRef } from 'react';

interface HeartbreakSceneProps {
  onComplete: () => void;
}

export function HeartbreakScene({ onComplete }: HeartbreakSceneProps) {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [crackProgress, setCrackProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Rain drops with enhanced effect
    const rain: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      rain.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 15 + Math.random() * 30,
        speed: 8 + Math.random() * 12,
        opacity: 0.08 + Math.random() * 0.15,
      });
    }

    // Drifting heart fragments
    const fragments: Array<{
      x: number;
      y: number;
      rotation: number;
      speed: number;
      opacity: number;
      drift: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      fragments.push({
        x: canvas.width / 2 + Math.cos(angle) * 50,
        y: canvas.height / 2 + Math.sin(angle) * 50,
        rotation: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.4,
        drift: Math.random() * Math.PI * 2,
      });
    }

    // Fog/mist effect
    const mist: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      mist.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.6 + Math.random() * canvas.height * 0.4,
        size: 100 + Math.random() * 200,
        opacity: 0.03 + Math.random() * 0.05,
        speed: 0.3 + Math.random() * 0.5,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark, muted gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#030305');
      gradient.addColorStop(0.5, '#050508');
      gradient.addColorStop(1, '#080810');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Muted moon with soft glow
      const moonX = canvas.width * 0.75;
      const moonY = canvas.height * 0.2;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
      moonGlow.addColorStop(0, 'rgba(120, 120, 120, 0.25)');
      moonGlow.addColorStop(0.5, 'rgba(80, 80, 80, 0.1)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 80, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();

      // Moon core
      const moonCore = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 30);
      moonCore.addColorStop(0, 'rgba(150, 150, 150, 0.3)');
      moonCore.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
      ctx.fillStyle = moonCore;
      ctx.fill();

      // Fog/mist
      time += 0.01;
      mist.forEach(m => {
        m.x += m.speed;
        if (m.x > canvas.width + m.size) {
          m.x = -m.size;
        }

        const mistGradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size);
        mistGradient.addColorStop(0, `rgba(50, 50, 60, ${m.opacity})`);
        mistGradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = mistGradient;
        ctx.fill();
      });

      // Enhanced rain with glow
      rain.forEach(drop => {
        drop.y += drop.speed;
        drop.x -= 1.5;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }

        const rainGradient = ctx.createLinearGradient(
          drop.x, drop.y,
          drop.x, drop.y + drop.length
        );
        rainGradient.addColorStop(0, 'transparent');
        rainGradient.addColorStop(0.5, `rgba(100, 110, 120, ${drop.opacity})`);
        rainGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3, drop.y + drop.length);
        ctx.strokeStyle = rainGradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Drifting heart fragments
      fragments.forEach(frag => {
        frag.y += frag.speed;
        frag.x += Math.sin(time + frag.drift) * 0.8;
        frag.rotation += 0.03;
        frag.opacity -= 0.001;

        if (frag.y > canvas.height + 50) {
          frag.y = canvas.height / 2;
          frag.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
          frag.opacity = 0.4 + Math.random() * 0.4;
        }

        ctx.save();
        ctx.translate(frag.x, frag.y);
        ctx.rotate(frag.rotation);
        ctx.font = '14px serif';

        const fragGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        fragGlow.addColorStop(0, `rgba(232, 180, 184, ${frag.opacity})`);
        fragGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = fragGlow;
        ctx.fill();
        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Crack animation
    const crackInterval = setInterval(() => {
      setCrackProgress(prev => {
        if (prev >= 100) {
          clearInterval(crackInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(crackInterval);
    };
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowText1(true), 1200),
      setTimeout(() => setShowText2(true), 2700),
      setTimeout(() => setShowButton(true), 4700),
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

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-md px-6 text-center">
        {/* Cracking heart */}
        <div className="relative animate-fadeInScale">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{ filter: 'drop-shadow(0 0 30px rgba(232, 180, 184, 0.4))' }}
          >
            <defs>
              <clipPath id="crackClipTop">
                <rect x="0" y="0" width="100" height={50 - crackProgress * 0.25} />
              </clipPath>
              <clipPath id="crackClipBottom">
                <rect x="0" y={50 + crackProgress * 0.25} width="100" height={50 - crackProgress * 0.25} />
              </clipPath>
            </defs>

            {/* Top half */}
            <path
              d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
              fill="rgba(232, 180, 184, 0.5)"
              clipPath="url(#crackClipTop)"
              style={{
                transform: `translateY(${-crackProgress * 0.3}px) translateX(${crackProgress * 0.1}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            />

            {/* Bottom half */}
            <path
              d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
              fill="rgba(232, 180, 184, 0.5)"
              clipPath="url(#crackClipBottom)"
              style={{
                transform: `translateY(${crackProgress * 0.3}px) translateX(${-crackProgress * 0.1}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            />

            {/* Crack line */}
            {crackProgress > 20 && (
              <line
                x1="50"
                y1="20"
                x2="50"
                y2={20 + crackProgress * 0.68}
                stroke="rgba(5, 5, 8, 0.9)"
                strokeWidth="2.5"
              />
            )}
          </svg>
        </div>

        {/* Messages */}
        <p
          className={`
            handwritten text-[#808080] text-lg tracking-wide leading-relaxed
            transition-all duration-700
            ${showText1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          Some feelings stay beautiful…
          <br />
          <span className="text-[#606060]">even without an ending.</span>
        </p>

        <p
          className={`
            letter-text text-center transition-all duration-700 delay-100
            ${showText2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          Thank you for listening to my heart.
        </p>

        {/* Continue button */}
        <div
          className={`
            mt-4 transition-all duration-700 delay-200
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={handleContinue}
            className="btn-emotional"
          >
            Talk on Instagram
          </button>
        </div>
      </div>
    </div>
  );
}
