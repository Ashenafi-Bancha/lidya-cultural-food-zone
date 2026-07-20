import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { EXPERIENCES } from "../../data/constants";

const SLIDE_DURATION = 4000; // ms per card

const slideVariants = {
  enter: {
    x: "100%",
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: "-100%",
    opacity: 0,
  },
};

export function CulturalExperience() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % EXPERIENCES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + EXPERIENCES.length) % EXPERIENCES.length);
  }, []);

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, next]);

  const exp = EXPERIENCES[current];

  return (
    <section
      id="experience"
      className="bg-[#f5efe6] py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        {/* ── Heading ── */}
        <Reveal className="text-center mb-12">
          <p
            className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            Beyond the Plate
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            The Full Cultural{" "}
            <em className="text-[#c25e2a] not-italic">Experience</em>
          </h2>
        </Reveal>

        {/* ── MOBILE Carousel (< md) ── */}
        <div
          className="block md:hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Slide window */}
          <div className="relative overflow-hidden w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="w-full"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-[#e8dcc8] mb-5">
                  <motion.img
                    src={exp.img}
                    alt={exp.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
                {/* Text */}
                <motion.h3
                  className="text-[#1e1008] font-semibold text-2xl mb-2"
                  style={{ fontFamily: "var(--font-lidya-serif)" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.25 }}
                >
                  {exp.title}
                </motion.h3>
                <motion.p
                  className="text-[#7a5c3a] text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-lidya-body)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.35 }}
                >
                  {exp.desc}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators + arrows */}
          <div className="flex items-center justify-between mt-6">
            {/* Prev */}
            <button
              onClick={prev}
              className="w-9 h-9 flex items-center justify-center border border-[#c25e2a]/40 text-[#c25e2a] hover:bg-[#c25e2a] hover:text-[#faf5ee] transition-colors duration-200"
              aria-label="Previous"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M13 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {EXPERIENCES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-400"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === current ? "28px" : "8px",
                      background: i === current ? "#c25e2a" : "rgba(194,94,42,0.28)",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="w-9 h-9 flex items-center justify-center border border-[#c25e2a]/40 text-[#c25e2a] hover:bg-[#c25e2a] hover:text-[#faf5ee] transition-colors duration-200"
              aria-label="Next"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-px bg-[#c25e2a]/15 w-full overflow-hidden">
            <motion.div
              key={current}
              className="h-full bg-[#c25e2a]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
            />
          </div>
        </div>

        {/* ── DESKTOP: staggered slide-in from right ── */}
        <div className="hidden md:flex gap-6 lg:gap-8 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {EXPERIENCES.map((item, i) => (
            <motion.div
              key={item.title}
              className="group flex-none w-[300px] lg:w-[340px]"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.15,
              }}
            >
              <div className="aspect-[5/4] overflow-hidden bg-[#e8dcc8] mb-4">
                <motion.img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <h3
                className="text-[#1e1008] font-semibold text-xl mb-2"
                style={{ fontFamily: "var(--font-lidya-serif)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-[#7a5c3a] text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-lidya-body)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop scroll hint */}
        <motion.div
          className="hidden md:flex items-center gap-2 mt-5 text-[#7a5c3a]/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            Scroll to explore
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

      </div>
    </section>
  );
}
