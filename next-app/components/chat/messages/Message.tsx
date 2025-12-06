"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User, Bot } from "lucide-react";
import { UIMessage } from "ai";

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 p-4 transition-colors ${
        isUser ? "bg-card/50" : "bg-muted/30"
      }`}
    >
      <div className="shrink-0">
        <Avatar className="w-8 h-8 ring-2 ring-primary/10">
          <AvatarFallback
            className={
              isUser
                ? "brand-gradient text-primary-foreground"
                : "brand-gradient-subtle text-primary"
            }
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-2">
        <div
          className={`font-medium text-sm ${
            isUser ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {isUser ? "You" : "Assistant"}
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="whitespace-pre-wrap text-foreground leading-relaxed"
                  >
                    {part.text}
                  </div>
                );
              case "tool-weather":
              case "tool-convertFahrenheitToCelsius":
                return (
                  <Card
                    key={`${message.id}-${i}`}
                    className="mt-2 p-3 brand-glass border border-border/50 brand-shadow-sm"
                  >
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(part, null, 2)}
                    </pre>
                  </Card>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

