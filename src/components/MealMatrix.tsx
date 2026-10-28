import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sunset, Moon, ArrowRight, Info, ChefHat } from 'lucide-react';
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
  onNavigateToTab,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const factor = calculateScaleFactor(portion);

  const filteredDays = selectedDay === 'all'
    ? MEAL_PLAN_7_DAYS
    : MEAL_PLAN_7_DAYS.filter((d) => d.shortName === selectedDay);

  return (
    <motion.section
      id="meal-plan"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-emerald-800 text-xs font-semibold tracking-wider mb-1.5">
            01. Lịch Thực Đơn Tuần · Nguồn từ Slide 02
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Ma Trận Thực Đơn 7 Ngày: Nấu 4 Suất Buổi Tối Để Giải Phóng Bữa Trưa
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Định lượng tính cho {portion} người lớn. Bữa tối Thứ Hai đến Thứ Bảy nấu mẻ {4 * factor} suất (gồm {2 * factor} suất ăn tối nay + {2 * factor} suất cất hộp ăn trưa mai).
          </p>
        </div>

        {/* Day Filter Segmented Control - 4 cols on iPhone, flex on tablet/desktop */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`col-span-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-[#1B4332] text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            Cả tuần
          </button>
          {MEAL_PLAN_7_DAYS.map((day) => (
            <button
              key={day.shortName}
              type="button"
              onClick={() => setSelectedDay(day.shortName)}
              className={`col-span-1 px-2.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
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
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2"
        >
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Nguyên tắc định lượng gạo & tinh bột ({portion} người)</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed tabular-nums">
            Mỗi bữa cơm {portion} người dùng <strong className="text-amber-900">{Math.round(160 * factor)} g</strong> gạo khô; mẻ nấu 4 suất tối dùng <strong className="text-amber-900">{Math.round(320 * factor)} g</strong> gạo khô. Cả tuần 14 bữa cơm dùng <strong className="text-amber-900">{Math.round(2240 * factor)} g</strong> gạo + <strong className="text-amber-900">{Math.round(160 * factor)} g</strong> nấu cháo Chủ Nhật = <strong className="text-amber-950 font-bold">{Math.round(2400 * factor)} g</strong> gạo (dùng gạo trắng hoặc pha gạo lứt đều được).
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-2"
        >
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nguyên tắc cân nguyên liệu tươi & linh hoạt khẩu phần</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed tabular-nums">
            Rau củ tính theo khối lượng mua trước sơ chế (<strong className="text-emerald-900">{(6.0 * factor).toFixed(1)} kg rau</strong>: gồm {(5.7 * factor).toFixed(1)} kg trong món + {(0.3 * factor).toFixed(1)} kg dưa leo ăn kèm); thịt đã lọc sạch da/mỡ, cá cân nguyên con. Người vận động nhiều có thể tăng cơm/khoai từ Quỹ dự phòng.
          </p>
        </motion.div>
      </div>

      {/* Days Meal Plan Cards with Smooth Scroll & Filter Animations */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredDays.map((day, idx) => (
            <motion.div
              key={day.shortName}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
            >
              {/* Day Header Bar */}
              <div className="bg-[#FAF8F5] border-b border-stone-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm">
                    {day.shortName}
                  </span>
                  <span className="text-lg font-bold text-stone-900 font-serif">
                    {day.dayName}
                  </span>
                </div>
                <div className="text-xs font-medium text-stone-500">
                  Khẩu phần {portion} người · 3 bữa đủ chất
                </div>
              </div>

              {/* 3 Meals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                {/* BỮA SÁNG */}
                <div className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span className="inline-flex items-center gap-1.5 font-bold text-amber-800">
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                        Bữa Sáng ({portion} người)
                      </span>
                      <span className="text-stone-500 tabular-nums">
                        {day.breakfast.prepTime}
                      </span>
                    </div>

                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={day.breakfast.image}
                        alt={day.breakfast.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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

                  <div className="pt-3 border-t border-stone-100">
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 tabular-nums">
                      <span className="text-stone-500 font-normal block mb-0.5">Định lượng:</span>
                      {scaleTextNumbers(day.breakfast.ingredients, factor)}
                    </div>
                  </div>
                </div>

                {/* BỮA TRƯA */}
                <div className="p-5 flex flex-col justify-between space-y-4 bg-emerald-50/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-900">
                        <Sunset className="w-3.5 h-3.5 text-emerald-600" />
                        Bữa Trưa ({2 * factor} suất hộp)
                      </span>
                      <span className="text-emerald-700 font-medium">
                        Hộp mang đi / tại nhà
                      </span>
                    </div>

                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={day.lunch.image}
                        alt={day.lunch.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5">
                        <span className="text-[11px] font-medium text-emerald-200">
                          Rảnh tay buổi trưa · Chỉ cần hâm nóng ≥ 74°C
                        </span>
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
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-900 font-semibold">Nguồn gốc mẻ nấu:</strong>
                        {day.lunch.source}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 tabular-nums">
                      <span className="text-stone-500 font-normal block mb-0.5">Định lượng:</span>
                      {scaleTextNumbers(day.lunch.ingredients, factor)}
                    </div>
                  </div>
                </div>

                {/* BỮA TỐI */}
                <div className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#1B4332]">
                        <Moon className="w-3.5 h-3.5 text-amber-600" />
                        Bữa Tối (Nấu mẻ {day.dinner.servingsCount * factor} suất)
                      </span>
                      <span className="text-stone-500 font-medium tabular-nums">
                        20–30 phút
                      </span>
                    </div>

                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={day.dinner.image}
                        alt={day.dinner.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5 flex justify-end">
                        <span className="text-[11px] font-bold text-amber-300">
                          Tâm đạt 74°C
                        </span>
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
                    <div className="text-xs font-semibold text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 tabular-nums">
                      <span className="text-emerald-700 font-normal block mb-0.5">Định lượng mẻ nấu ({day.dinner.servingsCount * factor} suất):</span>
                      {scaleTextNumbers(day.dinner.ingredients, factor)}
                    </div>

                    <div className="p-2 rounded-lg bg-stone-100 text-[11px] text-stone-600 flex items-start gap-1">
                      <span className="text-amber-700 font-bold shrink-0">Lưu ý:</span>
                      <span>{day.dinner.prepNote}</span>
                    </div>

                    {onNavigateToTab && (
                      <motion.button
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigateToTab('recipes')}
                        className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-stone-100 hover:bg-[#1B4332] text-stone-700 hover:text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Xem chi tiết công thức nấu</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Notice */}
      <div className="text-center p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600">
        <strong>Lưu ý quan trọng từ Slide 02:</strong> Không cộng trùng nguyên liệu ở bữa trưa Thứ Ba–Chủ Nhật vì đã nằm trọn trong mẻ 4 suất nấu tối hôm trước · Trái cây (1,5 kg chuối + 1,0 kg ổi) dùng tráng miệng lành mạnh sau các bữa ăn.
      </div>
    </motion.section>
  );
};
