"use client";

import { useEffect, useRef } from "react";

export function GlobalBackdrop3D() {
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

    let frameId = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawBeam = (time: number) => {
      const beamWidth = width * 0.28;
      const travel = (time * 0.045) % (width + beamWidth * 2);
      const beamX = travel - beamWidth;
      const gradient = context.createLinearGradient(beamX, 0, beamX + beamWidth, 0);
      gradient.addColorStop(0, "rgba(215, 0, 0, 0)");
      gradient.addColorStop(0.5, "rgba(215, 0, 0, 0.075)");
      gradient.addColorStop(1, "rgba(215, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const horizonY = height * 0.18;
      const baseY = height * 0.88;
      const centerX = width / 2;
      const wave = time * 0.00022;

      drawBeam(time);

      context.strokeStyle = "rgba(255, 255, 255, 0.05)";
      context.lineWidth = 1;

      for (let index = 0; index < 12; index += 1) {
        const depth = index / 11;
        const y = horizonY + depth * depth * (baseY - horizonY);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      for (let index = -7; index <= 7; index += 1) {
        const laneOffset = index * (width / 18);
        const laneDrift = Math.sin(wave * 4 + index * 0.6) * 10;
        context.beginPath();
        context.moveTo(centerX + laneOffset * 0.24, horizonY);
        context.lineTo(centerX + laneOffset + laneDrift, baseY);
        context.stroke();
      }

      context.strokeStyle = "rgba(215, 0, 0, 0.09)";
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(centerX - width * 0.18, horizonY + 24);
      context.bezierCurveTo(
        centerX - width * 0.14,
        height * 0.45,
        centerX + width * 0.08,
        height * 0.58,
        centerX + width * 0.2,
        baseY
      );
      context.stroke();

      context.beginPath();
      context.moveTo(centerX + width * 0.22, horizonY + 10);
      context.bezierCurveTo(
        centerX + width * 0.1,
        height * 0.4,
        centerX - width * 0.06,
        height * 0.54,
        centerX - width * 0.16,
        baseY
      );
      context.stroke();

      context.fillStyle = "rgba(246, 201, 14, 0.24)";
      for (let index = 0; index < 18; index += 1) {
        const x = (index * 113 + time * 0.018) % (width + 60) - 30;
        const y = horizonY + Math.sin(index * 0.85 + wave * 6) * 18 + index * 3.5;
        context.fillRect(x, y, 1.5, 1.5);
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="global-backdrop-3d" aria-hidden="true" />;
}

