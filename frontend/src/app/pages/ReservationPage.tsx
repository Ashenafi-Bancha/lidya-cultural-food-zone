import React from "react";
import { Reservation } from "../components/sections/Reservation";
import { usePageMeta } from "../hooks/usePageMeta";

export function ReservationPage() {
  usePageMeta(
    "Reserve a Table — Lidya Cultural Food Zone",
    "Book your table at Lidya Cultural Food Zone online — choose your branch in Addis Ababa or Wolaita Sodo, pick a date and time, and get an email confirmation. Traditional Ethiopian dining with coffee ceremonies.",
    "/reservation"
  );
  return (
    <main className="pt-[64px] lg:pt-[66px]">
      <Reservation />
    </main>
  );
}
