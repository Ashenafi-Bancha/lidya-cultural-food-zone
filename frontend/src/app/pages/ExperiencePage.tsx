import React from "react";
import { CulturalExperience } from "../components/sections/CulturalExperience";
import { Gallery } from "../components/sections/Gallery";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * "Experience" — the cultural experience and the photo gallery on one page,
 * since both answer the same question: what is it like to be at Lidya?
 */
export function ExperiencePage() {
  usePageMeta(
    "Gallery & Cultural Experience — Lidya Cultural Food Zone",
    "See the Lidya experience: traditional coffee ceremonies, cultural performances, mesob dining and our dishes — a photo gallery of Ethiopian culture at its warmest.",
    "/gallery"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <CulturalExperience />
      <Gallery />
    </main>
  );
}
