import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./Icons";

const FACEBOOK_URL = "https://web.facebook.com/leta.lemma.1";
const PHONE_NUMBER  = "0920994499";
const PHONE_HREF    = "tel:+251920994499";

/** Facebook "f" SVG — filled white */
function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

/** Animated ripple ring around the phone button */
function Ripple() {
  return (
    <>
      {[0, 0.45, 0.9].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ border: "2px solid rgba(212,168,67,0.55)" }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 1.6, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

export function MobileActionBar() {
  const [visible, setVisible] = useState(false);

  /* Show bar after user scrolls 200 px */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            background:
              "linear-gradient(180deg, rgba(20,10,3,0.88) 0%, rgba(14,7,3,0.97) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderTop: "1px solid rgba(212,168,67,0.18)",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.55)",
          }}
        >
          {/* tiny label row */}
          <div
            className="flex items-center justify-center gap-1 pt-2 pb-0.5"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            <span
              className="text-[9px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(212,168,67,0.55)" }}
            >
              Connect with us
            </span>
          </div>

          {/* action buttons row */}
          <div className="flex items-stretch gap-3 px-4 pt-2 pb-5">

            {/* CALL button */}
            <motion.a
              href={PHONE_HREF}
              id="mobile-call-btn"
              aria-label="Call Lidya Cultural Food Zone"
              className="relative flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3.5 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#f5c842 0%,#e8a820 45%,#fde272 100%)",
                boxShadow:
                  "0 0 0 1px rgba(212,168,67,0.5), 0 0 22px rgba(212,168,67,0.7), 0 6px 18px rgba(0,0,0,0.5)",
                fontFamily: "var(--font-lidya-sans)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
            >
              {/* animated ripple rings */}
              <Ripple />

              {/* icon bubble */}
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full text-[#f5c842] text-[18px] shrink-0"
                style={{ background: "rgba(26,14,4,0.22)" }}
              >
                <Icon.Phone />
              </span>

              <span className="flex flex-col leading-none">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#1a0e04]/70 font-semibold">
                  Call us now
                </span>
                <span className="text-[15px] font-extrabold text-[#1a0e04] tracking-tight">
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
              className="relative flex items-center justify-center gap-2 rounded-xl px-4 py-3.5"
              style={{
                background:
                  "linear-gradient(160deg,#4a90e8 0%,#1877F2 60%,#145dbf 100%)",
                boxShadow:
                  "0 0 18px rgba(24,119,242,0.65), 0 6px 18px rgba(0,0,0,0.45)",
                fontFamily: "var(--font-lidya-sans)",
                minWidth: "118px",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.18 }}
            >
              <FbIcon />
              <span className="flex flex-col leading-none">
                <span className="text-[9px] tracking-[0.2em] uppercase text-white/70 font-semibold">
                  Follow us
                </span>
                <span className="text-[13px] font-bold text-white">
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
