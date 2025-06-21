"use client";
import { ToastProvider } from "@/components/ui/toast";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function AppToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}
