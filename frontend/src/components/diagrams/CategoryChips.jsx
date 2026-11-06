"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function CategoryChips({ categories, activeCategory, onChange }) {
  const chipsRef = useRef(null);

  function scrollCategories(direction) {
    chipsRef.current?.scrollBy({
      left: direction * 220,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollCategories(-1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:flex"
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={chipsRef}
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onChange(category.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {Icon && <Icon size={16} />}
              {category.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollCategories(1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:flex"
        aria-label="Scroll categories right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
