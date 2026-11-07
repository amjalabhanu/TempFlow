"use client";

import { DemoAuthProvider } from "@/context/DemoAuthContext";
import { DemoWorkspaceProvider } from "@/context/DemoWorkspaceContext";

export default function ClientProviders({ children }) {
  return (
    <DemoAuthProvider>
      <DemoWorkspaceProvider>{children}</DemoWorkspaceProvider>
    </DemoAuthProvider>
  );
}
