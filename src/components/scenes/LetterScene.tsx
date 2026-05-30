import { useState, useEffect, useRef } from 'react';

interface LetterSceneProps {
  herName: string;
  onComplete: () => void;
}

export function LetterScene({ herName, onComplete }: LetterSceneProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fullLetter = `Honestly ${herName}… 💫
ee website create cheyyali ani decide avthanu ani nenu kuda expect cheyyaledu.

Ninnu first time chusinappudu, 😊
just oka normal moment anukunna.
Kani enduko…
aa moment tarvata nuvvu mind nunchi vellaledu. ✨

First ninnu college bus stop lo chusanu. 👀
Tarvata malli random ga kanipinchav.
Appudu konchem strange ga anipinchindi…
'intha coincidence enti?' ani. 🌙

Slow ga ninnu chudatam na daily routine aipoyindi. 💭
College aipoyina tarvata kuda,
konni rojulu just okka sari chudalani wait chesanu. ❤️

Konni sarlu almost matladedam anukunna… 😔
kani prati sari edo oka reason tho aagipoyanu.

Honestly…
idi konchem cinema laga undi 🎬

Ninnu kalavadaniki chesina attempts count chesthe, 😅
naa friends nannu full troll chestharu probably.
Kani em cheyyali…
nuvvu different ga anipinchav. 💖

Nee attitude… 👑
nee calmness… 🧘
nee self respect…
especially nuvvu nee own life handle chesthunna way…
ivanni naku chala nachayi. ✨

Nuvvu ekkuva matladakapoyina, 🤐
nee vibe chaala peaceful ga untadi.
And somehow…
aa peace ki nenu alavatu aipoya. 🕊️

Konni rojulu ninnu chudakapothe, 😞
day incomplete laga anipinchindi.
Bus timings gurthupettukovadam start ayyindi. 🚌

College complete aipoyindi… 😔
inka nuvvu kanipinchavu emo ani konchem feel ayyanu.
Kani oka roju random ga D-Mart ki vachinappudu,
akkada malli ninnu chusanu. ✨

Honestly… 🎬
aa moment lo nenu full shock and happy rendu aipoya 😍

Nuvvu nannu notice chesavo ledho telidhu gani, 🤷
nenu matram ninne chustunna. 👁️

Matladali ani chala anipinchindi… 😅
kani appudu ma akka and amma unnaru,
anduke silent ga akkade nilchipoina. 🤫

So next mission D-Mart 🛒

Akkadiki ravadaniki enni reasons vetukunnano nake telusu… 😊
kani ala vachina prati sari,
nuvvu matram kanipinchev kaadu. 💔

Idi konchem childish anipinchachu maybe… 🥰
kani every small thing was genuine. 💯

One time matladali ani decide ayi velthunte, 😔
naaku accident kuda ayyindi.
Appudu okka second anipinchindi…
'universe literally try chesthunda aapadaniki?' ani 🌌

Still…
nenu give up cheyyaledu. 🔥
Because for the first time,
someone actually became this important to me.
And that someone is you. 💕

This website may look simple… ✨
kani every color,
every animation,
every word here…
was made thinking about you. 🎨

No fake drama. 🙅
No impress cheyyali ane over action.
Just…
someone genuinely trying to tell you what they feel. ❤️

And before life malli fast ga move aipothundo…
before another chance miss aipothundo…
nenu finally cheppali anukunna. 🌟

You became one of my favorite parts of these past few months. 💫

So…
Will you let me be yours? 🙏✨`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ambient floating hearts
    const hearts: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;
      rotation: number;
    }> = [];

    const heartColors = ['#ff6b9d', '#e8b4b8', '#ffd1dc', '#b8a9c9'];
    for (let i = 0; i < 30; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        size: 8 + Math.random() * 15,
        opacity: 0.08 + Math.random() * 0.15,
        speed: 0.3 + Math.random() * 0.5,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: Math.random() * Math.PI * 2,
      });
    }

    // Glowing particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.4,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep night gradient with stars
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020204');
      gradient.addColorStop(0.3, '#050510');
      gradient.addColorStop(0.6, '#0a0e1a');
      gradient.addColorStop(1, '#0d0d15');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Romantic night glow
      const ambientGlow = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.3, 0,
        canvas.width * 0.3, canvas.height * 0.3, canvas.width * 0.9
      );
      ambientGlow.addColorStop(0, 'rgba(255, 107, 157, 0.12)');
      ambientGlow.addColorStop(0.5, 'rgba(184, 169, 201, 0.05)');
      ambientGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add starfield
      for (let i = 0; i < 200; i++) {
        const x = (i * 73.4) % canvas.width;
        const y = (i * 53.2) % canvas.height;
        const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 0.4 + twinkle * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 200, 255, ${0.1 + twinkle * 0.3})`;
        ctx.fill();
      }

      // Glowing particles
      time += 0.01;
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(time * 2 + p.y * 0.01) * 0.3;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        const pGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        pGlow.addColorStop(0, `rgba(247, 231, 206, ${p.opacity})`);
        pGlow.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = pGlow;
        ctx.fill();
      });

      // Floating hearts
      hearts.forEach(heart => {
        heart.y -= heart.speed;
        heart.x += Math.sin(time + heart.y * 0.005) * 0.5;
        heart.rotation += 0.01;

        if (heart.y < -30) {
          heart.y = canvas.height + 30;
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
        ctx.globalAlpha = heart.opacity;
        ctx.fill();

        ctx.beginPath();
        const scale = heart.size / 10;
        ctx.moveTo(0, -3 * scale);
        ctx.bezierCurveTo(-5 * scale, -8 * scale, -10 * scale, -3 * scale, -10 * scale, 2 * scale);
        ctx.bezierCurveTo(-10 * scale, 8 * scale, 0, 13 * scale, 0, 18 * scale);
        ctx.bezierCurveTo(0, 13 * scale, 10 * scale, 8 * scale, 10 * scale, 2 * scale);
        ctx.bezierCurveTo(10 * scale, -3 * scale, 5 * scale, -8 * scale, 0, -3 * scale);
        ctx.fillStyle = heart.color;
        ctx.globalAlpha = heart.opacity * 0.5;
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
    let charIndex = 0;
    const speed = 15;

    const typeInterval = setInterval(() => {
      if (charIndex <= fullLetter.length) {
        setDisplayedText(fullLetter.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setShowButton(true);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [fullLetter]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPercent = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(scrollPercent);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0e1a]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Progress bar with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
        <div
          className="h-full bg-gradient-to-r from-[#ff6b9d] via-[#e8b4b8] to-[#b8a9c9] transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 h-full overflow-y-auto px-6 py-16 scrollbar-thin scrollbar-thumb-white/10"
      >
        <div className="max-w-lg mx-auto">
          {/* Letter with smooth sentence-by-sentence animation */}
          <div className="letter-text text-lg">
            {displayedText.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-3 animate-fadeInUp">
                {line || '\u00A0'}
              </p>
            ))}
          </div>

          {/* Continue button */}
          <div
            className={`
              mt-14 mb-8 flex justify-center transition-all duration-700
              ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <button
              onClick={onComplete}
              className="btn-emotional flex items-center gap-2 relative group"
            >
              <span>Continue</span>
              <svg width="18" height="18" viewBox="0 0 100 100" className="text-[#ff6b9d]">
                <path
                  d="M50 88 C20 60, 5 35, 25 20 C35 12, 50 20, 50 35 C50 20, 65 12, 75 20 C95 35, 80 60, 50 88Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {scrollProgress < 5 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="text-[#c9d6df]/50 text-sm flex flex-col items-center gap-1">
            <span className="handwritten tracking-wide">scroll</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
