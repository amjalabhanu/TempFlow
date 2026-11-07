
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, X } from "lucide-react";
import { API } from "@/constants/api";

const diagramCategories = [
  "Flowchart",
  "Architecture",
  "Mind map",
  "Cloud",
  "Process",
];

export default function CreateDiagramDialog({ open, onClose }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Flowchart");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a diagram name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API.CREATE_DIAGRAM, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          nodes: [],
          edges: [],
          visibility: "PRIVATE",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create diagram.");
      }

      const diagram = result.data;

      setTitle("");
      setCategory("Flowchart");
      setDescription("");
      onClose();

      router.push(`/diagrams/${diagram.id}/edit`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-diagram-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <FilePlus2 size={24} />
            </div>

            <h2
              id="create-diagram-title"
              className="mt-4 text-xl font-bold text-gray-900"
            >
              Create a new diagram
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Create and save your diagram to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close create diagram dialog"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="diagram-title"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Diagram name
            </label>

            <input
              id="diagram-title"
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Product launch flow"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="diagram-category"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Category
            </label>

            <select
              id="diagram-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {diagramCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="diagram-description"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Description{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <textarea
              id="diagram-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What are you mapping out?"
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create diagram"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
