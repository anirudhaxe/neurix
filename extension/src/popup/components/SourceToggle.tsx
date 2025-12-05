import type { SourceToggleProps } from "../types";

export default function SourceToggle({
  sourceType,
  onSourceTypeChange,
}: SourceToggleProps) {
  return (
    <div className="p-3 border-b border-[rgba(77,181,207,0.2)]">
      <h3 className="text-xs font-medium text-[#9ca3af] mb-2">Source</h3>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center bg-[rgba(77,181,207,0.1)] rounded-full p-0.5">
          {/* Sliding indicator */}
          <div
            className={`absolute top-0.5 bottom-0.5 w-1/2 bg-gradient-to-r from-[#4DB5CF] to-[#3da3bd] rounded-full transition-all duration-300 ease-out ${
              sourceType === "web" ? "left-0.5" : "left-1/2"
            }`}
          />

          {/* Web Option */}
          <button
            onClick={() => onSourceTypeChange("web")}
            className={`relative z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              sourceType === "web"
                ? "text-white"
                : "text-[#9ca3af] hover:text-white"
            }`}
            aria-pressed={sourceType === "web"}
            role="radio"
            name="source-type"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span>Website</span>
          </button>

          {/* Document Option */}
          <button
            onClick={() => onSourceTypeChange("document")}
            className={`relative z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              sourceType === "document"
                ? "text-white"
                : "text-[#9ca3af] hover:text-white"
            }`}
            aria-pressed={sourceType === "document"}
            role="radio"
            name="source-type"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}