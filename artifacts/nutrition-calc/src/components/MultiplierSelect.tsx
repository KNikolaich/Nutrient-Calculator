import React, {
  useState, useRef, useEffect, useCallback, useId,
} from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const MULTIPLIERS = [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

interface MultiplierSelectProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function MultiplierSelect({ id, value, onChange, disabled }: MultiplierSelectProps) {
  const uid       = useId();
  const listboxId = `${uid}-listbox`;

  const [isOpen, setIsOpen]           = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const optionRefs   = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback((returnFocus = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    const idx = MULTIPLIERS.findIndex((m) => m === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [disabled, value]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus({ preventScroll: false });
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);

  // Close if disabled while open (e.g. dish deselected)
  useEffect(() => {
    if (disabled && isOpen) close(false);
  }, [disabled, isOpen, close]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      open();
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, MULTIPLIERS.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (index === 0) {
          setIsOpen(false);
          setActiveIndex(-1);
          triggerRef.current?.focus();
        } else {
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(MULTIPLIERS.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const handleSelect = (m: number) => {
    onChange(m);
    close();
  };

  return (
    <div ref={containerRef} className="relative shrink-0" data-testid={`multiplier-select-${id}`}>
      <button
        ref={triggerRef}
        type="button"
        id={`${uid}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label="Множитель порции"
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        data-testid={`select-multiplier-${id}`}
        className={cn(
          "rounded-md px-1.5 py-1 text-sm font-mono font-semibold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          disabled
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer",
          isOpen && "text-primary bg-primary/5 ring-2 ring-primary/30"
        )}
      >
        ×{value}
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={`${uid}-trigger`}
          aria-activedescendant={activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
          className="absolute top-[calc(100%+4px)] right-0 z-50 bg-background border border-border rounded-lg shadow-xl overflow-hidden py-1 min-w-[64px]"
        >
          {MULTIPLIERS.map((m, index) => {
            const isSelected = m === value;
            return (
              <button
                key={m}
                id={`${uid}-opt-${index}`}
                ref={(el) => { optionRefs.current[index] = el; }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => handleSelect(m)}
                onKeyDown={(e) => handleOptionKeyDown(e, index)}
                data-testid={`multiplier-option-${m}`}
                className={cn(
                  "w-full flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-mono text-left transition-colors",
                  "focus:outline-none",
                  isSelected
                    ? "bg-primary/8 text-primary font-semibold focus:bg-primary/12"
                    : "text-foreground hover:bg-muted/50 focus:bg-muted/50"
                )}
              >
                <span className="w-3 h-3 shrink-0 flex items-center justify-center" aria-hidden="true">
                  {isSelected && <Check className="w-3 h-3 text-primary" />}
                </span>
                ×{m}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
