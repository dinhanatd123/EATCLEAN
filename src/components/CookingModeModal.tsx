import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  Thermometer,
  Flame,
  ChefHat,
  Volume2,
} from 'lucide-react';
import { Recipe, PortionSize } from '../types';
import { scaleTextNumbers, calculateScaleFactor } from '../utils/calculator';
import { playChimeSound } from '../utils/audio';

interface CookingModeModalProps {
  recipe: Recipe;
  portion: PortionSize;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  portion,
  onClose,
}) => {
  const factor = calculateScaleFactor(portion);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const step = recipe.steps[currentStepIdx];
  const stepTimerMinutes = step?.timerMinutes || 5;

  // Countdown timer for active step
  const [secondsLeft, setSecondsLeft] = useState<number>(stepTimerMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Update timer whenever changing steps
  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsLeft((step?.timerMinutes || 5) * 60);
  }, [currentStepIdx, step?.timerMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
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

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestChime = () => {
    playChimeSound();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cooking-mode-title"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md text-white flex flex-col justify-between overflow-y-auto"
    >
      {/* Top Header Bar */}
      <div className="border-b border-stone-800 bg-stone-900/90 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ChefHat className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                CHẾ ĐỘ ĐỨNG BẾP RẢNH TAY
              </span>
              {recipe.targetTemp && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-stone-950">
                  Tâm ≥ {recipe.targetTemp}
                </span>
              )}
            </div>
            <h2 id="cooking-mode-title" className="text-lg sm:text-xl font-extrabold text-white font-serif line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestChime}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
            title="Nghe thử âm báo hết giờ"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Thử chuông
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chế độ đứng bếp"
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center space-y-8">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-semibold uppercase tracking-wider">
          <span>
            Bước {currentStepIdx + 1} trên {recipe.steps.length}
          </span>
          <span>{recipe.servingsText} ({portion} người)</span>
        </div>

        <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / recipe.steps.length) * 100}%` }}
          />
        </div>

        {/* Step Instruction Box (Large Readable Typography) */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs sm:text-sm font-bold border border-emerald-800/60">
                Bước {step.stepNumber}: {step.title}
              </span>
              <p className="text-xl sm:text-3xl font-medium text-stone-100 leading-relaxed font-sans">
                {scaleTextNumbers(step.instruction, factor)}
              </p>
            </div>
          </div>

          {/* Integrated Timer */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-stone-950/60 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                  Đồng hồ đếm ngược công đoạn
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-amber-400 tracking-wider">
                  {formatTimer(secondsLeft)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-base flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-stone-950" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-stone-950" /> Bắt đầu bấm giờ
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsLeft((step?.timerMinutes || 5) * 60);
                }}
                aria-label="Đặt lại thời gian bước này"
                className="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Secret / Safety Tip Box */}
        {recipe.prepSecret && (
          <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200 flex items-start gap-3">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold">Mẹo đầu bếp giữ độ ẩm:</strong> {recipe.prepSecret}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Controls */}
      <div className="border-t border-stone-800 bg-stone-900/90 px-4 sm:px-8 py-4 flex items-center justify-between sticky bottom-0 z-10">
        <button
          type="button"
          disabled={currentStepIdx === 0}
          onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
          className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Bước trước
        </button>

        {currentStepIdx < recipe.steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStepIdx((prev) => prev + 1)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            Bước tiếp theo <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Check className="w-5 h-5" /> Hoàn thành món ăn!
          </button>
        )}
      </div>
    </div>
  );
};
