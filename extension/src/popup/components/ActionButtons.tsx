import type { ActionButtonsProps } from "../types";

export default function ActionButtons({
  onContextualize,
  onCollection,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex-1 p-3 flex items-end">
      <div className="flex w-full space-x-2">
        {/* Contextualize Button - 3/4 width */}
        <button
          onClick={onContextualize}
          disabled={disabled}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#4DB5CF] via-[#3da3bd] to-[#2d9ab1] text-white rounded-lg font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-200 border border-cyan-400/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          + Contextualize
        </button>

        {/* Collection Button - 1/4 width */}
        <button
          onClick={onCollection}
          disabled={disabled}
          className="w-14 h-10 bg-[rgba(77,181,207,0.1)] border border-[rgba(77,181,207,0.3)] rounded-lg hover:bg-[rgba(77,181,207,0.2)] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(77,181,207,0.1)]"
          aria-label="Collection"
          style={{ overflow: "visible", padding: "8px" }}
        >
          <svg
            className="w-4 h-4 text-[#4DB5CF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
