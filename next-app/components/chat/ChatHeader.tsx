"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChatHeaderProps {
  onSidebarToggle: () => void;
  isMobile: boolean;
}

export function ChatHeader({ onSidebarToggle, isMobile }: ChatHeaderProps) {
  return (
    <Card className="flex items-center gap-4 p-4 border-b bg-card/50 backdrop-blur-sm rounded-none shadow-none">
      {isMobile && (
        <Button
          onClick={onSidebarToggle}
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <div className="w-5 h-5 flex flex-col gap-1">
            <div className="w-full h-0.5 bg-foreground rounded"></div>
            <div className="w-full h-0.5 bg-foreground rounded"></div>
            <div className="w-full h-0.5 bg-foreground rounded"></div>
          </div>
        </Button>
      )}

      <div className="flex-1">
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-sm text-muted-foreground">AI Assistant</p>
      </div>
    </Card>
  );
}