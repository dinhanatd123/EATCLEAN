import { PortionSize, IngredientItem, BudgetTierId } from '../types';
import { BUDGET_TIERS_METADATA } from '../data/flexibleEatCleanData';

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

  return text.replace(/(\d+(?:[.,]\d+)?)\s*(g|kg|ml|lít|L|quả|thìa|mẻ|suất)/gi, (match, numStr, unit) => {
    const cleanNum = parseFloat(numStr.replace(',', '.'));
    if (isNaN(cleanNum)) return match;
    const scaled = cleanNum * factor;
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace('.', ',');
    return `${formatted} ${unit}`;
  });
}

export interface BudgetCalculationResult {
  totalCost: number;
  ceilingBudget: number;
  contingencyRemaining: number;
  contingencyPercent: string;
  costPerServing: number;
  totalKgMeatFish: number;
  totalKgTofu: number;
  totalEggs: number;
  totalKgRice: number;
  totalKgCarbTotal: number;
  totalKgVeggies: number;
  totalKgFruit: number;
}

export function calculateBudgetTotals(
  items: IngredientItem[],
  portion: PortionSize = 2,
  customPrices?: Record<string, number>,
  tierId: BudgetTierId = '885k'
): BudgetCalculationResult {
  const factor = calculateScaleFactor(portion);
  const tierMeta = BUDGET_TIERS_METADATA[tierId] || BUDGET_TIERS_METADATA['885k'];
  const ceilingBudget = tierMeta.ceilingBudget * factor;

  let totalCost = 0;
  items.forEach((item) => {
    const itemPrice = customPrices && customPrices[item.id] !== undefined
      ? customPrices[item.id]
      : item.baseTotalPrice * factor;
    totalCost += itemPrice;
  });

  const contingencyRemaining = ceilingBudget - totalCost;
  const totalServings = portion * 21;
  const costPerServing = Math.round(totalCost / totalServings);

  return {
    totalCost: Math.round(totalCost),
    ceilingBudget: Math.round(ceilingBudget),
    contingencyRemaining: Math.round(contingencyRemaining),
    contingencyPercent: tierMeta.contingencyPercent,
    costPerServing,
    totalKgMeatFish: Number((tierMeta.totalKgMeatFish * factor).toFixed(2)),
    totalKgTofu: Number((tierMeta.totalKgTofu * factor).toFixed(2)),
    totalEggs: Math.round(tierMeta.totalEggs * factor),
    totalKgRice: Number((tierMeta.totalKgRice * factor).toFixed(2)),
    totalKgCarbTotal: Number((tierMeta.totalKgCarbTotal * factor).toFixed(2)),
    totalKgVeggies: Number((tierMeta.totalKgVeggies * factor).toFixed(2)),
    totalKgFruit: Number((tierMeta.totalKgFruit * factor).toFixed(2)),
  };
}

/**
 * Simulation helper from Slide 03 / Slide 04:
 * - Tier 885k / 1m: Swapping 600g lean pork shoulder (base 90.000đ) with 600g chicken breast/thigh (base 54.000đ) saves 36.000đ
 * - Tier 2m / 3.5m / 5m: Swapping 600g Vietnamese beef tenderloin (180.000đ) with 600g duck breast fillet or mackerel (120.000đ) saves 60.000đ
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
