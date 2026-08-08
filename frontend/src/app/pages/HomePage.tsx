import React from "react";
import { Hero } from "../components/sections/Hero";
import { QuickLinks } from "../components/sections/QuickLinks";
import { MenuSection } from "../components/sections/MenuSection";
import { Services } from "../components/sections/Services";
import { LidyaCoffee } from "../components/sections/LidyaCoffee";
import { Branches } from "../components/sections/Branches";
import { Testimonials } from "../components/sections/Testimonials";
import { Reservation } from "../components/sections/Reservation";
import { Contact } from "../components/sections/Contact";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * Homepage — a short highlight reel. Quick links sit right under the hero so
 * guests reach any part of the site in one tap; menu and services show a
 * preview with a link to their full page.
 */
export function HomePage() {
  usePageMeta(
    "Lidya Cultural Food Zone — Authentic Ethiopian Cultural Cuisine",
    "Lidya Cultural Food Zone (ሊዲያ የባህል ምግብ ዞን) celebrates the cultural cuisines of Ethiopia with traditional coffee ceremonies. Reserve a table at our Wolaita Sodo and Addis Ababa branches.",
    "/"
  );
  return (
    <>
      <Hero />
      <QuickLinks />
      <MenuSection preview />
      <Services preview />
      <LidyaCoffee />
      <Branches />
      <Testimonials />
      <Reservation />
      <Contact />
    </>
  );
}
