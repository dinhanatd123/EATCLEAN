import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowUp, Calendar, ShoppingCart, Clock, ChefHat, ShieldCheck } from 'lucide-react';

interface ScrollProgressProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowFloatingNav(y > 420);

      // Spy on sections to highlight active section while scrolling
      const sections = ['meal-plan', 'grocery', 'prep', 'recipes', 'safety'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
            if (activeTab !== sections[i]) {
              // Update active tab indicator silently if needed
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickNavItems = [
    { id: 'meal-plan', label: 'Thực Đơn', icon: Calendar },
    { id: 'grocery', label: 'Đi Chợ', icon: ShoppingCart },
    { id: 'prep', label: 'Sơ Chế', icon: Clock },
    { id: 'recipes', label: '11 Món', icon: ChefHat },
    { id: 'safety', label: 'An Toàn', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600 origin-left z-50 shadow-sm"
      />

      {/* Floating Quick Navigation & Back to Top on Scroll */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
          >
            {/* Compact Floating Section Switcher (Desktop/Tablet) */}
            <div className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-[#143225]/95 text-white backdrop-blur-md shadow-xl border border-emerald-700/50">
              {quickNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Back to Top Button */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Cuộn lên đầu trang"
              title="Cuộn lên đầu trang"
              className="p-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-amber-300 shadow-xl border border-emerald-600/50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
