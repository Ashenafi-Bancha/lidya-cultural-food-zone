import React, { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { useLang } from "../../../context/LanguageContext";
import { useNavGo } from "../../hooks/useNavGo";
import { EventBookingModal } from "../EventBookingModal";
import { EventType } from "../../../types/api";
import vipImg from "../../../imports/lidya-vip.webp";

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
    img: null,         // VIP room banner — drop src/imports/services/service-vip-room.jpg
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
    img: vipImg,       // VVIP room banner (existing photo — swap for a new one anytime)
  },
];

// Each service gets a high-quality banner image. Drop the file in
// src/imports/services/ and swap `img: null` → `img: <imported file>`.
// Until then an elegant themed placeholder renders in its place.
type ServiceCard = {
  titleKey: string;
  descKey: string;
  service: EventType;
  Glyph: React.FC;
  img: string | null;
  flagship?: boolean;
};

const EVENTS: ServiceCard[] = [
  { titleKey: "services.events.culturalTitle",    descKey: "services.events.culturalDesc",    service: "CATERING",    Glyph: Icon.Utensils, img: null, flagship: true },
  { titleKey: "services.events.deliveryTitle",    descKey: "services.events.deliveryDesc",    service: "OTHER",       Glyph: Icon.Send,     img: null },
  { titleKey: "services.events.weddingsTitle",    descKey: "services.events.weddingsDesc",    service: "WEDDING",     Glyph: Icon.Star,     img: null },
  { titleKey: "services.events.engagementsTitle", descKey: "services.events.engagementsDesc", service: "ENGAGEMENT",  Glyph: Icon.Star,     img: null },
  { titleKey: "services.events.hallTitle",        descKey: "services.events.hallDesc",        service: "HALL_RENTAL", Glyph: Icon.MapPin,   img: null },
  { titleKey: "services.events.cateringTitle",    descKey: "services.events.cateringDesc",    service: "CATERING",    Glyph: Icon.Utensils, img: null },
  { titleKey: "services.events.corporateTitle",   descKey: "services.events.corporateDesc",   service: "CORPORATE",   Glyph: Icon.Users,    img: null },
  { titleKey: "services.events.birthdaysTitle",   descKey: "services.events.birthdaysDesc",   service: "BIRTHDAY",    Glyph: Icon.Calendar, img: null },
];

/**
 * @param preview  Homepage mode: the flagship service plus three cards, then a
 *                 "View More Services" CTA linking to /services. VIP/VVIP tiers
 *                 and the bottom CTA block live on the full page only.
 */
export function Services({ preview = false }: { preview?: boolean } = {}) {
  const { t } = useLang();
  const navGo = useNavGo();
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
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("services.titlePre")} <em className="text-[#d4a843]">{t("services.titleEm")}</em>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed text-[#f5efe6]/78" style={{ fontFamily: "var(--font-lidya-body)" }}>
            {t("services.intro")}
          </p>
        </Reveal>

        {/* VIP / VVIP tiers — full page only */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-14 md:mb-20 ${preview ? "hidden" : ""}`}>
          {TIERS.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.12}>
              <div
                className="relative flex flex-col h-full border overflow-hidden group"
                style={{
                  borderColor: plan.border,
                  background: `radial-gradient(ellipse at top left,${plan.glow} 0%,transparent 65%),#160b04`,
                }}
              >
                {/* room banner image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#1c0f05]">
                  {plan.img ? (
                    <img src={plan.img} alt={`${plan.tier} private room at Lidya`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#2a1a0d 0%,#160b04 100%)" }} aria-hidden>
                      <span className="text-3xl" style={{ color: plan.color }}><Icon.Star /></span>
                      <span className="text-[9px] tracking-[0.25em] uppercase text-[#e8dcc8]/22" style={{ fontFamily: "var(--font-lidya-sans)" }}>Room photo coming soon</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160b04] via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="relative z-10 flex flex-col flex-1 p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-lidya-serif)", color: plan.color }}>{plan.tier}</span>
                  <span className="text-[10px] tracking-[0.28em] uppercase px-3 py-1 border" style={{ fontFamily: "var(--font-lidya-sans)", borderColor: plan.border, color: plan.color }}>{t(plan.labelKey)}</span>
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.featureKeys.map(fk => (
                    <li key={fk} className="flex items-start gap-3 text-sm text-[#f5efe6]/85" style={{ fontFamily: "var(--font-lidya-sans)" }}>
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
          <h3 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            {t("services.eventsTitlePre")} <em className="text-[#d4a843]">{t("services.eventsTitleEm")}</em>
          </h3>
        </Reveal>

        {/* Flagship service — wide, highlighted, with banner image */}
        {(() => {
          const f = EVENTS[0];
          const FGlyph = f.Glyph;
          return (
            <Reveal className="mb-6 md:mb-8">
              <motion.button
                type="button"
                onClick={() => openBooking(f.service)}
                className="group/ev w-full text-left grid md:grid-cols-2 overflow-hidden border"
                style={{
                  borderColor: "rgba(212,168,67,0.45)",
                  background: "radial-gradient(ellipse at top left,rgba(212,168,67,0.14) 0%,transparent 60%),#160b04",
                }}
                whileHover={{ boxShadow: "0 22px 60px rgba(0,0,0,0.5)" }}
                transition={{ duration: 0.3 }}
              >
                {/* banner image (right on desktop) */}
                <div className="relative min-h-[220px] md:min-h-[340px] overflow-hidden bg-[#1c0f05] md:order-2">
                  {f.img ? (
                    <img src={f.img} alt={t(f.titleKey)} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/ev:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#2a1a0d 0%,#160b04 100%)" }} aria-hidden>
                      <span className="text-[#d4a843]/55 text-4xl"><FGlyph /></span>
                      <span className="text-[9px] tracking-[0.25em] uppercase text-[#e8dcc8]/22" style={{ fontFamily: "var(--font-lidya-sans)" }}>Photo coming soon</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#160b04] via-transparent to-transparent pointer-events-none" />
                </div>
                {/* copy */}
                <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center md:order-1">
                  <span className="inline-flex items-center gap-2 self-start text-[10px] tracking-[0.28em] uppercase px-3 py-1 mb-4 border text-[#f5e6b8]" style={{ fontFamily: "var(--font-lidya-sans)", borderColor: "rgba(212,168,67,0.5)", background: "rgba(212,168,67,0.08)" }}>
                    ★ {t("services.flagshipBadge")}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4 group-hover/ev:text-[#d4a843] transition-colors" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                    {t(f.titleKey)}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#f5efe6]/80 mb-6 max-w-xl" style={{ fontFamily: "var(--font-lidya-body)" }}>
                    {t(f.descKey)}
                  </p>
                  <span className="inline-block text-[11px] tracking-[0.22em] uppercase text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("common.makeReservation")} →</span>
                </div>
              </motion.button>
            </Reveal>
          );
        })()}

        {/* Other services — image cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-14">
          {(preview ? EVENTS.slice(1, 4) : EVENTS.slice(1)).map((ev, i) => {
            const EvGlyph = ev.Glyph;
            return (
              <Reveal key={ev.titleKey} delay={i * 0.06}>
                <motion.button
                  type="button"
                  onClick={() => openBooking(ev.service)}
                  className="group/ev text-left w-full h-full flex flex-col overflow-hidden border border-[#d4a843]/12 bg-[#160b04]"
                  whileHover={{ y: -6, borderColor: "rgba(212,168,67,0.4)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1c0f05]">
                    {ev.img ? (
                      <img src={ev.img} alt={t(ev.titleKey)} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover/ev:scale-105" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#2a1a0d 0%,#160b04 100%)" }} aria-hidden>
                        <span className="text-[#d4a843]/55 text-3xl"><EvGlyph /></span>
                        <span className="text-[9px] tracking-[0.25em] uppercase text-[#e8dcc8]/22" style={{ fontFamily: "var(--font-lidya-sans)" }}>Photo coming soon</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160b04] via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2 group-hover/ev:text-[#d4a843] transition-colors" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t(ev.titleKey)}</h4>
                    <p className="text-sm leading-relaxed text-[#f5efe6]/75 flex-1" style={{ fontFamily: "var(--font-lidya-body)" }}>{t(ev.descKey)}</p>
                    <span className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase text-[#d4a843]/70" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("common.makeReservation")} →</span>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>

        {/* Homepage: send visitors to the full services page */}
        {preview && (
          <Reveal className="text-center">
            <motion.button
              type="button"
              onClick={() => navGo({ id: "services", path: "/services" })}
              className="group/cta inline-flex items-center gap-3 px-9 py-4 rounded-xl text-[11px] tracking-[0.24em] uppercase font-semibold"
              style={{
                fontFamily: "var(--font-lidya-sans)",
                color: "#d4a843",
                border: "1px solid rgba(212,168,67,0.5)",
                background: "linear-gradient(135deg, rgba(212,168,67,0.10) 0%, rgba(194,94,42,0.08) 100%)",
              }}
              whileHover={{ backgroundColor: "#d4a843", color: "#1e1008", boxShadow: "0 0 28px rgba(212,168,67,0.45)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              {t("common2.viewMoreServices")}
              <span aria-hidden className="inline-flex transition-transform duration-300 group-hover/cta:translate-x-1">
                <Icon.ArrowRight />
              </span>
            </motion.button>
          </Reveal>
        )}

        {/* Bottom CTA — full page only */}
        <Reveal className={preview ? "hidden" : ""}>
          <div
            className="relative overflow-hidden border flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8 md:py-10"
            style={{ borderColor: "rgba(212,168,67,0.2)", background: "linear-gradient(135deg,rgba(194,94,42,0.12) 0%,rgba(212,168,67,0.06) 100%)" }}
          >
            <div className="text-center sm:text-left">
              <p className="text-[#d4a843] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("services.ctaEyebrow")}</p>
              <p className="text-white text-xl sm:text-2xl font-bold leading-snug" style={{ fontFamily: "var(--font-lidya-serif)" }}>
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
                className="px-7 py-4 rounded-xl border text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
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
