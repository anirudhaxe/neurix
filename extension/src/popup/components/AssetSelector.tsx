import { useEffect } from "react";
import type { AssetSelectorProps } from "../types";

interface AssetButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  label: string;
  color: string;
}

function AssetButton({
  isSelected,
  onClick,
  icon,
  label,
  color,
}: AssetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? "border-[#2196F3] bg-[rgba(33,150,243,0.1)]"
          : "border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]"
      }`}
      aria-pressed={isSelected}
      role="radio"
      name="asset-type"
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <div className={color}>{icon}</div>
      </div>
      <p className="text-xs mt-1 text-[#9ca3af]">{label}</p>
    </button>
  );
}

export default function AssetSelector({
  sourceType,
  selectedAsset,
  onAssetSelect,
}: AssetSelectorProps) {
  const assets =
    sourceType === "web"
      ? [
          {
            type: "txt" as const,
            label: "TXT",
            color: "text-[#2196F3]",
            icon: (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            ),
          },
          {
            type: "video" as const,
            label: "Video",
            color: "text-[#1976D2]",
            icon: (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
              </svg>
            ),
          },
        ]
      : [
          {
            type: "doc" as const,
            label: "Doc",
            color: "text-[#1565C0]",
            icon: (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,12H16V14H8V12M8,16H13V18H8V16Z" />
              </svg>
            ),
          },
        ];

  // select a default asset type based on the source type
  useEffect(() => {
    if (sourceType === "web") {
      onAssetSelect("txt");
    } else {
      onAssetSelect("doc");
    }

    return () => {
      return;
    };
  }, [sourceType]);

  return (
    <div className="p-3 border-b border-[rgba(33,150,243,0.2)]">
      <div className="flex justify-center space-x-3">
        {assets.map((asset) => (
          <AssetButton
            key={asset.type}
            isSelected={selectedAsset === asset.type}
            onClick={() => onAssetSelect(asset.type)}
            icon={asset.icon}
            label={asset.label}
            color={asset.color}
          />
        ))}
      </div>
    </div>
  );
}

