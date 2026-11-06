"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import DiagramCard from "./DiagramCard";

export default function DiagramCarousel({ diagrams, ariaLabel, emptyMessage = "Nothing to show yet." }) {
  const carouselRef = useRef(null);

  function scrollCarousel(direction) {
    carouselRef.current?.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  }

  if (!diagrams.length) {
    return <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {diagrams.map((diagram) => (
          <div key={diagram.id} className="w-[280px] shrink-0 snap-start sm:w-[310px]">
            <DiagramCard diagram={diagram} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center sm:flex">
        <div className="pointer-events-auto flex gap-2 rounded-xl border border-gray-200 bg-white/95 p-1.5 shadow-md backdrop-blur">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Show previous diagrams"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Show more diagrams"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
