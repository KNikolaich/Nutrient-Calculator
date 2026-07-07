export interface Dish {
  id: string;
  name: string;
  protein: number;
  fat: number;
  carbs: number;
}

export const FOODS: Record<string, Dish[]> = {
  breakfast: [
    { id: "b1", name: "3 яйца + 30 г сыра + 1 хлебец", protein: 33, fat: 27, carbs: 8 },
    { id: "b2", name: "Овсяная каша 200г на воде + 1 банан", protein: 8, fat: 3, carbs: 52 },
    { id: "b3", name: "Творог 5% 200г + мёд 1 ч.л.", protein: 24, fat: 10, carbs: 16 },
    { id: "b4", name: "Омлет из 3 яиц + молоко 50 мл", protein: 20, fat: 16, carbs: 4 },
    { id: "b5", name: "Гречневая каша 200г + сливочное масло 10г", protein: 10, fat: 8, carbs: 48 },
    { id: "b6", name: "Сырники 3 шт. + сметана 2 ст.л.", protein: 22, fat: 18, carbs: 28 },
    { id: "b7", name: "Йогурт греческий 200г + гранола 30г", protein: 16, fat: 8, carbs: 30 },
  ],
  lunch: [
    { id: "l1", name: "Куриная грудка 200г + рис 150г + овощи", protein: 48, fat: 6, carbs: 45 },
    { id: "l2", name: "Борщ 300 мл + хлеб 2 куска", protein: 8, fat: 5, carbs: 38 },
    { id: "l3", name: "Тушёная говядина 150г + картофель 200г", protein: 32, fat: 18, carbs: 36 },
    { id: "l4", name: "Суп куриный 300 мл + гречневая каша 100г", protein: 22, fat: 6, carbs: 32 },
    { id: "l5", name: "Макароны с фаршем 300г", protein: 22, fat: 18, carbs: 55 },
    { id: "l6", name: "Греческий салат + куриная грудка 150г", protein: 34, fat: 14, carbs: 12 },
    { id: "l7", name: "Щи домашние 300 мл + картофельное пюре 150г", protein: 12, fat: 8, carbs: 42 },
  ],
  lunch_restaurant: [
    { id: "lr1", name: "Бизнес-ланч (суп + горячее + салат)", protein: 28, fat: 22, carbs: 48 },
    { id: "lr2", name: "Цезарь с курицей + хлеб", protein: 30, fat: 28, carbs: 18 },
    { id: "lr3", name: "Пицца Маргарита 2 куска", protein: 22, fat: 26, carbs: 58 },
    { id: "lr4", name: "Бургер + картофель фри порция", protein: 28, fat: 32, carbs: 62 },
    { id: "lr5", name: "Паста болоньезе 300г", protein: 24, fat: 20, carbs: 55 },
    { id: "lr6", name: "Борщ + вареники с картошкой 5 шт.", protein: 16, fat: 12, carbs: 60 },
    { id: "lr7", name: "Стейк из семги 200г + овощи гриль", protein: 40, fat: 24, carbs: 8 },
  ],
  dinner: [
    { id: "d1", name: "Рыба запечённая 200г + овощи на пару", protein: 40, fat: 8, carbs: 12 },
    { id: "d2", name: "Куриная грудка 200г + листовой салат", protein: 48, fat: 4, carbs: 6 },
    { id: "d3", name: "Тушёные овощи + яйца 2 шт.", protein: 18, fat: 14, carbs: 20 },
    { id: "d4", name: "Творог 200г + кефир 200 мл", protein: 28, fat: 8, carbs: 12 },
    { id: "d5", name: "Гречневая каша 150г + куриная котлета 1 шт.", protein: 24, fat: 14, carbs: 32 },
    { id: "d6", name: "Индейка тушёная 200г + брокколи 200г", protein: 46, fat: 6, carbs: 10 },
    { id: "d7", name: "Омлет 2 яйца + сыр 30г + помидоры", protein: 20, fat: 18, carbs: 6 },
  ],
  dinner_restaurant: [
    { id: "dr1", name: "Стейк рибай 200г + овощи гриль", protein: 46, fat: 28, carbs: 8 },
    { id: "dr2", name: "Лосось запечённый 200г + рис 100г", protein: 40, fat: 22, carbs: 36 },
    { id: "dr3", name: "Шашлык из свинины 200г + лаваш + овощи", protein: 38, fat: 24, carbs: 28 },
    { id: "dr4", name: "Суши-сет 8 роллов", protein: 20, fat: 8, carbs: 48 },
    { id: "dr5", name: "Паста с морепродуктами 300г", protein: 28, fat: 18, carbs: 52 },
    { id: "dr6", name: "Куриные крылышки BBQ 300г + картофель", protein: 36, fat: 28, carbs: 32 },
    { id: "dr7", name: "Том-ям 300 мл + рис 100г", protein: 22, fat: 14, carbs: 36 },
  ],
  snack: [
    { id: "s1", name: "Горсть орехов ассорти 30г", protein: 6, fat: 18, carbs: 6 },
    { id: "s2", name: "Яблоко + 20г миндаля", protein: 4, fat: 12, carbs: 20 },
    { id: "s3", name: "Протеиновый батончик", protein: 20, fat: 8, carbs: 22 },
    { id: "s4", name: "Банан + арахисовая паста 1 ч.л.", protein: 6, fat: 6, carbs: 28 },
    { id: "s5", name: "Кефир 250 мл + хлебец", protein: 10, fat: 4, carbs: 16 },
    { id: "s6", name: "Творог 100г + ягоды 50г", protein: 14, fat: 4, carbs: 10 },
    { id: "s7", name: "Хумус 50г + морковь и сельдерей", protein: 6, fat: 8, carbs: 12 },
  ],
  treats: [
    { id: "tr1", name: "Шоколад тёмный 70%+ 30г", protein: 3, fat: 10, carbs: 18 },
    { id: "tr2", name: "Мороженое 1 шарик (80г)", protein: 3, fat: 6, carbs: 24 },
    { id: "tr3", name: "Пончик 1 шт.", protein: 4, fat: 12, carbs: 30 },
    { id: "tr4", name: "Чипсы картофельные 30г", protein: 2, fat: 10, carbs: 16 },
    { id: "tr5", name: "Конфеты шоколадные 3 шт.", protein: 1, fat: 6, carbs: 20 },
    { id: "tr6", name: "Пирожное эклер 1 шт.", protein: 5, fat: 14, carbs: 28 },
    { id: "tr7", name: "Кола / газировка 330 мл", protein: 0, fat: 0, carbs: 35 },
  ],
};