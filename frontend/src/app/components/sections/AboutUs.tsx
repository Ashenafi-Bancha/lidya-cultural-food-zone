import React from "react";
import photo4 from "@/imports/image-4.png";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { STATS } from "../../data/constants";

export function AboutUs() {
  return (
    <section id="about-us" className="bg-[#f5efe6] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-16 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Our Heritage</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight mx-auto" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Rooted in Wolaita,<br /><em>Shared with the World</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal delay={0.1}>
            <div className="relative pr-4 sm:pr-6 pb-4">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8dcc8]">
                <motion.img
                  src={photo4}
                  alt="Wolaita people in traditional cultural attire"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="absolute -bottom-4 -right-0 sm:-right-4 w-full h-full border-2 border-[#d4a843]/40 pointer-events-none" />
              <div className="absolute top-4 sm:top-6 right-0 sm:-right-5 bg-[#c25e2a] text-[#faf5ee] p-4 sm:p-5 text-center shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-lidya-serif)" }}>12</div>
                <div className="text-[9px] tracking-[0.28em] uppercase mt-0.5" style={{ fontFamily: "var(--font-lidya-sans)" }}>Years</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-col gap-5">
              <p className="text-[#1e1008]/80 text-lg leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                Lidya Cultural Food Zone was founded in the heart of Wolaita Sodo by Lidya Lemma and Leta Lemma — driven by one conviction: that Wolaita cuisine is one of Ethiopia's greatest unsung treasures and deserves a home worthy of its history.
              </p>
              <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                What began as a family dream has grown into a cultural institution. Every dish we serve carries memory — in every bowl of kitfo, every smoke rising from the coffee ceremony. We do not just cook; we preserve.
              </p>
              <p className="text-[#1e1008]/65 leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>
                Our Addis Ababa branch in Lebu Area carries that same mission to the capital — an open invitation for the city to taste what the south has always known.
              </p>
              <div className="pt-4 border-t border-[#1e1008]/10">
                <p className="text-[#c25e2a] italic text-lg" style={{ fontFamily: "var(--font-lidya-body)" }}>"Food is not just nourishment — it is our most honest autobiography."</p>
                <p className="text-[#7a5c3a] text-sm mt-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>— Lidya Lemma &amp; Leta Lemma, Founders</p>
              </div>
            </div>
          </Reveal>
        </div>

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
                <div className="text-[10px] tracking-[0.2em] text-[#7a5c3a] uppercase" style={{ fontFamily: "var(--font-lidya-sans)" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
