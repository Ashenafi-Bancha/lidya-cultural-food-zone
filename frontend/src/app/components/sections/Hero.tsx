import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import heroBg from "@/imports/lidya-life1.jpg";
import { Icon } from "../Icons";
import { HeroDecoration } from "../HeroDecoration";
import { goto } from "../../data/constants";
import { useLang } from "../../../context/LanguageContext";

// Welcome greeting cycles through three languages, in order:
// Wolaytta → Amharic → English, then loops.
const WELCOME_TEXTS = [
  "Hashshu Saro Yeeta!",                  // Wolaytta
  "እንኳን ደህና መጡ!",                          // Amharic
  "Welcome to Lidya Cultural Food Zone",  // English
];

// Types the phrase one letter at a time until complete, then keeps it.
// Loops forever so the animation keeps drawing attention like a sign.
function Typewriter({
  texts,
  typeSpeed = 110,
  eraseSpeed = 45,
  hold = 1700,
  startDelay = 800,
}: {
  texts: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  hold?: number;
  startDelay?: number;
}) {
  const [ready, setReady] = useState(false);
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!ready) return;
    const current = texts[idx];
    if (!deleting && sub === current.length) {
      const id = setTimeout(() => setDeleting(true), hold);
      return () => clearTimeout(id);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
      return;
    }
    const id = setTimeout(
      () => setSub((s) => s + (deleting ? -1 : 1)),
      deleting ? eraseSpeed : typeSpeed
    );
    return () => clearTimeout(id);
  }, [ready, sub, deleting, idx, texts, hold, eraseSpeed, typeSpeed]);

  const shown = texts[idx].slice(0, sub);

  return (
    <span aria-label={texts.join(" · ")}>
      <span
        style={{
          fontFamily: "'Cinzel', 'Noto Serif Ethiopic', serif",
          background: "linear-gradient(180deg,#fff2b0 0%,#f5c842 40%,#c8901f 74%,#ffe488 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 14px rgba(212,168,67,0.35))",
        }}
      >
        {shown || " "}
      </span>
      <span
        className="ml-0.5"
        style={{
          color: "#f5c842",
          animation: "blink 1s steps(1) infinite",
          filter: "drop-shadow(0 0 8px rgba(245,200,66,0.7))",
        }}
      >
        |
      </span>
    </span>
  );
}

// Premium Ethiopian welcome — slides in smoothly, then floats gently.
const TYPE_SPEED = 130;
const TYPE_START = 900;

function CulturalWelcome() {
  // Ignite the moving-light border only once the greeting has finished typing.
  const [lightOn, setLightOn] = useState(false);
  useEffect(() => {
    const finishMs = TYPE_START + WELCOME_TEXTS[0].length * TYPE_SPEED + 250;
    const id = setTimeout(() => setLightOn(true), finishMs);
    return () => clearTimeout(id);
  }, []);

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
      {/* gently floating plate with a cultural tri-color light travelling the border */}
      <motion.div
        className="relative rounded-2xl p-[2px] overflow-hidden isolate"
        style={{
          background: "linear-gradient(180deg, rgba(10,10,10,0.94), rgba(0,0,0,0.92))",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* rotating cultural colours — red · black · yellow — clipped to the border ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[200%]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, #e11d2a 0deg, #f5c842 20deg, #0a0a0a 40deg, #e11d2a 60deg)",
            transform: "translate(-50%,-50%)",
            opacity: lightOn ? 1 : 0,
            transition: "opacity 0.6s ease",
            animation: lightOn ? "ctaspin 6s linear infinite" : "none",
          }}
        />
        {/* inner dark face holding the welcome text */}
        <div
          className="relative z-10 px-5 sm:px-7 py-1.5 sm:py-3.5 rounded-[14px]"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,10,0.94), rgba(0,0,0,0.92))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "inset 0 0 26px rgba(212,168,67,0.12)",
          }}
        >
          <div className="flex items-center justify-center text-center font-bold tracking-[0.05em] sm:tracking-[0.08em] leading-tight sm:leading-snug text-[13px] sm:text-lg md:text-2xl xl:text-3xl max-w-[78vw] sm:max-w-[22rem] md:max-w-[26rem] min-h-[1.3em] sm:min-h-[2.4em] mx-auto">
            <Typewriter texts={WELCOME_TEXTS} typeSpeed={TYPE_SPEED} startDelay={TYPE_START} />
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

      {/* ── MOBILE: full-bleed image at top, fading smoothly into the dark ── */}
      <div className="block md:hidden absolute inset-x-0 top-0 h-[55vh] pointer-events-none z-0">
        <motion.img
          src={heroBg}
          alt="Everyday life and hospitality at Lidya"
          className="w-full h-full object-cover object-center"
          loading="eager"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        />
        {/* Fade bottom — image dissolves into the text section */}
        <div
          className="absolute inset-x-0 bottom-0 h-[62%] z-10"
          style={{
            background:
              "linear-gradient(to top, #1e1008 0%, rgba(30,16,8,0.92) 38%, rgba(30,16,8,0.35) 78%, transparent 100%)",
          }}
        />
        {/* Fade left edge */}
        <div className="absolute inset-y-0 left-0 w-10 z-10" style={{ background: "linear-gradient(to right, #1e1008, transparent)" }} />
        {/* Fade right edge */}
        <div className="absolute inset-y-0 right-0 w-10 z-10" style={{ background: "linear-gradient(to left, #1e1008, transparent)" }} />
      </div>

      {/* ── DESKTOP: full-bleed image on the right, blended into the text ── */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[56%] pointer-events-none z-0">
        <motion.img
          src={heroBg}
          alt="Everyday life and hospitality at Lidya"
          className="w-full h-full object-cover object-center"
          loading="eager"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        />
        {/* Smooth left blend — gradual transition from the text column into the photo */}
        <div
          className="absolute inset-y-0 left-0 w-[70%] z-10"
          style={{
            background:
              "linear-gradient(to right, #1e1008 0%, rgba(30,16,8,0.94) 20%, rgba(30,16,8,0.6) 48%, rgba(30,16,8,0.2) 76%, transparent 100%)",
          }}
        />
        {/* Right edge feather */}
        <div
          className="absolute inset-y-0 right-0 w-[12%] z-10"
          style={{ background: "linear-gradient(to left, #1e1008 0%, transparent 100%)" }}
        />
        {/* Bottom feather */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 z-10"
          style={{ background: "linear-gradient(to top, #1e1008 0%, rgba(30,16,8,0.4) 55%, transparent 100%)" }}
        />
      </div>

      {/* ── Cultural welcome — mobile: over the top image ── */}
      <div className="md:hidden absolute top-0 inset-x-0 h-[55vh] flex items-start justify-center pt-[19%] px-4 z-20 pointer-events-none">
        <CulturalWelcome />
      </div>

      {/* ── Cultural welcome — desktop: top of the right-side image ── */}
      <div className="hidden md:flex absolute top-0 right-0 w-[55%] h-full items-start justify-center pt-[7%] px-4 z-20 pointer-events-none">
        <CulturalWelcome />
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
            style={{ fontFamily: "var(--font-lidya-serif)", textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}
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
            className="mt-8 md:mt-14 w-full flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-3 text-[#e8dcc8]/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            {/* animated scroll mouse */}
            <div
              className="w-[26px] h-[42px] rounded-full flex justify-center pt-2 shrink-0"
              style={{ border: "2px solid rgba(212,168,67,0.55)" }}
              aria-hidden
            >
              <motion.span
                className="w-[3px] h-[8px] rounded-full"
                style={{ background: "#d4a843" }}
                animate={{ y: [0, 11, 0], opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
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
