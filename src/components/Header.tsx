import React from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, Wallet, ShieldCheck, Flame, Calendar, ShoppingCart, Clock, ChefHat } from 'lucide-react';
import { PortionSize } from '../types';
import { calculateBudgetTotals, formatVND } from '../utils/calculator';
import { GROCERY_ITEMS } from '../data/eatCleanData';

interface HeaderProps {
  portion: PortionSize;
  onPortionChange: (portion: PortionSize) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  portion,
  onPortionChange,
  activeTab,
  onTabChange,
}) => {
  const budget = calculateBudgetTotals(GROCERY_ITEMS, portion);

  const navItems = [
    { id: 'meal-plan', label: 'Ma Trận 7 Ngày', icon: Calendar },
    { id: 'grocery', label: 'Giỏ Đi Chợ & Ngân Sách', icon: ShoppingCart },
    { id: 'prep', label: 'Sơ Chế 90 Phút', icon: Clock },
    { id: 'recipes', label: '11 Công Thức Nấu', icon: ChefHat },
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
      colSpan: '',
    },
    {
      label: 'Ngân sách trần/tuần',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      value: formatVND(budget.ceilingBudget),
      valueColor: 'text-white',
      sub: `(${formatVND(budget.ceilingBudget * 4)}/tháng)`,
      colSpan: '',
    },
    {
      label: 'Tổng dự toán đi chợ',
      icon: Wallet,
      iconColor: 'text-amber-400',
      value: formatVND(budget.totalCost),
      valueColor: 'text-amber-300',
      sub: 'Trong ngân sách trần · Tiết kiệm 11,5%',
      colSpan: '',
    },
    {
      label: 'Quỹ dự phòng còn lại',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      value: formatVND(budget.contingencyRemaining),
      valueColor: 'text-emerald-200',
      sub: '11,5% quỹ tuần phòng trượt giá',
      colSpan: '',
    },
  ];

  return (
    <header className="bg-gradient-to-b from-[#143225] via-[#1B4332] to-[#24523E] text-white pt-6 sm:pt-9 pb-8 sm:pb-10 px-3.5 sm:px-6 lg:px-8 border-b border-emerald-700/50 shadow-xl overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Kicker & Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-2.5 sm:space-y-3"
        >
          <div className="text-emerald-300 text-[11px] sm:text-sm font-semibold tracking-wide sm:tracking-wider leading-snug px-1">
            Cẩm Nang Thực Hành Nấu Ăn & Quản Lý Ngân Sách · Kế Hoạch 4 Tuần (Tuần 1)
          </div>

          <h1 className="text-[22px] sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.25] sm:leading-tight max-w-4xl mx-auto text-balance">
            Thực Đơn Eat Clean Tuần 1: <span className="text-amber-400 tabular-nums">{portion * 21} Suất Ăn Đủ Chất</span> Chỉ Với <span className="text-emerald-300 tabular-nums whitespace-nowrap">{formatVND(budget.totalCost)}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-emerald-100/90 text-xs sm:text-base leading-relaxed px-1">
            Hướng dẫn chi tiết định lượng nguyên liệu, quy trình sơ chế Chủ Nhật (90 phút) và kỹ thuật chế biến từng món ăn cho {portion} người trong 7 ngày theo chuẩn bảo quản thực phẩm USDA FSIS.
          </p>
        </motion.div>

        {/* Golden Rule Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#112d22]/90 border border-emerald-600/40 rounded-2xl p-3.5 sm:p-6 shadow-lg backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <div className="flex items-start sm:items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <span>Nguyên Tắc Vàng Tiết Kiệm Thời Gian & Chi Phí</span>
              </div>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed max-w-3xl">
                <strong className="text-white">“Nấu 1 lần vào buổi tối cho 4 suất (Tối hôm nay + Trưa hôm sau)”</strong> giúp giải phóng hoàn toàn thời gian nấu bữa trưa từ Thứ Ba đến Chủ Nhật, sử dụng 100% nguyên liệu tươi tự nhiên tại chợ dân sinh mà không cần thực phẩm đắt tiền gắn nhãn Eat Clean.
              </p>
            </div>

            {/* Portion switcher - iPhone safe grid */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 w-full lg:w-auto">
              <span className="text-xs text-emerald-300/90 font-medium">Chọn khẩu phần ăn:</span>
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
              <span>Cấu trúc nguyên liệu chính</span>
              <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div className="mt-1.5 text-xs text-stone-200 leading-relaxed tabular-nums">
              <span className="font-semibold text-white">{budget.totalKgMeatFish} kg</span> thịt/cá · <span className="font-semibold text-white">{budget.totalKgTofu} kg</span> đậu · <span className="font-semibold text-white">{budget.totalEggs}</span> trứng · <span className="font-semibold text-white">{budget.totalKgRice} kg</span> gạo · <span className="font-semibold text-white">{budget.totalKgVeggies} kg</span> rau · <span className="font-semibold text-white">{budget.totalKgFruit} kg</span> trái cây
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
