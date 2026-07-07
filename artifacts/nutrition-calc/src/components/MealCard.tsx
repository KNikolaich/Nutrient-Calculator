import React from "react";
import { Dish } from "@/data/foods";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MULTIPLIERS = [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

interface MealCardProps {
  id: string;
  title: string;
  icon: string;
  dishes: Dish[];
  selectedDishId: string | null;
  onSelect: (dishId: string | null) => void;
  multiplier: number;
  onMultiplierChange: (m: number) => void;
  hasRestaurantToggle?: boolean;
  isRestaurant?: boolean;
  onRestaurantToggle?: (checked: boolean) => void;
}

export function MealCard({
  id,
  title,
  icon,
  dishes,
  selectedDishId,
  onSelect,
  multiplier,
  onMultiplierChange,
  hasRestaurantToggle,
  isRestaurant,
  onRestaurantToggle,
}: MealCardProps) {
  const selectedDish = dishes.find((d) => d.id === selectedDishId) ?? null;

  const displayedDish = selectedDish
    ? {
        protein: Math.round(selectedDish.protein * multiplier * 10) / 10,
        fat: Math.round(selectedDish.fat * multiplier * 10) / 10,
        carbs: Math.round(selectedDish.carbs * multiplier * 10) / 10,
        calories: Math.round(
          (selectedDish.protein * 4 + selectedDish.fat * 9 + selectedDish.carbs * 4) * multiplier
        ),
      }
    : null;

  return (
    <Card className="mb-6 shadow-sm overflow-hidden" data-testid={`card-meal-${id}`}>
      <CardHeader className="p-4 pb-3 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{icon}</span>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>

        {hasRestaurantToggle && (
          <div className="flex items-center space-x-2 bg-background px-3 py-1.5 rounded-md border border-border shadow-sm">
            <Checkbox
              id={`rest-${id}`}
              checked={isRestaurant}
              onCheckedChange={(c) => onRestaurantToggle?.(!!c)}
              data-testid={`checkbox-restaurant-${id}`}
            />
            <Label htmlFor={`rest-${id}`} className="text-sm font-medium cursor-pointer">
              🍽 В ресторане
            </Label>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Selectors row */}
        <div className="flex gap-3 items-center">
          {/* Dish dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedDishId ?? ""}
              onChange={(e) => onSelect(e.target.value || null)}
              data-testid={`select-dish-${id}`}
              className={cn(
                "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2.5 pr-8",
                "text-sm font-medium leading-tight shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "transition-colors cursor-pointer",
                selectedDishId ? "text-primary border-primary/40 bg-primary/5" : "text-muted-foreground"
              )}
            >
              <option value="">— не выбрано —</option>
              {dishes.map((dish) => {
                const kcal = Math.round(dish.protein * 4 + dish.fat * 9 + dish.carbs * 4);
                return (
                  <option key={dish.id} value={dish.id}>
                    {dish.name} ({kcal} ккал)
                  </option>
                );
              })}
            </select>
            {/* Chevron icon */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Multiplier dropdown */}
          <div className="relative">
            <select
              value={multiplier}
              onChange={(e) => onMultiplierChange(Number(e.target.value))}
              disabled={!selectedDishId}
              data-testid={`select-multiplier-${id}`}
              className={cn(
                "appearance-none rounded-lg border border-border bg-background pl-3 pr-7 py-2.5",
                "text-sm font-mono font-semibold shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "transition-colors cursor-pointer",
                selectedDishId
                  ? "text-foreground border-border hover:border-primary/40"
                  : "text-muted-foreground/40 cursor-not-allowed opacity-50"
              )}
            >
              {MULTIPLIERS.map((m) => (
                <option key={m} value={String(m)}>×{m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
              <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Selected dish details */}
        {selectedDish && displayedDish && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-center justify-between gap-4">
            <div className="text-sm text-primary/80 font-medium leading-tight flex-1 min-w-0 truncate" title={selectedDish.name}>
              {selectedDish.name}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <span className="font-bold text-primary text-base">{displayedDish.calories} ккал</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-muted-foreground">
                Б:<span className="text-foreground font-semibold ml-0.5">{displayedDish.protein}</span>
              </span>
              <span className="text-muted-foreground">
                Ж:<span className="text-foreground font-semibold ml-0.5">{displayedDish.fat}</span>
              </span>
              <span className="text-muted-foreground">
                У:<span className="text-foreground font-semibold ml-0.5">{displayedDish.carbs}</span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
