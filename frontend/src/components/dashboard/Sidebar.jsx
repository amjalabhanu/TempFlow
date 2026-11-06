"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Globe,
  Home,
  LayoutDashboard,
  Lock,
  Plus,
  Settings,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";

export default function Sidebar({
  isAuthenticated = false,
  onLoginRequired,
  onCreateDiagram,
  activePath = "/",
  mobile = false,
  onClose,
}) {
  const [workspaceOpen, setWorkspaceOpen] = useState(
    activePath.startsWith("/workspace"),
  );

  function requireLogin(event) {
    if (!isAuthenticated) {
      event.preventDefault();
      onLoginRequired?.();
      return true;
    }

    return false;
  }

  function handleNavigation(event, protectedRoute = false) {
    if (protectedRoute && requireLogin(event)) return;
    onClose?.();
  }

  function isActive(href) {
    if (href === "/") return activePath === "/";
    return activePath === href || activePath.startsWith(`${href}/`);
  }

  const workspaceItems = [
    { name: "All diagrams", icon: LayoutDashboard, href: "/workspace" },
    { name: "Recent", icon: Clock3, href: "/workspace/recent" },
    { name: "Private", icon: Lock, href: "/workspace/private" },
  ];

  const navigationItems = [
    { name: "Published", icon: Globe, href: "/published", protectedRoute: false },
    { name: "Shared with me", icon: Users, href: "/shared", protectedRoute: true },
    { name: "Favorites", icon: Star, href: "/favorites", protectedRoute: true },
  ];

  const bottomItems = [
    { name: "Trash", icon: Trash2, href: "/trash", protectedRoute: true },
    { name: "Settings", icon: Settings, href: "/settings", protectedRoute: true },
  ];

  const navClass = "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition";
  const desktopClass = "hidden min-h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:flex";
  const mobileClass = "fixed inset-y-0 left-0 z-[60] flex min-h-screen w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white px-4 py-6 shadow-2xl lg:hidden";

  return (
    <aside className={mobile ? mobileClass : desktopClass}>
      <div className="flex items-center justify-between gap-3">
        <Link href="/" onClick={() => onClose?.()} className="flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            F
          </div>
          <span className="text-xl font-bold text-gray-900">FlowSpace</span>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onCreateDiagram}
        className="mb-8 mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus size={19} />
        Create new diagram
      </button>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Menu</p>

      <nav className="flex w-full flex-col gap-1" aria-label="Primary navigation">
        <Link
          href="/"
          onClick={(event) => handleNavigation(event)}
          className={`${navClass} ${
            isActive("/")
              ? "bg-indigo-50 font-semibold text-indigo-600"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <Home size={19} />
          Home
        </Link>

        <button
          type="button"
          onClick={(event) => {
            if (!isAuthenticated) {
              requireLogin(event);
              return;
            }

            setWorkspaceOpen((current) => !current);
          }}
          className={`${navClass} ${
            activePath.startsWith("/workspace")
              ? "bg-indigo-50 font-semibold text-indigo-600"
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
          aria-expanded={workspaceOpen}
        >
          <LayoutDashboard size={19} />
          <span className="flex-1">My Workspace</span>
          {workspaceOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
        </button>

        {isAuthenticated && workspaceOpen && (
          <div className="ml-5 flex flex-col gap-1 border-l border-gray-200 pl-3">
            {workspaceItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) => handleNavigation(event, true)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive(item.href)
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon size={17} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavigation(event, item.protectedRoute)}
              className={`${navClass} ${
                isActive(item.href)
                  ? "bg-indigo-50 font-semibold text-indigo-600"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex w-full flex-col gap-1 border-t border-gray-100 pt-5">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavigation(event, item.protectedRoute)}
              className={`${navClass} ${
                isActive(item.href)
                  ? "bg-indigo-50 font-semibold text-indigo-600"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
