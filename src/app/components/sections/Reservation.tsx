import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";

export function Reservation() {
  const [form, setForm] = useState({
    name: "", phone: "", date: "", guests: "2",
    branch: "Wolaita Sodo — Flagship", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const inputCls = "w-full border text-sm px-4 py-3 focus:outline-none transition-colors duration-200 placeholder-[#e8dcc8]/30 focus:border-[#d4a843]/55";
  const inputStyle = {
    fontFamily: "var(--font-lidya-sans)",
    background: "rgba(30,16,8,0.35)",
    borderColor: "rgba(232,220,200,0.18)",
    color: "#f5efe6",
  };

  return (
    <section id="reservation" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-[#120a03]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1668840961877-69f589e8d85a?w=1600&h=900&fit=crop&auto=format"
          alt="Restaurant dining hall"
          className="w-full h-full object-cover opacity-[0.18]"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(18,10,3,0.92),rgba(18,10,3,0.65))" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left info */}
          <Reveal className="text-center lg:text-left">
            <p className="text-[#d4a843] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Make a Booking</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f5efe6] leading-tight mb-6" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              Reserve Your<br /><em className="text-[#d4a843]">Table</em>
            </h2>
            <p className="text-lg leading-relaxed max-w-md mb-10 text-[#e8dcc8]/62" style={{ fontFamily: "var(--font-lidya-body)" }}>
              Join us for an evening that will stay with you long after the last cup of coffee. Tables fill quickly on performance nights.
            </p>
            <div className="space-y-4">
              {[
                { I: Icon.Clock, t: "Wolaita Sodo: 7:00 AM – 11:00 PM daily", href: null },
                { I: Icon.Clock, t: "Addis Ababa: 8:00 AM – 11:30 PM daily",  href: null },
                { I: Icon.Phone, t: "0920994499",                              href: "tel:+251920994499" },
              ].map(({ I, t, href }) => (
                <div key={t} className="flex items-center gap-3 text-sm text-[#e8dcc8]/58" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                  <span className="text-[#d4a843]"><I /></span>
                  {href
                    ? <a href={href} className="hover:text-[#d4a843] transition-colors">{t}</a>
                    : <span>{t}</span>
                  }
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right form */}
          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="border p-12 text-center"
                  style={{ background: "rgba(30,16,8,0.65)", borderColor: "rgba(212,168,67,0.25)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="text-4xl text-[#d4a843] mb-4" style={{ fontFamily: "var(--font-lidya-serif)" }}>✦</div>
                  <h3 className="text-[#d4a843] text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>Table Reserved</h3>
                  <p className="text-[#e8dcc8]/62" style={{ fontFamily: "var(--font-lidya-body)" }}>We look forward to welcoming you. Confirmation will be sent to your phone shortly.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={e => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 4500); }}
                  className="border flex flex-col gap-4 p-5 sm:p-8"
                  style={{ background: "rgba(30,16,8,0.55)", borderColor: "rgba(232,220,200,0.1)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} placeholder="Full Name"    value={form.name}  onChange={e => setForm({ ...form, name: e.target.value })}  required />
                    <input className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    <select className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                      {[1,2,3,4,5,6,7,8,"9+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
                    </select>
                  </div>
                  <select className={inputCls} style={inputStyle} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                    <option>Wolaita Sodo — Flagship Branch</option>
                    <option>Addis Ababa — Capital Branch</option>
                  </select>
                  <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={3} placeholder="Special requests…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  <motion.button
                    type="submit"
                    className="mt-1 py-4 text-[11px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                    whileHover={{ backgroundColor: "#d4a843", color: "#1e1008" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Confirm Reservation
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
