import { MessageSquarePlus, Siren, Users } from 'lucide-react';
import type { CommunityPost } from '@/types';
import { CommunityPostCard } from '@/components/CommunityPostCard';
import type { Store } from '@/lib/store';

interface Props {
  posts: CommunityPost[];
  store: Store;
  helpedPostIds: string[];
  onOpenResource: (id: string) => void;
  onOfferHelp: (postId: string) => void;
  onCreatePost: () => void;
  onUrgentHelp: () => void;
}

export function Community({
  posts,
  store,
  helpedPostIds,
  onOpenResource,
  onOfferHelp,
  onCreatePost,
  onUrgentHelp,
}: Props) {
  const sorted = [...posts].sort((a, b) => {
    if (a.type === 'urgent' && b.type !== 'urgent') return -1;
    if (a.type !== 'urgent' && b.type === 'urgent') return 1;
    return b.createdAt - a.createdAt;
  });
  const urgentCount = posts.filter((p) => p.type === 'urgent').length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Community</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
            <Users size={15} /> {posts.length} posts · {urgentCount} urgent
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={onCreatePost}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-violet-700 shadow-soft ring-1 ring-violet-100 transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <MessageSquarePlus size={17} /> Create Post
        </button>
        <button
          onClick={onUrgentHelp}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-rose-600 shadow-soft ring-1 ring-rose-100 transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <Siren size={17} /> Urgent Help
        </button>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/70 px-6 py-16 text-center ring-1 ring-brand-100 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
              <Users size={30} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-900">Be the first to start the conversation.</h3>
              <p className="mt-1 text-sm text-ink-500">Share a resource or ask for help.</p>
            </div>
            <button
              onClick={onCreatePost}
              className="rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.02]"
            >
              Create Post
            </button>
          </div>
        ) : (
          sorted.map((p) => (
            <CommunityPostCard
              key={p.id}
              post={p}
              store={store}
              onOpenResource={onOpenResource}
              onOfferHelp={onOfferHelp}
              helped={helpedPostIds.includes(p.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
