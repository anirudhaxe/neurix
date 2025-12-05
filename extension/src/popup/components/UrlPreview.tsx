import { useState, useEffect } from "react";
import { useChromeAPI } from "../hooks/useChromeAPI";

export default function UrlPreview() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { getActiveTab } = useChromeAPI();

  useEffect(() => {
    const fetchCurrentUrl = async () => {
      try {
        const tab = await getActiveTab();
        setCurrentUrl(tab.url || "");
      } catch (error) {
        console.error("Error fetching current URL:", error);
        setCurrentUrl("Unknown URL");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUrl();
  }, [getActiveTab]);

  const formatUrl = (url: string): string => {
    if (!url) return "";

    try {
      const urlObj = new URL(url);
      let displayUrl = urlObj.hostname + urlObj.pathname;

      // If pathname is too long, truncate it
      if (displayUrl.length > 40) {
        const parts = displayUrl.split("/");
        if (parts.length > 2) {
          displayUrl = parts[0] + "/.../" + parts[parts.length - 1];
        } else {
          displayUrl = displayUrl.substring(0, 37) + "...";
        }
      }

      return displayUrl;
    } catch {
      // Fallback for invalid URLs
      return url.replace(/^https?:\/\//, "").substring(0, 40);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
          <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-lg p-3 border border-slate-600/40 backdrop-blur-sm">
        <div className="space-y-1">
          {/* First row - Heading */}
          <p className="text-xs text-gray-400">
            Text will be Contextualized from:
          </p>

          {/* Second row - Pulse and URL */}
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2 flex-shrink-0"></div>
            <span className="text-sm text-cyan-300 font-medium truncate block">
              {formatUrl(currentUrl)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
