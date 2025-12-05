import { useState } from "react";
import GeometricPatternBackground from "@/components/GeometricPatternBackground";
import Header from "./components/Header";
import SourceToggle from "./components/SourceToggle";
import AssetSelector from "./components/AssetSelector";
import ActionButtons from "./components/ActionButtons";
import { useChromeAPI } from "./hooks/useChromeAPI";
import type { SourceType, AssetType } from "./types";

export default function App() {
  const [sourceType, setSourceType] = useState<SourceType>("web");
  const [selectedAsset, setSelectedAsset] = useState<AssetType>(null);
  const [isScanning, setIsScanning] = useState(false);

  const { scanCurrentPage, sendMessageToBackground } = useChromeAPI();

  const handleScanPage = async () => {
    if (isScanning) return;

    setIsScanning(true);
    try {
      const result = await scanCurrentPage();
      await sendMessageToBackground({
        action: "scanPage",
        text: result.text,
        tab: result.tab,
      });
    } catch (error) {
      console.error("Error scanning page:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleProfileClick = () => {
    // TODO: Implement profile functionality
    console.log("Profile clicked");
  };

  const handleCollection = () => {
    // TODO: Implement collection functionality
    console.log("Collection clicked");
  };

  const isActionDisabled = !selectedAsset || isScanning;

  return (
    <div
      className="relative bg-[#0C1232] text-white overflow-hidden"
      style={{ minHeight: "600px", width: "400px" }}
    >
      {/* Particle Background */}
      {/* <ParticleBackground /> */}

      {/* Aurora/Northern Lights Effect */}
      {/* <AuroraBackground /> */}

      {/* Geometric Pattern */}
      <GeometricPatternBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Row 1: Header */}
        <Header onProfileClick={handleProfileClick} />

        {/* Row 2: Source Section */}
        <SourceToggle
          sourceType={sourceType}
          onSourceTypeChange={setSourceType}
        />

        {/* Row 3: Asset Selection */}
        <AssetSelector
          sourceType={sourceType}
          selectedAsset={selectedAsset}
          onAssetSelect={setSelectedAsset}
        />

        {/* Row 4: Main Action Buttons */}
        <ActionButtons
          onContextualize={handleScanPage}
          onCollection={handleCollection}
          disabled={isActionDisabled}
        />
      </div>
    </div>
  );
}
