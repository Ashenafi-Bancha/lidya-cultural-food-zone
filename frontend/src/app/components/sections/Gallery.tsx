import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { OptimizedImage } from "../OptimizedImage";
import { GALLERY_ITEMS } from "../../data/gallery";
import { useGallery } from "../../../hooks/useGallery";
import { assetUrl } from "../../../lib/api";
import { useLang } from "../../../context/LanguageContext";

// Section order for the public gallery. Items are grouped under these headings.
const GALLERY_GROUPS = ["MOMENTS", "LIFE"];

/* ─── Individual gallery card ─────────────────────────────────────────── */
function GalleryCard({
  item,
  onClick,
}: {
  item: any;
  onClick: () => void;
}) {
  const { tf } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#2e1a0c] cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`View: ${item.title}`}
    >
      {/* ── Image with subtle zoom ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <OptimizedImage
          src={item.thumbUrl || item.thumb || item.imageUrl || item.src}
          alt={item.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* ── Always-visible gradient + title bar (bottom) ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(14,6,0,0.90) 0%, rgba(14,6,0,0.55) 48%, transparent 100%)",
        }}
      >
        <div className="px-3 pb-3 pt-10 sm:px-4 sm:pb-4 sm:pt-14">
          {/* Category tag */}
          {item.type === "video" && (
            <span
              className="inline-flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-[#d4a843] mb-1"
              style={{ fontFamily: "var(--font-lidya-sans)" }}
            >
              <Icon.Play />
              Video
            </span>
          )}

          {/* Title — always visible */}
          <p
            className="text-white font-semibold leading-tight text-sm sm:text-base drop-shadow"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            {tf(item, "title")}
          </p>

          {/* Description — only revealed on hover (full text lives in the lightbox) */}
          <motion.p
            className="text-white/80 text-xs leading-relaxed mt-1 drop-shadow line-clamp-3"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 6,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {tf(item, "description")}
          </motion.p>
        </div>
      </div>

      {/* ── Hover: dark scrim + zoom icon ── */}
      <motion.div
        className="absolute inset-0 z-20 flex items-start justify-end p-3 sm:p-4"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: "none" }}
      >
        {/* Gold accent top-right corner badge */}
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full border border-[#d4a843]/60 bg-black/50 text-[#d4a843]"
          style={{ fontSize: 14 }}
        >
          {item.type === "video" ? <Icon.Play /> : <Icon.ZoomIn />}
        </span>
      </motion.div>

      {/* ── Thin gold top-border that slides in on hover ── */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a843] to-transparent z-30"
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ originX: 0.5 }}
      />
    </div>
  );
}

/* ─── Section ──────────────────────────────────────────────────────────── */

// How many photos are visible before the "View More" CTA expands the rest.
const INITIAL_VISIBLE = 10;

export function Gallery() {
  const [selected, setSelected] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { t, tf } = useLang();

  // Hybrid content source: when the backend is reachable and has photos, the
  // admin-managed database wins; otherwise fall back to the bundled frontend
  // photos so the section always renders (e.g. on Vercel with no backend).
  const { data: apiItems } = useGallery();
  const items =
    apiItems && apiItems.length > 0
      ? apiItems.map((i) => ({ ...i, imageUrl: assetUrl(i.imageUrl), thumbUrl: assetUrl(i.thumbUrl) }))
      : GALLERY_ITEMS;

  // Allocate the initial quota across the groups in display order, so the
  // first N photos show and "View More" reveals the rest.
  const hiddenCount = Math.max(0, items.length - INITIAL_VISIBLE);
  let quota = showAll ? Infinity : INITIAL_VISIBLE;
  const visibleByGroup: Record<string, any[]> = {};
  for (const group of GALLERY_GROUPS) {
    const groupItems = items.filter((it) => (it.group || "MOMENTS") === group);
    const take = Math.max(0, Math.min(groupItems.length, quota));
    visibleByGroup[group] = groupItems.slice(0, take);
    quota -= take;
  }

  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  useEffect(() => {
    if (selected?.type === "video") {
      videoRef.current?.play().catch(() => {});
    }
  }, [selected]);

  return (
    <section id="gallery" className="bg-[#1e1008] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-12 text-center">
          <p
            className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            {t("gallery.eyebrow")}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            {t("gallery.titlePre")} <em className="text-[#d4a843]">{t("gallery.titleEm")}</em>
          </h2>
          <p
            className="mt-4 text-white/50 text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            {t("gallery.body")}
          </p>
        </Reveal>

        {items.length === 0 ? (
          <div className="py-16 text-center text-white/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
            {t("gallery.emptyComingSoon")}
          </div>
        ) : (
          <div className="space-y-14 md:space-y-20">
            {GALLERY_GROUPS.map((group) => {
              const groupItems = visibleByGroup[group] ?? [];
              if (groupItems.length === 0) return null;
              return (
                <div key={group}>
                  <Reveal className="text-center mb-6 md:mb-8">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-[#d4a843]"
                      style={{ fontFamily: "var(--font-lidya-serif)" }}
                    >
                      {t(`gallery.groups.${group}`)}
                    </h3>
                    <div className="mx-auto mt-3 w-16 h-px bg-[#d4a843]/40" />
                  </Reveal>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[210px]">
                    {groupItems.map((item, i) => (
                      <Reveal
                        key={`${item.id || item.alt}-${i}`}
                        delay={i * 0.05}
                        className={`${item.span} relative overflow-hidden rounded-sm`}
                      >
                        <GalleryCard item={item} onClick={() => setSelected(item)} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* ── View More / Show Less CTA ── */}
            {hiddenCount > 0 && (
              <Reveal className="text-center !mt-10 md:!mt-14">
                <motion.button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="group/cta relative inline-flex items-center gap-3 px-9 py-4 text-[11px] tracking-[0.24em] uppercase font-semibold overflow-hidden"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    color: "#d4a843",
                    border: "1px solid rgba(212,168,67,0.5)",
                    background: "linear-gradient(135deg, rgba(212,168,67,0.10) 0%, rgba(194,94,42,0.08) 100%)",
                    boxShadow: "0 0 18px rgba(212,168,67,0.15)",
                  }}
                  whileHover={{
                    backgroundColor: "#d4a843",
                    color: "#1e1008",
                    boxShadow: "0 0 28px rgba(212,168,67,0.45)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  aria-expanded={showAll}
                >
                  {showAll ? (
                    <>{t("gallery.showLess")}</>
                  ) : (
                    <>
                      {t("gallery.viewMore")}
                      <span
                        className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(212,168,67,0.2)", border: "1px solid rgba(212,168,67,0.4)" }}
                      >
                        +{hiddenCount}
                      </span>
                    </>
                  )}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: showAll ? -90 : 90 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex"
                  >
                    <Icon.ArrowRight />
                  </motion.span>
                </motion.button>
              </Reveal>
            )}
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-full flex flex-col items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {selected.type === "video" ? (
                <video
                  ref={videoRef}
                  src={selected.src || selected.imageUrl}
                  poster={selected.poster}
                  controls
                  playsInline
                  className="max-w-full max-h-[75vh] object-contain shadow-2xl bg-black"
                />
              ) : (
                <OptimizedImage
                  src={selected.imageUrl || selected.src}
                  alt={selected.alt}
                  className="max-w-full max-h-[75vh] object-contain shadow-2xl"
                  loading="eager"
                />
              )}

              {/* Caption below image in lightbox */}
              <div className="text-center px-4">
                <p
                  className="text-[#d4a843] text-xs tracking-[0.25em] uppercase mb-1"
                  style={{ fontFamily: "var(--font-lidya-sans)" }}
                >
                  {selected.type === "video" ? "Video" : "Photo"}
                </p>
                <h3
                  className="text-white text-xl sm:text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-lidya-serif)" }}
                >
                  {tf(selected, "title")}
                </h3>
                <p
                  className="text-white/60 text-sm mt-2 max-w-xl mx-auto leading-relaxed"
                  style={{ fontFamily: "var(--font-lidya-sans)" }}
                >
                  {tf(selected, "description")}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 sm:-right-12 text-white/70 hover:text-white transition-colors text-3xl p-2"
                aria-label="Close"
              >
                <Icon.X />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

