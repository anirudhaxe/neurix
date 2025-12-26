/**
 * FloatingParticles Component
 *
 * Creates subtle floating particle effects in the background to add
 * depth and visual interest to the landing page.
 *
 * Features:
 * - 6 particles with staggered animations
 * - Randomized positions and timing
 * - Floating animation with rotation
 * - Minimal visual impact
 *
 * @returns Container with floating particles
 */

import React from "react";

export function FloatingParticles() {
  // Configuration for particles
  const particleCount = 6;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20 animate-float"
          style={{
            // Stagger horizontal positions across the screen
            left: `${10 + i * 15}%`,
            // Distribute vertically in 3 rows
            top: `${20 + (i % 3) * 30}%`,
            // Stagger animation delays for natural movement
            animationDelay: `${i * 0.5}s`,
            // Vary animation durations for visual variety
            animationDuration: `${8 + i}s`,
          }}
        />
      ))}
    </div>
  );
}
