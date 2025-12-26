/**
 * HeroSection Component
 *
 * Main hero section containing badge, headline, subheading, CTA buttons,
 * and trust indicators.
 *
 * Features:
 * - Fade-in animation on mount
 * - Gradient text animation
 * - Responsive typography
 * - Hover effects on buttons
 * - Trust indicators with icons
 *
 * @param isLoaded - Whether the component has loaded
 * @returns Hero section component
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  isLoaded: boolean;
}

export function HeroSection({ isLoaded }: HeroSectionProps) {
  const router = useRouter();
  return (
    <section className="relative flex flex-col items-center justify-center py-16 sm:py-20 pt-24">
      <div className="max-w-5xl mx-auto px-6 text-center w-full">
        <div
          className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <Badge />

          {/* Main heading */}
          <Headline />

          {/* Subheading */}
          <Subheading />

          {/* CTA Buttons */}
          <CTAButtons router={router} />

          {/* Trust/feature indicators */}
          <TrustIndicators />
        </div>
      </div>
    </section>
  );
}

/**
 * Badge Component
 * Small badge showing tagline with animated pulse
 */
function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors cursor-default">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span className="text-sm text-muted-foreground">
        Capture context. Chat with clarity.
      </span>
    </div>
  );
}

/**
 * Headline Component
 * Main heading with animated gradient text
 */
function Headline() {
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight px-2">
      <span className="block">
        Your Knowledge,{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-gradient-animate">
          Organized
        </span>
      </span>
      <span className="block mt-2">Accessible & Actionable</span>
    </h1>
  );
}

/**
 * Subheading Component
 * Supporting description text
 */
function Subheading() {
  return (
    <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
      Seamlessly collect, organize, and chat with your digital context. Turn
      scattered information into coherent conversations.
    </p>
  );
}

/**
 * CTAButtons Component
 * Primary and secondary action buttons
 */
function CTAButtons({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4">
      <Button
        asChild
        size="lg"
        className="group relative overflow-hidden brand-shadow-lg hover:scale-105 transition-all duration-300 w-full sm:w-auto"
      >
        <div className="cursor-pointer" onClick={() => router.push("/sign-up")}>
          <span className="relative z-10 flex items-center gap-2">
            Start Exploring
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>
      </Button>
      {/* <Button */}
      {/*   asChild */}
      {/*   size="lg" */}
      {/*   variant="outline" */}
      {/*   className="border-border/50 hover:bg-card/50 hover:border-primary/50 transition-all duration-300 w-full sm:w-auto" */}
      {/* > */}
      {/*   <Link href="/chat">Try Demo</Link> */}
      {/* </Button> */}
    </div>
  );
}

/**
 * TrustIndicators Component
 * Small icons showing key features/benefits
 */
function TrustIndicators() {
  const indicators = [
    {
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      label: "Private by default",
      shortLabel: "Private",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      label: "Instant access",
      shortLabel: "Fast",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 pt-6 sm:pt-8 text-xs sm:text-sm text-muted-foreground">
      {indicators.map((indicator, i) => (
        <div key={i} className="flex items-center gap-1.5 sm:gap-2">
          {indicator.icon}
          <span className="hidden sm:inline">{indicator.label}</span>
          <span className="sm:hidden">{indicator.shortLabel}</span>
        </div>
      ))}
    </div>
  );
}
