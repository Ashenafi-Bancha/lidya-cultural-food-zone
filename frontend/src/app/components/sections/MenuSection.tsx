import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { OptimizedImage } from "../OptimizedImage";
import { useMenu, useCategories } from "../../../hooks/useMenu";
import { useLang } from "../../../context/LanguageContext";
import { useNavGo } from "../../hooks/useNavGo";
import { Icon } from "../Icons";

const TAG_BG: Record<string, string> = {
  Signature: "#c25e2a",
  Heritage: "#8b5a2b",
  Fasting: "#4a7c59",
  Ceremony: "#2a5c8a",
  Spicy: "#8b2525",
  New: "#2a5c8a"
};

/**
 * @param preview  Homepage mode: a few signature dishes with no category tabs,
 *                 followed by a "View Full Menu" CTA linking to /menu.
 */
export function MenuSection({
  preview = false,
  hideHeading = false,
}: { preview?: boolean; hideHeading?: boolean } = {}) {
  // Two-level category state: a top-level tab (e.g. "Drinks") and an optional
  // sub-category (e.g. "Hot Drinks") shown only for parents that have children.
  const { t, tf } = useLang();
  const navGo = useNavGo();
  const [activeTop, setActiveTop] = useState("All");
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const { data: menuData, isLoading: isLoadingMenu, isError: isErrorMenu } = useMenu();
  const { data: catData, isLoading: isLoadingCats } = useCategories();

  // API is the source of truth — no fabricated fallback content.
  const items = menuData ?? [];

  const tree = [...(catData ?? [])].sort((a, b) => a.order - b.order);
  const topTabs = ["All", ...tree.map(c => c.name)];
  const activeTopNode = tree.find(t => t.name === activeTop);
  const subTabs = activeTopNode?.children ?? [];

  const catNameOf = (i: any) => i.category?.name || i.cat;

  const selectTop = (name: string) => {
    setActiveTop(name);
    setActiveSub(null);
  };

  let filtered = items;
  if (preview) {
    // Signature dishes first, then fill to four.
    const signature = items.filter((i: any) => i.tag);
    const rest = items.filter((i: any) => !i.tag);
    filtered = [...signature, ...rest].slice(0, 4);
  } else if (activeTop !== "All") {
    if (activeSub) {
      // A specific sub-category is selected.
      filtered = items.filter(i => catNameOf(i) === activeSub);
    } else if (subTabs.length > 0) {
      // A parent with children — show items across all its children (plus any
      // assigned directly to the parent).
      const childNames = subTabs.map(c => c.name);
      filtered = items.filter(i => {
        const n = catNameOf(i);
        return childNames.includes(n) || n === activeTop;
      });
    } else {
      // A leaf top-level category.
      filtered = items.filter(i => catNameOf(i) === activeTop);
    }
  }

  return (
    <section id="menu" className={`bg-[#1e1008] ${hideHeading ? "pt-10 pb-16 md:pt-14 md:pb-24" : "py-16 md:py-24 lg:py-32"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className={`mb-12 text-center ${hideHeading ? "hidden" : ""}`}>
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("menu.eyebrow")}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("menu.titlePre")} <em className="text-[#d4a843]">{t("menu.titleEm")}</em>
          </h2>
        </Reveal>

        {preview ? null : isLoadingCats ? (
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-8 w-24 bg-[#3e2615] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mb-10">
            {/* Top-level category tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {topTabs.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => selectTop(cat)}
                  className="px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase border transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    background: activeTop === cat
                      ? "linear-gradient(135deg,#f5c842 0%,#d4a843 55%,#c8901f 100%)"
                      : "rgba(212,168,67,0.05)",
                    borderColor: activeTop === cat ? "#f5c842" : "rgba(212,168,67,0.28)",
                    color: activeTop === cat ? "#1e1008" : "rgba(232,220,200,0.65)",
                    fontWeight: activeTop === cat ? 700 : 500,
                    boxShadow: activeTop === cat ? "0 0 22px rgba(212,168,67,0.45)" : "none",
                  }}
                  whileHover={activeTop === cat ? {} : { borderColor: "rgba(212,168,67,0.7)", color: "#f5efe6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat === "All" ? t("menu.all") : (tf(tree.find(c => c.name === cat), "name") || cat)}
                </motion.button>
              ))}
            </div>

            {/* Sub-category tabs (only for a selected parent that has children) */}
            {subTabs.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <motion.button
                  onClick={() => setActiveSub(null)}
                  className="px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase rounded-full border transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    background: activeSub === null ? "#d4a843" : "transparent",
                    borderColor: activeSub === null ? "#d4a843" : "rgba(212,168,67,0.35)",
                    color: activeSub === null ? "#1e1008" : "rgba(212,168,67,0.75)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("menu.allPrefix")} {tf(activeTopNode, "name") || activeTop}
                </motion.button>
                {subTabs.map(sub => (
                  <motion.button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.name)}
                    className="px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase rounded-full border transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-lidya-sans)",
                      background: activeSub === sub.name ? "#d4a843" : "transparent",
                      borderColor: activeSub === sub.name ? "#d4a843" : "rgba(212,168,67,0.35)",
                      color: activeSub === sub.name ? "#1e1008" : "rgba(212,168,67,0.75)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tf(sub, "name")}
                  </motion.button>
                ))}
              </div>
            )}
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
          ) : items.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
              {isErrorMenu ? t("menu.emptyError") : t("menu.emptyComingSoon")}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group h-full flex flex-col items-center text-center"
                  whileHover={{ y: -8 }}
                >
                  {/* Domed dish photo — soft top corners, half-circle sweep at
                      the bottom, framed in gold. */}
                  <div
                    className="relative w-full overflow-hidden bg-[#3e2615]"
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "1.75rem 1.75rem 50% 50% / 1.75rem 1.75rem 34% 34%",
                      border: "1px solid rgba(212,168,67,0.3)",
                      boxShadow: "0 16px 38px rgba(0,0,0,0.45)",
                    }}
                  >
                    {item.imageUrl || (item as any).img ? (
                      <OptimizedImage
                        src={item.imageUrl || (item as any).img}
                        fallbackSrc={(item as any).fallbackImg || item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                        loading="lazy"
                      />
                    ) : (
                      /* No photo yet — an elegant branded placeholder keeps the
                         domed frame looking intentional. */
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{ background: "linear-gradient(150deg,#3a2412 0%,#241408 100%)" }}
                        aria-hidden
                      >
                        <span className="text-[#d4a843]/45 text-3xl"><Icon.Utensils /></span>
                        <span
                          className="text-[8px] tracking-[0.25em] uppercase text-[#e8dcc8]/25"
                          style={{ fontFamily: "var(--font-lidya-sans)" }}
                        >
                          Lidya
                        </span>
                      </div>
                    )}
                    {/* base shading so the dome edge reads against the page */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(14,7,3,0.55) 0%, transparent 45%)" }}
                    />
                    {/* warm gold bloom on hover */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(ellipse at bottom, rgba(212,168,67,0.32), transparent 65%)" }}
                    />
                    {item.tag && (
                      <span
                        className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase text-[#faf5ee] whitespace-nowrap"
                        style={{
                          fontFamily: "var(--font-lidya-sans)",
                          background: TAG_BG[item.tag] ?? "#c25e2a",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
                        }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="pt-5 px-2 flex-1 flex flex-col items-center">
                    <h3
                      className="text-[#f5efe6] font-semibold text-lg md:text-xl leading-snug transition-colors duration-300 group-hover:text-[#ffe488]"
                      style={{ fontFamily: "var(--font-lidya-serif)" }}
                    >
                      {tf(item, "name")}
                    </h3>

                    {/* gold price with flanking rules */}
                    <div className="flex items-center gap-3 my-2.5 w-full max-w-[190px]">
                      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4a843]/40" />
                      <span
                        className="text-[#d4a843] text-sm font-bold tracking-wide shrink-0"
                        style={{ fontFamily: "var(--font-lidya-sans)" }}
                      >
                        {item.price}
                      </span>
                      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4a843]/40" />
                    </div>

                    <p
                      className="text-sm leading-relaxed text-[#e8dcc8]/50"
                      style={{ fontFamily: "var(--font-lidya-body)" }}
                    >
                      {tf(item, "description")}
                    </p>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-10 text-center text-[#e8dcc8]/50">
                  {t("menu.noneInCategory")}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {preview && filtered.length > 0 && (
          <Reveal className="text-center mt-10 md:mt-12">
            <motion.button
              type="button"
              onClick={() => navGo({ id: "menu", path: "/menu" })}
              className="group/cta inline-flex items-center gap-3 px-9 py-4 rounded-xl text-[11px] tracking-[0.24em] uppercase font-semibold"
              style={{
                fontFamily: "var(--font-lidya-sans)",
                color: "#d4a843",
                border: "1px solid rgba(212,168,67,0.5)",
                background: "linear-gradient(135deg, rgba(212,168,67,0.10) 0%, rgba(194,94,42,0.08) 100%)",
              }}
              whileHover={{ backgroundColor: "#d4a843", color: "#1e1008", boxShadow: "0 0 28px rgba(212,168,67,0.45)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              {t("common2.viewFullMenu")}
              <span aria-hidden className="inline-flex transition-transform duration-300 group-hover/cta:translate-x-1">
                <Icon.ArrowRight />
              </span>
            </motion.button>
          </Reveal>
        )}
      </div>
    </section>
  );
}

