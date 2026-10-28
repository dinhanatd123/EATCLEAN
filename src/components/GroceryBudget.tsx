import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Share2,
  Check,
  AlertCircle,
  PiggyBank,
  ArrowRightLeft,
  Filter,
} from 'lucide-react';
import { PortionSize, IngredientItem } from '../types';
import { GROCERY_ITEMS, BUDGET_BREAKDOWN } from '../data/eatCleanData';
import {
  calculateScaleFactor,
  formatVND,
  calculateBudgetTotals,
  calculateSwapSavings,
} from '../utils/calculator';

interface GroceryBudgetProps {
  portion: PortionSize;
  onOpenExportModal: () => void;
}

const STORAGE_KEY_CHECKED = 'eatclean_groceries_checked_v1';
const STORAGE_KEY_SWAP = 'eatclean_pork_swapped_v1';

export const GroceryBudget: React.FC<GroceryBudgetProps> = ({
  portion,
  onOpenExportModal,
}) => {
  const factor = calculateScaleFactor(portion);

  // Checked items stored in localStorage
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State for swapping pork to chicken (From strategy in Slide 03)
  const [isPorkSwappedToChicken, setIsPorkSwappedToChicken] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SWAP) === 'true';
    } catch {
      return false;
    }
  });

  // Category & Phase Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  // Custom price simulation for pork
  const [simulatedPorkPrice, setSimulatedPorkPrice] = useState<number>(150000); // 150k/kg standard
  const [simulatedChickenPrice, setSimulatedChickenPrice] = useState<number>(90000); // 90k/kg standard

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(checkedMap));
    } catch (e) {
      console.warn('Failed saving checked groceries', e);
    }
  }, [checkedMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SWAP, isPorkSwappedToChicken ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed saving swap state', e);
    }
  }, [isPorkSwappedToChicken]);

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
    GROCERY_ITEMS.forEach((item) => {
      all[item.id] = true;
    });
    setCheckedMap(all);
  };

  // Adjust grocery items if pork is swapped for chicken
  const effectiveItems = GROCERY_ITEMS.map((item) => {
    if (item.id === 'pork-shoulder' && isPorkSwappedToChicken) {
      return {
        ...item,
        name: 'Ức gà thay thế thịt heo (Tiết kiệm 36k)',
        baseAmount: '0,6 kg',
        baseTotalPrice: 54000,
        distribution: 'Hoán đổi thông minh: Dùng 600g ức gà thay thế heo nạc vai cho tối T3',
      };
    }
    return item;
  });

  // Filter items
  const filteredItems = effectiveItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || item.shopPhase === selectedPhase;
    return matchesCategory && matchesPhase;
  });

  // Calculate totals
  const totalPlannedCost = effectiveItems.reduce((acc, it) => acc + it.baseTotalPrice * factor, 0);
  const totalSpent = effectiveItems.reduce((acc, it) => {
    return checkedMap[it.id] ? acc + it.baseTotalPrice * factor : acc;
  }, 0);
  const remainingInPlan = Math.max(0, totalPlannedCost - totalSpent);
  const percentDone = Math.round((totalSpent / totalPlannedCost) * 100);

  const swapCalc = calculateSwapSavings(
    (simulatedPorkPrice * 0.6),
    simulatedChickenPrice
  );

  const categories = ['all', 'Đạm', 'Tinh bột', 'Rau củ', 'Trái cây', 'Sữa & lạc', 'Gia vị'];

  return (
    <section id="grocery" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
            PHÂN KHU 3 • NGUỒN TỪ SLIDE 03
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif">
            Danh Sách Đi Chợ & Phân Bổ Ngân Sách {formatVND(totalPlannedCost)}
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Nhóm Đạm chiếm 47,8% chi phí; giữ lại {formatVND(115000 * factor)} dự phòng trượt giá hoặc tăng khẩu phần cho người tập luyện.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4 text-stone-950" />
            Xuất Zalo / In ấn
          </button>
        </div>
      </div>

      {/* Progress & Live Spent Gauge */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Tiến độ mua sắm giỏ hàng tuần
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
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
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Chọn tất cả
            </button>
            <button
              type="button"
              onClick={handleResetChecks}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              Đặt lại giỏ
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentDone)}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-1">
          <span>Còn lại cần chi: <strong>{formatVND(remainingInPlan)}</strong></span>
          <span>Quỹ dự phòng an toàn: <strong className="text-emerald-700">{formatVND(115000 * factor)}</strong> (11,5% ngân sách trần)</span>
        </div>
      </div>

      {/* Main Grid: Left = Shopping Table, Right = Budget Distribution & Price Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Interactive Checklist */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-stone-100 rounded-xl border border-stone-200">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1B4332] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả nhóm' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-stone-300 pl-2 pt-1 sm:pt-0">
              <span className="text-[11px] text-stone-500 font-medium">Chuyến:</span>
              <button
                type="button"
                onClick={() => setSelectedPhase('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedPhase === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Cả 2
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhase('Chủ Nhật')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedPhase === 'Chủ Nhật' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Chủ Nhật
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhase('Giữa tuần')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedPhase === 'Giữa tuần' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Giữa tuần
              </button>
            </div>
          </div>

          {/* Table Items */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F5] text-stone-700 text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th scope="col" className="p-3.5 w-12 text-center">Mua</th>
                    <th scope="col" className="p-3.5">Nguyên liệu & Phân chia</th>
                    <th scope="col" className="p-3.5 text-right">Lượng mua</th>
                    <th scope="col" className="p-3.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredItems.map((item) => {
                    const isChecked = !!checkedMap[item.id];
                    const itemTotal = item.baseTotalPrice * factor;

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
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            aria-label={`Đánh dấu ${item.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCheck(item.id);
                            }}
                            className="text-emerald-700 hover:scale-110 transition-transform"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300" />
                            )}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                              {item.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              {item.shopPhase}
                            </span>
                          </div>
                          <div
                            className={`text-xs mt-1 leading-snug ${
                              isChecked ? 'text-stone-400 line-through' : 'text-stone-500'
                            }`}
                          >
                            {item.distribution}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-medium text-stone-700 whitespace-nowrap">
                          {factor === 1 ? item.baseAmount : `${(item.baseQty * factor).toFixed(1)} ${item.unit}`}
                        </td>
                        <td className="p-3.5 text-right font-bold text-stone-900 whitespace-nowrap">
                          <span className={isChecked ? 'line-through text-stone-400' : 'text-emerald-900'}>
                            {formatVND(itemTotal)}
                          </span>
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
        </div>

        {/* Right Column (5 cols): Budget Structure & Price Fluctuation Strategy */}
        <div className="lg:col-span-5 space-y-6">
          {/* Budget Structure Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-700" />
                Cơ Cấu Ngân Sách Tuần (Trần {formatVND(1000000 * factor)})
              </h3>
              <span className="text-xs text-stone-500 font-medium">Slide 03</span>
            </div>

            <div className="space-y-3">
              {BUDGET_BREAKDOWN.map((group) => {
                const scaledAmount = group.amount * factor;
                return (
                  <div key={group.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-700">{group.name}</span>
                      <span className="font-bold text-stone-900">
                        {formatVND(scaledAmount)} ({group.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
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
              <div className="space-y-1 pt-1 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs font-medium text-emerald-800">
                  <span className="font-semibold">Quỹ dự phòng an toàn</span>
                  <span className="font-bold">{formatVND(115000 * factor)} (11,5% trần)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: '11.5%' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              * Dự toán giá chợ dân sinh lập ngày 30/09/2026 (chưa gồm điện, gas, nước sinh hoạt).
            </div>
          </div>

          {/* Strategy for Market Price Fluctuation (Slide 03 + Upgrade 2) */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-amber-50/70 rounded-2xl border-2 border-amber-300/80 p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-2 text-amber-900 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4>Chiến Lược Ứng Phó Khi Giá Chợ Biến Động</h4>
                <p className="text-xs font-normal text-amber-800 mt-0.5">
                  Bảo vệ ngân sách gia đình không bị thâm hụt khi giá thực phẩm ngoài chợ tăng.
                </p>
              </div>
            </div>

            <ul className="text-xs text-stone-700 space-y-2 list-disc list-inside">
              <li>
                <strong>Ưu tiên quỹ dự phòng {formatVND(115000 * factor)}:</strong> Hấp thụ các đợt tăng giá nhẹ trước khi phải can thiệp điều chỉnh thực đơn.
              </li>
              <li>
                <strong>Hoán đổi linh hoạt cùng định lượng:</strong> Đổi sang các loại rau theo mùa đồng giá tại chợ dân sinh.
              </li>
              <li className="text-amber-950 font-semibold">
                <strong>Nguyên tắc bất di bất dịch:</strong> Tuyệt đối không cắt số bữa hoặc bỏ nguồn đạm để ép ngân sách!
              </li>
            </ul>

            {/* Smart Swap Simulator Interactive Widget */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-inner space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  Mô phỏng hoán đổi nạc heo ➔ ức gà
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Tiết kiệm {formatVND(36000 * factor)}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Nếu thịt nạc vai ngoài chợ lên giá, bấm nút dưới để tự động chuyển 600g nạc heo sang 600g ức gà:
              </p>

              <button
                type="button"
                onClick={() => setIsPorkSwappedToChicken(!isPorkSwappedToChicken)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isPorkSwappedToChicken
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {isPorkSwappedToChicken ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    Đang kích hoạt hoán đổi (Đã tiết kiệm {formatVND(36000 * factor)}) • Bấm để hủy
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 text-amber-700" />
                    Áp dụng hoán đổi 600g Heo (90k) ➔ 600g Ức gà (54k)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
