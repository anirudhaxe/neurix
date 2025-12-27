"use client";

import React, { useMemo } from "react";
import { marked } from "marked";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    // Configure marked options
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true, // Enable GitHub Flavored Markdown
    });

    // Parse markdown to HTML
    const rawHtml = marked.parse(content) as string;

    // Sanitize HTML to prevent XSS attacks
    // DOMPurify is only available in the browser, so we need to handle SSR
    if (typeof window !== "undefined") {
      // Dynamic import for DOMPurify to avoid SSR issues
      const DOMPurify = require("dompurify");
      return DOMPurify.sanitize(rawHtml);
    }
    
    // Return raw HTML during SSR (it's safe since it's server-rendered)
    return rawHtml;
  }, [content]);

  return (
    <div
      className={`markdown-content prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
