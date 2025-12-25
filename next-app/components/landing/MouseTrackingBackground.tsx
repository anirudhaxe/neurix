/**
 * MouseTrackingBackground Component
 *
 * A subtle background gradient that follows mouse movement to create
 * an interactive and dynamic visual effect.
 *
 * Features:
 * - Smooth animation that follows cursor
 * - Subtle brand color gradient
 * - Minimal performance impact
 * - Fixed positioning to stay in viewport
 *
 * @returns The animated background div
 */

import React from "react";

interface MouseTrackingBackgroundProps {
  /** Current mouse X position (-0.5 to 0.5) */
  mouseX: number;
  /** Current mouse Y position (-0.5 to 0.5) */
  mouseY: number;
}

export function MouseTrackingBackground({
  mouseX,
  mouseY,
}: MouseTrackingBackgroundProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, oklch(0.72 0.18 200 / 0.1) 0%, transparent 50%)",
        transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)`,
        transition: "transform 0.3s ease-out",
      }}
    />
  );
}
