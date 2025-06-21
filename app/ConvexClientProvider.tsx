"use client";
import { ReactNode } from "react";

// ConvexClientProvider is now a passthrough. You can safely remove this file and all references to it if not used elsewhere.
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
