import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface MealInfoProps {
  mealId: string;
  mealName: string;
  text: string;
}

export function MealInfo({ mealId, mealName, text }: MealInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Подсказка: ${mealName}`}
          data-testid={`button-meal-info-${mealId}`}
          className="shrink-0 w-5 h-5 rounded-full border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 flex items-center justify-center text-xs font-bold leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          onClick={(e) => e.stopPropagation()}
        >
          !
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(360px,85vw)] text-sm leading-relaxed"
        data-testid={`popover-meal-info-${mealId}`}
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}
