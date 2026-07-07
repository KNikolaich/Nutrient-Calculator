import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "@/lib/cookies";
import { FOODS } from "@/data/foods";
import { GoalsForm, NutritionGoals } from "@/components/GoalsForm";
import { MealCard } from "@/components/MealCard";
import { Sidebar, SelectedMeal } from "@/components/Sidebar";

const GOALS_COOKIE = "nutrition_goals";
const ALLOWED_MULTIPLIERS = [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3] as const;
type AllowedMultiplier = typeof ALLOWED_MULTIPLIERS[number];

function normalizeMultiplier(value: number): AllowedMultiplier {
  if (!Number.isFinite(value)) return 1;
  return (ALLOWED_MULTIPLIERS.includes(value as AllowedMultiplier) ? value : 1) as AllowedMultiplier;
}

interface Selections {
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
  snack: string | null;
  treats: string | null;
}

interface RestaurantState {
  lunch: boolean;
  dinner: boolean;
}

interface Multipliers {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  treats: number;
}

export default function Home() {
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [isGoalsLoaded, setIsGoalsLoaded] = useState(false);

  const [selections, setSelections] = useState<Selections>({
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null,
    treats: null,
  });

  const [restaurant, setRestaurant] = useState<RestaurantState>({
    lunch: false,
    dinner: false,
  });

  const [multipliers, setMultipliers] = useState<Multipliers>({
    breakfast: 1,
    lunch: 1,
    dinner: 1,
    snack: 1,
    treats: 1,
  });

  useEffect(() => {
    const saved = getCookie(GOALS_COOKIE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.calories === 'number' && isFinite(parsed.calories) &&
          typeof parsed.protein === 'number' && isFinite(parsed.protein) &&
          typeof parsed.fat === 'number' && isFinite(parsed.fat) &&
          typeof parsed.carbs === 'number' && isFinite(parsed.carbs)
        ) {
          setGoals(parsed);
        }
      } catch (e) {
        // Corrupt cookie — ignore and let user re-enter goals
      }
    }
    setIsGoalsLoaded(true);
  }, []);

  const handleSaveGoals = (newGoals: NutritionGoals) => {
    setGoals(newGoals);
    setCookie(GOALS_COOKIE, JSON.stringify(newGoals), 365);
  };

  const handleSelect = (mealId: keyof Selections, dishId: string | null) => {
    setSelections(prev => ({ ...prev, [mealId]: dishId }));
  };

  const handleMultiplierChange = (mealId: keyof Multipliers, value: number) => {
    setMultipliers(prev => ({ ...prev, [mealId]: normalizeMultiplier(value) }));
  };

  const handleRestaurantToggle = (mealId: keyof RestaurantState, checked: boolean) => {
    setRestaurant(prev => ({ ...prev, [mealId]: checked }));
    // Clear selection and reset multiplier when switching modes
    setSelections(prev => ({ ...prev, [mealId]: null }));
    setMultipliers(prev => ({ ...prev, [mealId]: 1 }));
  };

  // Build the list of selected meals for the sidebar
  const selectedMealsList: SelectedMeal[] = [];

  const mealSections = [
    { id: 'breakfast', name: 'Завтрак', source: FOODS.breakfast },
    { id: 'lunch', name: 'Обед', source: restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch },
    { id: 'dinner', name: 'Ужин', source: restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner },
    { id: 'snack', name: 'Перекус', source: FOODS.snack },
    { id: 'treats', name: 'Вреднятина', source: FOODS.treats },
  ] as const;

  mealSections.forEach(section => {
    const selectedId = selections[section.id];
    if (selectedId) {
      const dish = section.source.find(d => d.id === selectedId);
      if (dish) {
        selectedMealsList.push({
          mealId: section.id,
          mealName: section.name,
          dish,
          multiplier: multipliers[section.id],
        });
      }
    }
  });

  if (!isGoalsLoaded) return null;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <header className="bg-card border-b border-border py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center md:justify-start gap-3">
          <span className="text-2xl" aria-hidden="true">🥑</span>
          <h1 className="text-xl font-bold text-primary tracking-tight">Daily Nutrition</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Main Content */}
          <div className="flex-1 w-full max-w-3xl">
            <GoalsForm initialGoals={goals} onSave={handleSaveGoals} />

            <div className="space-y-6">
              <MealCard
                id="breakfast"
                title="Завтрак"
                icon="🍳"
                dishes={FOODS.breakfast}
                selectedDishId={selections.breakfast}
                onSelect={(dishId) => handleSelect("breakfast", dishId)}
                multiplier={multipliers.breakfast}
                onMultiplierChange={(m) => handleMultiplierChange("breakfast", m)}
              />

              <MealCard
                id="lunch"
                title="Обед"
                icon="🍲"
                dishes={restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch}
                selectedDishId={selections.lunch}
                onSelect={(dishId) => handleSelect("lunch", dishId)}
                multiplier={multipliers.lunch}
                onMultiplierChange={(m) => handleMultiplierChange("lunch", m)}
                hasRestaurantToggle={true}
                isRestaurant={restaurant.lunch}
                onRestaurantToggle={(checked) => handleRestaurantToggle("lunch", checked)}
              />

              <MealCard
                id="dinner"
                title="Ужин"
                icon="🥩"
                dishes={restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner}
                selectedDishId={selections.dinner}
                onSelect={(dishId) => handleSelect("dinner", dishId)}
                multiplier={multipliers.dinner}
                onMultiplierChange={(m) => handleMultiplierChange("dinner", m)}
                hasRestaurantToggle={true}
                isRestaurant={restaurant.dinner}
                onRestaurantToggle={(checked) => handleRestaurantToggle("dinner", checked)}
              />

              <MealCard
                id="snack"
                title="Перекус"
                icon="🍎"
                dishes={FOODS.snack}
                selectedDishId={selections.snack}
                onSelect={(dishId) => handleSelect("snack", dishId)}
                multiplier={multipliers.snack}
                onMultiplierChange={(m) => handleMultiplierChange("snack", m)}
              />

              <MealCard
                id="treats"
                title="Вреднятина"
                icon="🍩"
                dishes={FOODS.treats}
                selectedDishId={selections.treats}
                onSelect={(dishId) => handleSelect("treats", dishId)}
                multiplier={multipliers.treats}
                onMultiplierChange={(m) => handleMultiplierChange("treats", m)}
              />
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <Sidebar goals={goals} selectedMeals={selectedMealsList} />
          </div>
        </div>
      </main>
    </div>
  );
}
