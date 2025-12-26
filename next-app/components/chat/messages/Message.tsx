"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Cloud, User, Wrench, Globe, Calculator } from "lucide-react";
import { UIMessage } from "ai";
import Image from "next/image";

interface ToolPart {
  type: string;
}

function ToolCallDisplay({ part }: { part: ToolPart }) {
  const getToolInfo = (toolType: string) => {
    switch (toolType) {
      case "tool-weather":
        return {
          name: "Calling Weather Tool",
          icon: Cloud,
          variant: "default" as const,
        };
      case "tool-calculator":
        return {
          name: "Calling Calculator Tool",
          icon: Calculator,
          variant: "default" as const,
        };
      case "tool-webSearch":
        return {
          name: "Calling Web Search Tool",
          icon: Globe,
          variant: "default" as const,
        };
      default:
        return {
          name: "Tool Call",
          icon: Wrench,
          variant: "outline" as const,
        };
    }
  };

  const toolInfo = getToolInfo(part.type);
  const Icon = toolInfo.icon;

  return (
    <Card className="mt-3 border-brand-200/50 dark:border-brand-900/50 brand-glass bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/20">
      <div className="flex items-center gap-3 p-3">
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center ring-1 ring-inset ring-primary/20">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge
              variant={toolInfo.variant}
              className="text-[10px] font-medium"
            >
              {toolInfo.name}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

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
              <Image
                src="/logo.png"
                alt="opencontext-logo"
                width={25}
                height={25}
              />
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
              case "tool-calculator":
              case "tool-webSearch":
                return (
                  <ToolCallDisplay
                    key={`${message.id}-${i}`}
                    part={part as ToolPart}
                  />
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
