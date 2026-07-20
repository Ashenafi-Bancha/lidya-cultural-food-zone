import React, { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/image.png";
import { Icon } from "../Icons";
import { NAV_LINKS, goto } from "../../data/constants";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://web.facebook.com/leta.lemma.1",
    bg: "#1877F2",
    shadow: "rgba(24,119,242,0.45)",
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    bg: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    shadow: "rgba(220,39,67,0.45)",
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  },
  {
    label: "Telegram",
    href: "https://t.me/lidyafoodzone",
    bg: "linear-gradient(180deg,#2AABEE 0%,#229ED9 100%)",
    shadow: "rgba(34,158,217,0.45)",
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/251920994499",
    bg: "linear-gradient(160deg,#25D366 0%,#128C7E 100%)",
    shadow: "rgba(37,211,102,0.45)",
    icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    bg: "#000",
    shadow: "rgba(0,0,0,0.5)",
    icon: <svg viewBox="0 0 24 24" width="13" height="13" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    bg: "#010101",
    shadow: "rgba(0,0,0,0.55)",
    icon: <svg viewBox="0 0 24 24" width="13" height="13" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>,
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-[#0e0703] pt-12 md:pt-16 pb-8 text-[#e8dcc8]/65">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#e8dcc8]/7">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-[#d4a843]/35">
                <ImageWithFallback src={logoImg} alt="Lidya Cultural Food Zone logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none gap-[3px]">
                <span className="text-xl font-bold tracking-[0.04em] text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Cultural</span>
                <span
                  className="text-[11px] tracking-[0.28em] uppercase font-bold"
                  style={{
                    fontFamily: "var(--font-lidya-serif)",
                    background: "linear-gradient(180deg,#ffe98a 0%,#d4a843 40%,#a0701a 75%,#f0d060 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 8px rgba(212,168,67,0.65)) drop-shadow(0 1px 0 rgba(80,40,0,0.9))",
                  }}
                >
                  Food Zone
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mt-4 mb-5 text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
              Celebrating the culinary heritage of the Wolaita people — one unforgettable meal at a time.
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase mb-3 font-medium text-[#e8dcc8]/45" style={{ fontFamily: "var(--font-lidya-sans)" }}>Follow Us</p>
            <div className="flex gap-2 flex-wrap">
              {SOCIALS.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px]"
                  style={{ background: s.bg, boxShadow: `0 2px 6px ${s.shadow}` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-[#f5efe6] text-[9px] tracking-[0.3em] uppercase mb-5 font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>Navigate</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <button onClick={() => goto(id)} className="text-sm hover:text-[#d4a843] transition-colors" style={{ fontFamily: "var(--font-lidya-sans)" }}>{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-[#f5efe6] text-[9px] tracking-[0.3em] uppercase mb-5 font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>Our Branches</h4>
            <div className="space-y-5 text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>
              {[
                { city: "Wolaita Sodo", addr: "Green Land Area, Wolaita Sodo", hrs: "7:00 AM – 11:00 PM" },
                { city: "Addis Ababa",  addr: "Lebu Area, Addis Ababa",        hrs: "8:00 AM – 11:30 PM" },
              ].map(({ city, addr, hrs }) => (
                <div key={city}>
                  <p className="text-[#d4a843] font-medium mb-1">{city}</p>
                  <p className="text-[#e8dcc8]/55">{addr}</p>
                  <p className="mt-1 text-[#e8dcc8]/45">{hrs}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#f5efe6] text-[9px] tracking-[0.3em] uppercase mb-5 font-medium" style={{ fontFamily: "var(--font-lidya-sans)" }}>Stay Connected</h4>
            <p className="text-sm leading-relaxed mb-5 text-[#e8dcc8]/50" style={{ fontFamily: "var(--font-lidya-body)" }}>
              Cultural event updates, seasonal menus, and invitations to special evenings.
            </p>
            {subscribed ? (
              <p className="text-[#d4a843] text-sm" style={{ fontFamily: "var(--font-lidya-body)" }}>You are subscribed — thank you.</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex w-full">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="min-w-0 flex-1 border px-3 py-3 text-xs focus:outline-none transition-colors text-[#f5efe6]"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "#1e1008", borderColor: "rgba(232,220,200,0.12)" }}
                />
                <motion.button
                  type="submit"
                  className="shrink-0 px-4 py-3 text-xs"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                  whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Join
                </motion.button>
              </form>
            )}
            <div className="mt-5 space-y-2 text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>
              <div className="flex items-center gap-2 text-[#e8dcc8]/50">
                <span className="text-[#d4a843]"><Icon.Mail /></span>
                <a href="mailto:letusletalemma@gmail.com" className="hover:text-[#d4a843] transition-colors">letusletalemma@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 text-[#e8dcc8]/50">
                <span className="text-[#d4a843]"><Icon.Phone /></span>
                <a href="tel:+251920994499" className="hover:text-[#d4a843] transition-colors">0920994499</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-[#e8dcc8]/28" style={{ fontFamily: "var(--font-lidya-sans)" }}>
          <span>© 2024 Lidya Cultural Food Zone. All rights reserved.</span>
          <span>Crafted with pride for the Wolaita, the Ethiopia and the world.</span>
        </div>
      </div>
    </footer>
  );
}
