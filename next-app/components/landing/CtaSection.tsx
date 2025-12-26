/**
 * CtaSection Component
 *
 * Call-to-action section encouraging users to sign up.
 * Features a gradient background and prominent CTA button.
 *
 * Features:
 * - Subtle gradient background
 * - Centered content layout
 * - Shimmer effect on button
 * - Responsive typography
 *
 * @returns Call-to-action section
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CtaSection() {
  const router = useRouter();
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-3xl mx-auto text-center relative px-4">
        <div className="space-y-4 sm:space-y-6">
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Ready to organize your knowledge?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Use OpenContext to make sense of information overload.
          </p>

          {/* CTA Button with shimmer effect */}
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden brand-shadow-lg hover:scale-105 transition-all duration-300 w-full sm:w-auto cursor-pointer"
            onClick={() => router.push("/sign-up")}
          >
            <div>
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
