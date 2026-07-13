import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { TESTIMONIALS } from "../../data/constants";

export function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-[#2c1508] py-16 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="text-center mb-14">
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Guest Words</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>What Our Guests Say</h2>
        </Reveal>

        <div className="min-h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="text-center w-full px-4 md:px-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-base"><Icon.Star filled /></span>
                ))}
              </div>
              <blockquote
                className="text-[#f5efe6]/82 text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 italic"
                style={{ fontFamily: "var(--font-lidya-body)" }}
              >
                "{TESTIMONIALS[idx].quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-10 h-10 bg-[#c25e2a] rounded-full flex items-center justify-center text-[#faf5ee] text-sm font-bold"
                  style={{ fontFamily: "var(--font-lidya-sans)" }}
                >
                  {TESTIMONIALS[idx].avatar}
                </div>
                <div className="text-left">
                  <p className="text-[#f5efe6] font-medium text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>{TESTIMONIALS[idx].name}</p>
                  <p className="text-xs text-[#e8dcc8]/45" style={{ fontFamily: "var(--font-lidya-sans)" }}>{TESTIMONIALS[idx].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIdx(i)}
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
      </div>
    </section>
  );
}
