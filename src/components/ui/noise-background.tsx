"use client";

import { cn } from "../../lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Helper component for gradient layers with GPU hardware acceleration
function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  gradientColor: string;
  opacity: number;
  multiplier: number;
}) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 50%)`;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none transform-gpu will-change-transform"
      style={{
        opacity,
        background,
        willChange: "background, opacity",
        transform: "translateZ(0)",
      }}
    />
  );
}

export interface NoiseBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  backdropBlur?: boolean;
  animating?: boolean;
  hoverOnly?: boolean;
}

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(255, 100, 150)",
    "rgb(100, 150, 255)",
    "rgb(255, 200, 100)",
  ],
  noiseIntensity = 0.2,
  speed = 0.1,
  backdropBlur = false,
  animating = true,
  hoverOnly = true,
}: NoiseBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dimsRef = useRef({ width: 400, height: 300 });

  const x = useMotionValue(200);
  const y = useMotionValue(150);

  // Smooth spring physics for fluid movement
  const springX = useSpring(x, { stiffness: 120, damping: 25, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 120, damping: 25, mass: 0.1 });

  // Transform for top gradient strip
  const topGradientX = useTransform(springX, (val) => val * 0.1 - 20);

  // Velocity state used only if continuous animation (hoverOnly = false) is explicitly enabled
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(0);

  // Cache dimensions on mount & window resize without layout-thrashing
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      dimsRef.current = { width: rect.width, height: rect.height };
      if (!isHovered) {
        x.set(rect.width / 2);
        y.set(rect.height / 2);
      }
    }
  }, [isHovered, x, y]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Handle cursor tracking on hover with zero CPU cost when idle
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    dimsRef.current = { width: rect.width, height: rect.height };
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return gradient back to center
    x.set(dimsRef.current.width / 2);
    y.set(dimsRef.current.height / 2);
  };

  // Only run frame loop if continuous non-hover animation is explicitly configured
  useAnimationFrame((time) => {
    if (!animating || hoverOnly) return; // 0% CPU consumption when idle or in hover-only mode!

    const maxX = dimsRef.current.width;
    const maxY = dimsRef.current.height;

    if (time - lastDirectionChangeRef.current > 2000) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = speed * 0.8;
      velocityRef.current = {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
      lastDirectionChangeRef.current = time;
    }

    const deltaTime = 16;
    let newX = x.get() + velocityRef.current.x * deltaTime;
    let newY = y.get() + velocityRef.current.y * deltaTime;

    const padding = 20;
    if (newX < padding || newX > maxX - padding || newY < padding || newY > maxY - padding) {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = speed * 0.8;
      velocityRef.current = {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
      newX = Math.max(padding, Math.min(maxX - padding, newX));
      newY = Math.max(padding, Math.min(maxY - padding, newY));
    }

    x.set(newX);
    y.set(newY);
  });

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-canvas-raised p-2 backdrop-blur-sm transform-gpu will-change-transform",
        "shadow-[0px_0.5px_1px_0px_var(--color-neutral-400)_inset,0px_1px_0px_0px_var(--color-neutral-100)]",
        backdropBlur &&
          "after:absolute after:inset-0 after:h-full after:w-full after:backdrop-blur-lg after:content-['']",
        containerClassName,
      )}
      style={
        {
          "--noise-opacity": noiseIntensity,
          willChange: "transform",
          transform: "translateZ(0)",
        } as React.CSSProperties
      }
    >
      {/* Moving gradient layers - accelerated and responsive */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[0]}
        opacity={isHovered ? 0.45 : 0.25}
        multiplier={1}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[1]}
        opacity={isHovered ? 0.35 : 0.2}
        multiplier={0.8}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[2] || gradientColors[0]}
        opacity={isHovered ? 0.3 : 0.15}
        multiplier={1.1}
      />

      {/* Top gradient strip */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80 blur-sm pointer-events-none transform-gpu will-change-transform"
        style={{
          background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
          x: topGradientX,
          transform: "translateZ(0)",
        }}
      />

      {/* Static Noise Pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu">
        <img
          src="/noise.webp"
          alt=""
          className="h-full w-full object-cover opacity-[var(--noise-opacity)] pointer-events-none"
          style={{ mixBlendMode: "overlay" }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className={cn("relative z-10 w-full h-full", className)}>{children}</div>
    </div>
  );
};
