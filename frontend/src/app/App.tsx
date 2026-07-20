import React, { useState } from "react";
import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { AboutUs } from "./components/sections/AboutUs";
import { MenuSection } from "./components/sections/MenuSection";
import { CulturalExperience } from "./components/sections/CulturalExperience";
import { LidyaCoffee } from "./components/sections/LidyaCoffee";
import { Gallery } from "./components/sections/Gallery";
import { Branches } from "./components/sections/Branches";
import { Services } from "./components/sections/Services";
import { Testimonials } from "./components/sections/Testimonials";
import { Reservation } from "./components/sections/Reservation";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";
import { MobileActionBar } from "./components/MobileActionBar";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-background text-foreground overflow-x-hidden pb-24 md:pb-0">
      <Navbar onOpenChange={setMenuOpen} />
      <Hero />
      <AboutUs />
      <MenuSection />
      <CulturalExperience />
      <LidyaCoffee />
      <Gallery />
      <Branches />
      <Services />
      <Testimonials />
      <Reservation />
      <Contact />
      <Footer />
      <MobileActionBar isMenuOpen={menuOpen} />
    </div>
  );
}
