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
} from 'lucide-react';
import { PortionSize } from '../types';
import { GROCERY_ITEMS, BUDGET_BREAKDOWN } from '../data/eatCleanData';
import {
  calculateScaleFactor,
  formatVND,
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

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isPorkSwappedToChicken, setIsPorkSwappedToChicken] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SWAP) === 'true';
    } catch {
      return false;
    }
  });

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

  const filteredItems = effectiveItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || item.shopPhase === selectedPhase;
    return matchesCategory && matchesPhase;
  });

  const totalPlannedCost = effectiveItems.reduce((acc, it) => acc + it.baseTotalPrice * factor, 0);
  const totalSpent = effectiveItems.reduce((acc, it) => {
    return checkedMap[it.id] ? acc + it.baseTotalPrice * factor : acc;
  }, 0);
  const remainingInPlan = Math.max(0, totalPlannedCost - totalSpent);
  const percentDone = Math.round((totalSpent / totalPlannedCost) * 100);

  const categories = ['all', 'Đạm', 'Tinh bột', 'Rau củ', 'Trái cây', 'Sữa & lạc', 'Gia vị'];

  return (
    <motion.section
      id="grocery"
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
            02. Quản Lý Đi Chợ & Ngân Sách · Nguồn từ Slide 03
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Danh Sách Đi Chợ & Phân Bổ Ngân Sách <span className="tabular-nums">{formatVND(totalPlannedCost)}</span>
          </h2>
          <p className="text-stone-600 text-sm mt-1 tabular-nums">
            Nhóm Đạm chiếm 47,8% chi phí; giữ lại {formatVND(115000 * factor)} dự phòng trượt giá hoặc tăng khẩu phần cho người tập luyện.
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-stone-500">
              Tiến độ mua sắm giỏ hàng tuần
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
          <span>Quỹ dự phòng an toàn: <strong className="text-emerald-700">{formatVND(115000 * factor)}</strong> (11,5% ngân sách trần)</span>
        </div>
      </motion.div>

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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
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
                className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPhase === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Cả 2
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhase('Chủ Nhật')}
                className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPhase === 'Chủ Nhật' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Chủ Nhật
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhase('Giữa tuần')}
                className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPhase === 'Giữa tuần' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                Giữa tuần
              </button>
            </div>
          </div>

          {/* Table Items */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F5] text-stone-700 text-xs font-semibold border-b border-stone-200">
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
                            className="text-emerald-700 hover:scale-110 transition-transform cursor-pointer"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300" />
                            )}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`font-semibold ${
                                isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs text-stone-400">·</span>
                            <span className="text-xs text-stone-500">{item.category}</span>
                            <span className="text-xs text-stone-400">·</span>
                            <span className="text-xs text-amber-700 font-medium">{item.shopPhase}</span>
                          </div>
                          <div
                            className={`text-xs mt-1 leading-snug ${
                              isChecked ? 'text-stone-400 line-through' : 'text-stone-500'
                            }`}
                          >
                            {item.distribution}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-medium text-stone-700 whitespace-nowrap tabular-nums">
                          {factor === 1 ? item.baseAmount : `${(item.baseQty * factor).toFixed(1)} ${item.unit}`}
                        </td>
                        <td className="p-3.5 text-right font-bold text-stone-900 whitespace-nowrap tabular-nums">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-700" />
                <span>Cơ Cấu Ngân Sách Tuần (Trần {formatVND(1000000 * factor)})</span>
              </h3>
              <span className="text-xs text-stone-500 font-medium">Slide 03</span>
            </div>

            <div className="space-y-3">
              {BUDGET_BREAKDOWN.map((group, idx) => {
                const scaledAmount = group.amount * factor;
                return (
                  <div key={group.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium tabular-nums">
                      <span className="text-stone-700">{group.name}</span>
                      <span className="font-bold text-stone-900">
                        {formatVND(scaledAmount)} ({group.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: group.ceilingPercent / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full w-full rounded-full origin-left"
                        style={{ backgroundColor: group.color }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Quỹ dự phòng bar */}
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs font-medium text-emerald-800 tabular-nums">
                  <span className="font-semibold">Quỹ dự phòng an toàn</span>
                  <span className="font-bold">{formatVND(115000 * factor)} (11,5% trần)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 0.115 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full rounded-full bg-emerald-500 origin-left"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              * Dự toán giá chợ dân sinh lập ngày 30/09/2026 (chưa gồm điện, gas, nước sinh hoạt).
            </div>
          </motion.div>

          {/* Strategy for Market Price Fluctuation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-amber-50/70 rounded-2xl border border-amber-300/80 p-5 space-y-4"
          >
            <div className="flex items-start gap-2 text-amber-900 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4>Chiến Lược Ứng Phó Khi Giá Chợ Biến Động</h4>
                <p className="text-xs font-normal text-amber-800 mt-0.5">
                  Bảo vệ ngân sách gia đình không bị thâm hụt khi giá thực phẩm ngoài chợ tăng.
                </p>
              </div>
            </div>

            <ul className="text-xs text-stone-700 space-y-2 list-disc list-inside tabular-nums">
              <li>
                <strong>Ưu tiên quỹ dự phòng {formatVND(115000 * factor)}:</strong> Hấp thụ các đợt tăng giá nhẹ trước khi điều chỉnh thực đơn.
              </li>
              <li>
                <strong>Hoán đổi linh hoạt cùng định lượng:</strong> Đổi sang các loại rau theo mùa đồng giá tại chợ dân sinh.
              </li>
              <li className="text-amber-950 font-semibold">
                <strong>Nguyên tắc bất di bất dịch:</strong> Tuyệt đối không cắt số bữa hoặc bỏ nguồn đạm để ép ngân sách!
              </li>
            </ul>

            {/* Smart Swap Simulator Interactive Widget */}
            <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  <span>Mô phỏng hoán đổi nạc heo ➔ ức gà</span>
                </span>
                <span className="text-emerald-800 font-bold tabular-nums">
                  Tiết kiệm {formatVND(36000 * factor)}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Nếu thịt nạc vai ngoài chợ lên giá, bấm nút dưới để tự động chuyển 600g nạc heo sang 600g ức gà:
              </p>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsPorkSwappedToChicken(!isPorkSwappedToChicken)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isPorkSwappedToChicken
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {isPorkSwappedToChicken ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>Đang kích hoạt hoán đổi (Đã tiết kiệm {formatVND(36000 * factor)}) · Bấm để hủy</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Áp dụng hoán đổi 600g Heo (90k) ➔ 600g Ức gà (54k)</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
