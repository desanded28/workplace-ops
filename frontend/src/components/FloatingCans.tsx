"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Simplified Red Bull can — at floating background size (~30px),
 * only the color blocking is recognizable: blue top, silver bottom,
 * thin silver lid, hint of red/gold logo area in the middle.
 */
const RedBullCan = ({ id }: { id: number }) => (
  <svg width="20" height="52" viewBox="0 0 20 52" fill="none">
    <defs>
      <clipPath id={`canClip-${id}`}>
        <rect x="1" y="5" width="18" height="44" rx="2.5" />
      </clipPath>
    </defs>

    {/* Silver body base */}
    <rect x="1" y="5" width="18" height="44" rx="2.5" fill="#c0c4cc" />

    <g clipPath={`url(#canClip-${id})`}>
      {/* Blue portion — vivid blue like the real can.
          Diagonal: left side blue goes to y=33, right side to y=19 */}
      <polygon points="1,5 19,5 19,19 1,33" fill="#2942a0" />

      {/* Thin silver edge at diagonal */}
      <line x1="1" y1="33" x2="19" y2="19" stroke="#d8dbe0" strokeWidth="0.5" />

      {/* Small red/gold logo hint at the diagonal boundary */}
      <circle cx="10" cy="28" r="1.2" fill="#d4a017" opacity="0.4" />
      <circle cx="8.5" cy="28" r="0.7" fill="#c8102e" opacity="0.5" />
      <circle cx="11.5" cy="28" r="0.7" fill="#c8102e" opacity="0.5" />
    </g>

    {/* Metallic lid */}
    <rect x="2.5" y="3" width="15" height="4" rx="2" fill="#d0d3d9" />
    <rect x="3.5" y="2" width="13" height="3" rx="1.5" fill="#e2e4e8" />

    {/* Pull tab */}
    <ellipse cx="12" cy="3" rx="2" ry="0.8" fill="none" stroke="#a0a3aa" strokeWidth="0.5" />

    {/* Bottom rim */}
    <rect x="2" y="47" width="16" height="2" rx="1" fill="#a8abb3" />

    {/* Cylinder highlight left */}
    <rect x="1.5" y="6" width="1" height="42" rx="0.5" fill="white" opacity="0.1" />

    {/* Cylinder shadow right */}
    <rect x="17.5" y="6" width="1" height="42" rx="0.5" fill="black" opacity="0.08" />
  </svg>
);

interface FloatingCanProps {
  index: number;
  delay: number;
  duration: number;
  x: string;
  y: string;
  opacity: number;
  rotation: number;
  scale: number;
}

const FloatingCan: React.FC<FloatingCanProps> = ({
  index,
  delay,
  duration,
  x,
  y,
  opacity,
  rotation,
  scale,
}) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y, opacity, rotate: rotation, scale }}
    animate={{ y: [0, -8, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <RedBullCan id={index} />
  </motion.div>
);

// Deterministic positions spread nicely across the screen
const CAN_POSITIONS = [
  { x: "8%", y: "12%" },
  { x: "22%", y: "65%" },
  { x: "35%", y: "8%" },
  { x: "48%", y: "78%" },
  { x: "62%", y: "20%" },
  { x: "75%", y: "55%" },
  { x: "88%", y: "10%" },
  { x: "15%", y: "40%" },
  { x: "52%", y: "45%" },
  { x: "82%", y: "75%" },
  { x: "5%", y: "85%" },
  { x: "42%", y: "30%" },
  { x: "70%", y: "88%" },
  { x: "92%", y: "40%" },
  { x: "28%", y: "92%" },
];

export function FloatingCans() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {CAN_POSITIONS.map((pos, i) => (
        <FloatingCan
          key={i}
          index={i}
          x={pos.x}
          y={pos.y}
          delay={i * 0.4}
          duration={4 + (i % 4)}
          opacity={0.06 + (i % 5) * 0.01}
          rotation={-20 + (i * 29) % 40}
          scale={0.8 + (i % 3) * 0.2}
        />
      ))}
    </div>
  );
}
