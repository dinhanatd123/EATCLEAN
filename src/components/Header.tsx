import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  DollarSign,
  Wallet,
  ShieldCheck,
  Flame,
  Calendar,
  ShoppingCart,
  Clock,
  ChefHat,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { PortionSize, BudgetTierId } from '../types';
import { calculateBudgetTotals, formatVND, calculateScaleFactor } from '../utils/calculator';
import { BUDGET_TIERS_METADATA, GROCERY_BY_TIER } from '../data/flexibleEatCleanData';

interface HeaderProps {
  portion: PortionSize;
  onPortionChange: (portion: PortionSize) => void;
  budgetTier: BudgetTierId;
  onBudgetTierChange: (tier: BudgetTierId) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TIER_ORDER: BudgetTierId[] = ['885k', '1m', '2m', '3.5m', '5m'];
const FLEX_COMPARISON_TIERS: BudgetTierId[] = ['1m', '2m', '3.5m', '5m'];

export const Header: React.FC<HeaderProps> = ({
  portion,
  onPortionChange,
  budgetTier,
  onBudgetTierChange,
  activeTab,
  onTabChange,
}) => {
  const [showTierMatrix, setShowTierMatrix] = useState<boolean>(false);
  const currentItems = GROCERY_BY_TIER[budgetTier];
  const budget = calculateBudgetTotals(currentItems, portion, undefined, budgetTier);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];
  const factor = calculateScaleFactor(portion);

  const navItems = [
    { id: 'meal-plan', label: 'Ma Trận 7 Ngày', icon: Calendar },
    { id: 'grocery', label: 'Giỏ Đi Chợ & Ngân Sách', icon: ShoppingCart },
    { id: 'prep', label: 'Sơ Chế 90 Phút', icon: Clock },
    { id: 'recipes', label: 'Công Thức Nấu', icon: ChefHat },
    { id: 'safety', label: 'Chuẩn An Toàn USDA', icon: ShieldCheck },
  ];

  const kpiCards = [
    {
      label: 'Quy mô phục vụ',
      icon: Users,
      iconColor: 'text-emerald-400',
      value: `${portion} người · 7 ngày`,
      valueColor: 'text-white',
      sub: portion === 1 ? '21 bữa = 21 suất ăn' : portion === 2 ? '21 bữa = 42 suất ăn' : '21 bữa = 84 suất ăn',
    },
    {
      label: 'Ngân sách trần/tuần',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      value: formatVND(budget.ceilingBudget),
      valueColor: 'text-white',
      sub: `(${formatVND(budget.ceilingBudget * 4)}/tháng)`,
    },
    {
      label: 'Tổng dự toán đi chợ',
      icon: Wallet,
      iconColor: 'text-amber-400',
      value: formatVND(budget.totalCost),
      valueColor: 'text-amber-300',
      sub: `~${formatVND(budget.costPerServing)}/suất ăn`,
    },
    {
      label: 'Quỹ dự phòng còn lại',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      value: formatVND(budget.contingencyRemaining),
      valueColor: 'text-emerald-200',
      sub: `${budget.contingencyPercent} quỹ tuần phòng trượt giá`,
    },
  ];

  return (
    <header className="bg-gradient-to-b from-[#143225] via-[#1B4332] to-[#24523E] text-white pt-6 sm:pt-9 pb-8 sm:pb-10 px-3.5 sm:px-6 lg:px-8 border-b border-emerald-700/50 shadow-xl overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-7">
        {/* Top Kicker & Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-2.5 sm:space-y-3"
        >
          <div className="text-emerald-300 text-[11px] sm:text-sm font-semibold tracking-wide sm:tracking-wider leading-snug px-1">
            Cẩm Nang Thực Hành Nấu Ăn & Quản Lý Ngân Sách Linh Hoạt · Kế Hoạch 1 Tuần ({portion * 21} Suất Ăn)
          </div>

          <h1 className="text-[22px] sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.25] sm:leading-tight max-w-4xl mx-auto text-balance">
            Thực Đơn Eat Clean Linh Hoạt: <span className="text-amber-400 tabular-nums">{portion * 21} Suất Ăn Đủ Chất</span> Với <span className="text-emerald-300 tabular-nums whitespace-nowrap">{formatVND(budget.totalCost)}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-emerald-100/90 text-xs sm:text-base leading-relaxed px-1">
            Hệ thống thực đơn phân tầng từ <strong>1,0Tr • 2,0Tr • 3,5Tr • 5,0Tr/tuần</strong> (chuẩn 2 người), giữ nguyên cấu trúc dinh dưỡng: <strong>30% Đạm chất lượng cao – 45% Tinh bột hấp thu chậm – 25% Chất béo tốt</strong> cùng {budget.totalKgVeggies} kg rau củ tươi.
          </p>
        </motion.div>

        {/* Budget Tier & Portion Switcher Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#112d22]/90 border border-emerald-600/40 rounded-2xl p-3.5 sm:p-6 shadow-lg backdrop-blur-sm space-y-4"
        >
          {/* Row 1: Budget Tier Selector */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1. Chọn Phân Khúc Ngân Sách Tuần (Tự động đổi thực đơn & giỏ đi chợ):</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTierMatrix(!showTierMatrix)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{showTierMatrix ? 'Thu gọn bảng so sánh 4 mức' : 'Xem bảng so sánh 4 mức (1Tr–5Tr)'}</span>
                {showTierMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 5 Budget Tier Buttons - Responsive Grid on iPhone, Flex on Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {TIER_ORDER.map((tId, idx) => {
                const meta = BUDGET_TIERS_METADATA[tId];
                const isSelected = budgetTier === tId;
                const scaledCeiling = meta.ceilingBudget * factor;
                const scaledPlanned = meta.plannedCost * factor;
                const isLastOddOnMobile = idx === TIER_ORDER.length - 1;

                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => onBudgetTierChange(tId)}
                    className={`${
                      isLastOddOnMobile ? 'col-span-2 sm:col-span-1' : ''
                    } p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-300/60'
                        : 'bg-emerald-950/80 text-emerald-100 border-emerald-700/60 hover:bg-emerald-900/80 hover:border-emerald-500/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-extrabold ${isSelected ? 'text-stone-950' : 'text-amber-300'}`}>
                        {meta.shortLabel}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-stone-950 shrink-0 stroke-[3]" />}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold tabular-nums mt-1 ${isSelected ? 'text-stone-950' : 'text-white'}`}>
                      Dự toán: {formatVND(scaledPlanned)}
                    </div>
                    <div className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight line-clamp-1 ${isSelected ? 'text-stone-900 font-medium' : 'text-emerald-300/80'}`}>
                      Trần {formatVND(scaledCeiling)} · {tId === '885k' ? 'Tuần 1 gốc' : tId === '1m' ? 'Chợ dân sinh' : tId === '2m' ? 'Tiêu chuẩn' : tId === '3.5m' ? 'Siêu thị' : 'Organic cao cấp'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible 4-Tier Comparison Matrix from Slide 01 */}
          <AnimatePresence>
            {showTierMatrix && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pt-2"
              >
                <div className="bg-emerald-950/90 border border-emerald-700/60 rounded-xl p-3 sm:p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-amber-300 font-bold">
                    <span>Bảng Phân Tầng Ngân Sách 1–5 Triệu/Tuần (Slide 01 · Chuẩn {portion} người)</span>
                    <span className="text-[11px] text-emerald-300 font-normal">Bấm vào mức bất kỳ để chọn</span>
                  </div>

                  {/* Mobile Stacked Cards (< md) */}
                  <div className="md:hidden grid grid-cols-1 gap-2.5">
                    {FLEX_COMPARISON_TIERS.map((tId) => {
                      const m = BUDGET_TIERS_METADATA[tId];
                      const active = budgetTier === tId;
                      return (
                        <div
                          key={tId}
                          onClick={() => onBudgetTierChange(tId)}
                          className={`p-3 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                            active
                              ? 'bg-amber-500/20 border-amber-400 text-white'
                              : 'bg-emerald-900/40 border-emerald-800/80 text-emerald-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-amber-300 text-xs">{m.name}</span>
                            <span className="font-bold text-xs text-white tabular-nums">
                              {formatVND(m.plannedCost * factor)} (~{formatVND(m.costPerServing)}/suất)
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-300 tabular-nums">
                            Quỹ dự phòng: <strong>{formatVND(m.contingencyFund * factor)}</strong> ({m.contingencyPercent})
                          </div>
                          <div className="text-[11px] text-stone-200 leading-snug">
                            <strong className="text-emerald-300">Đạm & Béo:</strong> {m.proteinSummary}
                          </div>
                          <div className="text-[11px] text-stone-200 leading-snug">
                            <strong className="text-emerald-300">Tinh bột & Rau:</strong> {m.carbVeggieSummary}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop 5-Column Table (>= md) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-emerald-800 text-emerald-300">
                          <th className="py-2 pr-3">Phân khúc</th>
                          <th className="py-2 px-2">Dự toán đi chợ</th>
                          <th className="py-2 px-2">Quỹ dự phòng</th>
                          <th className="py-2 px-2">Nguồn đạm & chất béo chủ đạo</th>
                          <th className="py-2 pl-2">Tinh bột chậm & Rau củ quả</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/80">
                        {FLEX_COMPARISON_TIERS.map((tId) => {
                          const m = BUDGET_TIERS_METADATA[tId];
                          const active = budgetTier === tId;
                          return (
                            <tr
                              key={tId}
                              onClick={() => onBudgetTierChange(tId)}
                              className={`cursor-pointer transition-colors ${
                                active ? 'bg-amber-500/20 text-white' : 'hover:bg-emerald-900/50 text-emerald-100'
                              }`}
                            >
                              <td className="py-2.5 pr-3 font-bold text-amber-300 whitespace-nowrap">
                                {m.shortLabel}
                              </td>
                              <td className="py-2.5 px-2 font-bold whitespace-nowrap tabular-nums">
                                {formatVND(m.plannedCost * factor)}
                                <span className="block text-[10px] text-emerald-300 font-normal">
                                  (~{formatVND(m.costPerServing)}/suất)
                                </span>
                              </td>
                              <td className="py-2.5 px-2 whitespace-nowrap tabular-nums text-emerald-200">
                                {formatVND(m.contingencyFund * factor)}
                                <span className="block text-[10px] text-emerald-400">({m.contingencyPercent})</span>
                              </td>
                              <td className="py-2.5 px-2 text-[11px] leading-snug max-w-xs">
                                {m.proteinSummary}
                              </td>
                              <td className="py-2.5 pl-2 text-[11px] leading-snug max-w-xs">
                                {m.carbVeggieSummary}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 2: Active Tier Description + Portion Switcher */}
          <div className="pt-3 border-t border-emerald-800/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Đang xem: {tierMeta.name}</span>
              </div>
              <p className="text-stone-200 text-xs leading-relaxed max-w-3xl">
                {tierMeta.subtitle}. Giữ nguyên quy tắc <strong className="text-white">“Nấu 1 lần buổi tối cho {4 * factor} suất (Tối nay + Trưa mai)”</strong>.
              </p>
            </div>

            {/* Portion switcher - iPhone safe 3-col grid */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 w-full lg:w-auto">
              <span className="text-xs text-emerald-300/90 font-medium">2. Chọn quy mô khẩu phần ăn:</span>
              <div className="grid grid-cols-3 lg:inline-flex gap-1 rounded-xl bg-emerald-950/90 p-1 border border-emerald-700/60 shadow-inner w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => onPortionChange(1)}
                  className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all text-center cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:gap-1 leading-tight ${
                    portion === 1
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <span>1 Người</span>
                  <span className="text-[10px] sm:text-xs opacity-85">(21 suất)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPortionChange(2)}
                  className={`px-1.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all text-center cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:gap-1 leading-tight ${
                    portion === 2
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <span>2 Người</span>
                  <span className="text-[10px] sm:text-xs opacity-85 whitespace-nowrap">(42 suất · Chuẩn)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPortionChange(4)}
                  className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all text-center cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:gap-1 leading-tight ${
                    portion === 4
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  <span>4 Người</span>
                  <span className="text-[10px] sm:text-xs opacity-85">(84 suất)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5 KPI Metric Cards with Staggered Reveal */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, delay: 0.15 + idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 sm:p-4 hover:border-emerald-500/60 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 text-emerald-300 text-[11px] sm:text-xs">
                  <span className="truncate">{card.label}</span>
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${card.iconColor}`} />
                </div>
                <div className="mt-2">
                  <div className={`text-base sm:text-xl font-bold tabular-nums leading-snug ${card.valueColor}`}>
                    {card.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-300/80 mt-0.5 tabular-nums leading-tight">
                    {card.sub}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Card 5: Ingredients structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.45, delay: 0.39, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-2 lg:col-span-1 bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3 sm:p-4 hover:border-emerald-500/60 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-emerald-300 text-[11px] sm:text-xs">
              <span>Định lượng chuẩn cả tuần</span>
              <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="mt-1.5 text-xs text-stone-200 leading-relaxed tabular-nums">
              <span className="font-semibold text-white">{budget.totalKgMeatFish} kg</span> thịt/cá/tôm · <span className="font-semibold text-white">{budget.totalKgTofu} kg</span> đậu · <span className="font-semibold text-white">{budget.totalEggs}</span> trứng · <span className="font-semibold text-white">{budget.totalKgCarbTotal} kg</span> tinh bột chậm · <span className="font-semibold text-white">{budget.totalKgVeggies} kg</span> rau nấm · <span className="font-semibold text-white">{budget.totalKgFruit} kg</span> trái cây
            </div>
          </motion.div>
        </div>

        {/* Quick Navigation Tabs - 2-column grid on iPhone, row on tablet/desktop */}
        <motion.nav
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Phân khu chính"
          className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 pt-1"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLastOdd = index === navItems.length - 1;
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onTabChange(item.id)}
                className={`${isLastOdd ? 'col-span-2 sm:col-span-1' : ''} flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'bg-emerald-950/60 text-emerald-200 hover:text-white hover:bg-emerald-900/80 border border-emerald-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
};
