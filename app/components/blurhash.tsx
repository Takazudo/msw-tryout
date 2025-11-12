'use client';

import { useEffect, useRef } from 'react';
import { decode } from 'blurhash';

interface BlurhashProps {
  hash: string;
  width: string | number;
  height: string | number;
  className?: string;
}

export function Blurhash({ hash, width, height, className = '' }: BlurhashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixels = decode(hash, 32, 32);
      const imageData = ctx.createImageData(32, 32);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Failed to decode blurhash:', error);
    }
  }, [hash]);

  return (
    <canvas
      ref={canvasRef}
      width={32}
      height={32}
      className={className}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}
