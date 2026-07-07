import React from "react";
import { Dish } from "@/data/foods";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

interface MealCardProps {
  id: string;
  title: string;
  icon: string;
  dishes: Dish[];
  selectedDishId: string | null;
  onSelect: (dishId: string | null) => void;
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
  hasRestaurantToggle,
  isRestaurant,
  onRestaurantToggle,
}: MealCardProps) {
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
            <Label 
              htmlFor={`rest-${id}`} 
              className="text-sm font-medium cursor-pointer"
            >
              🍽 В ресторане
            </Label>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col divide-y divide-border/50">
          {dishes.map((dish) => {
            const isSelected = selectedDishId === dish.id;
            const calories = Math.round(dish.protein * 4 + dish.fat * 9 + dish.carbs * 4);
            
            return (
              <button
                key={dish.id}
                type="button"
                onClick={() => onSelect(isSelected ? null : dish.id)}
                className={cn(
                  "w-full text-left p-4 flex items-start gap-4 transition-colors duration-200",
                  isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
                )}
                data-testid={`dish-row-${dish.id}`}
              >
                <div className={cn(
                  "mt-1 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-background"
                )}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className={cn("font-medium leading-tight", isSelected ? "text-primary" : "text-foreground")}>
                    {dish.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={cn(
                      "font-semibold font-mono",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}>
                      {calories} ккал
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <div className="flex gap-2 font-mono text-muted-foreground">
                      <span title="Белки">Б: <span className={cn(isSelected && "text-foreground font-medium")}>{dish.protein}</span></span>
                      <span title="Жиры">Ж: <span className={cn(isSelected && "text-foreground font-medium")}>{dish.fat}</span></span>
                      <span title="Углеводы">У: <span className={cn(isSelected && "text-foreground font-medium")}>{dish.carbs}</span></span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
