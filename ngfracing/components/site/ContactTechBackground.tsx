"use client";

import { useEffect, useRef } from "react";

export function ContactTechBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let raf = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const horizonY = height * 0.26;
      const centerX = width / 2;
      const speed = time * 0.00035;

      context.strokeStyle = "rgba(215, 0, 0, 0.32)";
      context.lineWidth = 1;

      for (let index = 1; index <= 14; index += 1) {
        const depth = (index + speed * 22) % 14;
        const t = depth / 14;
        const y = horizonY + t * t * (height - horizonY);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      for (let index = -8; index <= 8; index += 1) {
        const startX = centerX + index * (width / 15);
        const drift = Math.sin(speed * 4 + index * 0.5) * 8;
        context.beginPath();
        context.moveTo(startX, horizonY);
        context.lineTo(startX + drift, height);
        context.stroke();
      }

      context.fillStyle = "rgba(246, 201, 14, 0.34)";
      for (let index = 0; index < 24; index += 1) {
        const x = ((index * 79 + time * 0.045) % (width + 120)) - 60;
        const y = horizonY + Math.sin(index * 0.7 + speed * 5) * 12;
        context.fillRect(x, y, 2, 2);
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-tech-bg" aria-hidden="true" />;
}

