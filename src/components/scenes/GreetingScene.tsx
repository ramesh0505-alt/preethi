import { useState, useEffect, useRef } from 'react';

interface GreetingSceneProps {
  herName: string;
  onComplete: () => void;
}

export function GreetingScene({ herName, onComplete }: GreetingSceneProps) {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const texts = [
    `Hey ${herName}…`,
    "There's something I wanted to tell you.",
    "So I made this little page.",
  ];

  const typingSpeed = 50;
  const pauseBetweenTexts = 2200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Night sky with clouds
    const clouds: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      opacity: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: 30 + Math.random() * 120,
        width: 120 + Math.random() * 180,
        height: 35 + Math.random() * 45,
        opacity: 0.08 + Math.random() * 0.08,
        speed: 0.15 + Math.random() * 0.25,
      });
    }

    const stars: Array<{ x: number; y: number; size: number; opacity: number; twinkle: number }> = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        size: Math.random() * 2,
        opacity: Math.random() * 0.6,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    const petals: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      speed: number;
      opacity: number;
      color: string;
    }> = [];

    const petalColors = ['#e8b4b8', '#ffd1dc', '#ff6b9d', '#b8a9c9'];
    for (let i = 0; i < 25; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        opacity: 0.2 + Math.random() * 0.3,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }

    const fireflies: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      fireflies.push({
        x,
        y,
        targetX: x + (Math.random() - 0.5) * 200,
        targetY: y + (Math.random() - 0.5) * 200,
        size: 2 + Math.random() * 2,
        opacity: Math.random(),
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#050508');
      gradient.addColorStop(0.3, '#0a0e1a');
      gradient.addColorStop(0.7, '#0d1321');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw magnificent moon with enhanced glow
      const moonX = canvas.width * 0.78;
      const moonY = canvas.height * 0.18;

      // Moon rays
      time += 0.008;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.3;
        const rayLength = 100 + Math.sin(time * 3 + i) * 30;
        ctx.save();
        ctx.translate(moonX, moonY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(rayLength, -4);
        ctx.lineTo(rayLength, 4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(247, 231, 206, 0.08)';
        ctx.fill();
        ctx.restore();
      }

      // Moon outer glow
      const outerGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 130);
      outerGlow.addColorStop(0, 'rgba(247, 231, 206, 0.5)');
      outerGlow.addColorStop(0.3, 'rgba(201, 214, 223, 0.2)');
      outerGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 130, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Moon core
      const moonGradient = ctx.createRadialGradient(moonX - 12, moonY - 12, 0, moonX, moonY, 50);
      moonGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      moonGradient.addColorStop(0.5, 'rgba(247, 231, 206, 0.95)');
      moonGradient.addColorStop(1, 'rgba(201, 214, 223, 0.85)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
      ctx.fillStyle = moonGradient;
      ctx.fill();

      // Draw clouds with soft effect
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
        }

        const cloudGradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.width
        );
        cloudGradient.addColorStop(0, `rgba(201, 214, 223, ${cloud.opacity})`);
        cloudGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = cloudGradient;
        ctx.fill();
      });

      // Draw stars with enhanced twinkle
      stars.forEach(star => {
        star.twinkle += 0.03;
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinkle);

        const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        starGlow.addColorStop(0, `rgba(247, 231, 206, ${star.opacity * twinkle})`);
        starGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4 * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = starGlow;
        ctx.fill();
      });

      // Draw floating petals with glow
      petals.forEach(petal => {
        petal.y -= petal.speed;
        petal.x += Math.sin(time * 2 + petal.rotation) * 0.5;
        petal.rotation += 0.015;

        if (petal.y < -20) {
          petal.y = canvas.height + 20;
          petal.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);

        const petalGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size * 2.5);
        petalGlow.addColorStop(0, `${petal.color}${Math.round(petal.opacity * 255).toString(16).padStart(2, '0')}`);
        petalGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size * 2.5, petal.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = petalGlow;
        ctx.fill();
        ctx.restore();
      });

      // Draw fireflies
      fireflies.forEach(ff => {
        ff.x += (ff.targetX - ff.x) * 0.01;
        ff.y += (ff.targetY - ff.y) * 0.01;
        ff.opacity = Math.sin(time * 5 + ff.x) * 0.5 + 0.5;

        if (Math.abs(ff.x - ff.targetX) < 10) {
          ff.targetX = ff.x + (Math.random() - 0.5) * 200;
          ff.targetY = ff.y + (Math.random() - 0.5) * 200;
        }

        const ffGlow = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 8);
        ffGlow.addColorStop(0, `rgba(255, 255, 200, ${ff.opacity * 0.8})`);
        ffGlow.addColorStop(0.5, `rgba(255, 255, 150, ${ff.opacity * 0.4})`);
        ffGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 8, 0, Math.PI * 2);
        ctx.fillStyle = ffGlow;
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
    if (textIndex >= texts.length) {
      setTimeout(() => setShowButton(true), 500);
      return;
    }

    const text = texts[textIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setCurrentText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        setTimeout(() => {
          setCurrentText('');
          setTextIndex(prev => prev + 1);
        }, pauseBetweenTexts);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [textIndex]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center max-w-lg px-6">
        {/* Text container with smooth typewriter effect */}
        <div className="min-h-[140px] flex items-center justify-center">
          <p className="handwritten text-[#c9d6df] text-3xl text-center tracking-wide leading-relaxed relative">
            {currentText}
            <span
              className="inline-block w-[3px] h-7 bg-[#ff6b9d] ml-1"
              style={{
                animation: 'cursor-blink 1s ease-in-out infinite',
              }}
            />
          </p>
        </div>

        {/* Continue button with enhanced effects */}
        <div
          className={`
            mt-10 transition-all duration-700
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={onComplete}
            className="btn-emotional flex items-center gap-3 relative group"
          >
            <span>Tap to Continue</span>
            <svg width="20" height="20" viewBox="0 0 100 100" className="text-[#ff6b9d]">
              <path
                d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
