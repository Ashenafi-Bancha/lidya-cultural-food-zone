import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/image.png";
import { Icon } from "../Icons";
import { NAV_LINKS, goto } from "../../data/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(30,16,8,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#d4a843]/40">
            <ImageWithFallback src={logoImg} alt="Lidya Cultural Food Zone logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none gap-[3px]">
            <span
              className="text-[18px] font-bold tracking-[0.04em] text-[#f5efe6]"
              style={{ fontFamily: "var(--font-lidya-serif)" }}
            >
              Lidya Cultural
            </span>
            <span
              className="text-[11px] tracking-[0.28em] uppercase font-bold"
              style={{
                fontFamily: "var(--font-lidya-serif)",
                background: "linear-gradient(180deg,#ffe98a 0%,#d4a843 40%,#a0701a 75%,#f0d060 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 6px rgba(212,168,67,0.75)) drop-shadow(0 1px 0 rgba(80,40,0,0.9))",
              }}
            >
              Food Zone
            </span>
          </div>
        </button>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => goto(id)}
                className="text-[11px] tracking-widest uppercase text-[#e8dcc8]/70 hover:text-[#d4a843] transition-colors duration-200"
                style={{ fontFamily: "var(--font-lidya-sans)" }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="tel:+251920994499"
            className="flex items-center gap-2 px-4 py-2 text-[#1a0e04] font-bold text-[11px] tracking-wide"
            style={{
              fontFamily: "var(--font-lidya-sans)",
              background: "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)",
              boxShadow: "0 0 0 1px rgba(212,168,67,0.4), 0 0 16px rgba(212,168,67,0.65), 0 3px 10px rgba(0,0,0,0.45)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 26px rgba(212,168,67,0.95), 0 4px 14px rgba(0,0,0,0.5)" }}
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
            className="flex items-center justify-center w-[38px] h-[38px] rounded-lg"
            style={{
              background: "linear-gradient(160deg,#4a90e8 0%,#1877F2 55%,#145dbf 100%)",
              boxShadow: "0 0 14px rgba(24,119,242,0.6), 0 3px 8px rgba(0,0,0,0.4)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="white">
              <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#f5efe6] p-2 -mr-2 text-[26px]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <Icon.X /> : <Icon.Menu />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden px-6 pb-6 border-t border-[#d4a843]/15"
            style={{ background: "rgba(30,16,8,0.98)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => { goto(id); setOpen(false); }}
                    className="w-full text-left py-3 text-base text-[#e8dcc8]/75 hover:text-[#d4a843] transition-colors"
                    style={{ fontFamily: "var(--font-lidya-sans)" }}
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-3 border-t border-[#d4a843]/10 flex flex-col gap-3">
                <a
                  href="tel:+251920994499"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 text-[#1a0e04] font-bold text-base rounded"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)", boxShadow: "0 0 12px rgba(212,168,67,0.55)" }}
                >
                  <Icon.Phone /> Call: 0920994499
                </a>
                <a
                  href="https://web.facebook.com/leta.lemma.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-white font-bold text-sm rounded"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "#1877F2", boxShadow: "0 0 10px rgba(24,119,242,0.5)" }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  Follow on Facebook
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
