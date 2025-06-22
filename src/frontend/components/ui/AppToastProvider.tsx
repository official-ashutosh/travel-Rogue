"use client";
import { ToastProvider } from "@/frontend/components/ui/toast";
import { ReactNode } from "react";
import { Toaster } from "@/frontend/components/ui/toaster";

export default function AppToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}
