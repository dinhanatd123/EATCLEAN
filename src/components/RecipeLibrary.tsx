import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Camera,
  Play,
  ChevronDown,
  ChevronUp,
  Info,
  Flame,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Recipe, PortionSize, BudgetTierId } from '../types';
import { getRecipesForTier, BUDGET_TIERS_METADATA } from '../data/flexibleEatCleanData';
import { scaleTextNumbers, calculateScaleFactor } from '../utils/calculator';

interface RecipeLibraryProps {
  portion: PortionSize;
  budgetTier: BudgetTierId;
  onOpenCookingMode: (recipe: Recipe) => void;
}

const STORAGE_KEY_CUSTOM_IMAGES = 'eatclean_recipe_custom_images_v1';

export const RecipeLibrary: React.FC<RecipeLibraryProps> = ({
  portion,
  budgetTier,
  onOpenCookingMode,
}) => {
  const factor = calculateScaleFactor(portion);
  const tierMeta = BUDGET_TIERS_METADATA[budgetTier];
  const recipesList = getRecipesForTier(budgetTier);

  const [activeTab, setActiveTab] = useState<'breakfast' | 'chicken' | 'steamed' | 'tofu_egg'>('breakfast');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_IMAGES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeUploadModalRecipeId, setActiveUploadModalRecipeId] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(customImages));
    } catch (e) {
      console.warn('Failed saving custom recipe images', e);
    }
  }, [customImages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, recipeId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImages((prev) => ({
          ...prev,
          [recipeId]: reader.result as string,
        }));
        setActiveUploadModalRecipeId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (recipeId: string) => {
    if (!customUrlInput.trim()) return;
    setCustomImages((prev) => ({
      ...prev,
      [recipeId]: customUrlInput.trim(),
    }));
    setCustomUrlInput('');
    setActiveUploadModalRecipeId(null);
  };

  const handleResetImage = (recipeId: string) => {
    setCustomImages((prev) => {
      const copy = { ...prev };
      delete copy[recipeId];
      return copy;
    });
    setActiveUploadModalRecipeId(null);
  };

  const filteredRecipes = recipesList.filter((r) => r.category === activeTab);

  return (
    <section
      id="recipes"
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-emerald-800 text-xs font-semibold tracking-wider mb-1.5">
            04. Thư Viện Công Thức ({tierMeta.shortLabel}) · Nguồn từ Slide 06, 07, 08
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Thư Viện Công Thức Chế Biến Chuẩn Nhiệt Độ Tâm (Gà 74°C • Bò & Cá Hồi 63°C)
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Định lượng tự động đồng bộ theo {portion} người lớn ({tierMeta.name}). Tích hợp Chế Độ Đứng Bếp (Cooking Mode) rảnh tay.
          </p>
        </div>
      </div>

      {/* 4 Category Tabs - 2x2 grid on iPhone, flex on desktop */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('breakfast')}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer leading-snug ${
            activeTab === 'breakfast'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          Bữa Sáng Đa Ngũ Cốc 5–25p
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chicken')}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer leading-snug ${
            activeTab === 'chicken'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          Áp Chảo Gà, Bò & Cá Hồi (74°C/63°C)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('steamed')}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer leading-snug ${
            activeTab === 'steamed'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          Hải Sản Hấp (Tôm, Sò Điệp, Cá)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tofu_egg')}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer leading-snug ${
            activeTab === 'tofu_egg'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          Đậu Hũ Nấm – Trứng – Hải Sản
        </button>
      </div>

      {/* Special Category Highlight Notice from Slide 06, 07, 08 */}
      <AnimatePresence mode="wait">
        {activeTab === 'breakfast' && (
          <motion.div
            key="notice-breakfast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-amber-950 font-bold block">Bí quyết rút ngắn bữa sáng xuống dưới 10 phút (Slide 06):</strong>
              <p>
                · <strong>Ngâm yến mạch qua đêm (Overnight Oats):</strong> Với Thứ Hai, Thứ Tư, Thứ Sáu, có thể trộn sẵn yến mạch cùng sữa tươi/sữa chua Hy Lạp từ tối hôm trước để ngăn mát, sáng hôm sau chỉ việc cắt trái cây và rắc hạt (mất đúng 3 phút).
              </p>
              <p>
                · <strong>Hấp khoai & bắp cùng lúc nấu cơm tối:</strong> Sáng hôm sau làm nóng lại 2 phút bằng lò vi sóng cùng trứng gà. Tối Thứ Bảy ngâm trước 100g hạt sen và gạo lứt để sáng Chủ Nhật ninh cháo nhừ trong 20 phút.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'chicken' && (
          <motion.div
            key="notice-chicken"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <div className="flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-700 space-y-1.5 tabular-nums">
                <strong className="text-emerald-950 font-bold block">
                  Nguyên tắc kiểm soát nhiệt độ cho hộp cơm trưa & Công thức Sốt chấm Eat Clean (Slide 07):
                </strong>
                <p>
                  · <strong>Để thịt nghỉ (Resting time) 5 phút trước khi cắt:</strong> Giúp dịch ngọt phân bổ lại đều khắp thớ cơ, không chảy nước ra đáy hộp cơm làm nhão hạt cơm lứt. Gia cầm đạt tâm <strong>74°C</strong>; Bò bít tết & Cá hồi đạt <strong>63°C (Medium)</strong>.
                </p>
                <p>
                  · <strong>Chế biến ức vịt sốt cam (Trưa T2 Mức 3):</strong> Khứa caro mặt da vịt, áp chảo lạnh không dầu 6 phút cho chảy bớt mỡ dưới da, chắt bỏ mỡ thừa rồi rim cùng 50ml nước cam tươi tới khi tâm đạt 74°C.
                </p>
                <p className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
                  <strong>Mẹo pha sốt chấm Eat Clean không đường tinh luyện:</strong> Pha 2 thìa nước cốt chanh vàng/chanh ta + 1 thìa nước mắm cốt (hoặc xì dầu giảm mặn) + 1 thìa nước ấm + tỏi ớt băm và ngò rí; đóng vào hũ nhỏ 30ml mang theo hộp cơm trưa và chỉ rưới lên thịt/cá sau khi đã quay nóng.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'steamed' && (
          <motion.div
            key="notice-steamed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-blue-950 font-bold block">Lưu ý khi chế biến Tôm, Cồi sò điệp & Cá hấp mang đi làm (Slide 08):</strong>
              <p>
                · <strong>Tôm hấp sả/nước dừa:</strong> Tôm vừa chuyển đỏ cam và cong chữ C (5–7 phút) là tắt bếp ngay để thịt giòn ngọt; bóc sẵn vỏ tôm cho 2 hộp trưa Thứ Tư. Với cồi sò điệp Nhật (Mức 4), thấm khô áp chảo 90 giây mỗi mặt.
              </p>
              <p>
                · <strong>Cá nục / Cá chẽm / Cá tuyết hấp:</strong> Bắt buộc gỡ sạch toàn bộ xương cá ngay khi còn ấm trước khi chia vào 2 hộp ăn trưa Thứ Năm; rưới 2 thìa nước hấp cá nấm đông cô lên mặt thịt cá.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'tofu_egg' && (
          <motion.div
            key="notice-tofu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-stone-100 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-stone-900 font-bold block">Đậu hũ non om nấm & Hấp trứng hải sản (Slide 08):</strong>
              <p>
                Phương pháp hấp cách thủy và om nấm tự nhiên giúp cắt giảm 80% lượng dầu mỡ cho giữa tuần. Kết hợp 800g đậu hũ/mẻ + 4 quả trứng gà + 300g nấm tươi (+ 150–250g bò/tôm/cồi sò điệp ở Mức 2–4) tạo hương vị ngọt thanh tự nhiên.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map((recipe, idx) => {
            const currentImg = customImages[recipe.id] || recipe.imageUrl;
            const isExpanded = expandedRecipeId === recipe.id;

            return (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Scrim & Camera Button */}
                  <div className="relative aspect-video w-full bg-stone-100 overflow-hidden group">
                    <img
                      src={currentImg}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {recipe.tierTag && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#1B4332]/90 text-amber-300 text-[11px] font-bold backdrop-blur-sm">
                        {recipe.tierTag}
                      </span>
                    )}

                    {/* Change Photo Button */}
                    <button
                      type="button"
                      onClick={() => setActiveUploadModalRecipeId(recipe.id)}
                      aria-label={`Thay ảnh món ${recipe.title}`}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/65 hover:bg-black/85 text-white backdrop-blur-sm transition-colors cursor-pointer"
                      title="Thay ảnh bằng ảnh tự chụp hoặc ảnh từ file PDF"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    {/* Bottom Scrim Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3 flex items-center justify-between text-xs text-white tabular-nums">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{recipe.cookTime}</span>
                      </span>
                      <span className="font-semibold text-emerald-200">
                        {recipe.servingsText} {recipe.targetTemp ? `· Tâm ${recipe.targetTemp}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Recipe Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700">
                        {recipe.mealSchedule}
                      </span>
                      <h3 className="font-bold text-stone-900 text-base leading-snug mt-0.5 font-serif">
                        {recipe.title}
                      </h3>
                    </div>

                    {/* Visual Meal Prep Box Ratio */}
                    {recipe.mealBoxRatio && (
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 tabular-nums">
                        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                          <span>Tỷ lệ khay Meal Prep:</span>
                          <span>{recipe.mealBoxRatio.carbPercent}% Tinh bột · {recipe.mealBoxRatio.proteinPercent}% Đạm · {recipe.mealBoxRatio.veggiePercent}% Rau</span>
                        </div>
                        <div className="w-full h-2 rounded-full flex overflow-hidden">
                          <div
                            style={{ width: `${recipe.mealBoxRatio.carbPercent}%` }}
                            className="bg-amber-400"
                            title="Tinh bột"
                          />
                          <div
                            style={{ width: `${recipe.mealBoxRatio.proteinPercent}%` }}
                            className="bg-emerald-700"
                            title="Chất đạm"
                          />
                          <div
                            style={{ width: `${recipe.mealBoxRatio.veggiePercent}%` }}
                            className="bg-emerald-400"
                            title="Rau củ"
                          />
                        </div>
                      </div>
                    )}

                    {/* Ingredients Preview */}
                    <div className="space-y-1 pt-1 tabular-nums">
                      <div className="text-xs font-semibold text-stone-700">
                        Nguyên liệu chuẩn ({portion} người):
                      </div>
                      <ul className="text-xs text-stone-600 space-y-1">
                        {recipe.ingredients.slice(0, 3).map((ing, iIdx) => (
                          <li key={iIdx} className="flex items-start justify-between gap-2">
                            <span>· {ing.name}</span>
                            <span className="font-medium text-stone-800 text-right shrink-0">
                              {scaleTextNumbers(ing.baseAmount, factor)}
                            </span>
                          </li>
                        ))}
                        {recipe.ingredients.length > 3 && !isExpanded && (
                          <li className="text-[11px] text-emerald-700 italic">
                            + {recipe.ingredients.length - 3} nguyên liệu & gia vị khác...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Collapsible Steps & Secret */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-3 border-t border-stone-100 space-y-3 overflow-hidden"
                        >
                          {recipe.ingredients.length > 3 && (
                            <div className="space-y-1 tabular-nums">
                              <span className="text-xs font-semibold text-stone-700">Gia vị & phụ gia:</span>
                              <ul className="text-xs text-stone-600 space-y-0.5">
                                {recipe.ingredients.slice(3).map((ing, idx) => (
                                  <li key={idx} className="flex items-start justify-between gap-2">
                                    <span>· {ing.name}</span>
                                    <span className="font-medium text-stone-800 text-right shrink-0">{scaleTextNumbers(ing.baseAmount, factor)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-stone-700">Các bước thực hiện:</span>
                            <div className="space-y-2">
                              {recipe.steps.map((st) => (
                                <div key={st.stepNumber} className="text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                                  <div className="font-bold text-stone-800 flex items-center justify-between tabular-nums">
                                    <span>Bước {st.stepNumber}: {st.title}</span>
                                    {st.timerMinutes && (
                                      <span className="text-amber-700 font-semibold">
                                        {st.timerMinutes} phút
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-stone-600 mt-1 leading-relaxed">{scaleTextNumbers(st.instruction, factor)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                            <strong className="block font-semibold mb-0.5">Mẹo & Bí quyết:</strong>
                            {recipe.prepSecret}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom Card Controls */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                    className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <span>Thu gọn chi tiết</span> <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Xem toàn bộ các bước & mẹo</span> <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Primary Action: Cooking Mode */}
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onOpenCookingMode(recipe)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#24523E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400 shrink-0" />
                    <span>Chế Độ Đứng Bếp (Cooking Mode)</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Upload Custom Image Modal */}
      {activeUploadModalRecipeId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Thay Ảnh Minh Họa Món Ăn
              </h3>
              <button
                type="button"
                onClick={() => setActiveUploadModalRecipeId(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Bạn có thể tải ảnh cắt từ file PDF gốc hoặc ảnh chụp món ăn thực tế bạn tự nấu. Ảnh được lưu trên máy của bạn.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Chọn ảnh từ máy tính / điện thoại:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, activeUploadModalRecipeId)}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 my-2 text-stone-400 text-xs">
              <div className="h-px bg-stone-200 flex-1" />
              <span>hoặc</span>
              <div className="h-px bg-stone-200 flex-1" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Dán đường dẫn ảnh trực tuyến (URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => handleApplyUrl(activeUploadModalRecipeId)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {customImages[activeUploadModalRecipeId] && (
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleResetImage(activeUploadModalRecipeId)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục ảnh mặc định ban đầu</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
