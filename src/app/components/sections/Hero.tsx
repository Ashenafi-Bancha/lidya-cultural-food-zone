import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroBg from "@/imports/hero-bg.png";
import { Icon } from "../Icons";
import { HeroDecoration } from "../HeroDecoration";
import { goto } from "../../data/constants";

export function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 220]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#1e1008]">
      {/* Parallax hero bg */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, willChange: "transform" }}
      >
        <img
          src={heroBg}
          alt="Four women in traditional Wolaita attire holding traditional artifacts"
          className="w-full h-full object-cover object-[center_25%]"
          style={{ opacity: 0.42 }}
          loading="eager"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right,#1e1008 30%,rgba(30,16,8,0.82) 60%,rgba(30,16,8,0.25))" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,#1e1008 8%,transparent 50%)" }} />

      {/* Floating cultural icons */}
      <HeroDecoration />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-20">
        <motion.div
          className="flex items-center min-h-[calc(100vh-5rem)]"
          style={{ opacity: fade }}
        >
          <div className="flex flex-col justify-center py-12 md:py-16 w-full max-w-2xl">
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
              Where ancient Wolaita recipes meet gracious hospitality. Lidya Cultural Food Zone preserves the living culinary traditions of the Wolaita people — one unforgettable meal at a time.
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
              className="flex items-center gap-3 mt-12 md:mt-16 text-[#e8dcc8]/35"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
