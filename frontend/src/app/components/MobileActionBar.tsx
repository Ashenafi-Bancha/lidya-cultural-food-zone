import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./Icons";

const FACEBOOK_URL = "https://web.facebook.com/leta.lemma.1";
const PHONE_NUMBER  = "0920994499";
const PHONE_HREF    = "tel:+251920994499";

function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="white" aria-hidden="true">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function Ripple() {
  return (
    <>
      {[0, 0.5, 1].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ border: "1.5px solid rgba(212,168,67,0.5)" }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 1.7, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

interface Props {
  isMenuOpen: boolean;
}

export function MobileActionBar({ isMenuOpen }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = scrolled && !isMenuOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: "linear-gradient(180deg, rgba(20,10,3,0.85) 0%, rgba(14,7,3,0.96) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(212,168,67,0.16)",
            boxShadow: "0 -3px 20px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-stretch gap-2.5 px-3 pt-1.5 pb-4">

            {/* CALL button */}
            <motion.a
              href={PHONE_HREF}
              id="mobile-call-btn"
              aria-label="Call Lidya Cultural Food Zone"
              className="relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)",
                boxShadow: "0 0 0 1px rgba(212,168,67,0.4), 0 0 16px rgba(212,168,67,0.6), 0 4px 12px rgba(0,0,0,0.45)",
                fontFamily: "var(--font-lidya-sans)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <Ripple />
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full text-[#f5c842] text-[15px] shrink-0"
                style={{ background: "rgba(26,14,4,0.2)" }}
              >
                <Icon.Phone />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[8px] tracking-[0.22em] uppercase text-[#1a0e04]/65 font-semibold">
                  Call us
                </span>
                <span className="text-[13px] font-extrabold text-[#1a0e04] tracking-tight">
                  {PHONE_NUMBER}
                </span>
              </span>
            </motion.a>

            {/* FACEBOOK button */}
            <motion.a
              href={FACEBOOK_URL}
              id="mobile-facebook-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Lidya Cultural Food Zone on Facebook"
              className="relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5"
              style={{
                background: "linear-gradient(160deg,#4a90e8 0%,#1877F2 60%,#145dbf 100%)",
                boxShadow: "0 0 14px rgba(24,119,242,0.55), 0 4px 12px rgba(0,0,0,0.4)",
                fontFamily: "var(--font-lidya-sans)",
                minWidth: "100px",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <FbIcon />
              <span className="flex flex-col leading-none">
                <span className="text-[8px] tracking-[0.18em] uppercase text-white/65 font-semibold">
                  Follow us
                </span>
                <span className="text-[12px] font-bold text-white">
                  Facebook
                </span>
              </span>
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
