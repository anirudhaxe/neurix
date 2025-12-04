import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";

export default function App() {
  const [webSource, setWebSource] = useState(true);
  const [documentSource, setDocumentSource] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<"txt" | "video" | "doc" | null>(null);

  const handleScanPage = async () => {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) return;

      // Execute script to extract text
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });

      const text = results[0].result;

      // Send to background
      chrome.runtime.sendMessage({ action: 'scanPage', text });
    } catch (error) {
      console.error('Error scanning page:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div
        className="relative z-10 flex flex-col h-screen"
        style={{ minHeight: "600px", width: "400px" }}
      >
        {/* Row 1: Header */}
        <header className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            {/* Logo on top left */}
            <div className="flex items-center">
              <img 
                src="/dark-logo.png" 
                alt="Neurix" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Profile icon on top right */}
            <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
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
        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <h3 className="text-sm font-medium text-[#9ca3af] mb-3">Source</h3>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label 
                htmlFor="web-switch"
                className="text-sm font-medium cursor-pointer"
              >
                Web
              </label>
              <button
                id="web-switch"
                onClick={() => {
                  setWebSource(!webSource);
                  if (!webSource) setDocumentSource(false);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  webSource ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'bg-[rgba(255,255,255,0.2)]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    webSource ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <label 
                htmlFor="document-switch"
                className="text-sm font-medium cursor-pointer"
              >
                Document
              </label>
              <button
                id="document-switch"
                onClick={() => {
                  setDocumentSource(!documentSource);
                  if (!documentSource) setWebSource(false);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  documentSource ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'bg-[rgba(255,255,255,0.2)]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    documentSource ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Asset Selection */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex justify-center space-x-4">
            {/* TXT Asset */}
            <button
              onClick={() => setSelectedAsset('txt')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAsset === 'txt'
                  ? 'border-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-[rgba(99,102,241,0.1)]'
                  : 'border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#6366f1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <p className="text-xs mt-2 text-[#9ca3af]">TXT</p>
            </button>

            {/* Video Asset */}
            <button
              onClick={() => setSelectedAsset('video')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAsset === 'video'
                  ? 'border-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-[rgba(99,102,241,0.1)]'
                  : 'border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#8b5cf6]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                </svg>
              </div>
              <p className="text-xs mt-2 text-[#9ca3af]">Video</p>
            </button>

            {/* Document Asset */}
            <button
              onClick={() => setSelectedAsset('doc')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAsset === 'doc'
                  ? 'border-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-[rgba(99,102,241,0.1)]'
                  : 'border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)]'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#a78bfa]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,12H16V14H8V12M8,16H13V18H8V16Z" />
                </svg>
              </div>
              <p className="text-xs mt-2 text-[#9ca3af]">Doc</p>
            </button>
          </div>
        </div>

        {/* Row 4: Main Action Buttons */}
        <div className="flex-1 p-4 flex items-end">
          <div className="flex w-full space-x-3">
            {/* Contextualize Button - 3/4 width */}
            <button
              onClick={handleScanPage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              + Contextualize
            </button>
            
            {/* Collection Button - 1/4 width */}
            <button className="w-16 h-12 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition-colors flex items-center justify-center">
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
