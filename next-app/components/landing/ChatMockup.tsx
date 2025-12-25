/**
 * ChatMockup Component
 *
 * Animated chat interface mockup demonstrating the OpenContext chat feature.
 * Features realistic typing animation.
 *
 * Features:
 * - Character-by-character typing animation
 * - Auto-looping conversation with 4 messages
 * - Typing indicator with bouncing dots
 * - Floating icons around the interface
 * - Responsive design
 *
 * @param isLoaded - Whether the component has loaded
 * @returns Animated chat mockup
 */

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChatMessage } from "./types";

/**
 * Animated conversation messages
 * Cycles through these 4 messages to demonstrate chat functionality
 */
const ANIMATED_MESSAGES: ChatMessage[] = [
  { text: "How do neural networks learn?", type: "user" },
  {
    text: "Neural networks learn through backpropagation. They adjust weights based on error signals from predictions.",
    type: "assistant",
  },
  { text: "Can you explain it simply?", type: "user" },
  {
    text: "Think of it like teaching a child. When they make a mistake, you correct them and they learn from it.",
    type: "assistant",
  },
];

interface ChatMockupProps {
  isLoaded: boolean;
}

export function ChatMockup({ isLoaded }: ChatMockupProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Typing animation effect
   * Displays current message character by character, then waits and moves to next
   */
  useEffect(() => {
    if (currentMessageIndex < ANIMATED_MESSAGES.length) {
      const currentMessage = ANIMATED_MESSAGES[currentMessageIndex];
      let charIndex = 0;

      /**
       * Types one character at a time
       */
      const typeNextChar = () => {
        if (charIndex < currentMessage.text.length) {
          setDisplayedText(currentMessage.text.slice(0, charIndex + 1));
          charIndex++;
          typingTimeoutRef.current = setTimeout(typeNextChar, 30);
        } else {
          // Message complete, wait 2.5s then move to next
          typingTimeoutRef.current = setTimeout(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % ANIMATED_MESSAGES.length);
            setDisplayedText("");
          }, 2500);
        }
      };

      // Start typing immediately
      typeNextChar();
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentMessageIndex]);

  return (
    <div
      className={`mt-8 sm:mt-10 relative transition-all duration-1000 delay-300 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
        {/* Main chat interface */}
        <ChatInterface
          currentMessageIndex={currentMessageIndex}
          displayedText={displayedText}
        />

        {/* Floating icon badges */}
        <FloatingIcons />
      </div>
    </div>
  );
}

/**
 * ChatInterface Component
 * The main chat container with header, messages, and input
 */
function ChatInterface({
  currentMessageIndex,
  displayedText,
}: {
  currentMessageIndex: number;
  displayedText: string;
}) {
  const currentMessage = ANIMATED_MESSAGES[currentMessageIndex];

  return (
    <div className="aspect-[4/3] sm:aspect-video rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm brand-shadow-lg overflow-hidden">
      {/* Window header with logo */}
      <ChatHeader />

      {/* Messages container */}
      <div className="p-3 sm:p-4 h-[calc(100%-3.5rem)] overflow-hidden flex flex-col gap-2.5 sm:gap-3">
        {/* Previously displayed messages */}
        {ANIMATED_MESSAGES.slice(0, currentMessageIndex).map((msg, i) => (
          <ChatMessageBubble key={i} message={msg} />
        ))}

        {/* Currently typing message */}
        {displayedText ? (
          <ChatMessageBubble
            message={{
              text: displayedText,
              type: currentMessage.type,
            }}
            showCursor={true}
          />
        ) : (
          /* Typing indicator shown when starting new message */
          <TypingIndicator />
        )}

        {/* Spacer to push input to bottom */}
        <div className="flex-1" />

        {/* Input bar */}
        <ChatInput />
      </div>
    </div>
  );
}

/**
 * ChatHeader Component
 * Window-style header with dots and logo
 */
function ChatHeader() {
  return (
    <div className="border-b border-border/30 bg-card/30 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
      {/* Window control dots */}
      <div className="flex gap-1.5">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400/50" />
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400/50" />
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400/50" />
      </div>

      {/* Centered logo/title */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="OpenContext"
            width={14}
            height={14}
            className="rounded"
          />
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
            OpenContext Chat
          </span>
        </div>
      </div>

      {/* Spacer for alignment */}
      <div className="w-6 sm:w-8" />
    </div>
  );
}

/**
 * ChatMessageBubble Component
 * Individual message bubble in the chat
 */
function ChatMessageBubble({
  message,
  showCursor = false,
}: {
  message: ChatMessage;
  showCursor?: boolean;
}) {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        <span className="break-words">{message.text}</span>
        {/* Blinking cursor for currently typing message */}
        {showCursor && (
          <span className="inline-block w-1 h-4 ml-0.5 bg-current animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}

/**
 * TypingIndicator Component
 * Shows three bouncing dots when waiting for response
 */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl rounded-bl-md">
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" />
          <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce delay-100" />
          <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * ChatInput Component
 * Input bar at bottom of chat interface
 */
function ChatInput() {
  return (
    <div className="border border-border/30 bg-card/50 rounded-lg flex items-center gap-2 px-2.5 py-2 sm:px-3">
      <Image
        src="/logo.png"
        alt="Avatar"
        width={18}
        height={18}
        className="rounded-full"
      />
      <div className="flex-1 h-1.5 sm:h-2 bg-border/30 rounded-full" />
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-primary/20 flex items-center justify-center">
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * FloatingIcons Component
 * Decorative icons floating around the chat interface
 */
function FloatingIcons() {
  return (
    <>
      {/* Chat bubble icon - top right */}
      <div className="hidden sm:flex absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 items-center justify-center animate-bounce-slow">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      {/* Folder icon - bottom left */}
      <div className="hidden sm:flex absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 items-center justify-center animate-bounce-slow delay-700">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
    </>
  );
}
