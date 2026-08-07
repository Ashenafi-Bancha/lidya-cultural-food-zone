import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "sonner";
import { PublicLayout } from "./app/PublicLayout.tsx";
import { HomePage } from "./app/pages/HomePage.tsx";
import "./styles/index.css";

// Secondary public pages are code-split so the homepage stays light.
const MenuPage = lazy(() => import("./app/pages/MenuPage.tsx").then(m => ({ default: m.MenuPage })));
const ServicesPage = lazy(() => import("./app/pages/ServicesPage.tsx").then(m => ({ default: m.ServicesPage })));
const ExperiencePage = lazy(() => import("./app/pages/ExperiencePage.tsx").then(m => ({ default: m.ExperiencePage })));
const AboutPage = lazy(() => import("./app/pages/AboutPage.tsx").then(m => ({ default: m.AboutPage })));

// Lazy-load the admin area so public visitors don't download the admin UI and
// charting library (recharts) as part of the initial marketing-page bundle.
const AdminLayout = lazy(() => import("./admin/AdminLayout.tsx").then(m => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import("./admin/Dashboard.tsx").then(m => ({ default: m.Dashboard })));
const MenuManagement = lazy(() => import("./admin/MenuManagement.tsx").then(m => ({ default: m.MenuManagement })));
const MenuPrint = lazy(() => import("./admin/MenuPrint.tsx").then(m => ({ default: m.MenuPrint })));
const QrTableCard = lazy(() => import("./admin/QrTableCard.tsx").then(m => ({ default: m.QrTableCard })));
const ReservationManagement = lazy(() => import("./admin/ReservationManagement.tsx").then(m => ({ default: m.ReservationManagement })));
const EventBookingManagement = lazy(() => import("./admin/EventBookingManagement.tsx").then(m => ({ default: m.EventBookingManagement })));
const BranchManagement = lazy(() => import("./admin/BranchManagement.tsx").then(m => ({ default: m.BranchManagement })));
const GalleryManagement = lazy(() => import("./admin/GalleryManagement.tsx").then(m => ({ default: m.GalleryManagement })));
const TestimonialManagement = lazy(() => import("./admin/TestimonialManagement.tsx").then(m => ({ default: m.TestimonialManagement })));
const Account = lazy(() => import("./admin/Account.tsx").then(m => ({ default: m.Account })));
const Login = lazy(() => import("./admin/Login.tsx").then(m => ({ default: m.Login })));

const AdminFallback = () => (
  <div className="flex h-screen items-center justify-center bg-[#f5efe6] text-[#7a5c3a] text-sm">
    Loading…
  </div>
);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/gallery" element={<ExperiencePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="menu/print" element={<MenuPrint />} />
              <Route path="menu/qr-card" element={<QrTableCard />} />
              <Route path="reservations" element={<ReservationManagement />} />
              <Route path="events" element={<EventBookingManagement />} />
              <Route path="branches" element={<BranchManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="testimonials" element={<TestimonialManagement />} />
              <Route path="account" element={<Account />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" richColors toastOptions={{ style: { borderRadius: "12px", border: "1px solid rgba(212,168,67,0.5)", fontFamily: "var(--font-lidya-sans)", boxShadow: "0 8px 30px rgba(30,16,8,0.18)" } }} />
    </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);
