"use client";

import { useEffect, useRef } from "react";

interface LightParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  brightness: number;
  gridLine: "horizontal" | "vertical";
  progress: number;
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lights: LightParticle[] = [];
    let lastTime = 0;
    const GRID_SIZE = 60;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createLight = (): LightParticle => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const isHorizontal = Math.random() > 0.5;

      if (isHorizontal) {
        const y = Math.floor(Math.random() * (height / GRID_SIZE)) * GRID_SIZE;
        return {
          x: 0,
          y,
          targetX: width,
          targetY: y,
          speed: 0.3 + Math.random() * 0.8,
          brightness: 0.6 + Math.random() * 0.4,
          gridLine: "horizontal",
          progress: 0,
        };
      } else {
        const x = Math.floor(Math.random() * (width / GRID_SIZE)) * GRID_SIZE;
        return {
          x,
          y: 0,
          targetX: x,
          targetY: height,
          speed: 0.3 + Math.random() * 0.8,
          brightness: 0.6 + Math.random() * 0.4,
          gridLine: "vertical",
          progress: 0,
        };
      }
    };

    const drawGrid = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 0.5;

      // Vertical lines with subtle wave
      for (let x = -GRID_SIZE; x < width + GRID_SIZE; x += GRID_SIZE) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += 3) {
          const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const wave = Math.sin(distFromCenter * 0.015) * 12;
          const perspective = 1 - distFromCenter / (width * 0.9);
          const adjustedX = x + wave * Math.max(0, perspective);

          if (y === 0) ctx.moveTo(adjustedX, y);
          else ctx.lineTo(adjustedX, y);
        }
        ctx.stroke();
      }

      // Horizontal lines with subtle wave
      for (let y = -GRID_SIZE; y < height + GRID_SIZE; y += GRID_SIZE) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 3) {
          const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const wave = Math.sin(distFromCenter * 0.015) * 12;
          const perspective = 1 - distFromCenter / (height * 0.9);
          const adjustedY = y + wave * Math.max(0, perspective);

          if (x === 0) ctx.moveTo(x, adjustedY);
          else ctx.lineTo(x, adjustedY);
        }
        ctx.stroke();
      }
    };

    const drawLights = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2;
      const centerY = height / 2;

      lights.forEach((light) => {
        const distFromCenter = Math.sqrt((light.x - centerX) ** 2 + (light.y - centerY) ** 2);
        const wave = Math.sin(distFromCenter * 0.015) * 12;

        let drawX = light.x;
        let drawY = light.y;

        if (light.gridLine === "vertical") {
          const perspective = 1 - distFromCenter / (width * 0.9);
          drawX = light.x + wave * Math.max(0, perspective);
        } else {
          const perspective = 1 - distFromCenter / (height * 0.9);
          drawY = light.y + wave * Math.max(0, perspective);
        }

        // Red glow
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, 18);
        gradient.addColorStop(0, `rgba(219, 10, 64, ${light.brightness * 0.7})`);
        gradient.addColorStop(0.4, `rgba(219, 10, 64, ${light.brightness * 0.3})`);
        gradient.addColorStop(1, "rgba(219, 10, 64, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${light.brightness * 0.9})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update light positions
      for (let i = lights.length - 1; i >= 0; i--) {
        const light = lights[i];
        light.progress += light.speed * deltaTime * 0.001;

        if (light.gridLine === "horizontal") {
          light.x = light.progress * light.targetX;
        } else {
          light.y = light.progress * light.targetY;
        }

        if (light.progress >= 1) {
          lights.splice(i, 1);
        }
      }

      // Spawn new lights
      if (Math.random() < 0.015 && lights.length < 6) {
        lights.push(createLight());
      }

      drawGrid();
      drawLights();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
