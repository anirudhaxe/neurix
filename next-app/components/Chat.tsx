"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { DefaultChatTransport, generateId, UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./chat/sidebar";
import { MessageList } from "./chat/messages";
import { MultimodalInput } from "./chat/multimodal-input";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export default function Chat({
  id,
  initialMessages,
  userId,
}: {
  id: string; // chatId
  initialMessages?: UIMessage[];
  userId: string;
}) {
  const router = useRouter();

  const isChatTitleGenerated = useRef(
    initialMessages ? initialMessages?.length >= 2 : false,
  );

  // const trpcUtils = trpc.useUtils();
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], refetch } = trpc.chat.getChats.useQuery({
    userId,
  });

  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
    onFinish: async ({ messages: newMessages }) => {
      if (isChatTitleGenerated.current === false && newMessages?.length >= 2) {
        generateChatTitle({
          userId,
          messages: newMessages,
          chatId: id,
        });
        isChatTitleGenerated.current = true;
      }
      // await trpcUtils.chat.getChats.invalidate({ userId });
      await refetch();
    },
  });

  const { mutate: mutateChatDeletion } = trpc.chat.deleteChat.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const { mutate: generateChatTitle } = trpc.chat.generateChatTitle.useMutation(
    {
      onSuccess: async () => {
        await refetch();
      },
    },
  );

  const handleChatDeletion = ({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) => {
    mutateChatDeletion({
      userId,
      chatId,
    });
  };
  // scroll to bottom when messages populate
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSidebarNewChat = () => {
    router.push(`/chat/${generateId()}`, { scroll: false });
  };

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
    router.push(`/chat/${threadId}`);
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
          userId={userId}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNewChat={handleSidebarNewChat}
          threads={threads}
          selectedThreadId={selectedThreadId}
          onThreadSelect={handleThreadSelect}
          isUserMenuOpen={isUserMenuOpen}
          onUserMenuToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isMobile={false}
          handleChatDeletion={handleChatDeletion}
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
          userId={userId}
          isCollapsed={false}
          onToggle={() => {}} // No-op for mobile - close by clicking outside
          onNewChat={handleSidebarNewChat}
          threads={threads}
          selectedThreadId={selectedThreadId}
          onThreadSelect={handleThreadSelect}
          isUserMenuOpen={isUserMenuOpen}
          onUserMenuToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isMobile={true}
          handleChatDeletion={handleChatDeletion}
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
