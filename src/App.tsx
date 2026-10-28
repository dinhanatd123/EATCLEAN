/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortionSize, Recipe } from './types';
import { Header } from './components/Header';
import { MealMatrix } from './components/MealMatrix';
import { GroceryBudget } from './components/GroceryBudget';
import { PrepTimeline } from './components/PrepTimeline';
import { RecipeLibrary } from './components/RecipeLibrary';
import { FoodSafetyGuide } from './components/FoodSafetyGuide';
import { CookingModeModal } from './components/CookingModeModal';
import { ExportModal } from './components/ExportModal';
import { ScrollProgress } from './components/ScrollProgress';

export default function App() {
  const [portion, setPortion] = useState<PortionSize>(2);
  const [activeTab, setActiveTab] = useState<string>('meal-plan');
  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

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
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Phân Khu 2: Ma Trận Thực Đơn 7 Ngày */}
        <MealMatrix
          portion={portion}
          onNavigateToTab={handleTabChange}
        />

        {/* Phân Khu 3: Danh Sách Đi Chợ & Ngân Sách */}
        <GroceryBudget
          portion={portion}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Phân Khu 4: Timeline Sơ Chế 90 Phút & Nhịp Nấu Tối */}
        <PrepTimeline />

        {/* Phân Khu 5: Thư Viện 11 Công Thức Chế Biến */}
        <RecipeLibrary
          portion={portion}
          onOpenCookingMode={(recipe) => setCookingModeRecipe(recipe)}
        />

        {/* Phân Khu 6: Quy Chuẩn An Toàn Thực Phẩm USDA FSIS */}
        <FoodSafetyGuide portion={portion} />
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
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#143225] text-emerald-100/80 py-10 px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-16">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between text-xs">
          <div className="space-y-1">
            <p className="font-bold text-white text-sm">
              Cẩm Nang Thực Hành Nấu Ăn & Quản Lý Ngân Sách · Kế Hoạch 4 Tuần (Tuần 1)
            </p>
            <p className="text-emerald-300/80">
              Thực Đơn Eat Clean Tuần 1: 42 Suất Ăn Đủ Chất Chỉ Với 885.000 Đồng · Dự toán lập ngày 30/09/2026
            </p>
          </div>

          <div className="text-emerald-400/80 text-[11px] sm:text-right space-y-0.5">
            <p>Chuẩn bảo quản lạnh & vệ sinh an toàn: USDA FSIS & FoodSafety.gov</p>
            <p className="text-amber-400 font-medium">Toàn bộ 8 Slide Hướng Dẫn Tuần 1 được tích hợp đầy đủ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
