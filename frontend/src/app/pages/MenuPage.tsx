import React from "react";
import { MenuSection } from "../components/sections/MenuSection";

export function MenuPage() {
  // pt clears the fixed header so the section title isn't tucked under it.
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <MenuSection />
    </main>
  );
}
