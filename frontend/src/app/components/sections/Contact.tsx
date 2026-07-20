import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { Reveal } from "../Reveal";
import { Icon } from "../Icons";
import { contactService } from "../../../services/contact.service";
import { toast } from "sonner";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => contactService.sendMessage(form as any),
    onSuccess: () => {
      setSent(true);
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Could not send message. Please try again.");
    },
  });

  const inputCls = "w-full border text-sm px-4 py-3 focus:outline-none transition-colors duration-200";
  const inputStyle = {
    fontFamily: "var(--font-lidya-sans)",
    background: "#f5efe6",
    borderColor: "rgba(30,16,8,0.12)",
    color: "#1e1008",
  };

  return (
    <section id="contact" className="bg-[#faf5ee] py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <Reveal className="mb-14 text-center">
          <p className="text-[#c25e2a] text-[10px] tracking-[0.38em] uppercase mb-3" style={{ fontFamily: "var(--font-lidya-sans)" }}>Get in Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e1008] leading-tight" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            We would love<br /><em className="text-[#c25e2a]">to hear from you</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left info */}
          <Reveal className="lg:col-span-2 flex flex-col gap-8">
            <p className="text-sm leading-relaxed text-[#1e1008]/55" style={{ fontFamily: "var(--font-lidya-body)" }}>
              For reservations, private events, catering, media requests, or to share your Lidya experience — we respond within 24 hours.
            </p>
            {[
              { I: Icon.Phone, l: "Call us",  v1: "0920994499",                href1: "tel:+251920994499",           v2: "",                          href2: null },
              { I: Icon.Mail,  l: "Email us", v1: "letusletalemma@gmail.com", href1: "mailto:letusletalemma@gmail.com", v2: "", href2: null },
              { I: Icon.MapPin,l: "Visit us", v1: "Green Land Area, Wolaita Sodo", href1: null,                      v2: "Lebu Area, Addis Ababa",     href2: null },
            ].map(({ I, l, v1, href1, v2, href2 }) => (
              <div key={l} className="flex gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 mt-0.5 text-[#c25e2a]" style={{ background: "rgba(194,94,42,0.1)" }}><I /></div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#7a5c3a] mb-1" style={{ fontFamily: "var(--font-lidya-sans)" }}>{l}</p>
                  {href1
                    ? <a href={href1} className="text-[#1e1008] text-sm hover:text-[#c25e2a] transition-colors" style={{ fontFamily: "var(--font-lidya-sans)" }}>{v1}</a>
                    : <p className="text-[#1e1008] text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>{v1}</p>
                  }
                  {v2 && (href2
                    ? <a href={href2} className="text-sm hover:text-[#c25e2a] transition-colors text-[#1e1008]/60" style={{ fontFamily: "var(--font-lidya-sans)" }}>{v2}</a>
                    : <p className="text-sm text-[#1e1008]/60" style={{ fontFamily: "var(--font-lidya-sans)" }}>{v2}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          {/* Right form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  className="border p-10 text-center"
                  style={{ background: "rgba(212,168,67,0.08)", borderColor: "rgba(212,168,67,0.3)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl text-[#d4a843] mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>✦</div>
                  <h3 className="text-[#1e1008] text-xl font-bold mb-2" style={{ fontFamily: "var(--font-lidya-serif)" }}>Message Sent</h3>
                  <p className="text-sm text-[#7a5c3a]" style={{ fontFamily: "var(--font-lidya-body)" }}>Thank you for reaching out. We will be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={e => { e.preventDefault(); mutation.mutate(); }}
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} placeholder="Your Name"     value={form.name}    onChange={e => setForm({ ...form, name: e.target.value })}    required />
                    <input type="email" className={`${inputCls} col-span-2 sm:col-span-1`} style={inputStyle} placeholder="Email Address" value={form.email}   onChange={e => setForm({ ...form, email: e.target.value })}   required />
                  </div>
                  <input className={inputCls} style={inputStyle} placeholder="Subject"      value={form.subject}  onChange={e => setForm({ ...form, subject: e.target.value })} />
                  <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={5} placeholder="Your message…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  <motion.button
                    type="submit"
                    disabled={mutation.isPending}
                    className="mt-1 flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-60"
                    style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                    whileHover={!mutation.isPending ? { backgroundColor: "#1e1008", color: "#faf5ee" } : {}}
                    whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {mutation.isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Sending…
                      </>
                    ) : (
                      <><Icon.Send /> Send Message</>
                    )}
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

