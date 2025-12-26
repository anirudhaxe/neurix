/**
 * Footer Component
 *
 * Simple footer with logo and copyright information.
 *
 * Features:
 * - Logo with hover effect
 * - Responsive flex layout
 * - Minimal design
 * - Separated from main content with border
 *
 * @returns Footer component
 */

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex-shrink-0">
            <Image
              src="/logo.png"
              alt="OpenContext"
              width={28}
              height={28}
              className="transition-transform group-hover:scale-110"
            />
          </div>
          <span className="font-semibold text-sm">OpenContext</span>
        </Link>

        {/* Copyright notice */}
        <p className="text-xs sm:text-sm text-muted-foreground">
          © 2025 OpenContext. All rights reserved.
        </p>
      </div>
    </footer>
  );
}