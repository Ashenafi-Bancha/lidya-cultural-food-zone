import React from "react";
import { motion } from "motion/react";
import photo1 from "@/imports/image-1.png";
import branch2Img from "@/imports/lidya_hospitality.jpg";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";

const BRANCHES = [
  {
    name: "Wolaita Sodo",
    label: "Flagship",
    address: "Green Land Area, Wolaita Sodo, SNNPR, Ethiopia",
    phone: "0920994499",
    email: "letusletalemma@gmail.com",
    hours: "Mon–Sun: 7:00 AM – 11:00 PM",
    note: "The original Lidya — our ancestral home, largest mesob hall, and the venue for full Friday cultural nights.",
    img: photo1,
  },
  {
    name: "Addis Ababa",
    label: "Capital Branch",
    address: "Lebu Area, Addis Ababa, Ethiopia",
    phone: "0920994499",
    email: "letusletalemma@gmail.com",
    hours: "Mon–Sun: 8:00 AM – 11:30 PM",
    note: "Our capital outpost — curated Wolaita dining for Addis and the world, with private dining rooms available.",
    img: branch2Img,
  },
];

export function Branches() {
  return (
    <section id="branches" className="bg-[#f5efe6] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-14 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Find Us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Our<em className="text-[#c25e2a]"> Branches</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BRANCHES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.12}>
              <motion.div
                className="bg-[#faf5ee] overflow-hidden border border-[#1e1008]/8 h-full"
                whileHover={{ borderColor: "rgba(194,94,42,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-video overflow-hidden bg-[#e8dcc8]">
                  <motion.img
                    src={b.img}
                    alt={`${b.name} branch`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className="p-5 sm:p-8">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-[#c25e2a] font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>{b.label}</span>
                  <h3 className="text-2xl font-bold text-[#1e1008] mt-1 mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>{b.name}</h3>
                  <p className="text-[#7a5c3a] text-sm leading-relaxed mb-5 italic" style={{ fontFamily: "var(--font-lidya-body)" }}>{b.note}</p>
                  <div className="space-y-3">
                    {[
                      { I: Icon.MapPin, v: b.address, href: null },
                      { I: Icon.Clock,  v: b.hours,   href: null },
                      { I: Icon.Phone,  v: b.phone,   href: `tel:+251${b.phone.replace(/^0/, "")}` },
                      { I: Icon.Mail,   v: b.email,   href: `mailto:${b.email}` },
                    ].map(({ I, v, href }) => (
                      <div key={v} className="flex items-start gap-3 text-sm text-[#1e1008]/65" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                        <span className="text-[#c25e2a] mt-0.5 shrink-0"><I /></span>
                        {href
                          ? <a href={href} className="hover:text-[#c25e2a] transition-colors">{v}</a>
                          : <span>{v}</span>
                        }
                      </div>
                    ))}
                  </div>
                  <motion.a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase bg-[#c25e2a] text-[#faf5ee] px-5 py-3 shadow-sm hover:shadow-md transition-shadow"
                    style={{ fontFamily: "var(--font-lidya-sans)" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon.ExternalLink /> Get Directions
                  </motion.a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
