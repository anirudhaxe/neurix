"use client";

import { Card } from "@/components/ui/card";
import { SidebarHeader } from "./SidebarHeader";
import { ThreadList } from "./ThreadList";
import { UserMenu } from "./UserMenu";
import { Thread } from "../types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  threads: Thread[];
  selectedThreadId: string;
  onThreadSelect: (threadId: string) => void;
  isUserMenuOpen: boolean;
  onUserMenuToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  isCollapsed,
  onToggle,
  onNewChat,
  threads,
  selectedThreadId,
  onThreadSelect,
  isUserMenuOpen,
  onUserMenuToggle,
  isDarkMode,
  onThemeToggle,
  isMobile = false,
}: SidebarProps) {
  const sidebarWidth = isCollapsed ? "w-0" : "w-80";

  if (isCollapsed) {
    return null; // Completely hide sidebar when collapsed
  }

  return (
    <Card
      className={`${sidebarWidth} bg-sidebar border-r border-sidebar-border flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden rounded-none`}
      style={{
        minWidth: "320px",
        maxWidth: "320px",
      }}
    >
      {/* Sidebar Header */}
      <SidebarHeader
        onToggle={onToggle}
        onNewChat={onNewChat}
        isMobile={isMobile}
      />

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
        <ThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          onThreadSelect={onThreadSelect}
        />
      </div>

      {/* User Menu */}
      <UserMenu
        isOpen={isUserMenuOpen}
        onToggle={onUserMenuToggle}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />
    </Card>
  );
}
