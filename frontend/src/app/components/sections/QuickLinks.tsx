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
            className="text-2xl md:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            {t("quickLinks.title")}
          </h2>
        </Reveal>

        <style>{`@keyframes qlspin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {LINKS.map((link, i) => {
            const Glyph = link.Glyph;
            // With an odd number of tiles the last one is left alone in the
            // first column on mobile's 2-up grid, reading as a mistake. Let it
            // span the row and centre it at the same width as its neighbours
            // (half the row minus half the 0.75rem gap). Computed from the
            // count so adding or removing a link keeps this correct.
            const isOrphanOnMobile = LINKS.length % 2 === 1 && i === LINKS.length - 1;
            return (
              <Reveal
                key={link.id}
                delay={i * 0.05}
                className={
                  isOrphanOnMobile
                    ? "col-span-2 justify-self-center w-[calc(50%-0.375rem)] sm:col-span-1 sm:w-auto"
                    : undefined
                }
              >
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
                    borderColor: "rgba(0,0,0,0)",
                    boxShadow: "0 0 20px rgba(225,29,42,0.22), 0 0 26px rgba(212,168,67,0.30), 0 10px 24px rgba(0,0,0,0.45)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* tri-colour light — red · yellow · black — circling the border on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[300%] opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #e11d2a 0deg, #e11d2a 80deg, #f5c842 120deg, #f5c842 200deg, #0a0a0a 240deg, #0a0a0a 320deg, #e11d2a 360deg)",
                      animation: "qlspin 3.5s linear infinite",
                    }}
                  />
                  {/* inner face masks the gradient down to a 2px ring */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[2px] rounded-[14px]"
                    style={{ background: "linear-gradient(145deg, rgba(212,168,67,0.07) 0%, rgba(30,16,8,0) 70%), #160b04" }}
                  />
                  {/* gold wash that blooms on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-[2px] rounded-[14px] opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500"
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
                    <span className="block text-white text-[13px] sm:text-sm font-semibold leading-snug transition-colors duration-300 group-hover/tile:text-[#ffe488]">
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
