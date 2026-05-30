import { useState, useEffect, useRef, useCallback } from 'react';

interface ProposalSceneProps {
  herName: string;
  noAttempts: number;
  onYes: () => void;
  onNo: () => void;
  onNoAttempt: () => void;
}

const reactions = [
  'are you sure?',
  'think once more',
  'naa hearttt',
  'please think again…',
  'really?',
];

export function ProposalScene({ herName, noAttempts, onYes, onNo, onNoAttempt }: ProposalSceneProps) {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showReaction, setShowReaction] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [heartFloaters, setHeartFloaters] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Moonlight bloom effect
    const petals: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 30; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.3,
      });
    }

    const stars: Array<{ x: number; y: number; size: number; twinkle: number }> = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: Math.random() * 2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background with purple glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      gradient.addColorStop(0, '#0d1321');
      gradient.addColorStop(0.5, '#0a0e1a');
      gradient.addColorStop(1, '#050508');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Emotional purple glow in center
      const purpleGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 300
      );
      purpleGlow.addColorStop(0, 'rgba(107, 91, 149, 0.15)');
      purpleGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = purpleGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moon with radiant glow
      const moonX = canvas.width * 0.8;
      const moonY = canvas.height * 0.25;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120);
      moonGlow.addColorStop(0, 'rgba(247, 231, 206, 0.9)');
      moonGlow.addColorStop(0.2, 'rgba(201, 214, 223, 0.5)');
      moonGlow.addColorStop(0.5, 'rgba(184, 169, 201, 0.2)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();

      // Stars with enhanced twinkle
      time += 0.02;
      stars.forEach(star => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + star.twinkle);
        const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        starGlow.addColorStop(0, `rgba(247, 231, 206, ${twinkle})`);
        starGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle * 3, 0, Math.PI * 2);
        ctx.fillStyle = starGlow;
        ctx.fill();
      });

      // Floating petals with enhanced effect
      petals.forEach(petal => {
        petal.y -= petal.speed;
        petal.x += Math.sin(time + petal.rotation) * 0.3;
        petal.rotation += 0.01;

        if (petal.y < -20) {
          petal.y = canvas.height + 20;
          petal.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        const petalGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size * 2);
        petalGlow.addColorStop(0, `rgba(232, 180, 184, ${petal.opacity})`);
        petalGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size * 2, petal.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = petalGlow;
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

  const messages = [
    'No 😅',
    'Think again 💭',
    'Please 🥺',
    'Come on 💕',
    'Reconsider? 😊',
    'Sure? 🤔',
    'Really? 😢',
    'Think 💫',
    'Plzzz 🙏',
    'Please? 💖',
  ];

  const handleNoHover = useCallback(() => {
    const newX = (Math.random() - 0.5) * 250;
    const newY = (Math.random() - 0.5) * 120;

    setNoButtonPosition({ x: newX, y: newY });

    const msg = messages[messageCount % messages.length];
    setShowMessage(msg);
    setMessageCount(prev => prev + 1);

    // Clear message after 1s
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => setShowMessage(''), 1000);

    // Add heart floaters
    setHeartFloaters(prev => [
      ...prev,
      { id: Date.now(), x: 160 + newX, y: 50 + newY },
    ]);
  }, [messageCount]);

  const handleYesClick = () => {
    // Trigger celebration with confetti-like effect
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        setHeartFloaters(prev => [
          ...prev,
          {
            id: Date.now() + i,
            x: Math.random() * (window.innerWidth - 40) + 20,
            y: window.innerHeight + 20,
          },
        ]);
      }, i * 30);
    }

    // Redirect to Instagram after celebration
    setTimeout(() => {
      onYes();
      window.open('https://www.instagram.com/pandu_05_05_/', '_blank');
    }, 1500);
  };

  const handleNoClickTouch = () => {
    handleNoHover();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        {/* Question with excitement */}
        <div className="text-center animate-fadeInUp">
          <p className="handwritten text-[#c9d6df] text-xl tracking-wide mb-4">
            So… 💫
          </p>
          <h1 className="elegant-title text-[#e8b4b8] text-3xl leading-relaxed">
            Will you let me be yours, 💕
          </h1>
          <h1 className="elegant-title text-[#ff6b9d] text-4xl mt-2">
            {herName}? 🙏
          </h1>
        </div>

        {/* Buttons with proper spacing */}
        <div className="flex items-center gap-32 relative">
          {/* Yes button - Only clickable button */}
          <button
            onClick={handleYesClick}
            className="btn-emotional btn-yes animate-button-glow relative group hover:scale-110 transition-transform duration-300"
          >
            <span className="relative z-10">YES! 💖</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6b9d]/20 to-[#e8b4b8]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          </button>

          {/* No button */}
          <div className="relative" style={{ width: '80px', height: '50px' }}>
            <button
              onClick={handleNoClickTouch}
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              className="btn-emotional btn-no absolute transition-all duration-300 ease-out hover:scale-110"
              style={{
                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px) rotate(${noButtonPosition.x * 0.1}deg)`,
              }}
            >
              No 
            </button>
          </div>
        </div>

        {/* Message display */}
        {showMessage && (
          <p className="handwritten text-[#ff6b9d] text-sm md:text-base animate-emotional-bloom">
            {showMessage}
          </p>
        )}

        {/* Heart floaters */}
        {heartFloaters.map(floater => (
          <span
            key={floater.id}
            className="fixed text-[#ff6b9d] animate-float-up pointer-events-none text-2xl"
            style={{
              left: floater.x,
              top: floater.y,
            }}
          >
            💖
          </span>
        ))}
      </div>
    </div>
  );
}
