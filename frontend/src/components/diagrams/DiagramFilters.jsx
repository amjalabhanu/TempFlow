import { ArrowDownUp, Search, SlidersHorizontal } from "lucide-react";
import CategoryChips from "./CategoryChips";

export default function DiagramFilters({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search diagrams"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 text-sm font-medium text-gray-500 sm:flex">
            <SlidersHorizontal size={16} />
            Filter
          </div>
          <label className="sr-only" htmlFor="diagram-sort">Sort diagrams</label>
          <div className="relative">
            <ArrowDownUp size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              id="diagram-sort"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-gray-600 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="recent">Recently updated</option>
              <option value="name">Name A–Z</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </div>
      <CategoryChips
        categories={categories}
        activeCategory={activeCategory}
        onChange={onCategoryChange}
      />
    </div>
  );
}
