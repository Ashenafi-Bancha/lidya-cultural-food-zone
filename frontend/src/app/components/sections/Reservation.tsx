import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { reservationService } from "../../../services/reservation.service";
import { useBranches } from "../../../hooks/useBranches";
import { toast } from "sonner";
import { User, Phone, Calendar, Clock, Users, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

export function Reservation() {
  const { data: branches } = useBranches();

  const [form, setForm] = useState({
    customerName: "", phone: "", date: "", time: "19:00", partySize: "2",
    branchId: "", specialRequest: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        date: form.date,
        time: form.time,
        partySize: parseInt(form.partySize, 10) || 2,
        branchId: form.branchId || (branches && branches.length > 0 ? branches[0].id : ""),
        specialRequest: form.specialRequest || null,
      };
      return reservationService.createReservation(payload as any);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Reservation submitted! We'll confirm shortly.");
      setForm({ customerName: "", phone: "", date: "", time: "19:00", partySize: "2", branchId: "", specialRequest: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Could not submit reservation. Please try again.");
    },
  });

  const inputContainerCls = "relative w-full group";
  const inputCls = "w-full border text-sm pl-11 pr-4 py-3.5 focus:outline-none transition-all duration-300 placeholder-[#e8dcc8]/40 focus:border-[#d4a843]/80 focus:bg-[rgba(30,16,8,0.5)] rounded-md";
  const inputStyle = {
    fontFamily: "var(--font-lidya-sans)",
    background: "rgba(30,16,8,0.35)",
    borderColor: "rgba(232,220,200,0.15)",
    color: "#f5efe6",
    backdropFilter: "blur(8px)",
  };
  const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a843]/70 group-focus-within:text-[#d4a843] transition-colors w-4 h-4";

  return (
    <section id="reservation" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-[#120a03]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1668840961877-69f589e8d85a?w=1600&h=900&fit=crop&auto=format"
          alt="Restaurant dining hall"
          className="w-full h-full object-cover opacity-[0.18]"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(18,10,3,0.95),rgba(18,10,3,0.75))" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left info */}
          <Reveal className="text-center lg:text-left">
            <p className="text-[#d4a843] text-[10.5px] tracking-[0.4em] uppercase mb-4 font-semibold" style={{ fontFamily: "var(--font-lidya-sans)" }}>Make a Booking</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5efe6] leading-tight mb-6" style={{ fontFamily: "var(--font-lidya-serif)" }}>
              Reserve Your<br /><em className="text-[#d4a843] not-italic font-medium border-b border-[#d4a843]/30 pb-1">Table</em>
            </h2>
            <p className="text-lg leading-relaxed max-w-md mb-12 text-[#e8dcc8]/70 mx-auto lg:mx-0" style={{ fontFamily: "var(--font-lidya-body)" }}>
              Join us for an evening that will stay with you long after the last cup of coffee. Tables fill quickly on performance nights, so advance booking is highly recommended.
            </p>
            
            <div className="space-y-5 bg-[rgba(30,16,8,0.3)] p-6 rounded-lg border border-[#e8dcc8]/10 inline-block text-left w-full max-w-md">
              <h4 className="text-[#f5efe6] font-semibold text-sm tracking-wider uppercase mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>Opening Hours</h4>
              {[
                { I: Icon.Clock, t: "Wolaita Sodo: 7:00 AM – 11:00 PM", href: null },
                { I: Icon.Clock, t: "Addis Ababa: 8:00 AM – 11:30 PM",  href: null },
                { I: Icon.Phone, t: "Direct Line: 0920994499",                              href: "tel:+251920994499" },
              ].map(({ I, t, href }) => (
                <div key={t} className="flex items-center gap-3 text-[15px] text-[#e8dcc8]/70" style={{ fontFamily: "var(--font-lidya-sans)" }}>
                  <span className="text-[#d4a843] w-5"><I /></span>
                  {href
                    ? <a href={href} className="hover:text-[#d4a843] transition-colors">{t}</a>
                    : <span>{t}</span>
                  }
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right form */}
          <Reveal delay={0.15}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="p-10 md:p-14 text-center rounded-xl shadow-2xl relative overflow-hidden"
                  style={{ background: "rgba(20,10,5,0.7)", border: "1px solid rgba(212,168,67,0.3)", backdropFilter: "blur(12px)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a843] to-transparent opacity-50"></div>
                  <CheckCircle2 className="w-16 h-16 text-[#d4a843] mx-auto mb-6" strokeWidth={1.5} />
                  <h3 className="text-[#f5efe6] text-3xl mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>Request Received</h3>
                  <p className="text-[#e8dcc8]/70 leading-relaxed max-w-[280px] mx-auto" style={{ fontFamily: "var(--font-lidya-body)" }}>
                    Thank you. We are preparing your table. You will receive a confirmation message shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={e => { e.preventDefault(); mutation.mutate(); }}
                  className="flex flex-col gap-5 p-6 sm:p-10 rounded-xl shadow-2xl relative"
                  style={{ background: "rgba(20,10,5,0.6)", border: "1px solid rgba(232,220,200,0.08)", backdropFilter: "blur(12px)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent"></div>
                  
                  <h3 className="text-2xl text-[#f5efe6] mb-2 text-center" style={{ fontFamily: "var(--font-lidya-serif)" }}>Reservation Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className={inputContainerCls}>
                      <User className={iconCls} />
                      <input className={inputCls} style={inputStyle} placeholder="Full Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
                    </div>
                    <div className={inputContainerCls}>
                      <Phone className={iconCls} />
                      <input className={inputCls} style={inputStyle} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className={inputContainerCls}>
                      <Calendar className={iconCls} />
                      <input type="date" className={inputCls} style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    </div>
                    <div className={inputContainerCls}>
                      <Clock className={iconCls} />
                      <input type="time" className={inputCls} style={inputStyle} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                    </div>
                    <div className={inputContainerCls}>
                      <Users className={iconCls} />
                      <select className={inputCls} style={inputStyle} value={form.partySize} onChange={e => setForm({ ...form, partySize: e.target.value })}>
                        {[1,2,3,4,5,6,7,8,"9+"].map(n => <option key={n} value={n} className="bg-[#1e1008]">{n} {n === 1 ? "Guest" : "Guests"}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className={inputContainerCls}>
                    <MapPin className={iconCls} />
                    <select className={inputCls} style={inputStyle} value={form.branchId} onChange={e => setForm({ ...form, branchId: e.target.value })}>
                      {branches && branches.length > 0 ? (
                        branches.map(b => <option key={b.id} value={b.id} className="bg-[#1e1008]">{b.name} — {b.label}</option>)
                      ) : (
                        <>
                          <option value="" className="bg-[#1e1008]">Wolaita Sodo — Flagship Branch</option>
                          <option value="" className="bg-[#1e1008]">Addis Ababa — Capital Branch</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className={`${inputContainerCls} items-start`}>
                    <MessageSquare className={`absolute left-4 top-4 text-[#d4a843]/70 group-focus-within:text-[#d4a843] transition-colors w-4 h-4`} />
                    <textarea className={`${inputCls} resize-none !min-h-[100px]`} style={inputStyle} placeholder="Special requests, allergies, or occasions…" value={form.specialRequest} onChange={e => setForm({ ...form, specialRequest: e.target.value })} />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={mutation.isPending}
                    className="mt-4 py-4 text-[12px] tracking-[0.2em] font-semibold uppercase flex items-center justify-center gap-2 disabled:opacity-60 rounded-md overflow-hidden relative group"
                    style={{ fontFamily: "var(--font-lidya-sans)", background: "linear-gradient(to right, #c25e2a, #d4a843)", color: "#120a03" }}
                    whileHover={!mutation.isPending ? { scale: 1.01 } : {}}
                    whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      {mutation.isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Submitting…
                        </>
                      ) : "Confirm Reservation"}
                    </span>
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

