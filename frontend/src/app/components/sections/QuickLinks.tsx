import React from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useLang } from "../../../context/LanguageContext";
import { useNavGo } from "../../hooks/useNavGo";

/**
 * Quick links — compact branded tiles giving one-tap access to every part of
 * the site. `labelKey` overrides the default `nav.<id>` label.
 */
const LINKS: Array<{
  id: string;
  path: string;
  hash?: string;
  Glyph: React.FC;
  labelKey?: string;
}> = [
  { id: "menu",         path: "/menu",     Glyph: Icon.Utensils },
  { id: "services",     path: "/services", Glyph: Icon.Star },
  { id: "gallery",      path: "/gallery",  Glyph: Icon.Camera,  labelKey: "quickLinks.gallery" },
  { id: "coffee",       path: "/", hash: "coffee",       Glyph: Icon.Coffee },
  { id: "about-us",     path: "/about",    Glyph: Icon.Heart },
  { id: "branches",     path: "/", hash: "branches",     Glyph: Icon.MapPin },
  { id: "testimonials", path: "/", hash: "testimonials", Glyph: Icon.Quote },
  { id: "reservation",  path: "/", hash: "reservation",  Glyph: Icon.Calendar, labelKey: "quickLinks.reservation" },
  { id: "contact",      path: "/", hash: "contact",      Glyph: Icon.Phone },
];

export function QuickLinks() {
  const { t } = useLang();
  const go = useNavGo();

  return (
    <section className="bg-[#1e1008] pt-3 pb-14 md:pt-8 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="text-center mb-6 md:mb-10">
          <p
            className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-2"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            {t("quickLinks.eyebrow")}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#f5efe6] leading-tight"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            {t("quickLinks.title")}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {LINKS.map((link, i) => {
            const Glyph = link.Glyph;
            return (
              <Reveal key={link.id} delay={i * 0.05}>
                <motion.button
                  type="button"
                  onClick={() => go({ id: link.id, path: link.path, hash: link.hash })}
                  className="group/tile relative w-full h-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 rounded-2xl overflow-hidden text-left"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    background: "linear-gradient(145deg, rgba(212,168,67,0.07) 0%, rgba(30,16,8,0) 70%), #160b04",
                    border: "1px solid rgba(212,168,67,0.22)",
                  }}
                  whileHover={{
                    y: -4,
                    borderColor: "rgba(212,168,67,0.75)",
                    boxShadow: "0 0 26px rgba(212,168,67,0.35), 0 10px 24px rgba(0,0,0,0.45)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* gold wash that blooms on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at 0% 50%, rgba(212,168,67,0.20), transparent 70%)" }}
                  />

                  {/* icon medallion */}
                  <span
                    className="relative z-10 shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-[#d4a843] text-lg sm:text-xl transition-colors duration-300 group-hover/tile:text-[#ffe488]"
                    style={{
                      background: "rgba(212,168,67,0.12)",
                      border: "1px solid rgba(212,168,67,0.3)",
                    }}
                  >
                    <Glyph />
                  </span>

                  <span className="relative z-10 flex-1 min-w-0">
                    <span className="block text-[#f5efe6] text-[13px] sm:text-sm font-semibold leading-snug transition-colors duration-300 group-hover/tile:text-[#ffe488]">
                      {t(link.labelKey ?? `nav.${link.id}`)}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="relative z-10 shrink-0 text-[#d4a843]/50 text-sm transition-all duration-300 group-hover/tile:text-[#d4a843] group-hover/tile:translate-x-1"
                  >
                    <Icon.ArrowRight />
                  </span>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
