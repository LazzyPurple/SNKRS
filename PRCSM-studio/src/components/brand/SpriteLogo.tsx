import { useEffect, useRef } from 'react';

interface SpriteLogoProps {
  src: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  fps: number;
  scale?: number;
  className?: string;
}

export default function SpriteLogo({
  src,
  frameCount,
  frameWidth,
  frameHeight,
  fps,
  scale = 1,
  className = '',
}: SpriteLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = frameWidth * scale;
    canvas.height = frameHeight * scale;

    // Load the spritesheet image
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      startAnimation();
    };
    img.src = src;

    const frameDuration = 1000 / fps; // Duration per frame in milliseconds

    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (timestamp - lastFrameTimeRef.current >= frameDuration) {
          if (ctx && imageRef.current) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate source position in spritesheet
            const sourceX = (currentFrameRef.current % Math.floor(imageRef.current.width / frameWidth)) * frameWidth;
            const sourceY = Math.floor(currentFrameRef.current / Math.floor(imageRef.current.width / frameWidth)) * frameHeight;

            // Draw the current frame scaled
            ctx.imageSmoothingEnabled = false; // For pixel-perfect scaling
            ctx.drawImage(
              imageRef.current,
              sourceX,
              sourceY,
              frameWidth,
              frameHeight,
              0,
              0,
              frameWidth * scale,
              frameHeight * scale
            );

            // Move to next frame
            currentFrameRef.current = (currentFrameRef.current + 1) % frameCount;
            lastFrameTimeRef.current = timestamp;
          }
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src, frameCount, frameWidth, frameHeight, fps, scale]);

  return (
    <canvas
      ref={canvasRef}
      className={`sprite-logo ${className}`}
    />
  );
}