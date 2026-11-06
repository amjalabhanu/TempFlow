"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useDemoAuth } from "@/context/DemoAuthContext";

export default function Topbar({
  isAuthenticated = false,
  username = "",
  showLoginModal = false,
  setShowLoginModal,
  onOpenMobileMenu,
  onSearchSubmit,
  onSignOut,
}) {
  const { signIn } = useDemoAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isStartingDemo, setIsStartingDemo] = useState(false);

  function openLogin() {
    setShowLoginModal?.(true);
  }

  function handleProtectedAction() {
    if (!isAuthenticated) {
      openLogin();
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    onSearchSubmit?.(searchValue);
  }

  async function handleDemoSignIn() {
    setIsStartingDemo(true);
    await signIn();
    setIsStartingDemo(false);
    setShowLoginModal?.(false);
  }

  function handleSignOut() {
    setShowProfileMenu(false);
    onSignOut?.();
  }

  const avatarLetter = username.trim()
    ? username.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <form
            onSubmit={handleSearch}
            className="flex max-w-md min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4"
          >
            <Search size={19} className="shrink-0 text-gray-400" />
            <label className="sr-only" htmlFor="diagram-search">Search diagrams and projects</label>
            <input
              id="diagram-search"
              type="search"
              placeholder="Search diagrams, projects..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="min-w-0 w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={handleProtectedAction}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600"
          >
            <Bell size={20} />
            {isAuthenticated && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((current) => !current)}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                {avatarLetter}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="truncate font-semibold text-gray-900">{username}</p>
                    <p className="text-xs text-gray-500">FlowSpace demo member</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleProtectedAction}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-4"
            >
              <User size={17} />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </header>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onMouseDown={() => setShowLoginModal?.(false)}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLoginModal?.(false)}
              aria-label="Close login popup"
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <LogIn size={27} />
            </div>

            <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900">
              Login required
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Sign in to manage diagrams and collaborate with your team. This build uses local demo data only.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isStartingDemo}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
              >
                <LogIn size={18} />
                {isStartingDemo ? "Opening demo..." : "Use the demo account"}
              </button>

              <Link
                href="/login"
                onClick={() => setShowLoginModal?.(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Continue to login
              </Link>

              <Link
                href="/register"
                onClick={() => setShowLoginModal?.(false)}
                className="text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Create a demo account
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShowLoginModal?.(false)}
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Maybe later
            </button>
          </section>
        </div>
      )}
    </>
  );
}
