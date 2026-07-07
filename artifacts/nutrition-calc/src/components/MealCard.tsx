import React from "react";
import { Dish } from "@/data/foods";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DishSelect } from "./DishSelect";

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
  return (
    // No overflow-hidden so the custom dropdown can overflow the card boundary
    <Card className="mb-6 shadow-sm" data-testid={`card-meal-${id}`}>
      <CardHeader className="p-4 pb-3 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
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
          {/* Custom dish dropdown with macro table */}
          <DishSelect
            id={id}
            dishes={dishes}
            selectedDishId={selectedDishId}
            onSelect={onSelect}
          />

          {/* Multiplier select */}
          <div className="relative shrink-0">
            <select
              value={String(multiplier)}
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

      </CardContent>
    </Card>
  );
}
