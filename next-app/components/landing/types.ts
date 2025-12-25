/**
 * Type definitions for the landing page components
 */

/**
 * Represents a chat message in the animated mockup
 */
export interface ChatMessage {
  /** The message text content */
  text: string;
  /** The sender type - 'user' or 'assistant' */
  type: "user" | "assistant";
}

/**
 * Configuration for a feature card
 */
export interface Feature {
  /** SVG icon to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Configuration for trust indicators
 */
export interface TrustIndicator {
  /** SVG icon to display */
  icon: React.ReactNode;
  /** Text label to display */
  label: string;
  /** Short label for mobile */
  shortLabel: string;
}
