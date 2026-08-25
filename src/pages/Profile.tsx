import { Package, MessageSquare, HeartHandshake, Eye } from 'lucide-react';
import type { CommunityPost, Resource } from '@/types';
import { CURRENT_USER_ID, USER_MAP } from '@/lib/seed';
import { CATEGORY_MAP } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { AvailabilityBadge } from '@/components/Badges';
import { ResourceCard } from '@/components/ResourceCard';

interface Props {
  resources: Resource[];
  posts: CommunityPost[];
  contactedResourceIds: string[];
  helpedPostIds: string[];
  onOpenResource: (id: string) => void;
  onOpenPost: (id: string) => void;
}

export function Profile({
  resources,
  posts,
  contactedResourceIds,
  helpedPostIds,
  onOpenResource,
  onOpenPost,
}: Props) {
  const user = USER_MAP[CURRENT_USER_ID];
  const myResources = resources.filter((r) => r.contributorId === CURRENT_USER_ID);
  const myPosts = posts.filter((p) => p.authorId === CURRENT_USER_ID);
  const helpedCount = helpedPostIds.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Header card */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-100">
        <div className="h-28 bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500" />
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar user={user} size="xl" className="ring-4 ring-white !h-24 !w-24 !text-2xl" />
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
                  {user.name} <span>{user.emoji}</span>
                </h1>
                <p className="text-sm text-ink-500">{user.department}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-600">{user.bio}</p>

          {/* Demo banner */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 ring-1 ring-brand-100">
            <Eye size={15} className="shrink-0 text-brand-500" />
            <p className="text-xs text-ink-600">
              You're exploring RExchange SRM as a <span className="font-semibold text-brand-700">demo / guest account</span>. Resources and posts you create are saved in this browser only.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat icon={<Package size={16} />} label="Resources" value={myResources.length} />
            <Stat icon={<MessageSquare size={16} />} label="Posts" value={myPosts.length} />
            <Stat icon={<HeartHandshake size={16} />} label="Helped" value={helpedCount} />
          </div>
        </div>
      </div>

      {/* My Resources */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
          <Package size={18} className="text-brand-500" /> My Resources
        </h2>
        {myResources.length === 0 ? (
          <EmptyBlock text="You haven't listed any resources yet." />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myResources.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                contacted={contactedResourceIds.includes(r.id)}
                onClick={() => onOpenResource(r.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* My Posts */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
          <MessageSquare size={18} className="text-violet-500" /> My Posts
        </h2>
        {myPosts.length === 0 ? (
          <EmptyBlock text="You haven't posted in the community yet." />
        ) : (
          <div className="mt-4 space-y-3">
            {myPosts.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpenPost(p.id)}
                className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-soft ring-1 ring-brand-100 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    p.type === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'
                  }`}
                >
                  {p.type === 'urgent' ? <HeartHandshake size={16} /> : <MessageSquare size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase ${p.type === 'urgent' ? 'text-rose-600' : 'text-violet-600'}`}>
                      {p.type === 'urgent' ? 'Urgent Help' : 'Discussion'}
                    </span>
                    {p.type === 'urgent' && p.category && (
                      <span className="text-xs text-ink-400">· {CATEGORY_MAP[p.category].emoji}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900 line-clamp-2">
                    {p.type === 'urgent' ? `🚨 Need ${p.need}` : p.text}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-ink-400">
                    <span>{p.comments.length} comments</span>
                    {p.type === 'urgent' && <span>{p.helpOffers.length} offers</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-brand-50/60 p-3 text-center ring-1 ring-brand-100/70">
      <div className="flex items-center justify-center text-brand-500">{icon}</div>
      <p className="mt-1 text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-white/70 p-8 text-center text-sm text-ink-500 ring-1 ring-brand-100">
      {text}
    </div>
  );
}
