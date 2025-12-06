"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowUp, Square } from "lucide-react";
import { memo, useCallback, useEffect, useRef } from "react";

// Simple toast implementation for now
const toast = {
  error: (message: string) => {
    console.error(message);
    // You could replace this with a proper toast notification later
  },
};
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./prompt-input";

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  status: ReturnType<typeof useChat>["status"];
  stop: () => void;
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  className?: string;
}

function PureMultimodalInput({
  input,
  setInput,
  status,
  stop,
  sendMessage,
  className,
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [adjustHeight]);

  const resetHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const submitForm = useCallback(() => {
    if (input.trim()) {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: input }],
      });

      resetHeight();
      setInput("");

      // Focus back to textarea after submission
      textareaRef.current?.focus();
    }
  }, [input, setInput, sendMessage, resetHeight]);

  return (
    <div className={cn("relative flex w-full flex-col gap-4", className)}>
      <PromptInput
        className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 brand-shadow transition-all duration-200 focus-within:border-primary focus-within:brand-shadow-lg hover:border-primary/50"
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          if (status !== "ready") {
            toast.error("Please wait for the model to finish its response!");
          } else {
            submitForm();
          }
        }}
      >
        <div className="flex flex-row items-start gap-1 sm:gap-2">
          <PromptInputTextarea
            autoFocus
            className="grow resize-none border-0! border-none! bg-transparent p-2 text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
            data-testid="multimodal-input"
            disableAutoResize={true}
            onChange={handleInput}
            placeholder="Send a message..."
            ref={textareaRef}
            rows={1}
            value={input}
          />
        </div>

        <PromptInputToolbar className="border-top-0! border-t-0! p-0 shadow-none dark:border-0 dark:border-transparent!">
          <div className="grow" />{" "}
          {/* Spacer to align send button to the right */}
          {status === "submitted" ? (
            <Button
              className="size-7 rounded-full bg-foreground p-1 text-background transition-colors duration-200 hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground brand-shadow"
              data-testid="stop-button"
              onClick={(event) => {
                event.preventDefault();
                stop();
              }}
            >
              <Square size={14} />
            </Button>
          ) : (
            <PromptInputSubmit
              className="size-8 rounded-full brand-gradient text-primary-foreground transition-colors duration-200 hover:brand-gradient-dark disabled:bg-muted disabled:text-muted-foreground brand-shadow hover:brand-shadow-lg"
              data-testid="send-button"
              disabled={!input.trim()}
              status={status}
            >
              <ArrowUp size={14} />
            </PromptInputSubmit>
          )}
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export const MultimodalInput = memo(PureMultimodalInput);

