import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroBg from "@/imports/liday-life1.jpg";
import { Icon } from "../Icons";
import { HeroDecoration } from "../HeroDecoration";
import { goto } from "../../data/constants";

export function Hero() {
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#1e1008]"
    >
      {/* Subtle warm glow texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(194,94,42,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Floating cultural icons */}
      <HeroDecoration />

      {/* ── Main two-column wrapper ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-24 pb-12 flex flex-col md:flex-row md:items-center gap-8 md:gap-10 min-h-screen">

        {/* ── MOBILE: Image above text ── */}
        <motion.div
          className="block md:hidden w-full max-w-[340px] mx-auto flex-shrink-0"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,168,67,0.2)",
            }}
          >
            <img
              src={heroBg}
              alt="Everyday life and hospitality at Lidya"
              className="w-full h-auto block object-contain"
              loading="eager"
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,67,0.18)" }}
            />
          </div>
        </motion.div>

        {/* ── LEFT: Text content ── */}
        <motion.div
          className="flex flex-col justify-center w-full md:w-[48%] lg:w-[44%] flex-shrink-0"
          style={{ opacity: fade }}
        >
          {/* Eyebrow */}
          <motion.p
            className="text-[#d4a843] text-[10px] tracking-[0.4em] uppercase mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Wolaita Sodo · Addis Ababa · Est. 2012
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-[#f5efe6] leading-[1.06] mb-5 md:mb-6"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            A Taste of<br />
            <em className="text-[#d4a843] not-italic">Wolaita</em><br />
            Cultural Food
          </motion.h1>

          {/* Body */}
          <motion.p
            className="text-[#e8dcc8]/70 text-base md:text-lg leading-relaxed max-w-md mb-4"
            style={{ fontFamily: "var(--font-lidya-body)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.58 }}
          >
            Where ancient Wolaita recipes meet gracious hospitality. Lidya
            Cultural Food Zone preserves the living culinary traditions of the
            Wolaita people — one unforgettable meal at a time.
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-[#d4a843] text-[10px] tracking-[0.2em] uppercase mb-5 md:mb-6"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            ✦ Wolaita Sodo · Addis Ababa ✦
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72 }}
          >
            <motion.button
              onClick={() => goto("reservation")}
              className="w-full sm:w-auto px-8 py-4 sm:py-3.5 bg-[#c25e2a] text-[#faf5ee] text-[12px] sm:text-[11px] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-lidya-sans)" }}
              whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Reserve a Table
            </motion.button>
            <motion.a
              href="tel:+251920994499"
              className="w-full sm:w-auto px-8 py-4 sm:py-3.5 border text-[12px] sm:text-[11px] tracking-[0.18em] uppercase flex items-center justify-center gap-2"
              style={{
                fontFamily: "var(--font-lidya-sans)",
                borderColor: "rgba(232,220,200,0.35)",
                color: "rgba(232,220,200,0.75)",
              }}
              whileHover={{ borderColor: "#d4a843", color: "#d4a843" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Icon.Phone /> Call Us Now
            </motion.a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="flex items-center gap-3 mt-10 md:mt-14 text-[#e8dcc8]/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="w-8 h-px bg-current" />
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-lidya-sans)" }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>


    {/* ── RIGHT: Full-bleed image — desktop only ── */}
    <div className="hidden md:block absolute inset-y-0 right-0 w-[55%] pointer-events-none z-0">
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
      >
        <img
          src={heroBg}
          alt="Everyday life and hospitality at Lidya"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </motion.div>

      {/* Vignette — left: strong blend into text */}
      <div
        className="absolute inset-y-0 left-0 w-[60%] z-10"
        style={{
          background:
            "linear-gradient(to right, #1e1008 0%, rgba(30,16,8,0.85) 30%, rgba(30,16,8,0.4) 65%, transparent 100%)",
        }}
      />
      {/* Vignette — right edge */}
      <div
        className="absolute inset-y-0 right-0 w-[15%] z-10"
        style={{
          background: "linear-gradient(to left, #1e1008 0%, transparent 100%)",
        }}
      />
      {/* Vignette — top */}
      <div
        className="absolute inset-x-0 top-0 h-40 z-10"
        style={{
          background:
            "linear-gradient(to bottom, #1e1008 0%, rgba(30,16,8,0.5) 50%, transparent 100%)",
        }}
      />
      {/* Vignette — bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 z-10"
        style={{
          background:
            "linear-gradient(to top, #1e1008 0%, rgba(30,16,8,0.5) 50%, transparent 100%)",
        }}
      />
    </div>

      </div>
    </section>
  );
}
