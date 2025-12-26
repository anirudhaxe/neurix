/**
 * FeaturesSection Component
 *
 * Displays key features of OpenContext in a grid of interactive cards.
 * Features hover effects, icons, and responsive layout.
 *
 * Features:
 * - 3 feature cards with icons
 * - Hover animations (scale, border, gradient)
 * - Responsive grid layout (1-3 columns)
 * - Descriptive content for each feature
 *
 * @returns Features section with grid of cards
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Feature } from "./types";

/**
 * Feature configuration data
 * Centralized for easy maintenance
 */
const FEATURES: Feature[] = [
  {
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    title: "Capture Anywhere",
    description:
      "Instantly collect and organize content from across the web. Save articles, videos, and more with our browser extension.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
    title: "Organize Intelligently",
    description:
      "Automatic tagging and categorization keep your context library structured and searchable.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    title: "Chat with Context",
    description:
      "Select multiple contexts and engage in conversations that draw from your curated knowledge base.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FeaturesHeader />

        {/* Features grid */}
        <FeaturesGrid />
      </div>
    </section>
  );
}

/**
 * FeaturesHeader Component
 * Section title and description
 */
function FeaturesHeader() {
  return (
    <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
        Multimodal Context Processing
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
        Everything you need to capture, organize, and interact with your digital
        knowledge.
      </p>
    </div>
  );
}

/**
 * FeaturesGrid Component
 * Grid of feature cards
 */
function FeaturesGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
      {FEATURES.map((feature, i) => (
        <FeatureCard key={i} feature={feature} index={i} />
      ))}
    </div>
  );
}

/**
 * FeatureCard Component
 * Individual feature card with icon, title, and description
 */
function FeatureCard({ feature }: { feature: Feature; index: number }) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/40 hover:bg-card/60 transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]">
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Icon with background */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <div className="text-primary">{feature.icon}</div>
        </div>

        {/* Feature title */}
        <h3 className="text-base sm:text-lg font-semibold">{feature.title}</h3>

        {/* Feature description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
