import React from "react";
import { MenuHero } from "../components/sections/MenuHero";
import { MenuSection } from "../components/sections/MenuSection";

export function MenuPage() {
  // pt clears the fixed header so the hero isn't tucked under it.
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <MenuHero />
      <MenuSection hideHeading />
    </main>
  );
}
