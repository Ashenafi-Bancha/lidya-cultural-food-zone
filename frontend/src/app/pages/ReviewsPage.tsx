import React from "react";
import { Testimonials } from "../components/sections/Testimonials";
import { usePageMeta } from "../hooks/usePageMeta";

export function ReviewsPage() {
  usePageMeta(
    "Guest Reviews — Lidya Cultural Food Zone",
    "What guests say about Lidya Cultural Food Zone — reviews of our Ethiopian cultural dishes, coffee ceremonies and hospitality across our Addis Ababa and Wolaita Sodo branches.",
    "/reviews"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <Testimonials />
    </main>
  );
}
