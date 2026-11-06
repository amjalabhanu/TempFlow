
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Workflow,
  Network,
  GitBranch,
  Globe,
  Sparkles,
} from "lucide-react";

import AppShell, { useFlowShell } from "@/components/layout/AppShell";
import CategoryChips from "@/components/diagrams/CategoryChips";
import DiagramCarousel from "@/components/diagrams/DiagramCarousel";
import { diagramCategories } from "@/data/mockDiagrams";
import { useDemoAuth } from "@/context/DemoAuthContext";
import { useDemoWorkspace } from "@/context/DemoWorkspaceContext";

function HomeContent() {
  const { isAuthenticated } = useDemoAuth();
  const { diagrams } = useDemoWorkspace();
  const { requestCreateDiagram, requestLogin } = useFlowShell();
  const [activeCategory, setActiveCategory] = useState("all");
  const publishedDiagrams = useMemo(
    () => diagrams.filter((diagram) => (
      diagram.published
      && !diagram.trashed
      && (activeCategory === "all" || diagram.category === activeCategory)
    )),
    [activeCategory, diagrams],
  );

  function startDiagram() {
    if (isAuthenticated) {
      requestCreateDiagram();
      return;
    }

    requestLogin();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 p-6 sm:p-8">

          {/* Hero section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-8 py-12 text-white sm:px-12 sm:py-16">

            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-indigo-100">
                <Sparkles size={16} />
                Think. Visualize. Collaborate.
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
                Turn your ideas into
                <span className="block text-indigo-200">
                  beautiful diagrams.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
                Create flowcharts, system architectures, mind maps,
                and more. Bring your ideas to life with FlowSpace.
              </p>

              <button
                type="button"
                onClick={startDiagram}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
              >
                <Plus size={19} />
                Create your first diagram
              </button>
            </div>

            {/* Decorative icons */}
            <div className="pointer-events-none absolute -right-8 -top-12 hidden h-80 w-80 items-center justify-center rounded-full border border-white/10 md:flex">
              <div className="flex h-60 w-60 items-center justify-center rounded-full border border-white/10">
                <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                  <Workflow size={90} strokeWidth={1.2} />
                </div>
              </div>
            </div>
          </section>

          {/* Quick introduction */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                What do you want to create?
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Start with an idea and turn it into a visual story.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <button
                type="button"
                onClick={startDiagram}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                  <Workflow size={25} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Flowcharts
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Map processes and workflows.
                  </p>
                </div>
                <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </button>

              <button
                type="button"
                onClick={startDiagram}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Network size={25} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Architecture
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Design systems and networks.
                  </p>
                </div>
                <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </button>

              <button
                type="button"
                onClick={startDiagram}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <GitBranch size={25} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Mind Maps
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Organize and connect ideas.
                  </p>
                </div>
                <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </button>

            </div>
          </section>

          {/* Published diagrams */}
          <section>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Globe size={19} className="text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Discover diagrams
                  </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Get inspiration from diagrams shared by the community.
                </p>
              </div>

              <Link
                href="/published"
                className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
              >
                Explore all
                <ArrowRight size={16} />
              </Link>
            </div>

            <CategoryChips
              categories={diagramCategories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />

            <div className="mt-5">
              <DiagramCarousel
                diagrams={publishedDiagrams}
                ariaLabel="Published diagrams"
                emptyMessage="No published diagrams match this category yet."
              />
            </div>
          </section>

    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell activePath="/">
      <HomeContent />
    </AppShell>
  );
}
