import React from "react";
import { Reveal } from "../Reveal";
import { useLang } from "../../../context/LanguageContext";
import lidyaCoffee2 from "../../../imports/ldiyacoffee2.webp";

const OFFERINGS = [
  { name: "Abol Buna",     price: "50 ETB" },
  { name: "Butter Coffee", price: "100 ETB" },
];

export function LidyaCoffee() {
  const { t } = useLang();
  return (
    <section id="coffee" className="bg-[#0e0703] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        <Reveal className="mb-12 md:mb-16 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t("coffee.eyebrow")}</p>
          <div className="flex flex-col items-center gap-1 mb-4">
            <div className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              Lidya <em className="text-[#d4a843]">Coffee</em>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl text-[#f5efe6]/30 italic" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              ሊዲያ ቡና
            </div>
          </div>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed text-[#e8dcc8]/55" style={{ fontFamily: "var(--font-lidya-body)" }}>
            {t("coffee.intro")}
          </p>
        </Reveal>

        <Reveal>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-72 sm:h-96 md:h-[500px] w-full group">
              <img
                src={lidyaCoffee2}
                alt="Lidya Coffee"
                className="w-full h-full object-cover rounded-2xl border border-[#d4a843]/20 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0703] via-transparent to-transparent rounded-2xl opacity-80" />
            </div>
            <div className="order-1 lg:order-2">
              <h4 className="text-[#f5efe6] text-3xl md:text-4xl font-bold mb-10 text-left" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                {t("coffee.offeringsPre")} <em className="text-[#d4a843]">{t("coffee.offeringsEm")}</em>
              </h4>
              <div className="grid grid-cols-1 gap-y-8">
                {OFFERINGS.map((o, i) => (
                  <div key={o.name} className="group cursor-pointer">
                    <div className="flex justify-between items-end gap-4 mb-2">
                      <h5 className="text-[#f5efe6] font-medium text-lg md:text-xl transition-colors duration-300 group-hover:text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-sans)" }}>{t(`coffee.offerings.${i}.name`)}</h5>
                      <div className="flex-1 border-b border-dotted border-[#d4a843]/20 mb-2 transition-colors duration-300 group-hover:border-[#d4a843]/50" />
                      <span className="text-[#d4a843] font-bold text-base md:text-lg shrink-0" style={{ fontFamily: "var(--font-lidya-sans)" }}>{o.price}</span>
                    </div>
                    <p className="text-sm md:text-base text-[#e8dcc8]/50 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{t(`coffee.offerings.${i}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
