import React from "react";
import { CulturalExperience } from "../components/sections/CulturalExperience";
import { Gallery } from "../components/sections/Gallery";

/**
 * "Experience" — the cultural experience and the photo gallery on one page,
 * since both answer the same question: what is it like to be at Lidya?
 */
export function ExperiencePage() {
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <CulturalExperience />
      <Gallery />
    </main>
  );
}
