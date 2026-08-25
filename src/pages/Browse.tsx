import { PackageSearch, PlusCircle } from 'lucide-react';
import type { Category, Resource } from '@/types';
import { CATEGORIES, CATEGORY_MAP } from '@/lib/utils';
import { SearchBar } from '@/components/SearchBar';
import { ResourceCard } from '@/components/ResourceCard';

interface Props {
  resources: Resource[];
  contactedResourceIds: string[];
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: Category | 'all';
  setCategoryFilter: (c: Category | 'all') => void;
  onOpenResource: (id: string) => void;
  onAddResource: () => void;
  onAskCommunity: () => void;
  onClearFilters: () => void;
}

export function Browse({
  resources,
  contactedResourceIds,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  onOpenResource,
  onAddResource,
  onAskCommunity,
  onClearFilters,
}: Props) {
  const filtered = resources.filter((r) => {
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      CATEGORY_MAP[r.category].label.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const hasFilters = search.trim() || categoryFilter !== 'all';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {categoryFilter === 'all' ? 'All Resources' : CATEGORY_MAP[categoryFilter].label}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''} from the campus community
          </p>
        </div>
        <div className="sm:max-w-xs sm:flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search resources..." />
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
            categoryFilter === 'all'
              ? 'bg-brand-500 text-white shadow-soft'
              : 'bg-white text-ink-600 ring-1 ring-brand-100 hover:bg-brand-50'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
              categoryFilter === c.id
                ? 'bg-brand-500 text-white shadow-soft'
                : 'bg-white text-ink-600 ring-1 ring-brand-100 hover:bg-brand-50'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              contacted={contactedResourceIds.includes(r.id)}
              onClick={() => onOpenResource(r.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/70 px-6 py-16 text-center ring-1 ring-brand-100 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
            <PackageSearch size={30} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink-900">Couldn't find that resource.</h3>
            <p className="mt-1 text-sm text-ink-500">Try another search or ask the community.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={onAskCommunity}
              className="rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.02]"
            >
              Ask the Community
            </button>
            {hasFilters && (
              <button
                onClick={onClearFilters}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-600 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
              >
                Clear filters
              </button>
            )}
            <button
              onClick={onAddResource}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-600 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
            >
              <PlusCircle size={15} /> Add Resource
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
