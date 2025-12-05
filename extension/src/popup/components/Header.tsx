import type { HeaderProps } from "../types";

export default function Header({ onProfileClick }: HeaderProps) {
  return (
    <header className="p-3 border-b border-[rgba(77,181,207,0.2)]">
      <div className="flex items-center justify-between">
        {/* Logo on top left */}
        <div className="flex items-center">
          <img src="/dark-logo.png" alt="OpenContext" className="h-7 w-auto" />
        </div>

        {/* Profile icon on top right */}
        <button
          onClick={onProfileClick}
          className="p-1.5 rounded-lg hover:bg-[rgba(77,181,207,0.1)] transition-colors"
          aria-label="Profile"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

