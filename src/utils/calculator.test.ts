import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScaleFactor,
  formatVND,
  scaleTextNumbers,
  calculateBudgetTotals,
  calculateSwapSavings,
  calculateOilWeeklyQuota,
} from './calculator';
import { GROCERY_ITEMS } from '../data/eatCleanData';

test('calculateScaleFactor returns correct multipliers', () => {
  assert.equal(calculateScaleFactor(1), 0.5);
  assert.equal(calculateScaleFactor(2), 1.0);
  assert.equal(calculateScaleFactor(4), 2.0);
});

test('calculateBudgetTotals matches exact PDF Week 1 figures for 2 people', () => {
  const result = calculateBudgetTotals(GROCERY_ITEMS, 2);
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

test('calculateBudgetTotals scales correctly for 1 person (21 meals) and 4 people (84 meals)', () => {
  const result1 = calculateBudgetTotals(GROCERY_ITEMS, 1);
  assert.equal(result1.totalCost, 442500);
  assert.equal(result1.ceilingBudget, 500000);
  assert.equal(result1.contingencyRemaining, 57500);
  assert.equal(result1.totalKgMeatFish, 1.65);
  assert.equal(result1.totalEggs, 10);

  const result4 = calculateBudgetTotals(GROCERY_ITEMS, 4);
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
