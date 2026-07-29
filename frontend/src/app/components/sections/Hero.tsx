import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroBg from "@/imports/liday-life1.jpg";
import { Icon } from "../Icons";
import { HeroDecoration } from "../HeroDecoration";
import { goto } from "../../data/constants";
import { useLang } from "../../../context/LanguageContext";

const WELCOME_TEXT = "HASHSHU SARO YEETA!";

// Types the phrase one letter at a time until complete, then keeps it.
// Loops forever so the animation keeps drawing attention like a sign.
function Typewriter({ text, speed = 130, startDelay = 900, pauseAfter = 2600 }: {
  text: string; speed?: number; startDelay?: number; pauseAfter?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let restart: ReturnType<typeof setTimeout>;
    const begin = () => {
      setCount(0);
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            // Pause on the full phrase, then retype.
            restart = setTimeout(begin, pauseAfter);
            return c;
          }
          return c + 1;
        });
      }, speed);
    };
    const initial = setTimeout(begin, startDelay);
    return () => { clearTimeout(initial); clearTimeout(restart); clearInterval(interval); };
  }, [text, speed, startDelay, pauseAfter]);

  const done = count >= text.length;

  return (
    <span aria-label={text} className="inline-flex items-baseline">
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          background: "linear-gradient(180deg,#fff2b0 0%,#f5c842 40%,#c8901f 74%,#ffe488 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 14px rgba(212,168,67,0.35))",
        }}
      >
        {text.slice(0, count) || " "}
      </span>
      <span
        className="ml-0.5"
        style={{
          color: "#f5c842",
          opacity: done ? 0 : 1,
          animation: "blink 1s steps(1) infinite",
          filter: "drop-shadow(0 0 8px rgba(245,200,66,0.7))",
        }}
      >
        |
      </span>
    </span>
  );
}

// Premium Wolaita welcome — slides in smoothly, then floats gently.
function WolaitaWelcome() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -28, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}@keyframes ctaspin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
      {/* soft gold glow */}
      <motion.div
        className="absolute -inset-6 rounded-full blur-2xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,168,67,0.36), transparent 70%)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* gently floating plate with a Wolaita tri-color light travelling the border */}
      <motion.div
        className="relative rounded-2xl p-[2px] overflow-hidden isolate"
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* rotating Wolaita colours — red · black · yellow — clipped to the border ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[200%]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, #e11d2a 0deg, #f5c842 20deg, #0a0a0a 40deg, #e11d2a 60deg)",
            animation: "ctaspin 6s linear infinite",
          }}
        />
        {/* inner dark face holding the welcome text */}
        <div
          className="relative z-10 px-5 sm:px-7 py-3 sm:py-3.5 rounded-[14px]"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0.94), rgba(0,0,0,0.92))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "inset 0 0 26px rgba(212,168,67,0.12)",
          }}
        >
          <div className="text-xl lg:text-3xl xl:text-4xl font-bold tracking-[0.06em] sm:tracking-[0.08em] whitespace-nowrap leading-none">
            <Typewriter text={WELCOME_TEXT} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useLang();
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

      {/* ── MOBILE: Full-bleed image at top, fading into dark ── */}
      <div className="block md:hidden absolute inset-x-0 top-0 h-[55vh] pointer-events-none z-0">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        >
          <img
            src={heroBg}
            alt="Everyday life and hospitality at Lidya"
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </motion.div>
        {/* Fade bottom — image dissolves into text section */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] z-10"
          style={{
            background:
              "linear-gradient(to top, #1e1008 0%, rgba(30,16,8,0.9) 40%, rgba(30,16,8,0.3) 80%, transparent 100%)",
          }}
        />
        {/* Fade top — into navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 z-10"
          style={{
            background:
              "linear-gradient(to bottom, #1e1008 0%, rgba(30,16,8,0.5) 50%, transparent 100%)",
          }}
        />
        {/* Fade left edge */}
        <div
          className="absolute inset-y-0 left-0 w-10 z-10"
          style={{ background: "linear-gradient(to right, #1e1008, transparent)" }}
        />
        {/* Fade right edge */}
        <div
          className="absolute inset-y-0 right-0 w-10 z-10"
          style={{ background: "linear-gradient(to left, #1e1008, transparent)" }}
        />
      </div>

      {/* ── DESKTOP: Full-bleed image on right half ── */}
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
          style={{ background: "linear-gradient(to left, #1e1008 0%, transparent 100%)" }}
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

      {/* ── Wolaita welcome — mobile: over the top image ── */}
      <div className="md:hidden absolute top-0 inset-x-0 h-[55vh] flex items-start justify-center pt-[19%] px-4 z-20 pointer-events-none">
        <WolaitaWelcome />
      </div>

      {/* ── Wolaita welcome — desktop: top of the right-side image ── */}
      <div className="hidden md:flex absolute top-0 right-0 w-[55%] h-full items-start justify-center pt-[7%] px-4 z-20 pointer-events-none">
        <WolaitaWelcome />
      </div>

      {/* Floating cultural icons */}
      <HeroDecoration />

      {/* ── Main content wrapper ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-12 flex flex-col md:flex-row md:items-center gap-0 md:gap-10 min-h-screen">

        {/* Mobile spacer — pushes text below the image area */}
        <div className="block md:hidden h-[25vh] flex-shrink-0" />

        {/* ── Text content ── */}
        <motion.div
          className="flex flex-col justify-center w-full md:w-[48%] lg:w-[44%] flex-shrink-0 pt-0 pb-10 md:pt-24"
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
            {t("hero.eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-[#f5efe6] leading-[1.06] mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            {t("hero.headlineTop")}<br />
            <em className="text-[#d4a843] not-italic">{t("hero.headlineMid")}</em><br />
            {t("hero.headlineBottom")}
          </motion.h1>

          {/* Body */}
          <motion.p
            className="text-[#e8dcc8]/70 text-base md:text-lg leading-relaxed max-w-md mb-4"
            style={{ fontFamily: "var(--font-lidya-body)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.58 }}
          >
            {t("hero.body")}
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-[#d4a843] text-[10px] tracking-[0.2em] uppercase mb-4 md:mb-6"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            {t("hero.tagline")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72 }}
          >
            <style>{`@keyframes ctaspin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
            <motion.button
              onClick={() => goto("reservation")}
              className="w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl bg-[#c25e2a] text-[#faf5ee] text-[12px] sm:text-[11px] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-lidya-sans)" }}
              whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t("common.reserveTable")}
            </motion.button>

            {/* Call — a light travels around the rounded rectangular border */}
            <motion.a
              href="tel:+251920994499"
              aria-label={t("common.callUsNow")}
              className="relative w-full sm:w-auto rounded-xl p-[1.6px] overflow-hidden isolate"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {/* rotating light source — clipped to the border ring by the inner face */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[220%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg 300deg, rgba(245,200,66,0.15) 320deg, #ffe488 340deg, #fff6cf 346deg, #f5c842 352deg, transparent 360deg)",
                  animation: "ctaspin 3s linear infinite",
                }}
              />
              {/* faint static ring so the border always reads */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,67,0.3)" }}
              />
              {/* inner face */}
              <span
                className="relative z-10 flex items-center justify-center gap-2 rounded-[10px] px-8 py-4 sm:py-3.5 text-[12px] sm:text-[11px] tracking-[0.18em] uppercase text-[#e8dcc8]/85"
                style={{ fontFamily: "var(--font-lidya-sans)", background: "#1e1008" }}
              >
                <Icon.Phone /> {t("common.callUsNow")}
              </span>
            </motion.a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="flex items-center gap-3 mt-6 md:mt-14 text-[#e8dcc8]/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="w-8 h-px bg-current" />
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-lidya-sans)" }}
            >
              {t("hero.scrollHint")}
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
