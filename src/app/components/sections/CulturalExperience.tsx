import React from "react";
import { motion } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { EXPERIENCES } from "../../data/constants";

export function CulturalExperience() {
  return (
    <section id="experience" className="bg-[#f5efe6] py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-12 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Beyond the Plate</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            The Full Cultural<br /><em>Experience</em>
          </h2>
        </Reveal>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 0.09} className="flex-none w-[260px] sm:w-[290px] md:w-[350px] snap-start">
              <div className="group">
                <div className="aspect-[5/4] overflow-hidden bg-[#e8dcc8] mb-4">
                  <motion.img
                    src={exp.img}
                    alt={exp.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <h3 className="text-[#1e1008] font-semibold text-xl mb-2" style={{ fontFamily: "var(--font-lidya-serif)" }}>{exp.title}</h3>
                <p className="text-[#7a5c3a] text-sm leading-relaxed" style={{ fontFamily: "var(--font-lidya-body)" }}>{exp.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5 text-[#7a5c3a]/55">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-lidya-sans)" }}>Scroll to explore</span>
          <span className="text-sm"><Icon.ArrowRight /></span>
        </div>
      </div>
    </section>
  );
}
