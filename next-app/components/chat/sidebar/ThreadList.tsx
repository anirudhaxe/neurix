"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { Thread } from "../types";

interface ThreadListProps {
  threads: Thread[];
  selectedThreadId: string;
  onThreadSelect: (threadId: string) => void;
}

export function ThreadList({
  threads,
  selectedThreadId,
  onThreadSelect,
}: ThreadListProps) {
  return (
    <div className="p-2">
      <div className="space-y-1">
        {threads.map((thread, index) => (
          <Card
            key={thread.id}
            className={`relative p-3 rounded-lg transition-all duration-200 group cursor-pointer border ${
              selectedThreadId === thread.id
                ? "brand-gradient text-primary-foreground border-primary/30 brand-shadow-sm"
                : "brand-hover border-border/30 hover:border-primary/50"
            }`}
            onClick={() => onThreadSelect(thread.id)}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium text-sm truncate ${
                    selectedThreadId === thread.id
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {thread.title}
                </div>
                <div
                  className={`text-xs truncate mt-1 ${
                    selectedThreadId === thread.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {thread.preview}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`p-1 rounded transition-all duration-200 cursor-pointer hover:scale-110 h-6 w-6 ${
                    selectedThreadId === thread.id
                      ? "hover:bg-white/20 text-primary-foreground"
                      : "brand-hover text-muted-foreground hover:text-foreground"
                  }`}
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`p-1 rounded transition-all duration-200 cursor-pointer hover:scale-110 h-6 w-6 ${
                    selectedThreadId === thread.id
                      ? "hover:bg-white/20 text-primary-foreground"
                      : "brand-hover text-muted-foreground hover:text-foreground"
                  }`}
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div
              className={`text-xs mt-2 ${
                selectedThreadId === thread.id
                  ? "text-primary-foreground/60"
                  : "text-muted-foreground"
              }`}
            >
              {thread.timestamp}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
