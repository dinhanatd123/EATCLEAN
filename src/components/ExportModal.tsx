import React, { useState } from 'react';
import { X, Copy, Check, Printer, ShoppingCart } from 'lucide-react';
import { PortionSize, BudgetTierId } from '../types';
import { GROCERY_BY_TIER, BUDGET_TIERS_METADATA } from '../data/flexibleEatCleanData';
import { calculateScaleFactor, formatVND } from '../utils/calculator';

interface ExportModalProps {
  portion: PortionSize;
  budgetTier: BudgetTierId;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ portion, budgetTier, onClose }) => {
  const factor = calculateScaleFactor(portion);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];
  const items = GROCERY_BY_TIER[budgetTier];
  const [copied, setCopied] = useState<boolean>(false);

  const sundayItems = items.filter((i) => i.shopPhase === 'Chủ Nhật' || i.shopPhase === 'Cả tuần');
  const midweekItems = items.filter((i) => i.shopPhase === 'Giữa tuần');

  const generateExportText = () => {
    let text = `🛒 DANH SÁCH ĐI CHỢ EAT CLEAN (${tierMeta.name.toUpperCase()} · ${portion} NGƯỜI)\n`;
    text += `💰 Dự toán: ${formatVND(tierMeta.plannedCost * factor)} | Quỹ dự phòng: ${formatVND(tierMeta.contingencyFund * factor)} | Trần: ${formatVND(tierMeta.ceilingBudget * factor)}\n\n`;

    text += `📍 CHUYẾN 1: CHỢ CHÍNH / SIÊU THỊ CHIỀU CHỦ NHẬT\n`;
    sundayItems.forEach((it) => {
      const scaledQty = factor === 1 ? it.baseAmount : `${(it.baseQty * factor).toFixed(1)} ${it.unit}`;
      text += ` [ ] ${it.name}: ${scaledQty} (~${formatVND(it.baseTotalPrice * factor)})\n     ↳ ${it.distribution}\n`;
    });

    text += `\n📍 CHUYẾN 2: BỔ SUNG ĐỒ TƯƠI GIỮA TUẦN (THỨ TƯ / THỨ NĂM)\n`;
    midweekItems.forEach((it) => {
      const scaledQty = factor === 1 ? it.baseAmount : `${(it.baseQty * factor).toFixed(1)} ${it.unit}`;
      text += ` [ ] ${it.name}: ${scaledQty} (~${formatVND(it.baseTotalPrice * factor)})\n     ↳ ${it.distribution}\n`;
    });

    text += `\n📝 Lưu ý bảo quản USDA FSIS:\n- Rau lá, măng tây, cải kale ăn đầu tuần (T2–T4); bông cải, bí đỏ, bắp cải để cuối tuần (T5–CN).\n- Cấp đông đạm/hải sản dùng từ T3 trở đi ở ≤ -18°C; rã đông chậm ngăn mát (2–4°C) trước 1 đêm.\n- Nhiệt độ tâm: Gia cầm ≥ 74°C | Bò & Cá hồi ≥ 63°C (Medium).`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShoppingCart className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h3 id="export-modal-title" className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                Xuất Giỏ Đi Chợ ({tierMeta.shortLabel} · {portion} Người)
              </h3>
              <p className="text-xs text-stone-500">
                Tách riêng chuyến Chủ Nhật và Giữa tuần để dễ mua sắm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng xuất"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="flex-1 overflow-y-auto bg-stone-50 rounded-2xl p-4 border border-stone-200 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed select-all">
          {generateExportText()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="text-xs text-stone-500">
            {copied ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" /> Đã sao chép vào bộ nhớ tạm! Dán ngay vào Zalo hoặc Ghi chú.
              </span>
            ) : (
              'Bấm nút để chép nhanh danh sách'
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" /> In danh sách
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#24523E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép!' : 'Chép vào Zalo / Ghi chú'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
