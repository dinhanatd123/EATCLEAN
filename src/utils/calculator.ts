import { PortionSize, IngredientItem } from '../types';

export function calculateScaleFactor(portion: PortionSize): number {
  switch (portion) {
    case 1:
      return 0.5;
    case 4:
      return 2.0;
    case 2:
    default:
      return 1.0;
  }
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

/**
 * Intelligent scaling for Vietnamese recipe ingredient strings:
 * Parses numbers with 'g', 'kg', 'ml', 'quả', etc. and scales them.
 */
export function scaleTextNumbers(text: string, factor: number): string {
  if (factor === 1.0) return text;

  // Replace occurrences like "160 g" or "160g" or "1,5 kg" or "320g" or "4 quả"
  return text.replace(/(\d+(?:[.,]\d+)?)\s*(g|kg|ml|lít|L|quả|thìa|mẻ|suất)/gi, (match, numStr, unit) => {
    const cleanNum = parseFloat(numStr.replace(',', '.'));
    if (isNaN(cleanNum)) return match;
    const scaled = cleanNum * factor;
    // Format to max 1 decimal place if has decimals
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace('.', ',');
    return `${formatted} ${unit}`;
  });
}

export interface BudgetCalculationResult {
  totalCost: number;
  ceilingBudget: number;
  contingencyRemaining: number;
  totalKgMeatFish: number;
  totalKgTofu: number;
  totalEggs: number;
  totalKgRice: number;
  totalKgVeggies: number;
  totalKgFruit: number;
}

export function calculateBudgetTotals(
  items: IngredientItem[],
  portion: PortionSize = 2,
  customPrices?: Record<string, number>
): BudgetCalculationResult {
  const factor = calculateScaleFactor(portion);
  const ceilingBudget = 1000000 * factor;

  let totalCost = 0;
  items.forEach((item) => {
    const itemPrice = customPrices && customPrices[item.id] !== undefined
      ? customPrices[item.id]
      : item.baseTotalPrice * factor;
    totalCost += itemPrice;
  });

  const contingencyRemaining = ceilingBudget - totalCost;

  return {
    totalCost: Math.round(totalCost),
    ceilingBudget: Math.round(ceilingBudget),
    contingencyRemaining: Math.round(contingencyRemaining),
    totalKgMeatFish: Number((3.3 * factor).toFixed(2)),
    totalKgTofu: Number((1.6 * factor).toFixed(2)),
    totalEggs: Math.round(20 * factor),
    totalKgRice: Number((2.4 * factor).toFixed(2)),
    totalKgVeggies: Number((6.0 * factor).toFixed(2)),
    totalKgFruit: Number((2.5 * factor).toFixed(2)),
  };
}

/**
 * Simulation helper from Slide 03:
 * Swapping 600g lean pork shoulder (base 90.000đ) with 600g chicken breast (base 54.000đ)
 * gives an immediate savings of 36.000đ!
 */
export function calculateSwapSavings(
  porkPriceFor600g: number = 90000,
  chickenPricePerKg: number = 90000
): {
  porkCost: number;
  chickenCost: number;
  savings: number;
} {
  const chickenCost = Math.round(0.6 * chickenPricePerKg);
  const savings = porkPriceFor600g - chickenCost;
  return {
    porkCost: porkPriceFor600g,
    chickenCost,
    savings,
  };
}

export function calculateOilWeeklyQuota(portion: PortionSize): {
  minMl: number;
  maxMl: number;
  bottlesNeeded: number;
} {
  const factor = calculateScaleFactor(portion);
  const minMl = Math.round(140 * factor);
  const maxMl = Math.round(180 * factor);
  const bottlesNeeded = Math.ceil(maxMl / 250);
  return { minMl, maxMl, bottlesNeeded };
}
