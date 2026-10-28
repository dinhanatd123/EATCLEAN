import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Snowflake,
  Flame,
  Clock,
  Droplet,
  RotateCcw,
} from 'lucide-react';
import { PortionSize, BudgetTierId } from '../types';
import { calculateOilWeeklyQuota, calculateScaleFactor } from '../utils/calculator';
import { BUDGET_TIERS_METADATA } from '../data/flexibleEatCleanData';

interface FoodSafetyGuideProps {
  portion: PortionSize;
  budgetTier: BudgetTierId;
}

const STORAGE_KEY_OIL_TRACKER = 'eatclean_oil_tracker_ml_v1';

export const FoodSafetyGuide: React.FC<FoodSafetyGuideProps> = ({ portion, budgetTier }) => {
  const oilQuota = calculateOilWeeklyQuota(portion);
  const factor = calculateScaleFactor(portion);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];

  const [oilUsedMl, setOilUsedMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OIL_TRACKER);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OIL_TRACKER, oilUsedMl.toString());
    } catch (e) {
      console.warn('Failed saving oil tracker', e);
    }
  }, [oilUsedMl]);

  const addOil = (amount: number) => {
    setOilUsedMl((prev) => Math.min(300 * Math.ceil(portion / 2), prev + amount));
  };

  const resetOil = () => {
    setOilUsedMl(0);
  };

  const oilPercentage = Math.min(100, Math.round((oilUsedMl / oilQuota.maxMl) * 100));
  const isOilWarning = oilUsedMl > oilQuota.maxMl;

  const safetyCards = [
    {
      kicker: 'Khâu 1 · Làm Lạnh Nhanh',
      title: 'Chia Hộp Nông ≤ 5 cm (≤ 4°C)',
      icon: Snowflake,
      iconBg: 'bg-blue-50 text-blue-600',
      kickerColor: 'text-blue-700',
      description: (
        <>
          Chia thức ăn vào <strong className="text-stone-900">hộp nông (độ dày ≤ 5 cm)</strong>, để mở hé nắp 15 phút thoát hơi nóng rồi cất ngăn mát tủ lạnh (<strong className="text-blue-900">≤ 4°C</strong>) trong vòng tối đa <strong className="text-blue-900">2 giờ</strong> sau nấu (hoặc <strong className="text-red-700">1 giờ</strong> nếu nhiệt độ phòng &gt; 32°C).
        </>
      ),
      tip: 'Xếp tách biệt cơm lứt một bên, thịt/cá ở giữa và rau củ hấp một bên để hạt cơm không bị nhão.',
    },
    {
      kicker: 'Khâu 2 · Vận Chuyển & Hâm Nóng',
      title: 'Chuẩn Tâm 74°C & 63°C (USDA FSIS)',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-600',
      kickerColor: 'text-amber-700',
      description: (
        <>
          Mang đi làm bằng <strong className="text-stone-900">túi giữ nhiệt có đá gel lạnh</strong>. Gia cầm nấu đạt tâm <strong className="text-amber-900">≥ 74°C</strong>; Thịt bò nguyên miếng & Cá hồi áp chảo tối đạt <strong className="text-amber-900">≥ 63°C (Medium)</strong>. Khi ăn trưa, hâm nóng đều tới <strong className="text-amber-900">≥ 74°C</strong> (tôm & bò hâm 1,5–2 phút ở nhiệt vừa).
        </>
      ),
      tip: 'Chỉ rưới sốt chấm chanh vàng nước mắm cốt lên thịt/cá sau khi đã quay nóng để giữ trọn hương vị tươi mới.',
    },
    {
      kicker: 'Khâu 3 · Thời Hạn Bảo Quản',
      title: 'Cấp Đông Hải Sản & Đạm ≤ -18°C',
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
      kickerColor: 'text-emerald-700',
      description: (
        <>
          Thức ăn chín bảo quản ngăn mát <strong className="text-stone-900">3–4 ngày</strong> (thực đơn này tiêu thụ ngay vào trưa hôm sau). Hải sản tươi (<strong className="text-stone-900">tôm, cồi sò điệp, cá hồi</strong>) và thịt dùng từ Thứ Tư trở đi bắt buộc <strong className="text-emerald-900">cấp đông ≤ -18°C</strong> từ Chủ Nhật.
        </>
      ),
      tip: 'Luôn rã đông chậm trong ngăn mát (2–4°C) từ tối hôm trước; tuyệt đối không rã đông thịt cá ở nhiệt độ phòng.',
    },
  ];

  return (
    <section
      id="safety"
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-emerald-800 text-xs font-semibold tracking-wider mb-1.5">
            05. Chuẩn Vệ Sinh Thực Phẩm · Nguồn từ Slide 05, 07, 08
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Quy Chuẩn Làm Nguội, Mang Đi Làm & Hâm Nóng (USDA FSIS & FoodSafety.gov)
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Tiêu chuẩn kỹ thuật bắt buộc cho mọi phân khúc ngân sách (1–5 Triệu) giúp bảo vệ hệ tiêu hóa và giữ trọn độ mọng nước.
          </p>
        </div>
      </div>

      {/* 3 Core Technical Safety Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safetyCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center font-bold`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <span className={`text-xs font-bold ${card.kickerColor}`}>
                    {card.kicker}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed tabular-nums">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <em>{card.tip}</em>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section: Oil Intake Tracker & Nutritional Balance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (6 cols): Weekly Oil Budget Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Kiểm Soát Chất Béo Ẩn ({tierMeta.shortLabel} · {portion} người)</span>
              </span>
              <h3 className="text-lg font-bold text-stone-900 font-serif tabular-nums">
                Định Mức Dầu Tốt: {oilQuota.minMl}–{oilQuota.maxMl} ml / Tuần
              </h3>
            </div>
            <button
              type="button"
              onClick={resetOil}
              aria-label="Đặt lại mức dầu ăn"
              className="p-2 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              title="Đặt lại mức dầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed tabular-nums">
            Loại dầu khuyến nghị cho {tierMeta.shortLabel}: <strong>{tierMeta.oilType}</strong>. Cả tuần chỉ dùng khoảng <strong>{oilQuota.minMl}–{oilQuota.maxMl} ml</strong> (ưu tiên vị ngọt tự nhiên từ nấm, nước dừa, cà chua, sả, gừng, tỏi và thảo mộc tươi).
          </p>

          {/* Oil Gauge Bar */}
          <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200 tabular-nums">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Lượng dầu đã rót:</span>
              <span className={`font-bold ${isOilWarning ? 'text-red-600' : 'text-emerald-800'}`}>
                {oilUsedMl} ml / {oilQuota.maxMl} ml ({oilPercentage}%) {isOilWarning ? '· Vượt định mức' : ''}
              </span>
            </div>

            <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(1, oilPercentage / 100) }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full w-full rounded-full origin-left ${
                  isOilWarning ? 'bg-red-500' : 'bg-amber-400'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>0 ml</span>
              <span>Định mức an toàn: {oilQuota.minMl}–{oilQuota.maxMl} ml</span>
              <span>Chai 250 ml</span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(5)}
              className="py-2.5 px-2 sm:px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-semibold text-center leading-tight cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="font-bold">+5 ml</span>
              <span className="text-[10px] opacity-80">Mẻ cá hồi</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(10)}
              className="py-2.5 px-2 sm:px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-[11px] sm:text-xs font-bold text-center leading-tight cursor-pointer flex flex-col items-center justify-center"
            >
              <span>+10 ml</span>
              <span className="text-[10px] font-medium opacity-80">Mẻ áp chảo gà/bò</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(15)}
              className="py-2.5 px-2 sm:px-3 rounded-xl bg-amber-200 hover:bg-amber-300 border border-amber-400 text-amber-950 text-[11px] sm:text-xs font-bold text-center leading-tight cursor-pointer flex flex-col items-center justify-center"
            >
              <span>+15 ml</span>
              <span className="text-[10px] font-medium opacity-80">Mẻ nướng sả</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column (6 cols): Slide 08 Nutritional Balance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700">
              Slide 08 · Tổng Kết Cân Bằng Dinh Dưỡng Cả Tuần
            </span>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Đa Dạng Hóa 6 Nguồn Đạm & Trái Cây Tráng Miệng
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 tabular-nums">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <strong className="text-emerald-950 font-bold block">1. Đa dạng hóa 6 nguồn đạm ({(tierMeta.totalKgMeatFish * factor).toFixed(1)} kg thịt/cá/tôm + {Math.round(20 * factor)} trứng + {(1.6 * factor).toFixed(1)} kg đậu):</strong>
              <p>
                Kết hợp hài hòa <strong>Gia cầm (Gà/Vịt)</strong> + <strong>Thịt đỏ (Heo/Bò)</strong> + <strong>Cá biển/sông (Cá hồi/Cá tuyết/Cá chẽm/Cá nục)</strong> + <strong>Giáp xác (Tôm/Cồi sò điệp)</strong> + <strong>Trứng</strong> + <strong>Đạm thực vật (Đậu hũ, Nấm, Hạt)</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
              <strong className="text-amber-950 font-bold block">2. Trái cây tráng miệng ({(tierMeta.totalKgFruit * factor).toFixed(1)} kg/tuần):</strong>
              <p>
                Chia đều khoảng <strong>200 g/người</strong> sau bữa trưa hoặc bữa chiều (thanh long, chuối, cam, táo, kiwi vàng, dâu tây, việt quất) để bổ sung enzyme tiêu hóa và vitamin tự nhiên mà không cần đồ ngọt công nghiệp.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
