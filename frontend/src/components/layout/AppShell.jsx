"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useDemoAuth } from "@/context/DemoAuthContext";
import CreateDiagramDialog from "./CreateDiagramDialog";

const FlowShellContext = createContext(null);

export function useFlowShell() {
  const context = useContext(FlowShellContext);

  if (!context) {
    throw new Error("useFlowShell must be used within AppShell");
  }

  return context;
}

export default function AppShell({ children, activePath = "/" }) {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useDemoAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function requestLogin() {
    setMobileMenuOpen(false);
    setShowLoginModal(true);
  }

  function requestCreateDiagram() {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      requestLogin();
      return;
    }
    setShowCreateDialog(true);
  }

  function submitSearch(value) {
    const query = value.trim();

    if (!isAuthenticated) {
      requestLogin();
      return;
    }

    router.push(query ? `/workspace?search=${encodeURIComponent(query)}` : "/workspace");
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  const shellActions = {
    requestLogin,
    requestCreateDiagram,
  };

  return (
    <FlowShellContext.Provider value={shellActions}>
      <main className="flex min-h-screen bg-gray-50">
        <Sidebar
          isAuthenticated={isAuthenticated}
          onLoginRequired={requestLogin}
          onCreateDiagram={requestCreateDiagram}
          activePath={activePath}
        />

        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/35 lg:hidden"
            />
            <Sidebar
              mobile
              isAuthenticated={isAuthenticated}
              onLoginRequired={requestLogin}
              onCreateDiagram={requestCreateDiagram}
              onClose={() => setMobileMenuOpen(false)}
              activePath={activePath}
            />
          </>
        )}

        <div className="min-w-0 flex-1">
          <Topbar
            isAuthenticated={isAuthenticated}
            username={user?.name || ""}
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearchSubmit={submitSearch}
            onCreateDiagram={requestCreateDiagram}
            onSignOut={handleSignOut}
          />
          {children}
        </div>
      </main>

      <CreateDiagramDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </FlowShellContext.Provider>
  );
}
