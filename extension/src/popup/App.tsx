import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";

export default function App() {
  const [activeTab, setActiveTab] = useState<"page" | "link" | "file">("page");

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
        {/* Header */}
        <header className="p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold gradient-text pt-2">Neurix</h1>
            </div>
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex p-4 space-x-2 border-b border-[rgba(255,255,255,0.1)]">
          <button
            onClick={() => setActiveTab("page")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "page"
                ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white"
                : "text-[#9ca3af] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            Scan Current Page
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "link"
                ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white"
                : "text-[#9ca3af] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            Scan Link
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "file"
                ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white"
                : "text-[#9ca3af] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            Upload File
          </button>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto hide-scrollbar">
          {activeTab === "page" && (
            <div className="space-y-6">
               {/* Welcome Section */}
               <div className="text-center py-8">
                 {/* <h2 className="text-3xl font-bold mb-4 gradient-text"> */}
                 {/*   Welcome to Neurix */}
                 {/* </h2> */}
                 <p className="text-[#9ca3af] text-lg mb-4">Scan the current page</p>
                 <button
                   onClick={handleScanPage}
                   className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                 >
                   Scan Page
                 </button>
               </div>

              {/* Quick Actions */}
              {/* <div className="grid grid-cols-2 gap-4"> */}
              {/*   <button className="card p-4 text-left hover:scale-105 transition-transform"> */}
              {/*     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-3"> */}
              {/*       <svg */}
              {/*         className="w-6 h-6 text-white" */}
              {/*         fill="none" */}
              {/*         stroke="currentColor" */}
              {/*         viewBox="0 0 24 24" */}
              {/*       > */}
              {/*         <path */}
              {/*           strokeLinecap="round" */}
              {/*           strokeLinejoin="round" */}
              {/*           strokeWidth={2} */}
              {/*           d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" */}
              {/*         /> */}
              {/*       </svg> */}
              {/*     </div> */}
              {/*     <h3 className="font-semibold mb-1">Smart Insights</h3> */}
              {/*     <p className="text-sm text-[#9ca3af]"> */}
              {/*       Get AI-powered content analysis */}
              {/*     </p> */}
              {/*   </button> */}
              {/**/}
              {/*   <button className="card p-4 text-left hover:scale-105 transition-transform"> */}
              {/*     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center mb-3"> */}
              {/*       <svg */}
              {/*         className="w-6 h-6 text-white" */}
              {/*         fill="none" */}
              {/*         stroke="currentColor" */}
              {/*         viewBox="0 0 24 24" */}
              {/*       > */}
              {/*         <path */}
              {/*           strokeLinecap="round" */}
              {/*           strokeLinejoin="round" */}
              {/*           strokeWidth={2} */}
              {/*           d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" */}
              {/*         /> */}
              {/*       </svg> */}
              {/*     </div> */}
              {/*     <h3 className="font-semibold mb-1">Quick Actions</h3> */}
              {/*     <p className="text-sm text-[#9ca3af]"> */}
              {/*       Customize your workflow */}
              {/*     </p> */}
              {/*   </button> */}
              {/**/}
              {/*   <button className="card p-4 text-left hover:scale-105 transition-transform"> */}
              {/*     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-3"> */}
              {/*       <svg */}
              {/*         className="w-6 h-6 text-white" */}
              {/*         fill="none" */}
              {/*         stroke="currentColor" */}
              {/*         viewBox="0 0 24 24" */}
              {/*       > */}
              {/*         <path */}
              {/*           strokeLinecap="round" */}
              {/*           strokeLinejoin="round" */}
              {/*           strokeWidth={2} */}
              {/*           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" */}
              {/*         /> */}
              {/*       </svg> */}
              {/*     </div> */}
              {/*     <h3 className="font-semibold mb-1">Analytics</h3> */}
              {/*     <p className="text-sm text-[#9ca3af]"> */}
              {/*       Track your productivity */}
              {/*     </p> */}
              {/*   </button> */}
              {/**/}
              {/*   <button className="card p-4 text-left hover:scale-105 transition-transform"> */}
              {/*     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center mb-3"> */}
              {/*       <svg */}
              {/*         className="w-6 h-6 text-white" */}
              {/*         fill="none" */}
              {/*         stroke="currentColor" */}
              {/*         viewBox="0 0 24 24" */}
              {/*       > */}
              {/*         <path */}
              {/*           strokeLinecap="round" */}
              {/*           strokeLinejoin="round" */}
              {/*           strokeWidth={2} */}
              {/*           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" */}
              {/*         /> */}
              {/*         <path */}
              {/*           strokeLinecap="round" */}
              {/*           strokeLinejoin="round" */}
              {/*           strokeWidth={2} */}
              {/*           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" */}
              {/*         /> */}
              {/*       </svg> */}
              {/*     </div> */}
              {/*     <h3 className="font-semibold mb-1">Settings</h3> */}
              {/*     <p className="text-sm text-[#9ca3af]"> */}
              {/*       Personalize your experience */}
              {/*     </p> */}
              {/*   </button> */}
              {/* </div> */}
              {/**/}
              {/* Status Card */}
              {/* <div className="card p-4"> */}
              {/*   <div className="flex items-center justify-between mb-3"> */}
              {/*     <h3 className="font-semibold">Extension Status</h3> */}
              {/*     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> */}
              {/*   </div> */}
              {/*   <p className="text-sm text-[#9ca3af] mb-3"> */}
              {/*     All systems operational */}
              {/*   </p> */}
              {/*   <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2"> */}
              {/*     <div */}
              {/*       className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-2 rounded-full" */}
              {/*       style={{ width: "75%" }} */}
              {/*     ></div> */}
              {/*   </div> */}
              {/* </div> */}
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                Settings
              </h2>

              <div className="space-y-4">
                <div className="card p-4">
                  <h3 className="font-semibold mb-3">Appearance</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <div className="w-12 h-6 bg-[#6366f1] rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Animations</span>
                      <div className="w-12 h-6 bg-[#6366f1] rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="font-semibold mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Enable Notifications</span>
                      <div className="w-12 h-6 bg-[rgba(255,255,255,0.2)] rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Sound Effects</span>
                      <div className="w-12 h-6 bg-[rgba(255,255,255,0.2)] rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "file" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 gradient-text">About</h2>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Neurix Extension</h3>
                <p className="text-[#9ca3af] mb-4">Version 1.0.0</p>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  A powerful Chrome extension designed to enhance your browsing
                  experience with intelligent features and beautiful design.
                </p>
              </div>

              <div className="card p-4">
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-[#9ca3af]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] mr-3"></div>
                    Smart content analysis
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] mr-3"></div>
                    Productivity tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] mr-3"></div>
                    Customizable workflows
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] mr-3"></div>
                    Beautiful dark interface
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
