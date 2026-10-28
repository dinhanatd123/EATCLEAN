export type PortionSize = 1 | 2 | 4; // 1 người (21 suất), 2 người (42 suất - chuẩn), 4 người (84 suất)

export type BudgetTierId = '885k' | '1m' | '2m' | '3.5m' | '5m';

export interface BudgetTierMetadata {
  id: BudgetTierId;
  shortLabel: string;
  name: string;
  subtitle: string;
  ceilingBudget: number; // for 2 people
  plannedCost: number; // for 2 people
  contingencyFund: number; // for 2 people
  contingencyPercent: string;
  costPerServing: number;
  proteinSummary: string;
  carbVeggieSummary: string;
  totalKgMeatFish: number;
  totalKgTofu: number;
  totalEggs: number;
  totalKgRice: number;
  totalKgCarbTotal: number;
  totalKgVeggies: number;
  totalKgFruit: number;
  highlightBadge: string;
  oilType: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  category: 'Đạm' | 'Tinh bột' | 'Rau củ' | 'Trái cây' | 'Sữa & lạc' | 'Gia vị';
  baseAmount: string; // e.g. "1,5 kg"
  baseQty: number; // in numeric units (kg, liters, units, etc.)
  unit: string;
  baseUnitPrice: number; // e.g. 90000
  baseTotalPrice: number; // e.g. 135000
  distribution: string; // "Chia 300 g (T2) + 600 g (T2) + 600 g (T6)"
  shopPhase: 'Chủ Nhật' | 'Giữa tuần' | 'Cả tuần';
}

export interface BudgetBreakdownGroup {
  name: string;
  amount: number;
  percentage: number;
  ceilingPercent: number;
  color: string;
  note?: string;
}

export interface DayMealPlan {
  dayName: string; // "Thứ Hai", "Thứ Ba", ...
  shortName: string; // "T2", "T3", ...
  breakfast: {
    title: string;
    description: string;
    ingredients: string;
    prepTime: string;
    caloriesApprox: number;
    image: string;
  };
  lunch: {
    title: string;
    description: string;
    ingredients: string;
    source: string; // "Nấu sẵn chiều Chủ Nhật" or "Trích từ mẻ tối Thứ Hai"
    linkedDayId?: string;
    image: string;
  };
  dinner: {
    title: string;
    description: string;
    ingredients: string;
    servingsCount: number; // 4 suất (2 tối + 2 trưa mai) hoặc 2 suất
    prepNote: string;
    targetTemp?: string;
    image: string;
  };
}

export interface TimelineStepItem {
  id: string;
  timeRange: string;
  phase: string;
  title: string;
  durationMinutes: number;
  details: string[];
  keyHighlight?: string;
  completed?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  category: 'breakfast' | 'chicken' | 'steamed' | 'tofu_egg';
  categoryLabel: string;
  title: string;
  mealSchedule: string; // "Thứ Hai, Thứ Tư, Thứ Sáu"
  servingsText: string; // "Mẻ 4 suất" or "Khẩu phần 2 người"
  servingsCount: number;
  cookTime: string; // "15–20 phút"
  targetTemp?: string; // "74°C" or "63°C"
  tierTag?: string; // e.g., "Mức 1–4" or "Mức 3–4"
  imageUrl: string;
  ingredients: {
    name: string;
    baseAmount: string;
    note?: string;
  }[];
  steps: RecipeStep[];
  prepSecret: string; // Bí quyết giữ độ ẩm hoặc mẹo bảo quản
  mealBoxRatio?: {
    carbPercent: number; // 35%
    proteinPercent: number; // 35%
    veggiePercent: number; // 30%
  };
}
