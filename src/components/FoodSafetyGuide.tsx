import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Snowflake,
  Flame,
  Clock,
  Droplet,
  RotateCcw,
} from 'lucide-react';
import { PortionSize } from '../types';
import { calculateOilWeeklyQuota } from '../utils/calculator';

interface FoodSafetyGuideProps {
  portion: PortionSize;
}

const STORAGE_KEY_OIL_TRACKER = 'eatclean_oil_tracker_ml_v1';

export const FoodSafetyGuide: React.FC<FoodSafetyGuideProps> = ({ portion }) => {
  const oilQuota = calculateOilWeeklyQuota(portion);

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
      kicker: 'Khâu 1 · Sau Khi Nấu',
      title: 'Làm Lạnh Nhanh (≤ 4°C)',
      icon: Snowflake,
      iconBg: 'bg-blue-50 text-blue-600',
      kickerColor: 'text-blue-700',
      description: (
        <>
          Chia thức ăn vào <strong className="text-stone-900">hộp nông</strong> (dày không quá 5 cm) để nhiệt tỏa nhanh đều. Cất ngay vào ngăn mát tủ lạnh (<strong className="text-blue-900">≤ 4°C</strong>) trong vòng <strong className="text-blue-900">2 giờ</strong> sau khi nấu (hoặc <strong className="text-red-700">1 giờ</strong> khi nhiệt độ phòng mùa hè &gt; 32°C).
        </>
      ),
      tip: 'Tránh để nồi lớn ủ nhiệt trên bếp vì dải 5°C – 60°C là “vùng nguy hiểm” vi khuẩn sinh sôi gấp đôi mỗi 20 phút.',
    },
    {
      kicker: 'Khâu 2 · Đến Công Sở',
      title: 'Vận Chuyển & Hâm Nóng (≥ 74°C)',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-600',
      kickerColor: 'text-amber-700',
      description: (
        <>
          Mang đi làm bằng <strong className="text-stone-900">túi giữ nhiệt có đá gel</strong>, cất ngay vào tủ lạnh cơ quan khi vừa đến nơi. Khi ăn trưa, hâm nóng đều tới nhiệt độ tâm <strong className="text-amber-900">≥ 74°C</strong> (USDA Reheating Guide) để tiêu diệt mầm bệnh.
        </>
      ),
      tip: 'Trước khi đậy nắp quay lò vi sóng, châm thêm 1–2 thìa nước lọc hoặc nước hấp gừng để tạo hơi nước giúp thịt cá mềm mọng.',
    },
    {
      kicker: 'Khâu 3 · Phân Loại Ngăn Tủ',
      title: 'Thời Hạn Bảo Quản Chuẩn',
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
      kickerColor: 'text-emerald-700',
      description: (
        <>
          Đồ chín ngăn mát giữ tối đa <strong className="text-stone-900">3–4 ngày</strong> (thực đơn này tối ưu ăn ngay hôm sau). Gà sống ngăn mát chỉ <strong className="text-stone-900">1–2 ngày</strong>; phần thịt/cá dùng cho nửa cuối tuần phải <strong className="text-emerald-900">cấp đông ≤ -18°C</strong> ngay từ Chủ Nhật.
        </>
      ),
      tip: 'Rã đông an toàn: Chuyển đạm từ ngăn đá xuống ngăn mát từ tối hôm trước; tuyệt đối không ngâm nước nóng hay để trên bàn bếp.',
    },
  ];

  return (
    <motion.section
      id="safety"
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
            05. Chuẩn Vệ Sinh Thực Phẩm · Nguồn từ Slide 01, 04, 08
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Quy Chuẩn An Toàn Thực Phẩm USDA FSIS & Định Mức Dầu Gia Vị
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Tiêu chuẩn kỹ thuật bắt buộc bảo vệ hệ tiêu hóa, giữ trọn độ ẩm và đảm bảo dưỡng chất cho các bữa ăn meal prep.
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

      {/* Bottom Section: Oil Intake Tracker & Natural Seasonings */}
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
                <span>Bộ Theo Dõi Dầu Ăn Tuần ({portion} người)</span>
              </span>
              <h3 className="text-lg font-bold text-stone-900 font-serif tabular-nums">
                Định Mức Dầu Ăn: {oilQuota.minMl}–{oilQuota.maxMl} ml / Tuần
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
            Chỉ dùng <strong>10–15 ml dầu</strong> (đậu nành hoặc hạt cải) cho mỗi mẻ nấu 4 suất. Cả tuần dùng khoảng <strong>140–180 ml</strong> trên chai 250 ml (tiết kiệm đáng kể calo rỗng và bảo vệ tim mạch).
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
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(5)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              +5 ml (1 thìa cà phê)
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(10)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              +10 ml (Mẻ áp chảo nhẹ)
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addOil(15)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 border border-amber-400 text-amber-950 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              +15 ml (Mẻ nướng sả 4 suất)
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column (6 cols): Natural Spices & Fruit Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700">
              Gia Vị Tự Nhiên & Trái Cây
            </span>
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Tối Giản Sốt Công Nghiệp
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600 tabular-nums">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <strong className="text-emerald-950 font-bold block">1. Gia vị thơm tự nhiên:</strong>
              <p>
                Tạo hương vị đậm đà hấp dẫn bằng gừng tươi, tỏi băm, sả, hành hoa, chanh tươi và nêm nhạt với muối i-ốt hoặc nước mắm truyền thống. Không cần dùng các loại xốt đóng chai chứa nhiều đường siro bắp và chất điều vị.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
              <strong className="text-amber-950 font-bold block">2. Trái cây tráng miệng tuần:</strong>
              <p>
                · <strong>1,0 kg ổi tươi giòn:</strong> Cung cấp vitamin C dồi dào, chia ăn tráng miệng sau bữa trưa hoặc bữa tối trong tuần.
              </p>
              <p>
                · <strong>1,5 kg chuối chín (900g thịt quả):</strong> Dùng thái lát nấu cùng cháo yến mạch bữa sáng Thứ Hai, Thứ Tư, Thứ Sáu để tạo vị ngọt tự nhiên không cần đường cát.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
