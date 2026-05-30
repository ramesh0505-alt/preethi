import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleConfig {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: number;
  direction?: 'up' | 'down' | 'random';
  fadeOut?: boolean;
}

export function useParticles(config: ParticleConfig = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const {
    count = 50,
    colors = ['rgba(255, 107, 157, 0.6)', 'rgba(201, 214, 223, 0.5)', 'rgba(184, 169, 201, 0.4)', 'rgba(247, 231, 206, 0.3)'],
    minSize = 1,
    maxSize = 3,
    speed = 0.5,
    direction = 'up',
    fadeOut = true,
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (): Particle => {
      const x = Math.random() * canvas.width;
      const y = direction === 'up' ? canvas.height + Math.random() * 100 : -Math.random() * 100;
      const baseSpeed = speed * (0.5 + Math.random());
      const angle = direction === 'random' ? Math.random() * Math.PI * 2 : Math.PI * 1.5;

      return {
        x,
        y,
        vx: Math.cos(angle) * baseSpeed + (Math.random() - 0.5) * 0.3,
        vy: Math.sin(angle) * baseSpeed,
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 200 + Math.random() * 300,
      };
    };

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        let currentOpacity = particle.opacity;
        if (fadeOut) {
          const lifeRatio = particle.life / particle.maxLife;
          if (lifeRatio < 0.1) {
            currentOpacity = particle.opacity * (lifeRatio / 0.1);
          } else if (lifeRatio > 0.9) {
            currentOpacity = particle.opacity * ((1 - lifeRatio) / 0.1);
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${currentOpacity})`);
        ctx.fill();

        // Add glow effect for some particles
        if (particle.size > 2) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${currentOpacity * 0.5})`));
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Reset particle if out of bounds or dead
        if (
          particle.y < -50 ||
          particle.y > canvas.height + 50 ||
          particle.x < -50 ||
          particle.x > canvas.width + 50 ||
          particle.life > particle.maxLife
        ) {
          particlesRef.current[index] = createParticle();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, colors, minSize, maxSize, speed, direction, fadeOut]);

  return canvasRef;
}

export function ParticleField({ config }: { config?: ParticleConfig }) {
  const canvasRef = useParticles(config);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
