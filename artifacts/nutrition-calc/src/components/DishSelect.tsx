import React, {
  useState, useRef, useEffect, useCallback, useId,
} from "react";
import { Dish } from "@/data/foods";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DishSelectProps {
  dishes: Dish[];
  selectedDishId: string | null;
  onSelect: (id: string | null) => void;
  id?: string;
}

export function DishSelect({ dishes, selectedDishId, onSelect, id }: DishSelectProps) {
  const uid         = useId();
  const listboxId   = `${uid}-listbox`;

  const [isOpen, setIsOpen]           = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const optionRefs   = useRef<(HTMLButtonElement | null)[]>([]);

  // All options: index 0 = deselect, 1..N = dishes
  const allOptions: Array<{ id: string | null; label: string; dish: Dish | null }> = [
    { id: null, label: "— не выбрано —", dish: null },
    ...dishes.map((d) => ({ id: d.id, label: d.name, dish: d })),
  ];

  const close = useCallback((returnFocus = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    // Focus the currently selected option (or first) on next tick
    const idx = selectedDishId
      ? allOptions.findIndex((o) => o.id === selectedDishId)
      : 0;
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [selectedDishId, allOptions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus active option whenever it changes while open
  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus({ preventScroll: false });
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, activeIndex]);

  // Click-outside close
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
        setActiveIndex((i) => Math.min(i + 1, allOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (index === 0) {
          // Wrap back to trigger
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
        setActiveIndex(allOptions.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // Let tab naturally move focus but close the list
        close(false);
        break;
    }
  };

  const handleSelect = (dishId: string | null) => {
    onSelect(dishId);
    close();
  };

  const selectedDish   = dishes.find((d) => d.id === selectedDishId) ?? null;
  const selectedCalories = selectedDish
    ? Math.round(selectedDish.protein * 4 + selectedDish.fat * 9 + selectedDish.carbs * 4)
    : null;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-w-0"
      data-testid={`dish-select-${id}`}
    >
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${uid}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 md:px-3 md:py-2.5",
          "text-sm font-medium text-left shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          isOpen
            ? "border-primary ring-2 ring-primary/30 bg-background"
            : selectedDish
            ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/8"
            : "border-border bg-background text-muted-foreground hover:border-primary/30"
        )}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          {selectedDish ? (
            <>
              <span className="truncate leading-tight">{selectedDish.name}</span>
              <span className="shrink-0 text-xs font-mono font-semibold text-muted-foreground">
                {selectedCalories} ккал
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">— не выбрано —</span>
          )}
        </span>
        <svg
          className={cn(
            "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={`${uid}-trigger`}
          aria-activedescendant={
            activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined
          }
          className="absolute top-[calc(100%+4px)] left-0 z-50 bg-background border border-border rounded-xl shadow-xl overflow-hidden"
          style={{ minWidth: "100%", width: "min(520px, 92vw)" }}
        >
          {/* Column header */}
          <div className="grid grid-cols-[1fr_52px_36px_36px_36px] items-center px-3 py-2 bg-muted/60 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wide gap-x-2">
            <span>Блюдо</span>
            <span className="text-right">ккал</span>
            <span className="text-right text-blue-600 dark:text-blue-400">Б</span>
            <span className="text-right text-amber-600 dark:text-amber-400">Ж</span>
            <span className="text-right text-emerald-600 dark:text-emerald-400">У</span>
          </div>

          {/* Options */}
          <div className="max-h-[300px] overflow-y-auto overscroll-contain">
            {allOptions.map((opt, index) => {
              const isSelected = opt.id === selectedDishId;
              const kcal = opt.dish
                ? Math.round(opt.dish.protein * 4 + opt.dish.fat * 9 + opt.dish.carbs * 4)
                : null;

              return (
                <button
                  key={opt.id ?? "__none"}
                  id={`${uid}-opt-${index}`}
                  ref={(el) => { optionRefs.current[index] = el; }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}              // focus managed programmatically
                  onClick={() => handleSelect(opt.id)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  className={cn(
                    "w-full grid grid-cols-[1fr_52px_36px_36px_36px] items-center px-3 py-2.5 gap-x-2",
                    "text-sm text-left transition-colors border-b border-border/20 last:border-0",
                    "focus:outline-none",
                    isSelected
                      ? "bg-primary/8 focus:bg-primary/12"
                      : index === 0
                      ? "focus:bg-muted/50 hover:bg-muted/50"
                      : "hover:bg-muted/40 focus:bg-muted/50"
                  )}
                  data-testid={opt.dish ? `dish-option-${opt.id}` : "dish-option-none"}
                >
                  {/* Name */}
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center" aria-hidden="true">
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </span>
                    <span
                      className={cn(
                        "leading-snug",
                        opt.dish
                          ? isSelected ? "font-semibold text-primary" : "text-foreground"
                          : "italic text-muted-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                  </span>

                  {/* Macros */}
                  {opt.dish ? (
                    <>
                      <span className={cn("font-mono text-xs font-bold tabular-nums text-right", isSelected ? "text-primary" : "text-foreground/80")}>
                        {kcal}
                      </span>
                      <span className={cn("font-mono text-xs tabular-nums text-right", isSelected ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")}>
                        {opt.dish.protein}
                      </span>
                      <span className={cn("font-mono text-xs tabular-nums text-right", isSelected ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                        {opt.dish.fat}
                      </span>
                      <span className={cn("font-mono text-xs tabular-nums text-right", isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                        {opt.dish.carbs}
                      </span>
                    </>
                  ) : (
                    <><span /><span /><span /><span /></>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 bg-muted/40 border-t border-border/40 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span><span className="text-blue-600 dark:text-blue-400 font-semibold">Б</span> белки</span>
            <span><span className="text-amber-600 dark:text-amber-400 font-semibold">Ж</span> жиры</span>
            <span><span className="text-emerald-600 dark:text-emerald-400 font-semibold">У</span> углеводы</span>
            <span className="ml-auto">{dishes.length} блюд · ↑↓ навигация</span>
          </div>
        </div>
      )}
    </div>
  );
}
