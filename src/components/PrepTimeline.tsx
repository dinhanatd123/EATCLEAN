import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  Bell,
  Sparkles,
} from 'lucide-react';
import { PREP_TIMELINE_STEPS } from '../data/eatCleanData';
import { playChimeSound } from '../utils/audio';

const STORAGE_KEY_TIMELINE_CHECKS = 'eatclean_prep_checks_v1';

export const PrepTimeline: React.FC = () => {
  // Step checks saved in localStorage
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMELINE_CHECKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 90-Minute Stopwatch / Timer
  // Total 90 minutes = 5400 seconds
  const INITIAL_TIMER_SECONDS = 90 * 60;
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(INITIAL_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [stopwatchElapsed, setStopwatchElapsed] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIMELINE_CHECKS, JSON.stringify(completedSteps));
    } catch (e) {
      console.warn('Failed saving timeline checks', e);
    }
  }, [completedSteps]);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerMode === 'countdown') {
          setTimerSecondsLeft((prev) => {
            if (prev <= 1) {
              playChimeSound();
              setIsTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchElapsed((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMode]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(INITIAL_TIMER_SECONDS);
    setStopwatchElapsed(0);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = PREP_TIMELINE_STEPS.filter((s) => completedSteps[s.id]).length;

  return (
    <section id="prep" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            PHÂN KHU 4 • NGUỒN TỪ SLIDE 04
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif">
            Quy Trình Sơ Chế 90 Phút Chủ Nhật & Nhịp Nấu 20–30 Phút Mỗi Tối
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Tổ chức dây chuyền sơ chế khoa học giúp rút ngắn thời gian đứng bếp mỗi tối trong tuần xuống dưới 30 phút.
          </p>
        </div>

        {/* 90-Min Timer Widget */}
        <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-lg border border-emerald-700/60 flex items-center gap-4 shrink-0">
          <div className="space-y-0.5">
            <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-400" />
              {timerMode === 'countdown' ? 'Đồng hồ đếm ngược 90p' : 'Bấm giờ thực tế'}
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-wider">
              {timerMode === 'countdown' ? formatTime(timerSecondsLeft) : formatTime(stopwatchElapsed)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-emerald-800 pl-3">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow active:scale-95"
              aria-label={isTimerRunning ? 'Tạm dừng timer' : 'Bắt đầu timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-all active:scale-95"
              aria-label="Đặt lại timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Steps & Quality Control Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Step-by-Step Interactive Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Dây chuyền sơ chế ({completedCount}/{PREP_TIMELINE_STEPS.length} chặng hoàn thành)
            </span>
            {completedCount === PREP_TIMELINE_STEPS.length && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Tuyệt vời! Đã hoàn thành 100% sơ chế
              </span>
            )}
          </div>

          <div className="space-y-4">
            {PREP_TIMELINE_STEPS.map((step, idx) => {
              const isDone = !!completedSteps[step.id];

              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`rounded-2xl border transition-all p-5 cursor-pointer relative overflow-hidden ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-none'
                      : 'bg-white border-stone-200 hover:border-emerald-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      aria-label={`Hoàn thành bước ${step.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                      className="mt-0.5 text-emerald-700 hover:scale-110 transition-transform shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-stone-300" />
                      )}
                    </button>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1B4332] text-emerald-200">
                            {step.timeRange}
                          </span>
                          <span className="text-xs font-medium text-stone-500">
                            {step.phase}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          ⏱ {step.durationMinutes} phút
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold ${
                          isDone ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5 list-disc list-inside">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Vegetable Freshness & Visual Prep Box */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prep Photo Card */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="aspect-video w-full bg-stone-100 relative">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
                alt="Meal Prep Chủ Nhật"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-white font-medium">
                  Khay sơ chế thủy tinh có nắp gioăng & chia ngăn khoa học
                </span>
              </div>
            </div>
            <div className="p-4 text-xs text-stone-600 leading-relaxed">
              Chia sẵn ức gà theo mẻ (300g / 600g / 600g), rang 200g lạc cất hũ kín và cân sẵn yến mạch 160g/160g/180g giúp tiết kiệm tối đa thời gian buổi sáng và buổi tối trong tuần.
            </div>
          </div>

          {/* Quality Control Box from Slide 04 */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-stone-50 rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-2 text-emerald-950 font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4>Mẹo Kiểm Soát Chất Lượng Rau Củ</h4>
                <p className="text-xs font-normal text-emerald-800">
                  Slide 04: Thứ tự ưu tiên dùng rau giữ độ ngọt và dinh dưỡng tối đa
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Đầu tuần: Ăn ngay rau lá
                </div>
                <p className="text-stone-600">
                  Dùng <strong>rau cải (Thứ 2, Thứ 5, CN)</strong> và <strong>rau muống (Thứ 4)</strong> ngay khi còn tươi để đảm bảo lượng vitamin C và diệp lục cao nhất.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Cuối tuần: Củ quả nguyên miếng
                </div>
                <p className="text-stone-600">
                  Giữ <strong>bắp cải (Thứ 3, Thứ 7)</strong>, <strong>bí đỏ (Thứ 2, Thứ 6)</strong> và <strong>cà rốt (Thứ 6, Thứ 7, CN)</strong> cho nửa cuối tuần vì củ quả nguyên miếng giữ độ ngọt lâu hơn gấp <strong>2–3 lần</strong> so với rau lá.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 italic">
              * Nguồn tham khảo: FoodSafety.gov Cold Food Storage Charts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
