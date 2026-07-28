import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, CheckCircle2 } from "lucide-react";
import { eventBookingService } from "../../services/eventBooking.service";
import { useBranches } from "../../hooks/useBranches";
import { useLang } from "../../context/LanguageContext";
import { EventType } from "../../types/api";

const SERVICE_ORDER: EventType[] = [
  "WEDDING", "ENGAGEMENT", "HALL_RENTAL", "CATERING",
  "CORPORATE", "BIRTHDAY", "VIP", "VVIP", "OTHER",
];

interface Props {
  open: boolean;
  onClose: () => void;
  initialService?: EventType;
}

const EMPTY = {
  customerName: "", phone: "", email: "", serviceType: "OTHER" as EventType,
  eventDate: "", guestCount: "", branchId: "", message: "",
};

export function EventBookingModal({ open, onClose, initialService = "OTHER" }: Props) {
  const { t, tf } = useLang();
  const { data: branches } = useBranches();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  // Reset + preselect the service each time the modal opens.
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, serviceType: initialService });
      setSubmitted(false);
    }
  }, [open, initialService]);

  // Lock background scroll while the modal is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const mutation = useMutation({
    mutationFn: () =>
      eventBookingService.create({
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        serviceType: form.serviceType,
        eventDate: form.eventDate,
        guestCount: form.guestCount ? parseInt(form.guestCount, 10) : null,
        branchId: form.branchId || null,
        message: form.message || null,
      } as any),
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("booking.toastSuccess"));
    },
    onError: (e: any) => toast.error(e.response?.data?.message || t("booking.toastError")),
  });

  const inputCls =
    "w-full border text-sm px-4 py-3 rounded-md focus:outline-none transition-colors focus:border-[#d4a843]/80";
  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-lidya-sans)",
    background: "rgba(30,16,8,0.55)",
    borderColor: "rgba(232,220,200,0.16)",
    color: "#f5efe6",
  };
  const labelCls = "block text-[10px] tracking-[0.2em] uppercase text-[#d4a843]/80 mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg my-8 rounded-xl p-6 sm:p-8 shadow-2xl"
            style={{ background: "#160b04", border: "1px solid rgba(212,168,67,0.25)" }}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-[#e8dcc8]/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-[#d4a843] mx-auto mb-5" strokeWidth={1.5} />
                <h3 className="text-2xl text-[#f5efe6] mb-3" style={{ fontFamily: "var(--font-lidya-serif)" }}>
                  {t("booking.successTitle")}
                </h3>
                <p className="text-[#e8dcc8]/70 leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "var(--font-lidya-body)" }}>
                  {t("booking.successBody")}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 text-[11px] tracking-[0.2em] uppercase rounded-md"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
                >
                  ✓ OK
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="flex flex-col gap-4">
                <div className="mb-1">
                  <h3 className="text-2xl text-[#f5efe6]" style={{ fontFamily: "var(--font-lidya-serif)" }}>{t("booking.title")}</h3>
                  <p className="text-sm text-[#e8dcc8]/55 mt-1" style={{ fontFamily: "var(--font-lidya-body)" }}>{t("booking.subtitle")}</p>
                </div>

                <div>
                  <label className={labelCls}>{t("booking.service")}</label>
                  <select className={inputCls} style={inputStyle} value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value as EventType })} required>
                    {SERVICE_ORDER.map((s) => (
                      <option key={s} value={s} className="bg-[#1e1008]">{t(`booking.services.${s}`)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>{t("booking.name")}</label>
                  <input className={inputCls} style={inputStyle} value={form.customerName} maxLength={100} autoComplete="name" onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t("booking.phone")}</label>
                    <input type="tel" inputMode="tel" autoComplete="tel" maxLength={20} className={inputCls} style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div>
                    <label className={labelCls}>{t("booking.email")}</label>
                    <input type="email" autoComplete="email" maxLength={254} className={inputCls} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t("booking.date")}</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} className={inputCls} style={inputStyle} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
                  </div>
                  <div>
                    <label className={labelCls}>{t("booking.guests")}</label>
                    <input type="number" inputMode="numeric" min={1} max={5000} className={inputCls} style={inputStyle} value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t("booking.branch")}</label>
                  <select className={inputCls} style={inputStyle} value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                    <option value="" className="bg-[#1e1008]">{t("booking.branchNone")}</option>
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#1e1008]">{tf(b, "name")}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>{t("booking.message")}</label>
                  <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`} style={inputStyle} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-2 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold rounded-md disabled:opacity-60"
                  style={{ fontFamily: "var(--font-lidya-sans)", background: "linear-gradient(to right, #c25e2a, #d4a843)", color: "#120a03" }}
                >
                  {mutation.isPending ? t("booking.submitting") : t("booking.submit")}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
