import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";

export default function App() {
  const [sourceType, setSourceType] = useState<"web" | "document">("web");
  const [selectedAsset, setSelectedAsset] = useState<
    "txt" | "video" | "doc" | null
  >(null);

  const handleScanPage = async () => {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) return;

      // Execute script to extract text
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });

      const text = results[0].result;

      // Send to background
      chrome.runtime.sendMessage({ action: "scanPage", text });
    } catch (error) {
      console.error("Error scanning page:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0C1232] text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div
        className="relative z-10 flex flex-col h-screen"
        style={{ minHeight: "600px", width: "400px" }}
      >
        {/* Row 1: Header */}
        <header className="p-4 border-b border-[rgba(33,150,243,0.2)]">
          <div className="flex items-center justify-between">
            {/* Logo on top left */}
            <div className="flex items-center">
              <img src="/dark-logo.png" alt="Neurix" className="h-8 w-auto" />
            </div>

            {/* Profile icon on top right */}
            <button className="p-2 rounded-lg hover:bg-[rgba(33,150,243,0.1)] transition-colors">
              <svg
                className="w-5 h-5"
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

        {/* Row 2: Source Section */}
        <div className="p-4 border-b border-[rgba(33,150,243,0.2)]">
          <h3 className="text-sm font-medium text-[#9ca3af] mb-3">Source</h3>
          <div className="flex items-center justify-center">
            <div className="relative flex items-center bg-[rgba(33,150,243,0.1)] rounded-full p-1">
              {/* Sliding indicator */}
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] rounded-full transition-all duration-300 ease-out ${
                  sourceType === "web" ? "left-1" : "left-1/2"
                }`}
              />

              {/* Web Option */}
              <button
                onClick={() => setSourceType("web")}
                className={`relative z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  sourceType === "web"
                    ? "text-white"
                    : "text-[#9ca3af] hover:text-white"
                }`}
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span>Website</span>
              </button>

              {/* Document Option */}
              <button
                onClick={() => setSourceType("document")}
                className={`relative z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  sourceType === "document"
                    ? "text-white"
                    : "text-[#9ca3af] hover:text-white"
                }`}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Asset Selection */}
        <div className="p-4 border-b border-[rgba(33,150,243,0.2)]">
          <div className="flex justify-center space-x-4">
            {/* TXT Asset */}
            <button
              onClick={() => setSelectedAsset("txt")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAsset === "txt"
                  ? "border-[#2196F3] bg-[rgba(33,150,243,0.1)]"
                  : "border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#2196F3]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <p className="text-xs mt-1 text-[#9ca3af]">TXT</p>
            </button>

            {/* Video Asset */}
            <button
              onClick={() => setSelectedAsset("video")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAsset === "video"
                  ? "border-[#2196F3] bg-[rgba(33,150,243,0.1)]"
                  : "border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#1976D2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                </svg>
              </div>
              <p className="text-xs mt-1 text-[#9ca3af]">Video</p>
            </button>

            {/* Document Asset */}
            <button
              onClick={() => setSelectedAsset("doc")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAsset === "doc"
                  ? "border-[#2196F3] bg-[rgba(33,150,243,0.1)]"
                  : "border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#1565C0]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,12H16V14H8V12M8,16H13V18H8V16Z" />
                </svg>
              </div>
              <p className="text-xs mt-1 text-[#9ca3af]">Doc</p>
            </button>
          </div>
        </div>

        {/* Row 4: Main Action Buttons */}
        <div className="flex-1 p-4 flex items-end">
          <div className="flex w-full space-x-3">
            {/* Contextualize Button - 3/4 width */}
            <button
              onClick={handleScanPage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + Contextualize
            </button>

            {/* Collection Button - 1/4 width */}
            <button className="w-16 h-12 bg-[rgba(33,150,243,0.1)] border border-[rgba(33,150,243,0.3)] rounded-lg hover:bg-[rgba(33,150,243,0.2)] transition-colors flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#9ca3af]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
      </div>
    </div>
  );
}
