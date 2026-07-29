import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/lidya-logo2.PNG";
import { Icon } from "../Icons";
import { NAV_LINKS, goto } from "../../data/constants";
import { useLang } from "../../../context/LanguageContext";

interface NavbarProps {
  onOpenChange?: (open: boolean) => void;
}

export function Navbar({ onOpenChange }: NavbarProps) {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LangToggle = ({ className = "", compact = false }: { className?: string; compact?: boolean }) => {
    const pad = compact ? "px-2.5 py-1" : "px-3 py-1";
    const size = "text-[11px]";
    return (
      <div
        className={`flex items-center rounded-full border border-[#d4a843]/35 overflow-hidden tracking-wide shrink-0 ${className}`}
        style={{ fontFamily: "var(--font-lidya-sans)" }}
        role="group"
        aria-label="Language"
      >
        <button
          onClick={() => setLang("en")}
          className={`${size} ${pad} leading-none transition-colors ${lang === "en" ? "bg-[#d4a843] text-[#1a0e04] font-bold" : "text-[#e8dcc8]/70 hover:text-[#d4a843]"}`}
          aria-pressed={lang === "en"}
        >
          EN
        </button>
        <button
          onClick={() => setLang("am")}
          className={`${size} ${pad} leading-none transition-colors ${lang === "am" ? "bg-[#d4a843] text-[#1a0e04] font-bold" : "text-[#e8dcc8]/70 hover:text-[#d4a843]"}`}
          aria-pressed={lang === "am"}
        >
          አማ
        </button>
      </div>
    );
  };

  // Call + Facebook cluster shown on the right of the desktop header.
  const HeaderActions = () => (
    <>
      <motion.a
        href="tel:+251920994499"
        className="flex items-center gap-1.5 px-3 py-1.5 text-[#1a0e04] font-bold text-[10px] tracking-wide rounded-md"
        style={{
          fontFamily: "var(--font-lidya-sans)",
          background: "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)",
          boxShadow: "0 0 0 1px rgba(212,168,67,0.4), 0 0 10px rgba(212,168,67,0.5), 0 2px 6px rgba(0,0,0,0.35)",
        }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,168,67,0.9), 0 3px 10px rgba(0,0,0,0.45)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon.Phone />
        0920994499
      </motion.a>
      <motion.a
        href="https://web.facebook.com/leta.lemma.1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow us on Facebook"
        className="flex items-center justify-center w-[30px] h-[30px] rounded-md shrink-0"
        style={{
          background: "linear-gradient(160deg,#4a90e8 0%,#1877F2 55%,#145dbf 100%)",
          boxShadow: "0 0 10px rgba(24,119,242,0.5), 0 2px 6px rgba(0,0,0,0.35)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      </motion.a>
    </>
  );

  const toggleMenu = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(30,16,8,0.96)"
          : "linear-gradient(to bottom, rgba(18,10,5,0.82) 0%, rgba(18,10,5,0.42) 55%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* Main nav row */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10 flex items-center justify-between gap-3 h-[64px] lg:h-[66px]">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#d4a843]/40">
            <ImageWithFallback src={logoImg} alt="Lidya Cultural Food Zone logo" className="w-full h-full object-cover" />
          </div>
          {/* Brand text — hidden only in the tight 1024–1279 range so the nav
              links + call/facebook fit; shown on mobile and large desktops. */}
          <div className="flex flex-col leading-none gap-[3px] lg:hidden xl:flex">
            <span
              className="text-[18px] font-bold tracking-[0.04em] text-[#f5efe6]"
              style={{ fontFamily: "var(--font-lidya-serif)" }}
            >
              {t("common.brandLine1")}
            </span>
            <span
              className={`text-[11px] font-bold ${lang === "am" ? "tracking-[0.14em]" : "tracking-[0.28em] uppercase"}`}
              style={{
                fontFamily: "var(--font-lidya-serif)",
                background: "linear-gradient(180deg,#ffe98a 0%,#d4a843 40%,#a0701a 75%,#f0d060 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 6px rgba(212,168,67,0.75)) drop-shadow(0 1px 0 rgba(80,40,0,0.9))",
              }}
            >
              {t("common.brandLine2")}
            </span>
          </div>
        </button>

        {/* Desktop nav links — fill & center the middle (balanced in EN & AM) */}
        <ul className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-5">
          {NAV_LINKS.map(({ id }) => (
            <li key={id}>
              <button
                onClick={() => goto(id)}
                className="text-[9px] xl:text-[11px] tracking-widest uppercase text-[#e8dcc8]/70 hover:text-[#d4a843] transition-colors duration-200 whitespace-nowrap"
                style={{ fontFamily: "var(--font-lidya-sans)" }}
              >
                {t(`nav.${id}`)}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop right: language toggle + call + facebook */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <LangToggle />
          <HeaderActions />
        </div>

        {/* Mobile: language toggle (compact) — spaced between logo & hamburger */}
        <LangToggle compact className="lg:hidden" />

        {/* Mobile: hamburger */}
        <button
          className="lg:hidden text-[#f5efe6] p-2 -mr-2 text-[26px] shrink-0"
          onClick={() => toggleMenu(!open)}
          aria-label="Menu"
        >
          {open ? <Icon.X /> : <Icon.Menu />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden px-6 pb-6 border-t border-[#d4a843]/15"
            style={{ background: "rgba(30,16,8,0.98)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map(({ id }) => (
                <li key={id}>
                  <button
                    onClick={() => { goto(id); toggleMenu(false); }}
                    className="w-full text-left py-3 text-base text-[#e8dcc8]/75 hover:text-[#d4a843] transition-colors"
                    style={{ fontFamily: "var(--font-lidya-sans)" }}
                  >
                    {t(`nav.${id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      </header>

      {/* Floating Action Buttons for Mobile — rendered OUTSIDE the header so the
          header's scroll backdrop-filter doesn't become a containing block that
          re-anchors these fixed buttons to the top. They always float bottom-right. */}
      <div className="lg:hidden fixed bottom-4 right-3 z-50 flex flex-col gap-2.5 pointer-events-none">
        <motion.a
          href="https://web.facebook.com/leta.lemma.1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
          className="flex items-center justify-center w-11 h-11 rounded-full pointer-events-auto"
          style={{
            background: "linear-gradient(160deg,#4a90e8 0%,#1877F2 55%,#145dbf 100%)",
            boxShadow: "0 0 20px rgba(24,119,242,0.6), 0 4px 12px rgba(0,0,0,0.5)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="white">
            <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
        </motion.a>
        
        <motion.a
          href="tel:+251920994499"
          className="flex items-center justify-center w-11 h-11 rounded-full pointer-events-auto"
          style={{
            background: "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)",
            boxShadow: "0 0 0 2px rgba(212,168,67,0.4), 0 0 24px rgba(212,168,67,0.8), 0 6px 16px rgba(0,0,0,0.6)",
          }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(212,168,67,1), 0 8px 20px rgba(0,0,0,0.7)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Icon.Phone />
        </motion.a>
      </div>
    </>
  );
}
