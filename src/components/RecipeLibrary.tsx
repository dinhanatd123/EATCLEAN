import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  Thermometer,
  Camera,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Flame,
  Check,
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

  // Custom user uploaded images stored in localStorage
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
    <section id="recipes" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ChefHat className="w-3.5 h-3.5 text-emerald-700" />
            PHÂN KHU 5 • NGUỒN TỪ SLIDE 05, 06, 07, 08
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-serif">
            Thư Viện 11 Công Thức Chế Biến Có Hình Ảnh Minh Họa
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Định lượng tự động đồng bộ theo {portion} người lớn. Tích hợp Chế Độ Đứng Bếp (Cooking Mode) với bộ bấm giờ nấu ăn.
          </p>
        </div>
      </div>

      {/* 4 Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('breakfast')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'breakfast'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          🌅 Bữa Sáng Nhanh 5–25 Phút (3 món)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chicken')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'chicken'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          🍗 Nhóm Ức Gà Đạt Tâm 74°C (3 món)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('steamed')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'steamed'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          🥬 Nhóm Món Hấp Thanh Đạm (2 món)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tofu_egg')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'tofu_egg'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/80'
          }`}
        >
          🍳 Nhóm Đậu Hũ – Trứng (3 món)
        </button>
      </div>

      {/* Special Category Highlight Notice */}
      {activeTab === 'breakfast' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <strong className="text-amber-950 font-bold block">Điểm chung giúp bữa sáng chỉ mất 5–10 phút (Slide 05):</strong>
            <p>
              • Lạc sống (200 g) đã rang sẵn từ chiều Chủ Nhật cất hũ kín, mỗi sáng chỉ việc múc rắc lên món ăn (20g cho ngày yến mạch, 30g cho ngày khoai lang, 50g cho cháo sáng Chủ Nhật).
            </p>
            <p>
              • Khoai lang và trứng luộc có thể hấp/luộc từ tối hôm trước hoặc bật xửng hấp cách thủy trong lúc làm vệ sinh cá nhân buổi sáng.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'chicken' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Flame className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <strong className="text-emerald-950 font-bold block">Bí quyết giữ ức gà mềm ngọt khi hâm lại buổi trưa (Slide 06):</strong>
            <p>
              Thái ức gà theo thớ xiên với độ dày đồng đều (1,5–2 cm). Khi áp chảo chỉ dùng 10–15 ml dầu ăn, ngay khi mặt ngoài vừa xém vàng thì châm 2–3 thìa canh nước nóng và đậy nắp kín để hơi nước làm chín phần tâm tới đúng <strong>74°C</strong> mà không làm khô xác sợi cơ.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'steamed' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <strong className="text-blue-950 font-bold block">Lưu ý quan trọng khi chia suất mang đi làm (Slide 07):</strong>
            <p>
              • Với món cá diêu hồng: Bắt buộc gỡ sạch toàn bộ xương cá ngay sau khi hấp chín trước khi chia phần vào 2 hộp ăn trưa Thứ Năm để đảm bảo an toàn tuyệt đối và tiện lợi tại văn phòng.
            </p>
            <p>
              • Nước tiết ra từ đĩa hấp: Rưới 1–2 thìa nước hấp gừng ngọt thanh lên phần thịt/cá trong hộp để giữ độ ẩm tự nhiên khi bảo quản trong tủ lạnh.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'tofu_egg' && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-700 space-y-1">
            <strong className="text-stone-900 font-bold block">Đạm thực vật & Trứng tươi nguyên quả (Slide 08):</strong>
            <p>
              Đậu hũ trắng tươi 1,6kg chia 2 mẻ mua giữa tuần cho tối T5 và tối T7. Kết hợp cùng 20 quả trứng gà cung cấp nguồn axit amin hoàn chỉnh, chất béo tốt và lecithin cho não bộ với giá thành bình dân.
            </p>
          </div>
        </div>
      )}

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const currentImg = customImages[recipe.id] || recipe.imageUrl;
          const isExpanded = expandedRecipeId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges & Camera Button */}
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden group">
                  <img
                    src={currentImg}
                    alt={recipe.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#1B4332]/90 backdrop-blur-sm text-emerald-200 border border-emerald-500/30">
                      {recipe.servingsText}
                    </span>
                    {recipe.targetTemp && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-stone-950 shadow">
                        {recipe.targetTemp}
                      </span>
                    )}
                  </div>

                  {/* Change Photo Button */}
                  <button
                    type="button"
                    onClick={() => setActiveUploadModalRecipeId(recipe.id)}
                    aria-label={`Thay ảnh món ${recipe.title}`}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                    title="Thay ảnh bằng ảnh tự chụp hoặc ảnh từ file PDF"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Bottom Cook Time Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{recipe.cookTime}</span>
                  </div>
                </div>

                {/* Recipe Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                      {recipe.mealSchedule}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base leading-snug mt-0.5 font-serif">
                      {recipe.title}
                    </h3>
                  </div>

                  {/* Visual Meal Prep Box Ratio */}
                  {recipe.mealBoxRatio && (
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                        <span>Tỷ lệ khay Meal Prep:</span>
                        <span>{recipe.mealBoxRatio.carbPercent}% Cơm • {recipe.mealBoxRatio.proteinPercent}% Đạm • {recipe.mealBoxRatio.veggiePercent}% Rau</span>
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
                  <div className="space-y-1 pt-1">
                    <div className="text-xs font-semibold text-stone-700">
                      Nguyên liệu chuẩn ({portion} người):
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {recipe.ingredients.slice(0, 3).map((ing, iIdx) => (
                        <li key={iIdx} className="flex items-center justify-between">
                          <span>• {ing.name}</span>
                          <span className="font-medium text-stone-800">
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
                  {isExpanded && (
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      {/* Full Ingredients List */}
                      {recipe.ingredients.length > 3 && (
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-stone-700">Gia vị & phụ gia:</span>
                          <ul className="text-xs text-stone-600 space-y-0.5">
                            {recipe.ingredients.slice(3).map((ing, idx) => (
                              <li key={idx} className="flex items-center justify-between">
                                <span>• {ing.name}</span>
                                <span className="font-medium text-stone-800">{scaleTextNumbers(ing.baseAmount, factor)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Step by Step */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-stone-700">Các bước thực hiện:</span>
                        <div className="space-y-2">
                          {recipe.steps.map((st) => (
                            <div key={st.stepNumber} className="text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                              <div className="font-bold text-stone-800 flex items-center justify-between">
                                <span>Bước {st.stepNumber}: {st.title}</span>
                                {st.timerMinutes && (
                                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                                    ⏱ {st.timerMinutes}p
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-600 mt-1 leading-relaxed">{st.instruction}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chef Secret */}
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                        <strong className="block font-semibold mb-0.5">Mẹo & Bí quyết:</strong>
                        {recipe.prepSecret}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                  className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 font-medium transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Thu gọn chi tiết <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Xem toàn bộ các bước & mẹo <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Primary Action: Cooking Mode */}
                <button
                  type="button"
                  onClick={() => onOpenCookingMode(recipe)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#24523E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                  Chế Độ Đứng Bếp (Cooking Mode)
                </button>
              </div>
            </div>
          );
        })}
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
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Bạn có thể tải ảnh cắt từ file PDF gốc hoặc ảnh chụp món ăn thực tế bạn tự nấu. Ảnh được lưu trên máy của bạn.
            </p>

            {/* Option 1: File input */}
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

            {/* Option 2: Image URL */}
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
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Reset to default */}
            {customImages[activeUploadModalRecipeId] && (
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleResetImage(activeUploadModalRecipeId)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Khôi phục ảnh mặc định ban đầu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
