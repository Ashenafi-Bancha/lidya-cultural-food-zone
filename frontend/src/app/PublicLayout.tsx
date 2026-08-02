import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "./components/sections/Navbar";
import { Footer } from "./components/sections/Footer";
import { ScrollManager } from "./components/ScrollManager";

/** Shared shell for every public page: fixed navbar, page content, footer. */
export function PublicLayout() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden pb-8 md:pb-0">
      <ScrollManager />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
