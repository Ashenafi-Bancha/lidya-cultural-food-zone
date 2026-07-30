import React from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useBranches } from "../../../hooks/useBranches";
import { useLang } from "../../../context/LanguageContext";

// Branch banner photos — drop the files in src/imports/branches/ then uncomment
// the import and add the entry to BRANCH_IMAGES keyed by the branch name.
// import addisImg    from "@/imports/branches/branch-addis.jpg";
// import wolaita1Img from "@/imports/branches/branch-wolaita-1.jpg";
// import wolaita2Img from "@/imports/branches/branch-wolaita-2.jpg";

const BRANCH_IMAGES: Record<string, string> = {
  // "Addis Ababa": addisImg,
  // "Wolaita Sodo 1": wolaita1Img,
  // "Wolaita Sodo 2": wolaita2Img,
};

// Build a Google Maps link that drops a pin / offers directions to the address.
const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function Branches() {
  const { t, tf } = useLang();
  const { data: branchesData, isLoading, isError } = useBranches();

  const branches = branchesData ?? [];

  return (
    <section id="branches" className="bg-[#f5efe6] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-14 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("branches.eyebrow")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("branches.titlePre")}<em className="text-[#c25e2a]"> {t("branches.titleEm")}</em>
          </h2>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-[#faf5ee] border border-[#1e1008]/8 h-[500px] animate-pulse flex flex-col">
                <div className="aspect-video bg-[#e8dcc8]" />
                <div className="p-5 sm:p-8 flex flex-col gap-3">
                  <div className="h-4 bg-[#e8dcc8] w-20" />
                  <div className="h-8 bg-[#e8dcc8] w-48 mb-2" />
                  <div className="h-4 bg-[#e8dcc8] w-full" />
                  <div className="h-4 bg-[#e8dcc8] w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="py-16 text-center text-[#1e1008]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
            {isError ? t("branches.emptyError") : t("branches.emptyComingSoon")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((b, i) => {
              const img = BRANCH_IMAGES[b.name] || b.imageUrl || null;
              return (
                <Reveal key={b.id} delay={i * 0.1}>
                  <motion.div
                    className="bg-[#faf5ee] overflow-hidden border border-[#1e1008]/8 h-full flex flex-col group"
                    whileHover={{ borderColor: "rgba(194,94,42,0.3)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-video overflow-hidden bg-[#e8dcc8] relative">
                      {img ? (
                        <motion.img
                          src={img}
                          alt={`${b.name} branch`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.7 }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#e8dcc8 0%,#d9c7ab 100%)" }} aria-hidden>
                          <span className="text-[#c25e2a] text-3xl"><Icon.MapPin /></span>
                          <span className="text-[9px] tracking-[0.25em] uppercase text-[#7a5c3a]/60" style={{ fontFamily: "var(--font-lidya-sans)" }}>Photo coming soon</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-8 flex-1 flex flex-col">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#c25e2a] font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>{tf(b, "label")}</span>
                      <h3 className="text-2xl font-bold text-[#1e1008] mt-1 mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>{tf(b, "name")}</h3>
                      {tf(b, "note") && (
                        <p className="text-[#7a5c3a] text-sm leading-relaxed mb-5 italic flex-1" style={{ fontFamily: "var(--font-lidya-body)" }}>{tf(b, "note")}</p>
                      )}
                      <div className="space-y-3 mt-auto">
                        {[
                          { I: Icon.MapPin, v: b.address, href: null as string | null },
                          { I: Icon.Clock,  v: tf(b, "workingHours"), href: null as string | null },
                          { I: Icon.Phone,  v: b.phone, href: b.phone ? `tel:+251${b.phone.replace(/^0/, "")}` : null },
                          { I: Icon.Mail,   v: b.email, href: b.email ? `mailto:${b.email}` : null },
                        ].filter(x => x.v).map(({ I, v, href }) => (
                          <div key={v as string} className="flex items-start gap-3 text-sm text-[#1e1008]/65" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                            <span className="text-[#c25e2a] mt-0.5 shrink-0"><I /></span>
                            {href
                              ? <a href={href} className="hover:text-[#c25e2a] transition-colors">{v}</a>
                              : <span>{v}</span>}
                          </div>
                        ))}
                      </div>
                      <motion.a
                        href={mapsUrl(b.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase bg-[#c25e2a] text-[#faf5ee] px-5 py-3 shadow-sm hover:shadow-md transition-shadow justify-center"
                        style={{ fontFamily: "var(--font-lidya-sans)" }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon.MapPin /> {t("branches.getDirections")}
                      </motion.a>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
