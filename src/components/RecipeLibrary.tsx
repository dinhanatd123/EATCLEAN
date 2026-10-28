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
} from 'lucide-react';
import { Recipe, PortionSize } from '../types';
import { RECIPES_DATA } from '../data/eatCleanData';
import { scaleTextNumbers, calculateScaleFactor } from '../utils/calculator';

interface RecipeLibraryProps {
  portion: PortionSize;
  onOpenCookingMode: (recipe: Recipe) => void;
}

const STORAGE_KEY_CUSTOM_IMAGES = 'eatclean_recipe_custom_images_v1';

export const RecipeLibrary: React.FC<RecipeLibraryProps> = ({
  portion,
  onOpenCookingMode,
}) => {
  const factor = calculateScaleFactor(portion);
  const [activeTab, setActiveTab] = useState<'breakfast' | 'chicken' | 'steamed' | 'tofu_egg'>('breakfast');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>('recipe-chicken-panseared-pumpkin');

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

  const filteredRecipes = RECIPES_DATA.filter((r) => r.category === activeTab);

  return (
    <motion.section
      id="recipes"
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
            04. Thư Viện Công Thức · Nguồn từ Slide 05, 06, 07, 08
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif text-balance">
            Thư Viện 11 Công Thức Chế Biến Có Hình Ảnh Minh Họa
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Định lượng tự động đồng bộ theo {portion} người lớn. Tích hợp Chế Độ Đứng Bếp (Cooking Mode) với bộ bấm giờ nấu ăn.
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
          Bữa Sáng 5–25p (3 món)
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
          Ức Gà Tâm 74°C (3 món)
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
          Món Hấp Thanh Đạm (2 món)
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
          Đậu Hũ – Trứng (3 món)
        </button>
      </div>

      {/* Special Category Highlight Notice */}
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
              <strong className="text-amber-950 font-bold block">Điểm chung giúp bữa sáng chỉ mất 5–10 phút (Slide 05):</strong>
              <p>
                · Lạc sống (200 g) đã rang sẵn từ chiều Chủ Nhật cất hũ kín, mỗi sáng chỉ việc múc rắc lên món ăn (20g cho ngày yến mạch, 30g cho ngày khoai lang, 50g cho cháo sáng Chủ Nhật).
              </p>
              <p>
                · Khoai lang và trứng luộc có thể hấp/luộc từ tối hôm trước hoặc bật xửng hấp cách thủy trong lúc làm vệ sinh cá nhân buổi sáng.
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
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
          >
            <Flame className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-emerald-950 font-bold block">Bí quyết giữ ức gà mềm ngọt khi hâm lại buổi trưa (Slide 06):</strong>
              <p>
                Thái ức gà theo thớ xiên với độ dày đồng đều (1,5–2 cm). Khi áp chảo chỉ dùng 10–15 ml dầu ăn, ngay khi mặt ngoài vừa xém vàng thì châm 2–3 thìa canh nước nóng và đậy nắp kín để hơi nước làm chín phần tâm tới đúng <strong>74°C</strong> mà không làm khô xác sợi cơ.
              </p>
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
              <strong className="text-blue-950 font-bold block">Lưu ý quan trọng khi chia suất mang đi làm (Slide 07):</strong>
              <p>
                · Với món cá diêu hồng: Bắt buộc gỡ sạch toàn bộ xương cá ngay sau khi hấp chín trước khi chia phần vào 2 hộp ăn trưa Thứ Năm để đảm bảo an toàn tuyệt đối và tiện lợi tại văn phòng.
              </p>
              <p>
                · Nước tiết ra từ đĩa hấp: Rưới 1–2 thìa nước hấp gừng ngọt thanh lên phần thịt/cá trong hộp để giữ độ ẩm tự nhiên khi bảo quản trong tủ lạnh.
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
            className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 space-y-1 tabular-nums">
              <strong className="text-stone-900 font-bold block">Đạm thực vật & Trứng tươi nguyên quả (Slide 08):</strong>
              <p>
                Đậu hũ trắng tươi 1,6kg chia 2 mẻ mua giữa tuần cho tối T5 và tối T7. Kết hợp cùng 20 quả trứng gà cung cấp nguồn axit amin hoàn chỉnh, chất béo tốt và lecithin cho não bộ với giá thành bình dân.
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
                        {recipe.servingsText} {recipe.targetTemp ? `· ${recipe.targetTemp}` : ''}
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
                          <span>{recipe.mealBoxRatio.carbPercent}% Cơm · {recipe.mealBoxRatio.proteinPercent}% Đạm · {recipe.mealBoxRatio.veggiePercent}% Rau</span>
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
                          <li key={iIdx} className="flex items-center justify-between gap-2">
                            <span>· {ing.name}</span>
                            <span className="font-medium text-stone-800 text-right">
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
                                  <li key={idx} className="flex items-center justify-between gap-2">
                                    <span>· {ing.name}</span>
                                    <span className="font-medium text-stone-800 text-right">{scaleTextNumbers(ing.baseAmount, factor)}</span>
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
                                  <p className="text-stone-600 mt-1 leading-relaxed">{st.instruction}</p>
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
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#24523E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
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
    </motion.section>
  );
};
