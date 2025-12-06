"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, User, Moon, Sun, Settings, LogOut } from "lucide-react";
import { useRef, useEffect } from "react";

interface UserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function UserMenu({
  isOpen,
  onToggle,
  isDarkMode,
  onThemeToggle,
}: UserMenuProps) {
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div
      className="p-3 border-t border-sidebar-border bg-linear-to-t from-sidebar to-sidebar/50 transition-all duration-300 ease-in-out"
      ref={userMenuRef}
    >
      <Button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-2 brand-hover rounded-lg transition-all duration-300 ease-in-out"
        variant="ghost"
        title="User menu"
      >
        <Avatar className="w-8 h-8 transition-transform duration-200 hover:scale-105 ring-2 ring-primary/20">
          <AvatarFallback className="brand-gradient text-primary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left transition-all duration-300 ease-in-out opacity-100 w-auto">
          <div className="text-sm font-medium text-foreground">John Doe</div>
          <div className="text-xs text-muted-foreground">john@example.com</div>
        </div>
        <ChevronRight
          className={`h-4 text-primary transition-all duration-300 opacity-100 w-auto ${isOpen ? "rotate-90" : ""}`}
        />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-full left-3 right-3 mb-2 bg-card border border-border rounded-lg brand-shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
          <Button
            onClick={() => {
              onThemeToggle();
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm brand-hover rounded transition-colors justify-start"
            variant="ghost"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
            <span className="text-foreground">
              {isDarkMode ? "Light mode" : "Dark mode"}
            </span>
          </Button>
          <Separator className="bg-border/50" />
          <Button
            onClick={() => {
              onToggle();
              // Handle settings
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm brand-hover rounded transition-colors justify-start"
            variant="ghost"
          >
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-foreground">Settings</span>
          </Button>
          <Separator className="bg-border/50" />
          <Button
            onClick={() => {
              onToggle();
              // Handle logout
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm brand-hover rounded transition-colors text-destructive justify-start"
            variant="ghost"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </Button>
        </Card>
      )}
    </div>
  );
}

