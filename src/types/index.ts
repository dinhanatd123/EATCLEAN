export type PortionSize = 1 | 2 | 4; // 1 người (21 suất), 2 người (42 suất - chuẩn), 4 người (84 suất)

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
  targetTemp?: string; // "74°C"
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
