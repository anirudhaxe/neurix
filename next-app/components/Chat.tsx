"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { DefaultChatTransport, UIMessage } from "ai";
import { Button } from "@/components/ui/button";

import { Sidebar } from "./chat/sidebar";
import { MessageList } from "./chat/messages";
import { MultimodalInput } from "./chat/multimodal-input";

// TODO: implement thread data
// Mock thread data
const mockThreads = [
  {
    id: "1",
    title: "Help with React hooks",
    preview: "Can you explain the difference between useState and useReducer?",
    timestamp: "2 hours ago",
    messages: [],
  },
  {
    id: "2",
    title: "TypeScript best practices",
    preview: "What are some best practices for TypeScript interfaces?",
    timestamp: "1 day ago",
    messages: [],
  },
  {
    id: "3",
    title: "Next.js routing",
    preview: "How do I implement dynamic routes in Next.js App Router?",
    timestamp: "3 days ago",
    messages: [],
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    preview: "When should I use CSS Grid over Flexbox?",
    timestamp: "1 week ago",
    messages: [],
  },
  {
    id: "5",
    title: "JavaScript async patterns",
    preview:
      "What's the difference between Promise.all and Promise.allSettled?",
    timestamp: "2 weeks ago",
    messages: [],
  },
];

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
  });

  // scroll to bottom when messages populate
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    // TODO: implement new chat
    window.location.href = "/chat";
  };

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
    // TODO: implement new thread navigation
    window.location.href = `/chat/${threadId}`;
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: implement theme toggle
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-background via-background to-card">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNewChat={handleNewChat}
          threads={mockThreads}
          selectedThreadId={selectedThreadId}
          onThreadSelect={handleThreadSelect}
          isUserMenuOpen={isUserMenuOpen}
          onUserMenuToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isMobile={false}
        />
      </div>

      {/* Floating Sidebar Toggle Button - Shows when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <Button
          onClick={() => setIsSidebarCollapsed(false)}
          variant="ghost"
          size="icon"
          className="hidden lg:flex absolute left-4 top-4 z-10 p-2 brand-hover rounded-lg transition-all duration-200 hover:scale-105 brand-shadow-sm brand-glass border border-border/50"
          title="Expand sidebar"
        >
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
            <line x1="9" y1="4" x2="9" y2="20" strokeWidth={2} />
          </svg>
        </Button>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isCollapsed={false}
          onToggle={() => {}} // No-op for mobile - close by clicking outside
          onNewChat={handleNewChat}
          threads={mockThreads}
          selectedThreadId={selectedThreadId}
          onThreadSelect={handleThreadSelect}
          isUserMenuOpen={isUserMenuOpen}
          onUserMenuToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isMobile={true}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="ghost"
            size="icon"
            className="p-2 brand-hover rounded-lg transition-all duration-200 hover:scale-105"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
              <line x1="9" y1="4" x2="9" y2="20" strokeWidth={2} />
            </svg>
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 mx-auto flex w-full max-w-4xl gap-2 border-t border-border/50 bg-linear-to-t from-card via-card/80 to-transparent px-2 pb-3 md:px-4 md:pb-4 pt-2">
          <MultimodalInput
            input={input}
            setInput={setInput}
            status={status}
            stop={stop}
            sendMessage={sendMessage}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
