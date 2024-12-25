import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

interface SnowOverlayProps {
  snowflakeCount?: number;
  wind?: number;
  className?: string;
}

export function SnowOverlay({
  snowflakeCount = 100,
  wind = 0.5,
  className = ''
}: SnowOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflakes = () => {
      snowflakes.current = Array.from({ length: snowflakeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 2,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.7
      }));
    };

    const updateSnowflakes = () => {
      snowflakes.current.forEach(flake => {
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y / 30) * wind;

        // Reset snowflake when it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -5;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });
    };

    const drawSnowflakes = () => {
      // Clear with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set composite operation for drawing on top
      ctx.globalCompositeOperation = 'source-over';

      snowflakes.current.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
      });
    };
    if (!ctx) return;
    ctx.globalAlpha = 1;
    const animate = () => {
      updateSnowflakes();
      drawSnowflakes();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    createSnowflakes();
    animate();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [snowflakeCount, wind]);

  return (
    <canvas
      ref={canvasRef}
      className={` inset-0 pointer-events-none z-50 ${className}`}
      style={{ background: 'transparent', position: 'absolute' }}
    />
  );
}