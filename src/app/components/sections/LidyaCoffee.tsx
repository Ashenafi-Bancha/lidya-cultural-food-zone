import React from "react";
import { Reveal } from "../Reveal";
import lidyaCoffee1 from "../../../imports/lidyacoffee1.png";
import lidyaCoffee2 from "../../../imports/ldiyacoffee2.png";

const ROUNDS = [
  { num: "01", name: "Abol",   sub: "First Round",               desc: "The strongest pour — freshly roasted, stone-ground Wolaita highland coffee. Offered with respect." },
  { num: "02", name: "Tona",   sub: "Second Round",              desc: "A lighter brew from the same grounds. The round of conversation, laughter, and shared time." },
  { num: "03", name: "Baraka", sub: "Third Round · The Blessing", desc: "To receive all three rounds is to receive the full hospitality of a Wolaita home." },
];

const OFFERINGS = [
  { name: "Jebena Buna",                    price: "120 ETB", desc: "Full three-round ceremony, roasted over open flame in a handcrafted clay jebena. Served with popcorn and incense." },
  { name: "Wolaita Highlands Single-Origin", price: "90 ETB",  desc: "Single-origin beans from the highlands of Wolaita. Dark roast with notes of chocolate and dried fig." },
  { name: "Spiced Buna",                     price: "85 ETB",  desc: "Brewed with cardamom, cloves, and cinnamon — a warming ancestral blend." },
  { name: "Butter Buna",                     price: "95 ETB",  desc: "Highland coffee stirred with niter kibbeh and a pinch of salt. A rare Wolaita tradition." },
];

export function LidyaCoffee() {
  return (
    <section id="coffee" className="bg-[#0e0703] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        <Reveal className="mb-12 md:mb-16 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Ethiopia's Living Tradition</p>
          <div className="flex flex-col items-center gap-1 mb-4">
            <div className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              Lidya <em className="text-[#d4a843]">Buna</em>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl text-[#f5efe6]/30 italic" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              ሊዲያ ቡና
            </div>
          </div>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed text-[#e8dcc8]/55" style={{ fontFamily: "var(--font-lidya-body)" }}>
            In Wolaita, coffee is not a beverage — it is a ceremony, a ritual of welcome, and the most intimate act of hospitality a home can offer.
          </p>
        </Reveal>

        <Reveal className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-full min-h-[300px]">
              <img
                src={lidyaCoffee1}
                alt="Traditional jebena pouring coffee into a small cup"
                className="w-full h-full object-cover brightness-75"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right,transparent 60%,#0e0703)" }} />
            </div>
            <div className="bg-[#160b04] flex flex-col justify-center px-8 sm:px-10 py-10 md:py-12">
              <p className="text-[#d4a843] text-[10px] tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "var(--font-lidya-sans)" }}>The Sacred Ceremony</p>
              <h3 className="text-3xl md:text-4xl font-bold text-[#f5efe6] mb-6 leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                Three Rounds,<br /><em className="text-[#d4a843]">One Blessing</em>
              </h3>
              <p className="text-sm leading-relaxed mb-8 text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
                Every Lidya Buna ceremony follows the three sacred rounds passed down through Wolaita generations. Each pour has a name, a meaning, and a place in the ritual.
              </p>
              <div className="space-y-4">
                {ROUNDS.map(r => (
                  <div key={r.name} className="flex gap-4 items-start">
                    <span className="text-[#d4a843]/40 text-xs font-bold mt-0.5 shrink-0 w-6 text-right" style={{ fontFamily: "var(--font-lidya-sans)" }}>{r.num}</span>
                    <div>
                      <span className="text-[#f5efe6] font-bold tracking-wide mr-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>{r.name}</span>
                      <span className="text-[#d4a843]/60 text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-lidya-sans)" }}>{r.sub}</span>
                      <p className="mt-1 text-sm leading-relaxed text-[#e8dcc8]/40" style={{ fontFamily: "var(--font-lidya-body)" }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-6xl mx-auto border-t border-[#d4a843]/15 pt-12 md:pt-16 mt-16 md:mt-24 px-4 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative h-72 sm:h-96 md:h-[500px] w-full group">
                <img 
                  src={lidyaCoffee2} 
                  alt="Lidya Coffee Offerings" 
                  className="w-full h-full object-cover rounded-2xl border border-[#d4a843]/20 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0703] via-transparent to-transparent rounded-2xl opacity-80" />
              </div>
              <div className="order-1 lg:order-2">
                <h4 className="text-[#f5efe6] text-3xl md:text-4xl font-bold mb-10 text-left" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                  Coffee <em className="text-[#d4a843]">Offerings</em>
                </h4>
                <div className="grid grid-cols-1 gap-y-8">
                  {OFFERINGS.map(o => (
                    <div key={o.name} className="group cursor-pointer">
                      <div className="flex justify-between items-end gap-4 mb-2">
                        <h5 className="text-[#f5efe6] font-medium text-lg md:text-xl transition-colors duration-300 group-hover:text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-sans)" }}>{o.name}</h5>
                        <div className="flex-1 border-b border-dotted border-[#d4a843]/20 mb-2 transition-colors duration-300 group-hover:border-[#d4a843]/50" />
                        <span className="text-[#d4a843] font-bold text-base md:text-lg shrink-0" style={{ fontFamily: "var(--font-lidya-sans)" }}>{o.price}</span>
                      </div>
                      <p className="text-sm md:text-base text-[#e8dcc8]/50 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{o.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
