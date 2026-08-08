import React from "react";
import { MenuHero } from "../components/sections/MenuHero";
import { MenuSection } from "../components/sections/MenuSection";
import { usePageMeta } from "../hooks/usePageMeta";

export function MenuPage() {
  usePageMeta(
    "Menu · ምናሌ — Lidya Cultural Food Zone",
    "Full menu of Lidya Cultural Food Zone: kitfo, doro wot, fasting dishes, Lidya specials, traditional drinks and coffee — every dish in English and Amharic with prices in ETB.",
    "/menu"
  );
  // pt clears the fixed header so the hero isn't tucked under it.
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <MenuHero />
      <MenuSection hideHeading />
    </main>
  );
}
