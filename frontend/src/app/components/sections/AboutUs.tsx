import React from "react";
import aboutHero from "@/imports/team/about-us-hero.webp";
import founderLeta from "@/imports/team/founder-leta.webp";
import socialManager from "@/imports/team/social-media-manager.webp";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { STATS } from "../../data/constants";
import { useLang } from "../../../context/LanguageContext";

const STAT_LABEL_KEY: Record<string, string> = {
  "Years of Experience": "about.statExperience",
  "Signature Dishes": "about.statDishes",
  "Happy Guests": "about.statGuests",
  "Branches": "about.statBranches",
};

// People shown in "Meet the Family". `img: null` renders a gold monogram
// placeholder — just drop the matching file in @/imports/team/ and wire it here.
const TEAM = [
  { name: "Leta Lemma",  roleKey: "about.roleFounderLeta",  img: founderLeta,   initials: "LL", founder: true },
  { name: "Lidya Lemma", roleKey: "about.roleFounderLidya", img: null,          initials: "LL", founder: true },
  { name: "",            roleKey: "about.roleManagerWolaita", img: null,        initials: "WS", founder: false },
  { name: "",            roleKey: "about.roleManagerAddis",  img: null,         initials: "AA", founder: false },
  { name: "Temu Teferi", roleKey: "about.roleSocial",        img: socialManager, initials: "TT", founder: false },
];

const VALUE_ICONS = [Icon.Utensils, Icon.Users, Icon.Star, Icon.MapPin];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Renders `text` with the founders' names wrapped in bold.
function boldNames(text: string, names: string[]): React.ReactNode {
  const present = names.filter(Boolean);
  if (!present.length) return text;
  const re = new RegExp(`(${present.map(escapeRegExp).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    present.includes(part) ? (
      <strong key={i} className="font-bold text-[#1e1008]">{part}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function Avatar({ img, alt, initials }: { img: string | null; alt: string; initials: string }) {
  if (img) {
    return (
      <motion.img
        src={img}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.6 }}
      />
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(150deg,#2a1a0d 0%,#1e1008 100%)" }}
      aria-hidden
    >
      <span
        className="text-3xl font-bold tracking-wide"
        style={{
          fontFamily: "var(--font-lidya-serif)",
          background: "linear-gradient(180deg,#ffe98a 0%,#d4a843 45%,#a0701a 80%,#f0d060 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

export function AboutUs() {
  const { t, lang } = useLang();
  const founderNames = lang === "am" ? ["ሌታ ለማ", "ልዲያ ለማ"] : ["Leta Lemma", "Lidya Lemma"];

  return (
    <section id="about-us" className="bg-[#f5efe6] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-16 text-center">
          <p className="text-[#c25e2a] text-sm md:text-base tracking-[0.3em] uppercase mb-3 font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.eyebrow")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight mx-auto" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("about.titleTop")}<br /><em>{t("about.titleEm")}</em>
          </h2>
        </Reveal>

        {/* Story: photo + paragraphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal delay={0.1}>
            <div className="relative pr-4 sm:pr-6 pb-4">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8dcc8]">
                <motion.img
                  src={aboutHero}
                  alt="Lidya Cultural Food Zone — heritage and hospitality"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="absolute -bottom-4 -right-0 sm:-right-4 w-full h-full border-2 border-[#d4a843]/40 pointer-events-none" />
              <div className="absolute top-4 sm:top-6 right-0 sm:-right-5 bg-[#c25e2a] text-[#faf5ee] p-4 sm:p-5 text-center shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-lidya-serif)" }}>12</div>
                <div className="text-[9px] tracking-[0.28em] uppercase mt-0.5" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.years")}</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-col gap-5">
              <p className="text-[#1e1008]/80 text-lg leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                {boldNames(t("about.p1"), founderNames)}
              </p>
              <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                {t("about.p2")}
              </p>
              <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                {t("about.p3")}
              </p>
              <div className="pt-4 border-t border-[#1e1008]/10">
                <p className="text-[#c25e2a] italic text-lg" style={{ fontFamily: "var(--font-lidya-body)" }}>{t("about.quote")}</p>
                <p className="text-[#7a5c3a] text-sm mt-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.quoteAuthor")}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal delay={0.1} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e1008]/10">
            {STATS.map(({ value, label, Icon: I }) => (
              <motion.div
                key={label}
                className="bg-[#f5efe6] px-4 sm:px-8 py-6 sm:py-8 text-center"
                whileHover={{ backgroundColor: "#faf5ee" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-3 text-[#c25e2a] text-xl"><I /></div>
                <div className="text-4xl font-bold text-[#1e1008] mb-1" style={{ fontFamily: "var(--font-lidya-serif)" }}>{value}</div>
                <div className="text-[10px] tracking-[0.2em] text-[#7a5c3a] uppercase" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t(STAT_LABEL_KEY[label] || label)}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Mission & Vision */}
        <Reveal delay={0.05} className="mt-24 md:mt-28">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-8 text-center" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.mvEyebrow")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: t("about.missionTitle"), body: t("about.mission") },
              { title: t("about.visionTitle"), body: t("about.vision") },
            ].map((c) => (
              <div key={c.title} className="relative bg-white/60 border border-[#1e1008]/10 p-8 md:p-10">
                <span className="block w-10 h-[3px] bg-[#d4a843] mb-5" />
                <h3 className="text-2xl font-bold text-[#1e1008] mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>{c.title}</h3>
                <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Our Values */}
        <div className="mt-24 md:mt-28">
          <Reveal className="text-center mb-12">
            <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.valuesEyebrow")}</p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e1008]" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t("about.valuesTitle")}</h3>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => {
              const I = VALUE_ICONS[i];
              return (
                <Reveal key={i} delay={0.08 * i}>
                  <div className="h-full text-center px-4 py-8 bg-white/50 border border-[#1e1008]/8">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-[#c25e2a] text-xl" style={{ background: "rgba(212,168,67,0.14)" }}>
                      <I />
                    </div>
                    <h4 className="text-base font-bold text-[#1e1008] mb-2" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t(`about.values.${i}.title`)}</h4>
                    <p className="text-[#1e1008]/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{t(`about.values.${i}.desc`)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Our Journey */}
        <div className="mt-24 md:mt-28">
          <Reveal className="text-center mb-12">
            <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.journeyEyebrow")}</p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e1008]" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t("about.journeyTitle")}</h3>
          </Reveal>
          <div className="relative border-l-2 border-[#d4a843]/35 pl-8 ml-3 max-w-2xl mx-auto space-y-10">
            {[0, 1, 2, 3].map((i) => (
              <Reveal key={i} delay={0.06 * i}>
                <div className="relative">
                  <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#c25e2a] ring-4 ring-[#f5efe6]" />
                  <div className="text-[#c25e2a] text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t(`about.journey.${i}.year`)}</div>
                  <h4 className="text-xl font-bold text-[#1e1008] mb-1" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t(`about.journey.${i}.title`)}</h4>
                  <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{t(`about.journey.${i}.desc`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Meet the Family */}
        <div className="mt-24 md:mt-28">
          <Reveal className="text-center mb-12">
            <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("about.teamEyebrow")}</p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e1008] mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t("about.teamTitle")}</h3>
            <p className="text-[#1e1008]/60 max-w-xl mx-auto" style={{ fontFamily: "var(--font-lidya-body)" }}>{t("about.teamIntro")}</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {TEAM.map((m, i) => (
              <Reveal
                key={m.roleKey}
                delay={0.06 * i}
                className={i === TEAM.length - 1 ? "col-span-2 md:col-span-1" : ""}
              >
                <div className="text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden ring-2 ring-[#d4a843]/45 shadow-md">
                    <Avatar img={m.img} alt={m.name || t(m.roleKey)} initials={m.initials} />
                  </div>
                  <p className="mt-4 text-base font-bold text-[#1e1008]" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                    {m.name || <span className="text-[#1e1008]/40 italic font-normal text-sm">{t("about.namePending")}</span>}
                  </p>
                  <p className="text-[#c25e2a] text-[11px] tracking-[0.12em] uppercase mt-1" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t(m.roleKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
