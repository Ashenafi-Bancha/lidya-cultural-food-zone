import React from "react";
import { Branches } from "../components/sections/Branches";
import { Contact } from "../components/sections/Contact";
import { usePageMeta } from "../hooks/usePageMeta";

export function BranchesPage() {
  usePageMeta(
    "Our Branches — Lidya Cultural Food Zone",
    "Three Lidya Cultural Food Zone branches: Lebu (Music Sefer) in Addis Ababa, and Green Land Area in Wolaita Sodo. Addresses, phone numbers and directions — call 0920994499.",
    "/branches"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <Branches />
      <Contact />
    </main>
  );
}
