export interface Thread {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

export interface ChatState {
  input: string;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isUserMenuOpen: boolean;
  selectedThreadId: string;
  isDarkMode: boolean;
}

export interface ChatHandlers {
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleNewChat: () => void;
  handleThreadSelect: (threadId: string) => void;
  handleThemeToggle: () => void;
  onSidebarToggle: () => void;
  onSidebarCollapse: () => void;
  onUserMenuToggle: () => void;
  setInput: (value: string) => void;
}

