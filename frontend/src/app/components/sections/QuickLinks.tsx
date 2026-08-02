import React from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useLang } from "../../../context/LanguageContext";
import { useNavGo } from "../../hooks/useNavGo";
import menuImg from "@/imports/lidya-menu1.webp";
import servicesImg from "@/imports/lidya-vip.webp";
import experienceImg from "@/imports/gallery/fe-14.webp";
import aboutImg from "@/imports/team/about-us-hero.webp";

/** Photo cards under the hero — one tap to every main part of the site. */
const CARDS = [
  { id: "menu",       path: "/menu",       img: menuImg,       captionKey: "quickLinks.menuCaption" },
  { id: "services",   path: "/services",   img: servicesImg,   captionKey: "quickLinks.servicesCaption" },
  { id: "experience", path: "/experience", img: experienceImg, captionKey: "quickLinks.experienceCaption" },
  { id: "about-us",   path: "/about",      img: aboutImg,      captionKey: "quickLinks.aboutCaption" },
];

export function QuickLinks() {
  const { t } = useLang();
  const go = useNavGo();

  return (
    <section className="bg-[#1e1008] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="text-center mb-8 md:mb-12">
          <p
            className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3"
            style={{ fontFamily: "var(--font-lidya-sans)" }}
          >
            {t("quickLinks.eyebrow")}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#f5efe6] leading-tight"
            style={{ fontFamily: "var(--font-lidya-serif)" }}
          >
            {t("quickLinks.title")}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {CARDS.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08}>
              <motion.button
                type="button"
                onClick={() => go({ id: card.id, path: card.path })}
                className="group/ql relative w-full overflow-hidden rounded-2xl text-left aspect-[4/5] sm:aspect-[3/4] border border-[#d4a843]/20"
                whileHover={{ y: -6, borderColor: "rgba(212,168,67,0.55)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                aria-label={t(`nav.${card.id}`)}
              >
                <img
                  src={card.img}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/ql:scale-110"
                />
                {/* readability scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,6,2,0.95) 0%, rgba(12,6,2,0.55) 45%, rgba(12,6,2,0.15) 100%)",
                  }}
                />
                {/* gold hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover/ql:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at bottom,rgba(212,168,67,0.28),transparent 65%)" }}
                />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3
                    className="text-[#f5efe6] font-bold text-base sm:text-lg md:text-xl leading-tight group-hover/ql:text-[#f5e6b8] transition-colors"
                    style={{ fontFamily: "var(--font-lidya-serif)" }}
                  >
                    {t(`nav.${card.id}`)}
                  </h3>
                  <p
                    className="text-[#e8dcc8]/65 text-[10px] sm:text-xs leading-snug mt-1"
                    style={{ fontFamily: "var(--font-lidya-sans)" }}
                  >
                    {t(card.captionKey)}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 mt-3 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#d4a843]"
                    style={{ fontFamily: "var(--font-lidya-sans)" }}
                  >
                    {t("quickLinks.cta")}
                    <motion.span
                      aria-hidden
                      className="inline-flex"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      <Icon.ArrowRight />
                    </motion.span>
                  </span>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
