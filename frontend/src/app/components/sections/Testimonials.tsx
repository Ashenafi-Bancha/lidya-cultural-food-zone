import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useLang } from "../../../context/LanguageContext";
import { TESTIMONIALS } from "../../data/testimonials";
import { useTestimonials } from "../../../hooks/useTestimonials";
import { assetUrl } from "../../../lib/api";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export function Testimonials() {
  const { t, tf } = useLang();

  // Hybrid content source: the admin-managed database wins when the backend is
  // reachable and has active testimonials; otherwise fall back to the bundled
  // frontend testimonials so the section always renders (e.g. on Vercel).
  const { data: apiData } = useTestimonials();
  const apiItems = (apiData ?? []).filter((x) => x.isActive);
  const items =
    apiItems.length > 0
      ? apiItems.map((x) => ({ ...x, imageUrl: assetUrl(x.imageUrl) }))
      : TESTIMONIALS;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % items.length), 5200);
    return () => clearInterval(timer);
  }, [items.length]);

  // Keep the index valid if the list size changes.
  useEffect(() => {
    if (idx >= items.length) setIdx(0);
  }, [items.length, idx]);

  // Hide the whole section when there are no testimonials.
  if (items.length === 0) return null;

  const current = items[idx % Math.max(items.length, 1)];

  return (
    <section id="testimonials" className="bg-[#2c1508] py-16 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="text-center mb-14">
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("testimonials.eyebrow")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t("testimonials.title")}</h2>
          <p className="text-base md:text-lg text-[#f5efe6]/80 max-w-2xl mx-auto mt-5 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{t("testimonials.subtitle")}</p>
        </Reveal>

        <div className="min-h-[240px] flex items-center justify-center">
          {!current ? null : (
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="text-center w-full px-4 md:px-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: Math.min(Math.max(current.rating || 5, 1), 5) }).map((_, i) => (
                    <span key={i} className="text-base"><Icon.Star filled /></span>
                  ))}
                </div>
                <blockquote
                  className="text-[#f5efe6]/82 text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 italic"
                  style={{ fontFamily: "var(--font-lidya-body)" }}
                >
                  "{tf(current, "quote")}"
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  {current.imageUrl ? (
                    <img
                      src={current.imageUrl}
                      alt={current.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#d4a843]/45"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-[#c25e2a] rounded-full flex items-center justify-center text-[#faf5ee] text-lg font-bold"
                      style={{ fontFamily: "var(--font-lidya-sans)" }}
                    >
                      {initials(current.name)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-white font-medium text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>{current.name}</p>
                    {tf(current, "role") && (
                      <p className="text-xs text-[#e8dcc8]/45" style={{ fontFamily: "var(--font-lidya-sans)" }}>{tf(current, "role")}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Dot indicators */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="rounded-full"
                animate={{
                  width: i === idx ? 28 : 8,
                  backgroundColor: i === idx ? "#d4a843" : "rgba(232,220,200,0.25)",
                }}
                style={{ height: 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
