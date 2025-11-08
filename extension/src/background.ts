// Background service worker for the extension
console.log("[CRXJS] Background service worker loaded");

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "scanPage") {
    try {
      // Send to API
      const response = await fetch(
        "http://localhost:3000/api/extensions/browser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message.text }),
        },
      );

      if (response.ok) {
        console.log("Text sent to API successfully");
      } else {
        console.error("Failed to send text to API");
      }
    } catch (error) {
      console.error("Error sending to API:", error);
    }
  }
});
