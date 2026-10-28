import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScaleFactor,
  scaleTextNumbers,
  calculateBudgetTotals,
  calculateSwapSavings,
  calculateOilWeeklyQuota,
} from './calculator';
import { GROCERY_ITEMS } from '../data/eatCleanData';
import { GROCERY_BY_TIER } from '../data/flexibleEatCleanData';

test('calculateScaleFactor returns correct multipliers', () => {
  assert.equal(calculateScaleFactor(1), 0.5);
  assert.equal(calculateScaleFactor(2), 1.0);
  assert.equal(calculateScaleFactor(4), 2.0);
});

test('calculateBudgetTotals matches exact PDF Week 1 figures for 2 people (885k tier)', () => {
  const result = calculateBudgetTotals(GROCERY_ITEMS, 2, undefined, '885k');
  assert.equal(result.totalCost, 885000);
  assert.equal(result.ceilingBudget, 1000000);
  assert.equal(result.contingencyRemaining, 115000);
  assert.equal(result.totalKgMeatFish, 3.3);
  assert.equal(result.totalKgTofu, 1.6);
  assert.equal(result.totalEggs, 20);
  assert.equal(result.totalKgRice, 2.4);
  assert.equal(result.totalKgVeggies, 6.0);
  assert.equal(result.totalKgFruit, 2.5);
});

test('calculateBudgetTotals matches exact figures for 1M, 2M, 3.5M, and 5M tiers from new PDF', () => {
  const r1m = calculateBudgetTotals(GROCERY_BY_TIER['1m'], 2, undefined, '1m');
  assert.equal(r1m.totalCost, 910000);
  assert.equal(r1m.ceilingBudget, 1000000);
  assert.equal(r1m.contingencyRemaining, 90000);
  assert.equal(r1m.totalKgMeatFish, 3.5);
  assert.equal(r1m.totalKgCarbTotal, 4.9);
  assert.equal(r1m.totalKgFruit, 2.8);

  const r2m = calculateBudgetTotals(GROCERY_BY_TIER['2m'], 2, undefined, '2m');
  assert.equal(r2m.totalCost, 1820000);
  assert.equal(r2m.ceilingBudget, 2000000);
  assert.equal(r2m.contingencyRemaining, 180000);

  const r35m = calculateBudgetTotals(GROCERY_BY_TIER['3.5m'], 2, undefined, '3.5m');
  assert.equal(r35m.totalCost, 3180000);
  assert.equal(r35m.ceilingBudget, 3500000);
  assert.equal(r35m.contingencyRemaining, 320000);

  const r5m = calculateBudgetTotals(GROCERY_BY_TIER['5m'], 2, undefined, '5m');
  assert.equal(r5m.totalCost, 4550000);
  assert.equal(r5m.ceilingBudget, 5000000);
  assert.equal(r5m.contingencyRemaining, 450000);
});

test('calculateBudgetTotals scales correctly for 1 person (21 meals) and 4 people (84 meals)', () => {
  const result1 = calculateBudgetTotals(GROCERY_ITEMS, 1, undefined, '885k');
  assert.equal(result1.totalCost, 442500);
  assert.equal(result1.ceilingBudget, 500000);
  assert.equal(result1.contingencyRemaining, 57500);
  assert.equal(result1.totalKgMeatFish, 1.65);
  assert.equal(result1.totalEggs, 10);

  const result4 = calculateBudgetTotals(GROCERY_ITEMS, 4, undefined, '885k');
  assert.equal(result4.totalCost, 1770000);
  assert.equal(result4.ceilingBudget, 2000000);
  assert.equal(result4.contingencyRemaining, 230000);
  assert.equal(result4.totalEggs, 40);
});

test('calculateSwapSavings demonstrates saving 36.000đ when substituting pork with chicken', () => {
  const swap = calculateSwapSavings(90000, 90000);
  assert.equal(swap.porkCost, 90000);
  assert.equal(swap.chickenCost, 54000);
  assert.equal(swap.savings, 36000);
});

test('calculateOilWeeklyQuota calculates oil intake range', () => {
  const quota = calculateOilWeeklyQuota(2);
  assert.equal(quota.minMl, 140);
  assert.equal(quota.maxMl, 180);
  assert.equal(quota.bottlesNeeded, 1);
});

test('scaleTextNumbers adjusts ingredient quantities accurately', () => {
  const original = 'Ức gà bỏ da: 600 g | Bí đỏ: 700 g | Trứng: 4 quả';
  const scaled = scaleTextNumbers(original, 2);
  assert.ok(scaled.includes('1200 g') || scaled.includes('1200g'));
  assert.ok(scaled.includes('1400 g') || scaled.includes('1400g'));
  assert.ok(scaled.includes('8 quả'));
});
