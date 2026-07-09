import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getCookie, setCookie } from "@/lib/cookies";
import { FOODS } from "@/data/foods";
import { GoalsForm, NutritionGoals } from "@/components/GoalsForm";
import { MealCard } from "@/components/MealCard";
import { Sidebar, SelectedMeal } from "@/components/Sidebar";
import { ReferenceDialog } from "@/components/ReferenceDialog";
import { AboutDialog } from "@/components/AboutDialog";

const GOALS_COOKIE = "nutrition_goals";

const MEAL_INFO: Record<
  "breakfast" | "lunch" | "dinner" | "snack" | "treats",
  string
> = {
  breakfast:
    "Завтрак строится по принципу – БЕЛКИ+ЖИРЫ, и можно совсем немного углеводов. Я учел тот факт, чтобы в завтраке было 30-50 г белка",
  lunch: "Обед, это углеводы + белок и немного клетчатки",
  dinner:
    "Здесь мы обычно уже подгоняем под наше БЖУ и финалим день. Вы смотрите, если у вас остался вариант только белка, то делаем ужин лишь белковым, если остались еще и углеводы, прекрасно, делаем как и в обед и закрываем красиво день с углеводами. Но для примера я накину 20 вариантов, где в основе на ужин будет белок, а вы уже смотрите, если не хватает вам еще углеводов, то добавляем углеводы. Не стесняйтесь корректировать, пока не сойдетесь ровно-ровно по нашей калорийности. Вижу частую ошибку, как при заданной калорийности 1900 ккал и 130 г белка (пример), мне скидывают отчет 1900 ккал и 160 г белка или 110 г белка, но так не должно быть. В таком случае если вы при планировании перебрали по белку, но калории сошлись, тогда просто убираем часть белка, калорийность уменьшится, а в остаток, чтобы выровнять калорийность и сохранить белок, добавляем углеводы или жиры.",
  snack:
    "Я всегда стараюсь сделать их максимально вкусными и особенно перекус в поздний ужин. Я делаю более сложные варианты с готовкой, например это могут быть вафли протеиновые, панкейки с греческим йогуртом на сахарозаменителе. Но все же давайте накидаю каких-нибудь простых вариантов",
  treats:
    "И в завершении добавлю 20% вкусного. Как я и говорю и учу вас, что не нужно ограничивать свой рацион и старайтесь каждый раз по возможности добавить любимые продукты. Я приведу примеры «Запрещенки» но более полезной для нашей формы. В период глубокой сушки, когда процент жира у меня доходит до 5-7% я не использую быстрые углеводы, хотя могу, потому что мне хочеться в данный период больше еды, простой еды по типу овсянки, риса и хлеба. И если я впишу свои 20%, то я останусь голодным. То есть в зависимости от этапа сушки тоже вписывайте любимые приемы пищи и кайфуйте. Обратите внимание, что я подобрал варианты где больше углеводов, но не жиров. На это тоже делайте акцент при выборе вредного.",
};
const ALLOWED_MULTIPLIERS = [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3] as const;
type AllowedMultiplier = (typeof ALLOWED_MULTIPLIERS)[number];

function normalizeMultiplier(value: number): AllowedMultiplier {
  if (!Number.isFinite(value)) return 1;
  return (
    ALLOWED_MULTIPLIERS.includes(value as AllowedMultiplier) ? value : 1
  ) as AllowedMultiplier;
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
          typeof parsed.calories === "number" &&
          isFinite(parsed.calories) &&
          typeof parsed.protein === "number" &&
          isFinite(parsed.protein) &&
          typeof parsed.fat === "number" &&
          isFinite(parsed.fat) &&
          typeof parsed.carbs === "number" &&
          isFinite(parsed.carbs)
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileSidebarOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const handleSaveGoals = (newGoals: NutritionGoals) => {
    setGoals(newGoals);
    setCookie(GOALS_COOKIE, JSON.stringify(newGoals), 365);
  };

  const handleSelect = (mealId: keyof Selections, dishId: string | null) => {
    setSelections((prev) => ({ ...prev, [mealId]: dishId }));
  };

  const handleMultiplierChange = (mealId: keyof Multipliers, value: number) => {
    setMultipliers((prev) => ({
      ...prev,
      [mealId]: normalizeMultiplier(value),
    }));
  };

  const handleRestaurantToggle = (
    mealId: keyof RestaurantState,
    checked: boolean,
  ) => {
    setRestaurant((prev) => ({ ...prev, [mealId]: checked }));
    setSelections((prev) => ({ ...prev, [mealId]: null }));
    setMultipliers((prev) => ({ ...prev, [mealId]: 1 }));
  };

  const mealSections = [
    { id: "breakfast", name: "Завтрак", source: FOODS.breakfast },
    {
      id: "lunch",
      name: "Обед",
      source: restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch,
    },
    {
      id: "dinner",
      name: "Ужин",
      source: restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner,
    },
    { id: "snack", name: "Перекус", source: FOODS.snack },
    { id: "treats", name: "Запрещенка", source: FOODS.treats },
  ] as const;

  const selectedMealsList: SelectedMeal[] = [];
  mealSections.forEach((section) => {
    const selectedId = selections[section.id];
    if (selectedId) {
      const dish = section.source.find((d) => d.id === selectedId);
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
    <div className="min-h-[100dvh] bg-background text-foreground pb-24 md:pb-20">
      <header className="bg-card border-b border-border py-2.5 px-4 md:py-4 md:px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-xl md:text-2xl" aria-hidden="true">
            🥑
          </span>
          <h1 className="text-lg md:text-xl font-bold text-primary tracking-tight flex-1 text-center md:text-left md:flex-none">
            Конструктор питания
          </h1>
          <div className="flex items-center gap-1 ml-auto">
            <ReferenceDialog />
            <AboutDialog />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-3 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left column: meal cards */}
          <div className="flex-1 w-full">
            <GoalsForm initialGoals={goals} onSave={handleSaveGoals} />

            <div className="space-y-2.5 md:space-y-6">
              <MealCard
                id="breakfast"
                title="Завтрак"
                icon="🍳"
                infoText={MEAL_INFO.breakfast}
                dishes={FOODS.breakfast}
                selectedDishId={selections.breakfast}
                onSelect={(d) => handleSelect("breakfast", d)}
                multiplier={multipliers.breakfast}
                onMultiplierChange={(m) =>
                  handleMultiplierChange("breakfast", m)
                }
              />
              <MealCard
                id="lunch"
                title="Обед"
                icon="🍲"
                infoText={MEAL_INFO.lunch}
                dishes={restaurant.lunch ? FOODS.lunch_restaurant : FOODS.lunch}
                selectedDishId={selections.lunch}
                onSelect={(d) => handleSelect("lunch", d)}
                multiplier={multipliers.lunch}
                onMultiplierChange={(m) => handleMultiplierChange("lunch", m)}
                hasRestaurantToggle
                isRestaurant={restaurant.lunch}
                onRestaurantToggle={(c) => handleRestaurantToggle("lunch", c)}
              />
              <MealCard
                id="dinner"
                title="Ужин"
                icon="🥩"
                infoText={MEAL_INFO.dinner}
                dishes={
                  restaurant.dinner ? FOODS.dinner_restaurant : FOODS.dinner
                }
                selectedDishId={selections.dinner}
                onSelect={(d) => handleSelect("dinner", d)}
                multiplier={multipliers.dinner}
                onMultiplierChange={(m) => handleMultiplierChange("dinner", m)}
                hasRestaurantToggle
                isRestaurant={restaurant.dinner}
                onRestaurantToggle={(c) => handleRestaurantToggle("dinner", c)}
              />
              <MealCard
                id="snack"
                title="Перекус"
                icon="🍎"
                infoText={MEAL_INFO.snack}
                dishes={FOODS.snack}
                selectedDishId={selections.snack}
                onSelect={(d) => handleSelect("snack", d)}
                multiplier={multipliers.snack}
                onMultiplierChange={(m) => handleMultiplierChange("snack", m)}
              />
              <MealCard
                id="treats"
                title="Запрещенка"
                icon="🍩"
                infoText={MEAL_INFO.treats}
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
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center text-2xl font-bold hover:bg-primary/90 active:scale-95 transition-transform"
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
                <span className="text-base font-bold text-foreground flex items-center gap-1.5">
                  📊 Сводка за день
                </span>
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
                <Sidebar
                  goals={goals}
                  selectedMeals={selectedMealsList}
                  compact
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
