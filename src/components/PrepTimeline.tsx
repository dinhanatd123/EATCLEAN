import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Lightbulb,
  Bell,
  PackageCheck,
} from 'lucide-react';
import { BudgetTierId } from '../types';
import { getTimelineForTier, BUDGET_TIERS_METADATA } from '../data/flexibleEatCleanData';
import { playChimeSound } from '../utils/audio';

interface PrepTimelineProps {
  budgetTier: BudgetTierId;
}

const STORAGE_KEY_TIMELINE_CHECKS = 'eatclean_prep_checks_v2';

export const PrepTimeline: React.FC<PrepTimelineProps> = ({ budgetTier }) => {
  const steps = getTimelineForTier(budgetTier);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];
  const isOriginal = budgetTier === '885k';

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMELINE_CHECKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const INITIAL_TIMER_SECONDS = 90 * 60;
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(INITIAL_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIMELINE_CHECKS, JSON.stringify(completedSteps));
    } catch (e) {
      console.warn('Failed saving timeline checks', e);
    }
  }, [completedSteps]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            playChimeSound();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(INITIAL_TIMER_SECONDS);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = steps.filter((s) => completedSteps[s.id]).length;

  return (
    <section
      id="prep"
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-emerald-800 text-xs font-semibold tracking-wider mb-1.5">
            03. Dây Chuyền Sơ Chế ({tierMeta.shortLabel}) · Nguồn từ Slide 05
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Quy Trình Sơ Chế 90 Phút Ngày Chủ Nhật & Nhịp Nấu 20–30 Phút Mỗi Tối
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Chuẩn hóa khâu chia khẩu phần và bảo quản lạnh cho cả nguyên liệu chợ dân sinh (Mức 1–2) lẫn hải sản/bò nhập khẩu (Mức 3–4).
          </p>
        </div>

        {/* 90-Min Timer Widget */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-emerald-950 text-white rounded-2xl p-4 shadow-lg border border-emerald-700/60 flex items-center justify-between sm:justify-start gap-4 shrink-0 w-full md:w-auto"
        >
          <div className="space-y-0.5">
            <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Đồng hồ đếm ngược 90 phút</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-wider tabular-nums">
              {formatTime(timerSecondsLeft)}
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-emerald-800 pl-3.5">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-3 sm:p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow active:scale-95 cursor-pointer"
              aria-label={isTimerRunning ? 'Tạm dừng timer' : 'Bắt đầu timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="p-3 sm:p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-all active:scale-95 cursor-pointer"
              aria-label="Đặt lại timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Steps & Quality Control Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Step-by-Step Interactive Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1 tabular-nums">
            <span className="text-xs font-semibold text-stone-500">
              Dây chuyền sơ chế ({completedCount}/{steps.length} chặng hoàn thành)
            </span>
            {completedCount === steps.length && (
              <span className="text-xs text-emerald-700 font-bold">
                Đã hoàn thành 100% sơ chế
              </span>
            )}
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isDone = !!completedSteps[step.id];

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => toggleStep(step.id)}
                  className={`rounded-2xl border transition-colors p-4 sm:p-5 cursor-pointer relative overflow-hidden ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <button
                      type="button"
                      aria-label={`Hoàn thành bước ${step.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                      className="mt-0.5 text-emerald-700 hover:scale-110 transition-transform shrink-0 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-stone-300" />
                      )}
                    </button>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-stone-600">
                          <span className="font-bold text-[#1B4332]">{step.timeRange}</span>
                          <span>·</span>
                          <span>{step.phase}</span>
                        </div>
                        <span className="font-bold text-amber-800 tabular-nums">
                          {step.durationMinutes} phút
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold ${
                          isDone ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside tabular-nums">
                        {step.details.map((detail, dIdx) => (
                          <li key={dIdx} className={isDone ? 'text-stone-400' : 'text-stone-700'}>
                            {detail}
                          </li>
                        ))}
                      </ul>

                      {step.keyHighlight && (
                        <div className="mt-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Bí quyết chuyên gia:</strong> {step.keyHighlight}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recommended Storage Containers Box from Slide 05 */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <PackageCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-amber-950 font-bold block">
                Danh mục hộp bảo quản & dụng cụ bếp khuyến nghị (Slide 05):
              </strong>
              <p>
                Sử dụng <strong>4 hộp thủy tinh chữ nhật 800ml chia ngăn</strong> cho bữa trưa văn phòng (chịu nhiệt lò vi sóng tới 400°C), <strong>6 hộp nhựa PP/thủy tinh 1.000ml</strong> trữ đông đạm theo ngày, và <strong>1 nhiệt kế thăm tâm thịt điện tử</strong> để kiểm tra độ chín chuẩn xác (<strong>63°C cho bò/cá hồi, 74°C cho gà/vịt</strong>).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Vegetable Freshness & Visual Prep Box */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prep Photo Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
          >
            <div className="aspect-video w-full bg-stone-100 relative overflow-hidden">
              <img
                src={isOriginal ? './assets/dishes/pdf_img_2.jpg' : './assets/dishes_flex/flex_img_1.jpg'}
                alt="Meal Prep Chủ Nhật"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                <span className="text-xs text-white font-medium">
                  Chia sẵn cá hồi, thăn bò, ức gà, tôm bóc nõn, bông cải xanh, măng tây & các hũ hạt
                </span>
              </div>
            </div>
            <div className="p-4 text-xs text-stone-600 leading-relaxed tabular-nums">
              Chia sẵn cá hồi, thăn bò, ức gà, tôm bóc nõn, bông cải xanh, măng tây, khoai lang và các hũ hạt dinh dưỡng (óc chó, mắc ca, hạnh nhân, điều, lạc) trong 90 phút chiều Chủ Nhật.
            </div>
          </motion.div>

          {/* Quality Control Box from Slide 05 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 space-y-3"
          >
            <div className="text-emerald-950 font-bold text-base">
              <h4>Mẹo Kiểm Soát Độ Tươi Ngon Nguyên Liệu Cả Tuần</h4>
              <p className="text-xs font-normal text-emerald-800 mt-0.5">
                Slide 05: Thứ tự ưu tiên dùng rau, rã đông chậm & bảo quản hạt/bơ
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-900">
                  1. Thứ tự ưu tiên dùng rau củ
                </div>
                <p className="text-stone-600">
                  Dùng <strong>măng tây, cải thìa, cải bó xôi, cải kale, rau muống</strong> trong 3 ngày đầu tuần (Thứ 2–Thứ 4); giữ <strong>bông cải xanh, đậu cô ve, cải thảo, bắp cải và bí đỏ</strong> cho nửa cuối tuần (Thứ 5–Chủ Nhật).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-amber-900">
                  2. Rã đông hải sản & bò bít tết
                </div>
                <p className="text-stone-600">
                  Luôn rã đông chậm trong ngăn mát (<strong>2–4°C</strong>) từ tối hôm trước để giữ nguyên cấu trúc thớ thịt; tuyệt đối không ngâm nước ấm làm thất thoát dịch ngọt tự nhiên.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-stone-900">
                  3. Bảo quản các loại hạt & bơ chín
                </div>
                <p className="text-stone-600">
                  Hạt óc chó, mắc ca, hạnh nhân bảo quản trong hũ thủy tinh kín ở ngăn mát để tránh ôi dầu; <strong>bơ sáp/bơ Booth</strong> vừa chín tới cất ngay vào ngăn mát giữ dẻo béo suốt 5 ngày.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              * Nguồn tham khảo: FoodSafety.gov Cold Food Storage Charts
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
