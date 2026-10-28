import React, { useState } from 'react';
import { Calendar, Sun, Sunset, Moon, ArrowRight, Info, Sparkles, ChefHat } from 'lucide-react';
import { PortionSize } from '../types';
import { MEAL_PLAN_7_DAYS } from '../data/eatCleanData';
import { scaleTextNumbers, calculateScaleFactor } from '../utils/calculator';

interface MealMatrixProps {
  portion: PortionSize;
  onOpenRecipeModal?: (recipeTitle: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const MealMatrix: React.FC<MealMatrixProps> = ({
  portion,
  onOpenRecipeModal,
  onNavigateToTab,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all'); // 'all' or 'T2', 'T3', etc.
  const factor = calculateScaleFactor(portion);

  const filteredDays = selectedDay === 'all'
    ? MEAL_PLAN_7_DAYS
    : MEAL_PLAN_7_DAYS.filter((d) => d.shortName === selectedDay);

  return (
    <section id="meal-plan" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            PHÂN KHU 2 • NGUỒN TỪ SLIDE 02
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif">
            Ma Trận Thực Đơn 7 Ngày: Nấu 4 Suất Buổi Tối Để Giải Phóng Bữa Trưa
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Định lượng tính cho {portion} người lớn. Bữa tối Thứ Hai đến Thứ Bảy nấu mẻ {4 * factor} suất (gồm {2 * factor} suất ăn tối nay + {2 * factor} suất cất hộp ăn trưa mai).
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedDay === 'all'
                ? 'bg-[#1B4332] text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            Toàn bộ 7 ngày
          </button>
          {MEAL_PLAN_7_DAYS.map((day) => (
            <button
              key={day.shortName}
              type="button"
              onClick={() => setSelectedDay(day.shortName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDay === day.shortName
                  ? 'bg-[#1B4332] text-white shadow'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              {day.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* 2 Principle Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1 */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Nguyên tắc định lượng gạo & tinh bột ({portion} người)</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Mỗi bữa cơm {portion} người dùng <strong className="text-amber-900">{Math.round(160 * factor)} g</strong> gạo khô; mẻ nấu 4 suất tối dùng <strong className="text-amber-900">{Math.round(320 * factor)} g</strong> gạo khô. Cả tuần 14 bữa cơm dùng <strong className="text-amber-900">{Math.round(2240 * factor)} g</strong> gạo + <strong className="text-amber-900">{Math.round(160 * factor)} g</strong> nấu cháo Chủ Nhật = <strong className="text-amber-950 font-bold">{Math.round(2400 * factor)} g</strong> gạo (có thể dùng gạo trắng hoặc pha gạo lứt đều được).
          </p>
        </div>

        {/* Box 2 */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nguyên tắc cân nguyên liệu tươi & linh hoạt khẩu phần</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Rau củ tính theo khối lượng mua trước sơ chế (<strong className="text-emerald-900">{(6.0 * factor).toFixed(1)} kg rau</strong>: gồm {(5.7 * factor).toFixed(1)} kg trong món + {(0.3 * factor).toFixed(1)} kg dưa leo ăn kèm); thịt đã lọc sạch da/mỡ, cá cân nguyên con. Người vận động nhiều tập gym có thể tăng thêm cơm/khoai lang trích từ Quỹ dự phòng.
          </p>
        </div>
      </div>

      {/* Days Meal Plan Cards */}
      <div className="space-y-6">
        {filteredDays.map((day) => (
          <div
            key={day.shortName}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Day Header Bar */}
            <div className="bg-[#FAF8F5] border-b border-stone-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {day.shortName}
                </span>
                <span className="text-lg font-bold text-stone-900 font-serif">
                  {day.dayName}
                </span>
              </div>
              <div className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                Khẩu phần {portion} người • 3 bữa đủ chất
              </div>
            </div>

            {/* 3 Meals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
              {/* BỮA SÁNG */}
              <div className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      Bữa Sáng ({portion} người)
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      ⏱ {day.breakfast.prepTime}
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative shadow-inner">
                    <img
                      src={day.breakfast.image}
                      alt={day.breakfast.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {day.breakfast.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {day.breakfast.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-stone-500 font-normal block mb-0.5">Định lượng:</span>
                    {scaleTextNumbers(day.breakfast.ingredients, factor)}
                  </div>
                </div>
              </div>

              {/* BỮA TRƯA */}
              <div className="p-5 flex flex-col justify-between space-y-4 bg-emerald-50/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                      <Sunset className="w-3.5 h-3.5 text-emerald-600" />
                      Bữa Trưa ({2 * factor} suất hộp)
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Hộp mang đi / tại nhà
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative shadow-inner">
                    <img
                      src={day.lunch.image}
                      alt={day.lunch.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-950/85 backdrop-blur-sm rounded-md text-[11px] font-medium text-emerald-200 border border-emerald-500/30">
                      Rảnh tay 100%
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {day.lunch.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {day.lunch.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  {/* Meal prep origin badge */}
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-900 font-semibold">Nguồn gốc mẻ nấu:</strong>
                      {day.lunch.source}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                    <span className="text-stone-500 font-normal block mb-0.5">Định lượng:</span>
                    {scaleTextNumbers(day.lunch.ingredients, factor)}
                  </div>
                </div>
              </div>

              {/* BỮA TỐI */}
              <div className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B4332] text-emerald-200 text-xs font-bold">
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                      Bữa Tối (Nấu mẻ {day.dinner.servingsCount * factor} suất)
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      ⏱ 20–30 phút
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative shadow-inner">
                    <img
                      src={day.dinner.image}
                      alt={day.dinner.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold shadow">
                      Tâm đạt 74°C
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {day.dinner.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {day.dinner.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="text-xs font-semibold text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-emerald-700 font-normal block mb-0.5">Định lượng mẻ nấu ({day.dinner.servingsCount * factor} suất):</span>
                    {scaleTextNumbers(day.dinner.ingredients, factor)}
                  </div>

                  <div className="p-2 rounded-lg bg-stone-100 text-[11px] text-stone-600 flex items-start gap-1">
                    <span className="text-amber-600 font-bold">Lưu ý:</span>
                    <span>{day.dinner.prepNote}</span>
                  </div>

                  {onNavigateToTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('recipes')}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-stone-100 hover:bg-[#1B4332] text-stone-700 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Xem chi tiết công thức nấu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Notice */}
      <div className="text-center p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600">
        📌 <strong>Lưu ý quan trọng từ Slide 02:</strong> Không cộng trùng nguyên liệu ở bữa trưa Thứ Ba–Chủ Nhật vì đã nằm trọn trong mẻ 4 suất nấu tối hôm trước • Trái cây (1,5 kg chuối + 1,0 kg ổi) dùng tráng miệng lành mạnh sau các bữa ăn.
      </div>
    </section>
  );
};
