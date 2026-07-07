import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          typeof parsed.calories === "number" && isFinite(parsed.calories) &&
          typeof parsed.protein === "number" && isFinite(parsed.protein) &&
          typeof parsed.fat === "number" && isFinite(parsed.fat) &&
          typeof parsed.carbs === "number" && isFinite(parsed.carbs)
        ) {
          setGoals(parsed);
        }
      } catch {
        // Corrupt cookie — ignore
      }
    }
    setIsGoalsLoaded(true);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!isMobileSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMobileSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileSidebarOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileSidebarOpen]);

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
    setSelections(prev => ({ ...prev, [mealId]: null }));
    setMultipliers(prev => ({ ...prev, [mealId]: 1 }));
  };

  const mealSections = [
    { id: "breakfast", name: "Завтрак", source: FOODS.breakfast },
    { id: "lunch", name: "Обед", source: restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch },
    { id: "dinner", name: "Ужин", source: restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner },
    { id: "snack", name: "Перекус", source: FOODS.snack },
    { id: "treats", name: "Вреднятина", source: FOODS.treats },
  ] as const;

  const selectedMealsList: SelectedMeal[] = [];
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

          {/* Left column: meal cards */}
          <div className="flex-1 w-full">
            <GoalsForm initialGoals={goals} onSave={handleSaveGoals} />

            <div className="space-y-6">
              <MealCard
                id="breakfast" title="Завтрак" icon="🍳"
                dishes={FOODS.breakfast}
                selectedDishId={selections.breakfast}
                onSelect={(d) => handleSelect("breakfast", d)}
                multiplier={multipliers.breakfast}
                onMultiplierChange={(m) => handleMultiplierChange("breakfast", m)}
              />
              <MealCard
                id="lunch" title="Обед" icon="🍲"
                dishes={restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch}
                selectedDishId={selections.lunch}
                onSelect={(d) => handleSelect("lunch", d)}
                multiplier={multipliers.lunch}
                onMultiplierChange={(m) => handleMultiplierChange("lunch", m)}
                hasRestaurantToggle isRestaurant={restaurant.lunch}
                onRestaurantToggle={(c) => handleRestaurantToggle("lunch", c)}
              />
              <MealCard
                id="dinner" title="Ужин" icon="🥩"
                dishes={restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner}
                selectedDishId={selections.dinner}
                onSelect={(d) => handleSelect("dinner", d)}
                multiplier={multipliers.dinner}
                onMultiplierChange={(m) => handleMultiplierChange("dinner", m)}
                hasRestaurantToggle isRestaurant={restaurant.dinner}
                onRestaurantToggle={(c) => handleRestaurantToggle("dinner", c)}
              />
              <MealCard
                id="snack" title="Перекус" icon="🍎"
                dishes={FOODS.snack}
                selectedDishId={selections.snack}
                onSelect={(d) => handleSelect("snack", d)}
                multiplier={multipliers.snack}
                onMultiplierChange={(m) => handleMultiplierChange("snack", m)}
              />
              <MealCard
                id="treats" title="Вреднятина" icon="🍩"
                dishes={FOODS.treats}
                selectedDishId={selections.treats}
                onSelect={(d) => handleSelect("treats", d)}
                multiplier={multipliers.treats}
                onMultiplierChange={(m) => handleMultiplierChange("treats", m)}
              />
            </div>
          </div>

          {/* Right column: sidebar — desktop only */}
          <div className="hidden lg:block w-[320px] shrink-0">
            <Sidebar goals={goals} selectedMeals={selectedMealsList} />
          </div>
        </div>
      </main>

      {/* ── Mobile: floating Σ button ── */}
      <button
        type="button"
        onClick={() => setIsMobileSidebarOpen(true)}
        aria-label="Открыть сводку за день"
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center text-2xl font-bold hover:bg-primary/90 active:scale-95 transition-transform"
      >
        Σ
      </button>

      {/* ── Mobile: backdrop + bottom drawer ── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] rounded-t-2xl overflow-hidden shadow-2xl flex flex-col bg-background"
            >
              {/* Drag handle + close */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b bg-background">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                <span className="text-base font-bold text-foreground">Сводка за день</span>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  aria-label="Закрыть"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1">
                <Sidebar goals={goals} selectedMeals={selectedMealsList} compact />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
