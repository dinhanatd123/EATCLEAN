import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Share2,
  Check,
  AlertCircle,
  PiggyBank,
  ArrowRightLeft,
  Sliders,
  BarChart3,
} from 'lucide-react';
import { PortionSize, BudgetTierId } from '../types';
import {
  GROCERY_BY_TIER,
  BREAKDOWN_BY_TIER,
  BUDGET_TIERS_METADATA,
} from '../data/flexibleEatCleanData';
import {
  calculateScaleFactor,
  formatVND,
} from '../utils/calculator';

interface GroceryBudgetProps {
  portion: PortionSize;
  budgetTier: BudgetTierId;
  onBudgetTierChange: (tier: BudgetTierId) => void;
  onOpenExportModal: () => void;
}

const STORAGE_KEY_CHECKED = 'eatclean_groceries_checked_v2';
const STORAGE_KEY_SWAP = 'eatclean_smart_swapped_v2';

export const GroceryBudget: React.FC<GroceryBudgetProps> = ({
  portion,
  budgetTier,
  onBudgetTierChange,
  onOpenExportModal,
}) => {
  const factor = calculateScaleFactor(portion);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];
  const baseItems = GROCERY_BY_TIER[budgetTier];
  const breakdownGroups = BREAKDOWN_BY_TIER[budgetTier];

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSmartSwapped, setIsSmartSwapped] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SWAP) === 'true';
    } catch {
      return false;
    }
  });

  // Intermediate Odd Budget Upgrades from Slide 04 (1,5Tr • 2,5Tr • 4,0Tr)
  const [upgradeMondaySalmon, setUpgradeMondaySalmon] = useState<boolean>(false); // +250k/500g
  const [upgradeFridayBeef, setUpgradeFridayBeef] = useState<boolean>(false); // +280k/600g

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(checkedMap));
    } catch (e) {
      console.warn('Failed saving checked groceries', e);
    }
  }, [checkedMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SWAP, isSmartSwapped ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed saving swap state', e);
    }
  }, [isSmartSwapped]);

  const toggleCheck = (id: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetChecks = () => {
    setCheckedMap({});
  };

  const handleSelectAll = () => {
    const all: Record<string, boolean> = {};
    baseItems.forEach((item) => {
      all[item.id] = true;
    });
    setCheckedMap(all);
  };

  const isLowTier = budgetTier === '885k' || budgetTier === '1m';
  const swapSavingBase = isLowTier ? 36000 : 60000;

  const effectiveItems = baseItems.map((item, idx) => {
    // Apply Smart Swap on the primary meat item
    if (isSmartSwapped && idx === 0) {
      if (isLowTier) {
        return {
          ...item,
          name: `${item.name} (Đã hoán đổi 600g heo ➔ 600g ức gà, tiết kiệm ${formatVND(36000 * factor)})`,
          baseTotalPrice: item.baseTotalPrice - 36000,
        };
      }
      return {
        ...item,
        name: `${item.name} (Đã đổi 600g thăn bò ➔ 600g ức vịt/cá thu, tiết kiệm ${formatVND(60000 * factor)})`,
        baseTotalPrice: item.baseTotalPrice - 60000,
      };
    }
    return item;
  });

  const filteredItems = effectiveItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || item.shopPhase === selectedPhase;
    return matchesCategory && matchesPhase;
  });

  const upgradeAddonCost =
    ((upgradeMondaySalmon ? 250000 : 0) + (upgradeFridayBeef ? 280000 : 0)) * factor;

  const totalPlannedCost =
    effectiveItems.reduce((acc, it) => acc + it.baseTotalPrice * factor, 0) + upgradeAddonCost;

  const totalSpent = effectiveItems.reduce((acc, it) => {
    return checkedMap[it.id] ? acc + it.baseTotalPrice * factor : acc;
  }, 0);
  const remainingInPlan = Math.max(0, totalPlannedCost - totalSpent);
  const percentDone = totalPlannedCost > 0 ? Math.round((totalSpent / totalPlannedCost) * 100) : 0;

  const categories = ['all', 'Đạm', 'Tinh bột', 'Rau củ', 'Trái cây'];

  // 4-Tier Comparison Rows from Slide 04
  const slide04ComparisonRows = [
    {
      group: '1. Đạm thịt & gia cầm (1,9 kg)',
      desc: 'Đùi gà/heo (M1) • Gà ta/bò Việt (M2) • Bò Úc/vịt/gà hữu cơ (M3–4)',
      m1: 195000,
      m2: 380000,
      m3: 680000,
      m4: 980000,
    },
    {
      group: '2. Đạm cá & hải sản (1,6 kg)',
      desc: 'Cá nục/tôm nhỏ (M1) • Cá chẽm/tôm (M2) • Cá hồi/tuyết/tôm sú/sò điệp (M3–4)',
      m1: 145000,
      m2: 380000,
      m3: 740000,
      m4: 1120000,
    },
    {
      group: '3. Đậu hũ & Trứng (1,6 kg + 20 quả)',
      desc: 'Đậu trắng/trứng thường (M1–2) • Đậu hữu cơ/trứng gà ta/Omega-3 (M3–4)',
      m1: 110000,
      m2: 180000,
      m3: 280000,
      m4: 380000,
    },
    {
      group: '4. Tinh bột phức hợp (4,9 kg)',
      desc: '2,4kg gạo lứt/Quinoa + 0,5kg yến mạch + 2,0kg khoai lang mật/Nhật & bắp',
      m1: 135000,
      m2: 210000,
      m3: 320000,
      m4: 440000,
    },
    {
      group: '5. Rau củ, Nấm & Bơ (6,0 kg)',
      desc: 'Cải, muống, bầu, cô ve, bí đỏ (M1) • Bông cải, măng tây, nấm đông cô, bơ (M2–4)',
      m1: 150000,
      m2: 260000,
      m3: 450000,
      m4: 650000,
    },
    {
      group: '6. Trái cây, Sữa, Hạt & Dầu (2,8 kg + 1L + 250g)',
      desc: 'Lạc/điều/óc chó/mắc ca + sữa tươi/Hy Lạp/sữa hạt + dầu cải/ô liu EVOO',
      m1: 175000,
      m2: 410000,
      m3: 710000,
      m4: 980000,
    },
  ];

  return (
    <section
      id="grocery"
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-emerald-800 text-xs font-semibold tracking-wider mb-1.5">
            02. Quản Lý Đi Chợ & Phân Bổ Ngân Sách 1–5 Triệu · Nguồn từ Slide 01 & Slide 04
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Danh Sách Đi Chợ ({tierMeta.shortLabel}) · Dự Toán <span className="tabular-nums text-amber-700">{formatVND(totalPlannedCost)}</span>
          </h2>
          <p className="text-stone-600 text-sm mt-1 tabular-nums">
            Giữ nguyên định lượng chuẩn ({(13.7 * factor).toFixed(1)} kg thực phẩm tươi/tuần cho {portion} người); tỷ trọng nhóm Đạm luôn chiếm 45–50% dự toán ở mọi phân khúc.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-stone-950" />
            <span>Xuất Zalo / In ấn</span>
          </motion.button>
        </div>
      </div>

      {/* Progress & Live Spent Gauge */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-stone-500">
              Tiến độ mua sắm giỏ hàng tuần ({tierMeta.name})
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 tabular-nums">
              Đã nhặt: <span className="text-emerald-700">{formatVND(totalSpent)}</span>{' '}
              <span className="text-sm font-normal text-stone-500">
                / {formatVND(totalPlannedCost)} ({percentDone}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Chọn tất cả
            </button>
            <button
              type="button"
              onClick={handleResetChecks}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Đặt lại giỏ</span>
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.min(1, percentDone / 100) }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-emerald-600 h-full w-full rounded-full origin-left"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-1 tabular-nums">
          <span>Còn lại cần chi: <strong>{formatVND(remainingInPlan)}</strong></span>
          <span>Quỹ dự phòng an toàn: <strong className="text-emerald-700">{formatVND(tierMeta.contingencyFund * factor)}</strong> ({tierMeta.contingencyPercent} ngân sách trần)</span>
        </div>
      </div>

      {/* Main Grid: Left = Shopping Table + Odd Budget Customizer, Right = Budget Breakdown & Swap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Interactive Checklist & Odd Budget Customizer */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Tier Pills inside Grocery Section */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-emerald-950/5 rounded-xl border border-emerald-900/15">
            <span className="text-xs font-bold text-[#1B4332] px-2">Đổi nhanh mức ngân sách:</span>
            {(['885k', '1m', '2m', '3.5m', '5m'] as BudgetTierId[]).map((tId) => (
              <button
                key={tId}
                type="button"
                onClick={() => onBudgetTierChange(tId)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  budgetTier === tId
                    ? 'bg-[#1B4332] text-amber-300 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {BUDGET_TIERS_METADATA[tId].shortLabel}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 bg-stone-100 rounded-xl border border-stone-200">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1B4332] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả nhóm' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-1.5 border-t sm:border-t-0 sm:border-l border-stone-300 sm:pl-2.5 pt-2 sm:pt-0">
              <span className="text-xs sm:text-[11px] text-stone-500 font-medium">Chuyến đi chợ:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedPhase('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-[11px] font-medium cursor-pointer ${
                    selectedPhase === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Cả 2
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhase('Chủ Nhật')}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-[11px] font-medium cursor-pointer ${
                    selectedPhase === 'Chủ Nhật' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Chủ Nhật
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhase('Giữa tuần')}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-[11px] font-medium cursor-pointer ${
                    selectedPhase === 'Giữa tuần' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Giữa tuần
                </button>
              </div>
            </div>
          </div>

          {/* Table Items - Responsive for iPhone & Desktop */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="w-full">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F5] text-stone-700 text-xs font-semibold border-b border-stone-200">
                  <tr>
                    <th scope="col" className="p-2.5 sm:p-3.5 w-10 sm:w-12 text-center">Mua</th>
                    <th scope="col" className="p-2.5 sm:p-3.5">Nguyên liệu & Phân chia</th>
                    <th scope="col" className="hidden sm:table-cell p-3.5 text-right">Lượng mua</th>
                    <th scope="col" className="p-2.5 sm:p-3.5 text-right">Định lượng / Giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredItems.map((item) => {
                    const isChecked = !!checkedMap[item.id];
                    const itemTotal = item.baseTotalPrice * factor;
                    const qtyDisplay = factor === 1 ? item.baseAmount : `${(item.baseQty * factor).toFixed(1)} ${item.unit}`;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/40 text-stone-400'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <td className="p-2.5 sm:p-3.5 text-center align-top sm:align-middle pt-3.5 sm:pt-3.5">
                          <button
                            type="button"
                            aria-label={`Đánh dấu ${item.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCheck(item.id);
                            }}
                            className="text-emerald-700 hover:scale-110 transition-transform cursor-pointer"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300" />
                            )}
                          </button>
                        </td>
                        <td className="p-2.5 sm:p-3.5">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            <span
                              className={`font-semibold text-xs sm:text-sm ${
                                isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs text-stone-400">·</span>
                            <span className="text-[11px] sm:text-xs text-stone-500">{item.category}</span>
                            <span className="text-xs text-stone-400">·</span>
                            <span className="text-[11px] sm:text-xs text-amber-700 font-medium">{item.shopPhase}</span>
                          </div>
                          <div
                            className={`text-[11px] sm:text-xs mt-1 leading-snug ${
                              isChecked ? 'text-stone-400 line-through' : 'text-stone-500'
                            }`}
                          >
                            {item.distribution}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell p-3.5 text-right font-medium text-stone-700 whitespace-nowrap tabular-nums">
                          {qtyDisplay}
                        </td>
                        <td className="p-2.5 sm:p-3.5 text-right align-top sm:align-middle whitespace-nowrap tabular-nums">
                          <div className="font-bold text-xs sm:text-sm text-stone-900">
                            <span className={isChecked ? 'line-through text-stone-400' : 'text-emerald-900'}>
                              {formatVND(itemTotal)}
                            </span>
                          </div>
                          <div className="sm:hidden text-[11px] font-medium text-stone-500 mt-0.5">
                            {qtyDisplay}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-stone-500 text-sm">
                Không tìm thấy nguyên liệu trong bộ lọc này.
              </div>
            )}
          </div>

          {/* Odd Budget Customizer (1,5 Triệu • 2,5 Triệu • 4,0 Triệu/tuần) from Slide 04 */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <Sliders className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-950 text-sm sm:text-base">
                  Tùy Biến Ngân Sách Lẻ (1,5 Triệu • 2,5 Triệu • 4,0 Triệu/tuần · Slide 04)
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Để thiết lập mức ngân sách nằm giữa các mốc chuẩn, giữ nguyên khung đi chợ hiện tại rồi nâng cấp 1 hoặc 2 bữa tối chủ lực (Thứ Hai & Thứ Sáu) sang Cá hồi phi lê hoặc Thăn bò Úc:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setUpgradeMondaySalmon(!upgradeMondaySalmon)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  upgradeMondaySalmon
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${upgradeMondaySalmon ? 'text-amber-400' : 'text-stone-300'}`} />
                <div>
                  <div className="font-bold">Nâng cấp Tối Thứ Hai ➔ Cá hồi phi lê</div>
                  <div className={`text-[11px] mt-0.5 tabular-nums ${upgradeMondaySalmon ? 'text-emerald-200' : 'text-stone-500'}`}>
                    +{formatVND(250000 * factor)} / {Math.round(500 * factor)}g cá hồi
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUpgradeFridayBeef(!upgradeFridayBeef)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  upgradeFridayBeef
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-400'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${upgradeFridayBeef ? 'text-amber-400' : 'text-stone-300'}`} />
                <div>
                  <div className="font-bold">Nâng cấp Tối Thứ Sáu ➔ Thăn bò Úc</div>
                  <div className={`text-[11px] mt-0.5 tabular-nums ${upgradeFridayBeef ? 'text-emerald-200' : 'text-stone-500'}`}>
                    +{formatVND(280000 * factor)} / {Math.round(600 * factor)}g bò Úc
                  </div>
                </div>
              </button>
            </div>

            {(upgradeMondaySalmon || upgradeFridayBeef) && (
              <div className="text-xs font-semibold text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between tabular-nums">
                <span>Tổng dự toán sau nâng cấp bữa chủ lực:</span>
                <span className="text-sm font-extrabold text-amber-700">{formatVND(totalPlannedCost)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Budget Structure & Price Fluctuation Strategy */}
        <div className="lg:col-span-5 space-y-6">
          {/* Budget Structure Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-700" />
                <span>Cơ Cấu Ngân Sách ({tierMeta.shortLabel} · Trần {formatVND(tierMeta.ceilingBudget * factor)})</span>
              </h3>
              <span className="text-xs text-stone-500 font-medium">Slide 04</span>
            </div>

            <div className="space-y-3">
              {breakdownGroups.map((group) => {
                const scaledAmount = group.amount * factor;
                return (
                  <div key={group.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium tabular-nums gap-2">
                      <span className="text-stone-700 truncate">{group.name}</span>
                      <span className="font-bold text-stone-900 shrink-0">
                        {formatVND(scaledAmount)} ({group.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${group.ceilingPercent}%`,
                          backgroundColor: group.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Quỹ dự phòng bar */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs font-medium text-emerald-800 tabular-nums">
                  <span className="font-semibold">Quỹ dự phòng an toàn</span>
                  <span className="font-bold">{formatVND(tierMeta.contingencyFund * factor)} ({tierMeta.contingencyPercent} trần)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full w-[10%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              * Nguyên tắc “Bất biến Dinh dưỡng – Linh hoạt Nguyên liệu”: Dù ở mức 1 triệu hay 5 triệu, mỗi người đều nhận đủ 1,4–1,6g Protein/kg cân nặng/ngày (~58–65g đạm nguyên chất/người/ngày).
            </div>
          </div>

          {/* Strategy for Market Price Fluctuation */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-300/80 p-5 space-y-4">
            <div className="flex items-start gap-2 text-amber-900 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4>Nguyên Tắc Hoán Đổi Đồng Giá Khi Chợ Biến Động</h4>
                <p className="text-xs font-normal text-amber-800 mt-0.5">
                  Bảo vệ ngân sách gia đình không bị thâm hụt mà vẫn giữ nguyên hàm lượng đạm chuẩn.
                </p>
              </div>
            </div>

            <ul className="text-xs text-stone-700 space-y-2 list-disc list-inside tabular-nums">
              <li>
                <strong>Quỹ dự phòng {formatVND(tierMeta.contingencyFund * factor)}:</strong> Hấp thụ 9–11,5% biến động giá thời tiết hoặc tăng khẩu phần.
              </li>
              <li>
                <strong>Ở Mức 1 (Chợ dân sinh):</strong> Hoán đổi 600g nạc heo sang 600g ức gà/má đùi gà giúp tiết kiệm ngay <strong>{formatVND(36000 * factor)}</strong>.
              </li>
              <li>
                <strong>Ở Mức 2–4 (Siêu thị/Nâng cao):</strong> Thay 600g thăn bò Việt ({formatVND(180000 * factor)}) bằng 600g ức vịt phi lê hoặc cá thu ({formatVND(120000 * factor)}) để tiết kiệm ngay <strong>{formatVND(60000 * factor)}</strong>.
              </li>
            </ul>

            {/* Smart Swap Simulator Interactive Widget */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isLowTier ? 'Mô phỏng đổi Heo ➔ Gà' : 'Mô phỏng đổi Thăn bò ➔ Ức vịt/Cá thu'}</span>
                </span>
                <span className="text-emerald-800 font-bold tabular-nums shrink-0">
                  Tiết kiệm {formatVND(swapSavingBase * factor)}
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSmartSwapped(!isSmartSwapped)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center leading-snug ${
                  isSmartSwapped
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {isSmartSwapped ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>Đang kích hoạt hoán đổi (Tiết kiệm {formatVND(swapSavingBase * factor)}) · Bấm để hủy</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      {isLowTier
                        ? `Áp dụng đổi 600g Heo ➔ 600g Gà (-${formatVND(36000 * factor)})`
                        : `Áp dụng đổi 600g Bò ➔ 600g Ức vịt/Cá thu (-${formatVND(60000 * factor)})`}
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Full 4-Tier Comparison Table by 6 Food Groups from Slide 04 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1B4332] shrink-0" />
            <h3 className="font-bold text-stone-900 text-sm sm:text-lg font-serif">
              Bảng Đối Chiếu Chi Phí 6 Nhóm Thực Phẩm Từ 1–5 Triệu Đồng (Slide 04 · {portion} người)
            </h3>
          </div>
          <span className="text-xs text-stone-500">Bấm vào cột mức giá để chuyển nhanh</span>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[640px] text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-stone-200 text-stone-700">
                <th className="p-3 font-bold w-[42%] min-w-[240px]">Nhóm thực phẩm & Định lượng cố định</th>
                <th
                  onClick={() => onBudgetTierChange('1m')}
                  className={`p-3 text-right cursor-pointer transition-colors ${budgetTier === '1m' ? 'bg-amber-100 text-amber-950 font-extrabold' : 'hover:bg-stone-100'}`}
                >
                  Mức 1 (1,0Tr)
                </th>
                <th
                  onClick={() => onBudgetTierChange('2m')}
                  className={`p-3 text-right cursor-pointer transition-colors ${budgetTier === '2m' ? 'bg-amber-100 text-amber-950 font-extrabold' : 'hover:bg-stone-100'}`}
                >
                  Mức 2 (2,0Tr)
                </th>
                <th
                  onClick={() => onBudgetTierChange('3.5m')}
                  className={`p-3 text-right cursor-pointer transition-colors ${budgetTier === '3.5m' ? 'bg-amber-100 text-amber-950 font-extrabold' : 'hover:bg-stone-100'}`}
                >
                  Mức 3 (3,5Tr)
                </th>
                <th
                  onClick={() => onBudgetTierChange('5m')}
                  className={`p-3 text-right cursor-pointer transition-colors ${budgetTier === '5m' ? 'bg-amber-100 text-amber-950 font-extrabold' : 'hover:bg-stone-100'}`}
                >
                  Mức 4 (5,0Tr)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 tabular-nums">
              {slide04ComparisonRows.map((row) => (
                <tr key={row.group} className="hover:bg-stone-50">
                  <td className="p-3">
                    <div className="font-bold text-stone-900">{row.group}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{row.desc}</div>
                  </td>
                  <td className={`p-3 text-right font-semibold whitespace-nowrap ${budgetTier === '1m' ? 'bg-amber-50/70 text-amber-950 font-bold' : 'text-stone-700'}`}>
                    {formatVND(row.m1 * factor)}
                  </td>
                  <td className={`p-3 text-right font-semibold whitespace-nowrap ${budgetTier === '2m' ? 'bg-amber-50/70 text-amber-950 font-bold' : 'text-stone-700'}`}>
                    {formatVND(row.m2 * factor)}
                  </td>
                  <td className={`p-3 text-right font-semibold whitespace-nowrap ${budgetTier === '3.5m' ? 'bg-amber-50/70 text-amber-950 font-bold' : 'text-stone-700'}`}>
                    {formatVND(row.m3 * factor)}
                  </td>
                  <td className={`p-3 text-right font-semibold whitespace-nowrap ${budgetTier === '5m' ? 'bg-amber-50/70 text-amber-950 font-bold' : 'text-stone-700'}`}>
                    {formatVND(row.m4 * factor)}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-50/70 font-bold text-emerald-950 border-t-2 border-emerald-200">
                <td className="p-3">
                  7. Tổng dự toán + Quỹ dự phòng (9–10%) = Ngân sách trần
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {formatVND(910000 * factor)} + {formatVND(90000 * factor)} = {formatVND(1000000 * factor)}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {formatVND(1820000 * factor)} + {formatVND(180000 * factor)} = {formatVND(2000000 * factor)}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {formatVND(3180000 * factor)} + {formatVND(320000 * factor)} = {formatVND(3500000 * factor)}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {formatVND(4550000 * factor)} + {formatVND(450000 * factor)} = {formatVND(5000000 * factor)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
