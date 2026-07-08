import React from "react";
import { Dish } from "@/data/foods";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DishSelect } from "./DishSelect";
import { MealInfo } from "./MealInfo";
import { MultiplierSelect } from "./MultiplierSelect";

interface MealCardProps {
  id: string;
  title: string;
  icon: string;
  infoText: string;
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
  infoText,
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
    <Card className="mb-0 shadow-sm" data-testid={`card-meal-${id}`}>
      <CardHeader className="p-2.5 pb-2 md:p-4 md:pb-3 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-lg md:text-xl" aria-hidden="true">{icon}</span>
          <CardTitle className="text-base md:text-lg font-semibold">{title}</CardTitle>
          <MealInfo mealId={id} mealName={title} text={infoText} />
        </div>

        {hasRestaurantToggle && (
          <div className="flex items-center space-x-1.5 md:space-x-2 bg-background px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-border shadow-sm">
            <Checkbox
              id={`rest-${id}`}
              checked={isRestaurant}
              onCheckedChange={(c) => onRestaurantToggle?.(!!c)}
              data-testid={`checkbox-restaurant-${id}`}
            />
            <Label htmlFor={`rest-${id}`} className="text-xs md:text-sm font-medium cursor-pointer">
              🍽 В ресторане
            </Label>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-2.5 md:p-4 space-y-2 md:space-y-3">
        {/* Selectors row */}
        <div className="flex gap-2 md:gap-3 items-center">
          {/* Custom dish dropdown with macro table */}
          <DishSelect
            id={id}
            dishes={dishes}
            selectedDishId={selectedDishId}
            onSelect={onSelect}
          />

          {/* Multiplier select — compact text trigger, dropdown on click */}
          <MultiplierSelect
            id={id}
            value={multiplier}
            onChange={onMultiplierChange}
            disabled={!selectedDishId}
          />
        </div>

      </CardContent>
    </Card>
  );
}
