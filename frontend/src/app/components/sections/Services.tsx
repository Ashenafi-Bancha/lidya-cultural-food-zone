import React, { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useLang } from "../../../context/LanguageContext";
import { EventBookingModal } from "../EventBookingModal";
import { EventType } from "../../../types/api";
import vipImg from "../../../imports/lidya-vip.jpg";

const TIERS = [
  {
    tier: "VIP",
    labelKey: "services.vipLabel",
    color: "#d4a843",
    glow: "rgba(212,168,67,0.18)",
    border: "rgba(212,168,67,0.3)",
    featureKeys: [
      "services.vip.f1",
      "services.vip.f2",
      "services.vip.f3",
      "services.vip.f4",
      "services.vip.f5",
      "services.vip.f6",
    ],
    ctaKey: "services.vipCta",
    filled: false,
  },
  {
    tier: "VVIP",
    labelKey: "services.vvipLabel",
    color: "#fff0a0",
    glow: "rgba(255,240,160,0.22)",
    border: "rgba(255,240,160,0.45)",
    featureKeys: [
      "services.vvip.f1",
      "services.vvip.f2",
      "services.vvip.f3",
      "services.vvip.f4",
      "services.vvip.f5",
      "services.vvip.f6",
      "services.vvip.f7",
    ],
    ctaKey: "services.vvipCta",
    filled: true,
  },
];

const EVENTS: { titleKey: string; descKey: string; service: EventType }[] = [
  { titleKey: "services.events.weddingsTitle", descKey: "services.events.weddingsDesc", service: "WEDDING" },
  { titleKey: "services.events.engagementsTitle", descKey: "services.events.engagementsDesc", service: "ENGAGEMENT" },
  { titleKey: "services.events.hallTitle", descKey: "services.events.hallDesc", service: "HALL_RENTAL" },
  { titleKey: "services.events.cateringTitle", descKey: "services.events.cateringDesc", service: "CATERING" },
  { titleKey: "services.events.corporateTitle", descKey: "services.events.corporateDesc", service: "CORPORATE" },
  { titleKey: "services.events.birthdaysTitle", descKey: "services.events.birthdaysDesc", service: "BIRTHDAY" },
];

export function Services() {
  const { t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<EventType>("OTHER");

  const openBooking = (service: EventType) => {
    setBookingService(service);
    setBookingOpen(true);
  };

  return (
    <section id="services" className="bg-[#120a03] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        <Reveal className="mb-12 md:mb-16 text-center">
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("services.eyebrow")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("services.titlePre")} <em className="text-[#d4a843]">{t("services.titleEm")}</em>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed text-[#e8dcc8]/52" style={{ fontFamily: "var(--font-lidya-body)" }}>
            {t("services.intro")}
          </p>
        </Reveal>

        {/* VIP / VVIP tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-14 md:mb-20">
          {TIERS.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.12}>
              <div
                className="relative flex flex-col h-full border p-7 sm:p-9 overflow-hidden group"
                style={{
                  borderColor: plan.border,
                  background: `radial-gradient(ellipse at top left,${plan.glow} 0%,transparent 65%),#160b04`,
                }}
              >
                {plan.tier === "VVIP" && (
                  <>
                    <img src={vipImg} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" alt="VIP Service" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160b04] to-transparent opacity-80" />
                  </>
                )}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-lidya-serif)", color: plan.color }}>{plan.tier}</span>
                  <span className="text-[10px] tracking-[0.28em] uppercase px-3 py-1 border" style={{ fontFamily: "var(--font-lidya-sans)", borderColor: plan.border, color: plan.color }}>{t(plan.labelKey)}</span>
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.featureKeys.map(fk => (
                    <li key={fk} className="flex items-start gap-3 text-sm text-[#e8dcc8]/65" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                      <span className="mt-1 shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center" style={{ borderColor: plan.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: plan.color }} />
                      </span>
                      {t(fk)}
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => openBooking(plan.tier as EventType)}
                  className="w-full py-4 text-[11px] tracking-[0.22em] uppercase font-semibold"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    background: plan.filled ? plan.color : "transparent",
                    color: plan.filled ? "#1e1008" : plan.color,
                    border: `1px solid ${plan.border}`,
                  }}
                  whileHover={{ backgroundColor: plan.color, color: "#1e1008" }}
                  transition={{ duration: 0.2 }}
                >
                  {t(plan.ctaKey)}
                </motion.button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Events */}
        <Reveal className="mb-8 md:mb-10 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("services.eventsEyebrow")}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("services.eventsTitlePre")} <em className="text-[#d4a843]">{t("services.eventsTitleEm")}</em>
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#d4a843]/8 mb-12 md:mb-14">
          {EVENTS.map((ev, i) => (
            <Reveal key={ev.titleKey} delay={i * 0.08}>
              <motion.button
                type="button"
                onClick={() => openBooking(ev.service)}
                className="text-left w-full bg-[#120a03] px-6 sm:px-8 py-7 sm:py-8 h-full block group/ev"
                whileHover={{ backgroundColor: "#1c0f05" }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-[#f5efe6] font-semibold text-base mb-2 group-hover/ev:text-[#d4a843] transition-colors" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t(ev.titleKey)}</h4>
                <p className="text-sm leading-relaxed text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>{t(ev.descKey)}</p>
                <span className="inline-block mt-3 text-[10px] tracking-[0.2em] uppercase text-[#d4a843]/70" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("common.makeReservation")} →</span>
              </motion.button>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div
            className="relative overflow-hidden border flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8 md:py-10"
            style={{ borderColor: "rgba(212,168,67,0.2)", background: "linear-gradient(135deg,rgba(194,94,42,0.12) 0%,rgba(212,168,67,0.06) 100%)" }}
          >
            <div className="text-center sm:text-left">
              <p className="text-[#d4a843] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("services.ctaEyebrow")}</p>
              <p className="text-[#f5efe6] text-xl sm:text-2xl font-bold leading-snug" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                {t("services.ctaTitle")}
              </p>
              <p className="text-sm mt-2 text-[#e8dcc8]/46" style={{ fontFamily: "var(--font-lidya-body)" }}>
                {t("services.ctaBody")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <motion.button
                onClick={() => openBooking("OTHER")}
                className="px-7 py-4 text-[11px] tracking-[0.2em] uppercase w-full sm:w-auto"
                style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
                transition={{ duration: 0.2 }}
              >
                {t("common.makeReservation")}
              </motion.button>
              <motion.a
                href="tel:+251920994499"
                className="px-7 py-4 border text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ fontFamily: "var(--font-lidya-sans)", borderColor: "rgba(232,220,200,0.18)", color: "rgba(232,220,200,0.58)" }}
                whileHover={{ borderColor: "#d4a843", color: "#d4a843" }}
                transition={{ duration: 0.2 }}
              >
                <Icon.Phone /> {t("common.callToDiscuss")}
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>

      <EventBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} initialService={bookingService} />
    </section>
  );
}
