export type SourceType = "web" | "document";
export type AssetType = "txt" | "video" | "doc" | null;

export interface HeaderProps {
  onProfileClick?: () => void;
}

export interface SourceToggleProps {
  sourceType: SourceType;
  onSourceTypeChange: (type: SourceType) => void;
}

export interface AssetSelectorProps {
  sourceType: SourceType;
  selectedAsset: AssetType;
  onAssetSelect: (asset: AssetType) => void;
  isYouTubeUrl?: boolean;
}

export interface ActionButtonsProps {
  onContextualize: () => void;
  onCollection: () => void;
  disabled?: boolean;
}

export interface ChromeTab {
  id?: number;
  url?: string;
  title?: string;
}

export interface ScanPageResult {
  text: string;
  tab: ChromeTab;
}
