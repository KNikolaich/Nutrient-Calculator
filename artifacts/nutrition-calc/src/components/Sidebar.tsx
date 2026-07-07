import React from "react";
import { NutritionGoals } from "./GoalsForm";
import { Dish } from "@/data/foods";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectedMeal {
  mealId: string;
  mealName: string;
  dish: Dish;
}

interface SidebarProps {
  goals: NutritionGoals | null;
  selectedMeals: SelectedMeal[];
}

export function Sidebar({ goals, selectedMeals }: SidebarProps) {
  const totals = selectedMeals.reduce(
    (acc, { dish }) => {
      const calories = Math.round(dish.protein * 4 + dish.fat * 9 + dish.carbs * 4);
      acc.calories += calories;
      acc.protein += dish.protein;
      acc.fat += dish.fat;
      acc.carbs += dish.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const renderProgress = (current: number, target: number | null, unit: string = "") => {
    if (target === null || target === undefined) return <span className="text-muted-foreground font-mono">{current}{unit} / -</span>;
    
    const ratio = current / target;
    let colorClass = "text-muted-foreground"; // below
    
    if (ratio > 1.05) {
      colorClass = "text-destructive"; // over
    } else if (ratio >= 0.95 && ratio <= 1.05) {
      colorClass = "text-green-600 dark:text-green-500"; // within 5%
    }
    
    return (
      <span className="font-mono flex items-baseline gap-1">
        <span className={cn("font-bold text-lg leading-none", colorClass)}>{current}</span>
        <span className="text-sm text-muted-foreground leading-none">/ {target}{unit}</span>
      </span>
    );
  };

  return (
    <div className="sticky top-6">
      <Card className="shadow-md border-border/60 bg-sidebar/50 backdrop-blur-sm" data-testid="sidebar-summary">
        <CardHeader className="p-5 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            📊 Сводка за день
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-5">
          
          <div className="space-y-3 min-h-[100px]">
            <AnimatePresence mode="popLayout">
              {selectedMeals.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground text-center py-6 italic"
                >
                  Блюда пока не выбраны
                </motion.div>
              ) : (
                selectedMeals.map(({ mealId, mealName, dish }) => {
                  const calories = Math.round(dish.protein * 4 + dish.fat * 9 + dish.carbs * 4);
                  return (
                    <motion.div 
                      key={mealId}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm space-y-1 bg-background p-3 rounded-lg border shadow-sm"
                      data-testid={`sidebar-item-${mealId}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-foreground/80">{mealName}</span>
                        <span className="font-mono font-bold text-primary">{calories}</span>
                      </div>
                      <div className="text-muted-foreground leading-snug line-clamp-2" title={dish.name}>
                        {dish.name}
                      </div>
                      <div className="flex gap-3 text-xs font-mono pt-1 text-muted-foreground/80">
                        <span>Б: {dish.protein}</span>
                        <span>Ж: {dish.fat}</span>
                        <span>У: {dish.carbs}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          <Separator className="bg-border/60" />

          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">Итого</h3>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-muted-foreground">Калории</span>
                {renderProgress(totals.calories, goals?.calories || null, " ккал")}
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-muted-foreground">Белки</span>
                {renderProgress(totals.protein, goals?.protein || null, "г")}
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-muted-foreground">Жиры</span>
                {renderProgress(totals.fat, goals?.fat || null, "г")}
              </div>
              
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-muted-foreground">Углеводы</span>
                {renderProgress(totals.carbs, goals?.carbs || null, "г")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
