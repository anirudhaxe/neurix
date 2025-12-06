"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { UIMessage } from "ai";
import { Message } from "./Message";

interface MessageListProps {
  messages: UIMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Card className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center mb-4 brand-shadow animate-pulse">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </Card>
        <h2 className="text-xl font-semibold mb-2 bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Start a conversation
        </h2>
        <p className="text-muted-foreground max-w-md">
          Ask me anything! I can help you with questions, tasks, and provide
          information on various topics.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-border/30">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

