import type { ChromeTab, ScanPageResult } from "../types";

export function useChromeAPI() {
  const scanCurrentPage = async (): Promise<ScanPageResult> => {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      
      if (!tab.id) {
        throw new Error("No active tab found");
      }

      // Execute script to extract text
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });

      const text = results[0]?.result || "";
      
      return {
        text,
        tab: {
          id: tab.id,
          url: tab.url,
          title: tab.title,
        },
      };
    } catch (error) {
      console.error("Error scanning page:", error);
      throw error;
    }
  };

  const sendMessageToBackground = async (message: {
    action: string;
    [key: string]: any;
  }) => {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error("Error sending message to background:", error);
      throw error;
    }
  };

  const getActiveTab = async (): Promise<ChromeTab> => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      
      return {
        id: tab.id,
        url: tab.url,
        title: tab.title,
      };
    } catch (error) {
      console.error("Error getting active tab:", error);
      throw error;
    }
  };

  return {
    scanCurrentPage,
    sendMessageToBackground,
    getActiveTab,
  };
}