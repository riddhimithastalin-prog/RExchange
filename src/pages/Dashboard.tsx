import { ArrowRight, Siren, Sparkles } from 'lucide-react';
import type { CommunityPost, Resource } from '@/types';
import { USER_MAP, CURRENT_USER_ID } from '@/lib/seed';
import { CATEGORIES, CATEGORY_MAP, URGENCY_DEADLINE, URGENCY_MAP } from '@/lib/utils';
import { SearchBar } from '@/components/SearchBar';
import { Avatar } from '@/components/Avatar';
import { ResourceCard } from '@/components/ResourceCard';

interface Props {
  resources: Resource[];
  posts: CommunityPost[];
  contactedResourceIds: string[];
  search: string;
  setSearch: (v: string) => void;
  onOpenResource: (id: string) => void;
  onOpenPost: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onSeeAllUrgent: () => void;
}

export function Dashboard({
  resources,
  posts,
  contactedResourceIds,
  search,
  setSearch,
  onOpenResource,
  onOpenPost,
  onSelectCategory,
  onSeeAllUrgent,
}: Props) {
  const currentUser = USER_MAP[CURRENT_USER_ID];
  const urgentPosts = posts.filter((p) => p.type === 'urgent').slice(0, 3);
  const featured = resources.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Welcome */}
      <div className="animate-slide-up">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-100">
          <Sparkles size={13} /> Campus Resource Exchange
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Welcome, {currentUser.name.split(' ')[0]} <span className="inline-block">{currentUser.emoji}</span>
        </h1>
        <p className="mt-2 max-w-xl text-base text-ink-500">
          Find something you need. Share something you don't. Help someone nearby.
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-2xl animate-slide-up" style={{ animationDelay: '60ms' }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={'Search "USB-C cable", "DSA textbook", "concert ticket"...'}
        />
      </div>

      {/* Urgent Right Now */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900 sm:text-xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <Siren size={16} />
            </span>
            Urgent Right Now
          </h2>
          <button
            onClick={onSeeAllUrgent}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            See all →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {urgentPosts.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white/70 p-6 text-center text-sm text-ink-500 ring-1 ring-brand-100">
              No urgent requests right now. The campus is all caught up. 🎉
            </div>
          )}
          {urgentPosts.map((p) => {
            const author = USER_MAP[p.authorId];
            const u = p.urgency ? URGENCY_MAP[p.urgency] : null;
            return (
              <button
                key={p.id}
                onClick={() => onOpenPost(p.id)}
                className="group flex flex-col gap-3 rounded-3xl bg-gradient-to-b from-rose-50/80 to-white p-5 text-left shadow-soft ring-1 ring-rose-200 transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">
                    <Siren size={12} /> URGENT
                  </span>
                  {u && <span className={`inline-flex items-center rounded-full font-bold ring-1 text-[11px] px-2.5 py-1 ${u.classes}`}>{u.label}</span>}
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink-900 leading-snug">🚨 Need {p.need}</h3>
                  <p className="mt-1 text-sm text-ink-600 line-clamp-2">{p.why ?? p.text}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Avatar user={author} size="xs" />
                    <span className="text-xs font-medium text-ink-600">{author.name.split(' ')[0]}</span>
                    {p.category && <span className="text-xs text-ink-400">· {CATEGORY_MAP[p.category].emoji}</span>}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:gap-1.5 transition-all">
                    View <ArrowRight size={13} />
                  </span>
                </div>
                {p.urgency && (
                  <p className="text-[11px] font-medium text-rose-500">{URGENCY_DEADLINE[p.urgency]}</p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink-900 sm:text-xl">Browse by category</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const count = resources.filter((r) => r.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.gradient} p-5 text-left shadow-soft ring-1 ring-white/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <h3 className="mt-3 text-base font-bold text-ink-900 leading-snug">{c.label}</h3>
                <p className="mt-1 text-xs text-ink-600">{c.subtitle}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-500">{count} item{count !== 1 ? 's' : ''}</span>
                  <span className={`inline-flex items-center gap-1 text-sm font-bold ${c.accent} group-hover:gap-1.5 transition-all`}>
                    Browse <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured resources */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900 sm:text-xl">Recently shared</h2>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              contacted={contactedResourceIds.includes(r.id)}
              onClick={() => onOpenResource(r.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
