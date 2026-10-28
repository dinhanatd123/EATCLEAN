import React from 'react';
import { Users, DollarSign, Wallet, ShieldCheck, Flame, Calendar, ShoppingCart, Clock, ChefHat, Sparkles } from 'lucide-react';
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

  return (
    <header className="bg-gradient-to-b from-[#143225] via-[#1B4332] to-[#24523E] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-600/40 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Tag & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            CẨM NANG THỰC HÀNH NẤU ĂN & QUẢN LÝ NGÂN SÁCH • KẾ HOẠCH 4 TUẦN (TUẦN 1)
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
            Thực Đơn Eat Clean Tuần 1: <span className="text-amber-400">{portion * 21} Suất Ăn Đủ Chất</span> Chỉ Với <span className="text-emerald-300">{formatVND(budget.totalCost)}</span>
          </h1>

          <p className="max-w-3xl mx-auto text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Hướng dẫn chi tiết định lượng nguyên liệu, quy trình sơ chế Chủ Nhật (90 phút) và kỹ thuật chế biến từng món ăn cho {portion} người trong 7 ngày theo chuẩn bảo quản thực phẩm USDA FSIS.
          </p>
        </div>

        {/* Golden Rule Highlight Box */}
        <div className="bg-[#112d22]/90 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm tracking-wide uppercase">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                Nguyên Tắc Vàng Tiết Kiệm Thời Gian & Chi Phí
              </div>
              <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
                <strong className="text-white">“Nấu 1 lần vào buổi tối cho 4 suất (Tối hôm nay + Trưa hôm sau)”</strong> giúp giải phóng hoàn toàn thời gian nấu bữa trưa từ Thứ Ba đến Chủ Nhật, sử dụng 100% nguyên liệu tươi tự nhiên tại chợ dân sinh mà không cần thực phẩm đắt tiền gắn nhãn Eat Clean.
              </p>
            </div>

            {/* Portion switcher */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <span className="text-xs text-emerald-300/90 font-medium">Chọn khẩu phần ăn:</span>
              <div className="inline-flex rounded-xl bg-emerald-950/80 p-1 border border-emerald-700/60 shadow-inner w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onPortionChange(1)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    portion === 1
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  1 Người (21 suất)
                </button>
                <button
                  type="button"
                  onClick={() => onPortionChange(2)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    portion === 2
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  2 Người • Chuẩn (42 suất)
                </button>
                <button
                  type="button"
                  onClick={() => onPortionChange(4)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    portion === 4
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                  }`}
                >
                  4 Người (84 suất)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1 */}
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3.5 sm:p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Quy mô phục vụ</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg sm:text-xl font-bold text-white">
                {portion} người lớn • 7 ngày
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">
                {portion === 1 ? '21 bữa = 21 suất ăn' : portion === 2 ? '21 bữa = 42 suất ăn' : '21 bữa = 84 suất ăn'}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3.5 sm:p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Ngân sách trần/tuần</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg sm:text-xl font-bold text-white">
                {formatVND(budget.ceilingBudget)}
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">
                ({formatVND(budget.ceilingBudget * 4)}/tháng)
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3.5 sm:p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Tổng dự toán đi chợ</span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg sm:text-xl font-bold text-amber-300">
                {formatVND(budget.totalCost)}
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                Trong ngân sách trần
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3.5 sm:p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Quỹ dự phòng còn lại</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg sm:text-xl font-bold text-emerald-200">
                {formatVND(budget.contingencyRemaining)}
              </div>
              <div className="text-xs text-emerald-300/80 mt-0.5">
                11,5% quỹ tuần phòng trượt giá
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-2 lg:col-span-1 bg-emerald-900/60 border border-emerald-700/40 rounded-xl p-3.5 sm:p-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <span>Cấu trúc nguyên liệu chính</span>
              <ChefHat className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-1 text-xs text-stone-200 leading-snug">
              <span className="font-semibold text-white">{budget.totalKgMeatFish} kg</span> thịt/cá • <span className="font-semibold text-white">{budget.totalKgTofu} kg</span> đậu • <span className="font-semibold text-white">{budget.totalEggs}</span> trứng • <span className="font-semibold text-white">{budget.totalKgRice} kg</span> gạo • <span className="font-semibold text-white">{budget.totalKgVeggies} kg</span> rau • <span className="font-semibold text-white">{budget.totalKgFruit} kg</span> trái cây
            </div>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <nav aria-label="Phân khu chính" className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pt-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md ring-2 ring-amber-300/50 scale-102'
                    : 'bg-emerald-950/60 text-emerald-200 hover:text-white hover:bg-emerald-900/80 border border-emerald-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-emerald-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
