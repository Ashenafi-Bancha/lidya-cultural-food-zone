import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import { AdminLayout } from "./admin/AdminLayout.tsx";
import { Dashboard } from "./admin/Dashboard.tsx";
import { MenuManagement } from "./admin/MenuManagement.tsx";
import { ReservationManagement } from "./admin/ReservationManagement.tsx";
import { BranchManagement } from "./admin/BranchManagement.tsx";
import { GalleryManagement } from "./admin/GalleryManagement.tsx";
import { Login } from "./admin/Login.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="reservations" element={<ReservationManagement />} />
            <Route path="branches" element={<BranchManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  </QueryClientProvider>
);