import React from "react";
import { Services } from "../components/sections/Services";
import { usePageMeta } from "../hooks/usePageMeta";

export function ServicesPage() {
  usePageMeta(
    "Services & Events — Lidya Cultural Food Zone",
    "Weddings, engagements, catering anywhere in Ethiopia, corporate events, birthdays, anniversaries, product launches and national holiday celebrations — plus VIP and VVIP private dining.",
    "/services"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <Services />
    </main>
  );
}
