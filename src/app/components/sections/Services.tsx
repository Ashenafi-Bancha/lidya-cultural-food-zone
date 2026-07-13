import React from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { goto } from "../../data/constants";
import vipImg from "../../../imports/lidya-vip.jpg";

const TIERS = [
  {
    tier: "VIP",
    label: "Premium Experience",
    color: "#d4a843",
    glow: "rgba(212,168,67,0.18)",
    border: "rgba(212,168,67,0.3)",
    features: [
      "Dedicated private dining room",
      "Personal waiter throughout your visit",
      "Priority reservation & arrival",
      "Premium menu selection",
      "Complimentary welcome coffee ceremony",
      "Curated cultural entertainment on request",
    ],
    cta: "Book VIP Table",
    filled: false,
  },
  {
    tier: "VVIP",
    label: "Ultra-Premium Experience",
    color: "#fff0a0",
    glow: "rgba(255,240,160,0.22)",
    border: "rgba(255,240,160,0.45)",
    features: [
      "Exclusive private hall — fully reserved for your group",
      "Dedicated event coordinator from Lidya team",
      "Fully customised menu & décor",
      "Full Wolaita cultural performance (krar, esa dance)",
      "Private jebena coffee ceremony with incense",
      "VIP arrival & red-carpet welcome",
      "Photography & event documentation support",
    ],
    cta: "Book VVIP Experience",
    filled: true,
  },
];

const EVENTS = [
  { title: "Weddings & Engagements",      desc: "From intimate ceremonies to grand celebrations — we prepare full Wolaita wedding buffets and cultural décor for your special day." },
  { title: "Corporate Events & Meetings", desc: "Professional buffet service, private halls, and cultural dining experiences tailored for corporate gatherings, launches, and team events." },
  { title: "Birthdays & Celebrations",   desc: "Make your birthday or milestone unforgettable with a personalised Lidya experience — custom cake, buffet spread, and live cultural music." },
  { title: "Outdoor & Catering Services",desc: "We bring Lidya to you. Full buffet setup and catering service for outdoor events, community gatherings, and off-site celebrations." },
];

export function Services() {
  return (
    <section id="services" className="bg-[#120a03] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        <Reveal className="mb-12 md:mb-16 text-center">
          <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Premium & Event Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Beyond the <em className="text-[#d4a843]">Ordinary</em>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed text-[#e8dcc8]/52" style={{ fontFamily: "var(--font-lidya-body)" }}>
            From intimate VIP dinners to grand cultural celebrations — Lidya offers exclusive service tiers and full event catering to make every occasion extraordinary.
          </p>
        </Reveal>

        {/* VIP / VVIP tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-14 md:mb-20">
          {TIERS.map((t, i) => (
            <Reveal key={t.tier} delay={i * 0.12}>
              <div
                className="relative flex flex-col h-full border p-7 sm:p-9 overflow-hidden group"
                style={{
                  borderColor: t.border,
                  background: `radial-gradient(ellipse at top left,${t.glow} 0%,transparent 65%),#160b04`,
                }}
              >
                {t.tier === "VVIP" && (
                  <>
                    <img src={vipImg} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" alt="VIP Service" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160b04] to-transparent opacity-80" />
                  </>
                )}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-lidya-serif)", color: t.color }}>{t.tier}</span>
                  <span className="text-[10px] tracking-[0.28em] uppercase px-3 py-1 border" style={{ fontFamily: "var(--font-lidya-sans)", borderColor: t.border, color: t.color }}>{t.label}</span>
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#e8dcc8]/65" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                      <span className="mt-1 shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center" style={{ borderColor: t.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => goto("reservation")}
                  className="w-full py-4 text-[11px] tracking-[0.22em] uppercase font-semibold"
                  style={{
                    fontFamily: "var(--font-lidya-sans)",
                    background: t.filled ? t.color : "transparent",
                    color: t.filled ? "#1e1008" : t.color,
                    border: `1px solid ${t.border}`,
                  }}
                  whileHover={{ backgroundColor: t.color, color: "#1e1008" }}
                  transition={{ duration: 0.2 }}
                >
                  {t.cta}
                </motion.button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Events */}
        <Reveal className="mb-8 md:mb-10 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>Event Catering & Buffet</p>
          <h3 className="text-3xl md:text-4xl font-bold text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            We Cater Your <em className="text-[#d4a843]">Celebration</em>
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#d4a843]/8 mb-12 md:mb-14">
          {EVENTS.map((ev, i) => (
            <Reveal key={ev.title} delay={i * 0.08}>
              <motion.div
                className="bg-[#120a03] px-6 sm:px-8 py-7 sm:py-8 h-full"
                whileHover={{ backgroundColor: "#1c0f05" }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-[#f5efe6] font-semibold text-base mb-2" style={{ fontFamily: "var(--font-lidya-serif)" }}>{ev.title}</h4>
                <p className="text-sm leading-relaxed text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>{ev.desc}</p>
              </motion.div>
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
              <p className="text-[#d4a843] text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>Reserve Your Event</p>
              <p className="text-[#f5efe6] text-xl sm:text-2xl font-bold leading-snug" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                Let us make your occasion<br className="hidden sm:block" /> unforgettable.
              </p>
              <p className="text-sm mt-2 text-[#e8dcc8]/46" style={{ fontFamily: "var(--font-lidya-body)" }}>
                Contact us to discuss your event, guest count, menu preferences, and date.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <motion.button
                onClick={() => goto("reservation")}
                className="px-7 py-4 text-[11px] tracking-[0.2em] uppercase w-full sm:w-auto"
                style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
                transition={{ duration: 0.2 }}
              >
                Make a Reservation
              </motion.button>
              <motion.a
                href="tel:+251920994499"
                className="px-7 py-4 border text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{ fontFamily: "var(--font-lidya-sans)", borderColor: "rgba(232,220,200,0.18)", color: "rgba(232,220,200,0.58)" }}
                whileHover={{ borderColor: "#d4a843", color: "#d4a843" }}
                transition={{ duration: 0.2 }}
              >
                <Icon.Phone /> Call to Discuss
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
