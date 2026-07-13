import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { OptimizedImage } from "../OptimizedImage";
import { GALLERY_ITEMS } from "../../data/constants";
import type { GalleryItem } from "../../data/media";

export function Gallery() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Moments Captured</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Inside <em className="text-[#d4a843]">Lidya</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 auto-rows-[160px] md:auto-rows-[220px]">
          {GALLERY_ITEMS.map((item, i) => (
            <Reveal
              key={`${item.alt}-${i}`}
              delay={i * 0.05}
              className={`${item.span} relative overflow-hidden bg-[#2e1a0c] cursor-pointer`}
            >
              <motion.div
                className="w-full h-full"
                onClick={() => setSelected(item)}
                whileHover="hovered"
              >
                <OptimizedImage
                  src={item.thumb}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.type === "video" && (
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/55 flex items-center justify-center text-white text-sm pointer-events-none">
                    <Icon.Play />
                  </div>
                )}
                <motion.div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  variants={{ hovered: { opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-3xl drop-shadow-lg">
                    {item.type === "video" ? <Icon.Play /> : <Icon.ZoomIn />}
                  </span>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

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
              className="relative w-full max-w-5xl max-h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {selected.type === "video" ? (
                <video
                  ref={videoRef}
                  src={selected.src}
                  poster={selected.poster}
                  controls
                  playsInline
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl bg-black"
                />
              ) : (
                <OptimizedImage
                  src={selected.src}
                  alt={selected.alt}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                  loading="eager"
                />
              )}
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
