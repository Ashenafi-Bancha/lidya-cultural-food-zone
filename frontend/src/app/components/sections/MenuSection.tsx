import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { OptimizedImage } from "../OptimizedImage";
import { MENU_CATEGORIES, MENU_ITEMS as FALLBACK_MENU_ITEMS } from "../../data/constants";
import { useMenu, useCategories } from "../../../hooks/useMenu";

const TAG_BG: Record<string, string> = {
  Signature: "#c25e2a",
  Heritage: "#8b5a2b",
  Fasting: "#4a7c59",
  Ceremony: "#2a5c8a",
  Spicy: "#8b2525",
  New: "#2a5c8a"
};

export function MenuSection() {
  const [active, setActive] = useState("All");
  
  const { data: menuData, isLoading: isLoadingMenu, isError: isErrorMenu } = useMenu();
  const { data: catData, isLoading: isLoadingCats } = useCategories();

  // Use API data if available, otherwise fallback to static constants
  const items = menuData && menuData.length > 0 ? menuData : FALLBACK_MENU_ITEMS;
  
  // Create category list dynamically if API has them, else use static list
  let categories = [...MENU_CATEGORIES];
  if (catData && catData.length > 0) {
    categories = ["All", ...catData.sort((a, b) => a.order - b.order).map(c => c.name)];
  }

  const filtered = active === "All" 
    ? items 
    : items.filter(i => {
        // Handle both api shape (category.name) and static shape (cat)
        const catName = (i as any).category?.name || (i as any).cat;
        return catName === active;
      });

  return (
    <section id="menu" className="bg-[#1e1008] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-12 text-center">
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Lidya Cultural Food Zone</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Our <em className="text-[#d4a843]">Menu</em>
          </h2>
        </Reveal>

        {isLoadingCats ? (
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-8 w-24 bg-[#3e2615] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-lidya-sans)",
                  background: active === cat ? "#c25e2a" : "transparent",
                  borderColor: active === cat ? "#c25e2a" : "rgba(232,220,200,0.18)",
                  color: active === cat ? "#faf5ee" : "rgba(232,220,200,0.55)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {isLoadingMenu ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="bg-[#2e1a0c] h-[300px] animate-pulse">
                  <div className="aspect-[4/3] bg-[#3e2615]" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-[#3e2615] w-2/3" />
                    <div className="h-4 bg-[#3e2615] w-full" />
                    <div className="h-4 bg-[#3e2615] w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-[#2e1a0c] overflow-hidden h-full flex flex-col"
                  whileHover={{ y: -7, boxShadow: "0 24px 48px rgba(0,0,0,0.45)" }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#3e2615] relative">
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                    >
                      <OptimizedImage
                        src={item.imageUrl || (item as any).img}
                        fallbackSrc={(item as any).fallbackImg || item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                    {item.tag && (
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase text-[#faf5ee]"
                        style={{ fontFamily: "var(--font-lidya-sans)", background: TAG_BG[item.tag] ?? "#c25e2a" }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[#f5efe6] font-semibold text-lg leading-snug" style={{ fontFamily: "var(--font-lidya-serif)" }}>{item.name}</h3>
                      <span className="text-[#d4a843] text-sm font-medium shrink-0 mt-0.5" style={{ fontFamily: "var(--font-lidya-sans)" }}>{item.price}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#e8dcc8]/50 mt-auto" style={{ fontFamily: "var(--font-lidya-body)" }}>{item.description || (item as any).desc}</p>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-10 text-center text-[#e8dcc8]/50">
                  No items found in this category.
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

