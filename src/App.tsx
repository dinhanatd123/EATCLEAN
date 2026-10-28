/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortionSize, BudgetTierId, Recipe } from './types';
import { Header } from './components/Header';
import { MealMatrix } from './components/MealMatrix';
import { GroceryBudget } from './components/GroceryBudget';
import { PrepTimeline } from './components/PrepTimeline';
import { RecipeLibrary } from './components/RecipeLibrary';
import { FoodSafetyGuide } from './components/FoodSafetyGuide';
import { CookingModeModal } from './components/CookingModeModal';
import { ExportModal } from './components/ExportModal';
import { ScrollProgress } from './components/ScrollProgress';

const STORAGE_KEY_TIER = 'eatclean_budget_tier_v1';

export default function App() {
  const [portion, setPortion] = useState<PortionSize>(2);
  const [budgetTier, setBudgetTier] = useState<BudgetTierId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIER) as BudgetTierId | null;
      if (saved && ['885k', '1m', '2m', '3.5m', '5m'].includes(saved)) {
        return saved;
      }
      return '1m';
    } catch {
      return '1m';
    }
  });
  const [activeTab, setActiveTab] = useState<string>('meal-plan');
  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIER, budgetTier);
    } catch {
      // Ignore storage errors
    }
  }, [budgetTier]);

  // Scroll spy to highlight current active section
  useEffect(() => {
    const sectionIds = ['meal-plan', 'grocery', 'prep', 'recipes', 'safety'];
    const handleScrollSpy = () => {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260) {
            setActiveTab(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      {/* Smooth Scroll Progress Bar & Floating Navigation */}
      <ScrollProgress activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Top Banner & Header */}
      <Header
        portion={portion}
        onPortionChange={setPortion}
        budgetTier={budgetTier}
        onBudgetTierChange={setBudgetTier}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-7 sm:py-10 space-y-14 sm:space-y-20">
        {/* Phân Khu 1: Ma Trận Thực Đơn 7 Ngày */}
        <MealMatrix
          portion={portion}
          budgetTier={budgetTier}
          onNavigateToTab={handleTabChange}
        />

        {/* Phân Khu 2: Danh Sách Đi Chợ & Ngân Sách 1–5 Triệu */}
        <GroceryBudget
          portion={portion}
          budgetTier={budgetTier}
          onBudgetTierChange={setBudgetTier}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Phân Khu 3: Timeline Sơ Chế 90 Phút & Nhịp Nấu Tối */}
        <PrepTimeline budgetTier={budgetTier} />

        {/* Phân Khu 4: Thư Viện Công Thức Chế Biến */}
        <RecipeLibrary
          portion={portion}
          budgetTier={budgetTier}
          onOpenCookingMode={(recipe) => setCookingModeRecipe(recipe)}
        />

        {/* Phân Khu 5: Quy Chuẩn An Toàn Thực Phẩm USDA FSIS */}
        <FoodSafetyGuide portion={portion} budgetTier={budgetTier} />
      </main>

      {/* Cooking Mode Modal */}
      {cookingModeRecipe && (
        <CookingModeModal
          recipe={cookingModeRecipe}
          portion={portion}
          onClose={() => setCookingModeRecipe(null)}
        />
      )}

      {/* Export Shopping List Modal */}
      {isExportModalOpen && (
        <ExportModal
          portion={portion}
          budgetTier={budgetTier}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#143225] text-emerald-100/80 pt-10 pb-24 sm:py-10 px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between text-xs">
          <div className="space-y-1">
            <p className="font-bold text-white text-sm">
              Cẩm Nang Thực Hành Nấu Ăn & Quản Lý Ngân Sách Linh Hoạt · Hệ Thống Thực Đơn 1–5 Triệu/Tuần
            </p>
            <p className="text-emerald-300/80">
              Tích hợp đầy đủ Thực đơn Gốc 885K & 4 Phân khúc 1,0Tr • 2,0Tr • 3,5Tr • 5,0Tr/tuần (Cập nhật 10/2026)
            </p>
          </div>

          <div className="text-emerald-400/80 text-[11px] sm:text-right space-y-0.5">
            <p>Chuẩn bảo quản lạnh & vệ sinh an toàn: USDA FSIS & FoodSafety.gov</p>
            <p className="text-amber-400 font-medium">Gia cầm ≥ 74°C · Thịt bò & Cá hồi ≥ 63°C · Ngăn mát ≤ 4°C · Cấp đông ≤ -18°C</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
