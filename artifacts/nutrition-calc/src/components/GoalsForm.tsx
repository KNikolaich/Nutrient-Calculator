import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2, Pencil, CheckCircle2 } from "lucide-react";

export interface NutritionGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface GoalsFormProps {
  initialGoals: NutritionGoals | null;
  onSave: (goals: NutritionGoals) => void;
}

export function GoalsForm({ initialGoals, onSave }: GoalsFormProps) {
  const [isEditing, setIsEditing] = useState<boolean>(!initialGoals);
  const [calories, setCalories] = useState<string>(initialGoals?.calories.toString() || "");
  const [protein, setProtein] = useState<string>(initialGoals?.protein.toString() || "");
  const [fat, setFat] = useState<string>(initialGoals?.fat.toString() || "");
  const [carbs, setCarbs] = useState<string>(initialGoals?.carbs.toString() || "");
  const [autoCarbs, setAutoCarbs] = useState<boolean>(true);

  // Auto-calculate carbs
  useEffect(() => {
    if (!autoCarbs) return;
    const c = parseInt(calories);
    const p = parseInt(protein);
    const f = parseInt(fat);
    
    if (!isNaN(c) && !isNaN(p) && !isNaN(f)) {
      const calculatedCarbs = Math.max(0, Math.round((c - p * 4 - f * 9) / 4));
      setCarbs(calculatedCarbs.toString());
    }
  }, [calories, protein, fat, autoCarbs]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseInt(calories);
    const p = parseInt(protein);
    const f = parseInt(fat);
    const cb = parseInt(carbs);

    if (!isNaN(c) && !isNaN(p) && !isNaN(f) && !isNaN(cb)) {
      onSave({ calories: c, protein: p, fat: f, carbs: cb });
      setIsEditing(false);
    }
  };

  if (!isEditing && initialGoals) {
    return (
      <div 
        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card shadow-sm mb-6"
        data-testid="goals-summary"
      >
        <div className="flex items-center gap-2 text-sm text-card-foreground font-medium">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span>Мой план:</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-semibold">{initialGoals.calories} кал</span>
          <span className="text-muted-foreground">•</span>
          <span>Бел: {initialGoals.protein}г</span>
          <span className="text-muted-foreground">•</span>
          <span>Жиры: {initialGoals.fat}г</span>
          <span className="text-muted-foreground">•</span>
          <span>Угл: {initialGoals.carbs}г</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          className="h-8 text-muted-foreground hover:text-foreground"
          data-testid="button-edit-goals"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 shadow-sm border-primary/20" data-testid="goals-form-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Настройка КБЖУ</h2>
        </div>
        
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="space-y-1.5">
              <Label htmlFor="calories" className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Калории</Label>
              <Input 
                id="calories" 
                type="number" 
                value={calories} 
                onChange={(e) => setCalories(e.target.value)} 
                required 
                className="font-mono text-base"
                data-testid="input-calories"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="protein" className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Белки (г)</Label>
              <Input 
                id="protein" 
                type="number" 
                value={protein} 
                onChange={(e) => setProtein(e.target.value)} 
                required 
                className="font-mono text-base"
                data-testid="input-protein"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fat" className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Жиры (г)</Label>
              <Input 
                id="fat" 
                type="number" 
                value={fat} 
                onChange={(e) => setFat(e.target.value)} 
                required 
                className="font-mono text-base"
                data-testid="input-fat"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="carbs" className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Углеводы (г)</Label>
                {autoCarbs && <span className="text-[10px] text-primary bg-primary/10 px-1 rounded font-medium">авто</span>}
              </div>
              <Input 
                id="carbs" 
                type="number" 
                value={carbs} 
                onChange={(e) => {
                  setCarbs(e.target.value);
                  setAutoCarbs(false);
                }} 
                required 
                className="font-mono text-base"
                data-testid="input-carbs"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto"
            data-testid="button-save-goals"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Сохранить план
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
