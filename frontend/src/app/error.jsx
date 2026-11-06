"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <section className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle size={27} /></div>
        <h1 className="mt-5 text-xl font-bold text-gray-900">Something interrupted this view</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">Try loading the local FlowSpace demo again. No remote data is required.</p>
        <button type="button" onClick={() => reset()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"><RefreshCw size={17} />Try again</button>
      </section>
    </main>
  );
}
