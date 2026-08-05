import React from "react";
import { motion } from "motion/react";
import { useLang } from "../../../context/LanguageContext";
import heroImg from "@/imports/lidya-menu1.webp";

/** Banner at the top of the /menu page. */
export function MenuHero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-[#1e1008]">
      {/* backdrop */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          loading="eager"
          {...({ fetchpriority: "high" } as any)}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,11,4,0.88) 0%, rgba(20,11,4,0.72) 45%, #1e1008 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-9 sm:py-12 md:py-16 text-center">
        <motion.p
          className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-4"
          style={{ fontFamily: "var(--font-lidya-sans)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("menu.eyebrow")}
        </motion.p>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
          style={{ fontFamily: "var(--font-lidya-serif)", textShadow: "0 3px 18px rgba(0,0,0,0.6)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("menu.heroTitle")}
        </motion.h1>

        {/* gold divider */}
        <motion.div
          className="flex items-center justify-center gap-3 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span className="w-14 h-px bg-gradient-to-r from-transparent to-[#d4a843]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#d4a843]" style={{ boxShadow: "0 0 10px rgba(212,168,67,0.9)" }} />
          <span className="w-14 h-px bg-gradient-to-l from-transparent to-[#d4a843]" />
        </motion.div>

        <motion.p
          className="text-base md:text-lg text-[#f5efe6]/90 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-lidya-body)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {t("menu.heroSubtitle")}
        </motion.p>
      </div>
    </section>
  );
}
