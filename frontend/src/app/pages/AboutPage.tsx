import React from "react";
import { AboutUs } from "../components/sections/AboutUs";
import { usePageMeta } from "../hooks/usePageMeta";

export function AboutPage() {
  usePageMeta(
    "About Us — Lidya Cultural Food Zone",
    "The story of Lidya Cultural Food Zone — celebrating Ethiopia's cultural cuisines and hospitality across three branches in Addis Ababa and Wolaita Sodo.",
    "/about"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <AboutUs />
    </main>
  );
}
