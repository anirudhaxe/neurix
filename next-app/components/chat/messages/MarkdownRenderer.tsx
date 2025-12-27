"use client";

import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

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
    return DOMPurify.sanitize(rawHtml);
  }, [content]);

  return (
    <div
      className={`markdown-content prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
