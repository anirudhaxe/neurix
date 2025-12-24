import { useState, useEffect } from "react";
import GeometricPatternBackground from "@/components/GeometricPatternBackground";
import Header from "./components/Header";
import SourceToggle from "./components/SourceToggle";
import AssetSelector from "./components/AssetSelector";
import UrlPreview from "./components/UrlPreview";
import ActionButtons from "./components/ActionButtons";
import Login from "./components/Login";
import DocumentComingSoon from "./components/DocumentComingSoon";
import { useChromeAPI } from "./hooks/useChromeAPI";
import { Loader2 } from "lucide-react";
import type { SourceType, AssetType } from "./types";
import { useSession } from "@/lib/auth/auth-client";

export default function App() {
  const [sourceType, setSourceType] = useState<SourceType>("web");
  const [selectedAsset, setSelectedAsset] = useState<AssetType>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const { data, isPending } = useSession();

  const { scanCurrentPage, sendMessageToBackground, getActiveTab } = useChromeAPI();

  // Check if current URL is a YouTube video being watched
  const isYouTubeUrl = currentUrl.includes("youtube.com/watch") || currentUrl.includes("youtu.be/");

  // Get current URL on component mount
  useEffect(() => {
    const getCurrentUrl = async () => {
      try {
        const tab = await getActiveTab();
        setCurrentUrl(tab.url || "");
      } catch (error) {
        console.error("Error getting current URL:", error);
      }
    };

    getCurrentUrl();
  }, [getActiveTab]);

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

  const isActionDisabled =
    sourceType === "document" ? true : !selectedAsset || isScanning;

  if (isPending) {
    return (
      <div
        className="relative bg-[#0a1929] text-white overflow-hidden"
        style={{ minHeight: "600px", width: "400px" }}
      >
        <GeometricPatternBackground />
        <div className="relative z-10 flex flex-col h-screen justify-center items-center p-6">
          <div className="text-center">
            <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DB5CF] mx-auto mb-4" />
            <p className="text-gray-300">Just a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.user?.id) {
    return <Login />;
  }

  return (
    <div
      className="relative bg-[#0a1929] text-white overflow-hidden"
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

        {/* Row 3: Asset Selection or Document Message */}
        {sourceType === "document" ? (
          <DocumentComingSoon />
        ) : (
          <>
            <AssetSelector
              sourceType={sourceType}
              selectedAsset={selectedAsset}
              onAssetSelect={setSelectedAsset}
              isYouTubeUrl={isYouTubeUrl}
            />

            {/* Row 4: URL Preview */}
            <UrlPreview />
          </>
        )}

        {/* Row 5: Main Action Buttons */}
        <ActionButtons
          onContextualize={handleScanPage}
          onCollection={handleCollection}
          disabled={isActionDisabled}
        />
      </div>
    </div>
  );
}
