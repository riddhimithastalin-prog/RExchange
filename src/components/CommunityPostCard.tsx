import { useState } from 'react';
import { Clock, Link2, MapPin, MessageSquare, Send, Share2, Siren, HeartHandshake } from 'lucide-react';
import type { CommunityPost } from '@/types';
import { USER_MAP, CURRENT_USER_ID } from '@/lib/seed';
import { CATEGORY_MAP, timeAgo, URGENCY_DEADLINE, URGENCY_MAP } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { UrgencyBadge } from '@/components/Badges';
import type { Store } from '@/lib/store';
import { useToast } from '@/components/Toast';

interface Props {
  post: CommunityPost;
  store: Store;
  onOpenResource?: (id: string) => void;
  onOfferHelp: (postId: string) => void;
  helped: boolean;
}

export function CommunityPostCard({ post, store, onOpenResource, onOfferHelp, helped }: Props) {
  const author = USER_MAP[post.authorId];
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isUrgent = post.type === 'urgent';

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    store.addComment(post.id, text);
    setCommentText('');
    setShowComments(true);
  };

  const share = () => {
    const url = `${window.location.origin}/?post=${post.id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        toast({ kind: 'info', title: 'Link copied!', message: 'Share it with a friend.' });
        setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  };

  return (
    <article
      className={`overflow-hidden rounded-3xl bg-white p-5 shadow-soft ring-1 transition-all hover:shadow-card ${
        isUrgent ? 'ring-rose-200 bg-gradient-to-b from-rose-50/60 to-white' : 'ring-brand-100/60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar user={author} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-ink-900">{author.name}</span>
            <span>{author.emoji}</span>
            <span className="text-xs text-ink-400">· {timeAgo(post.createdAt)}</span>
          </div>
          <p className="text-xs text-ink-500">{author.department}</p>
        </div>
        {isUrgent ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft animate-pulse-ring">
            <Siren size={13} /> URGENT
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
            <MessageSquare size={13} /> Discussion
          </span>
        )}
      </div>

      {/* Body */}
      <div className="mt-4">
        {isUrgent ? (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-ink-900 leading-snug">
              🚨 Need {post.need}
            </h3>
            <p className="text-sm text-ink-600">{post.why ?? post.text}</p>
            {post.image && (
              <div className="overflow-hidden rounded-2xl ring-1 ring-rose-100">
                <img src={post.image} alt="Post attachment" className="aspect-[16/9] w-full object-cover" loading="lazy" />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {post.urgency && <UrgencyBadge urgency={post.urgency} />}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                <Clock size={13} /> {post.urgency ? URGENCY_DEADLINE[post.urgency] : ''}
              </span>
              {post.category && (
                <span className="text-xs text-ink-500">
                  {CATEGORY_MAP[post.category].emoji} {CATEGORY_MAP[post.category].label}
                </span>
              )}
            </div>
            {post.location && (
              <p className="inline-flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={12} /> {post.location}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[15px] text-ink-700 leading-relaxed">{post.text}</p>
            {post.image && (
              <div className="overflow-hidden rounded-2xl ring-1 ring-brand-100">
                <img src={post.image} alt="Post attachment" className="aspect-[16/9] w-full object-cover" loading="lazy" />
              </div>
            )}
            {post.resourceLink && onOpenResource && (
              <button
                onClick={() => onOpenResource(post.resourceLink!)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Link2 size={15} /> View linked resource
              </button>
            )}
          </div>
        )}
      </div>

      {/* Help offers (urgent) */}
      {isUrgent && post.helpOffers.length > 0 && (
        <div className="mt-4 space-y-2 rounded-2xl bg-emerald-50/70 p-3 ring-1 ring-emerald-100">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            {post.helpOffers.length} offer{post.helpOffers.length > 1 ? 's' : ''} to help 🙌
          </p>
          {post.helpOffers.map((o) => {
            const oAuthor = USER_MAP[o.authorId];
            return (
              <div key={o.id} className="flex items-start gap-2.5">
                <Avatar user={oAuthor} size="xs" />
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {oAuthor.name} offered
                    {o.authorId === CURRENT_USER_ID && <span className="text-brand-600"> (you)</span>}
                  </p>
                  {o.message && <p className="text-sm text-ink-600 italic">"{o.message}"</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isUrgent ? (
          <button
            onClick={() => onOfferHelp(post.id)}
            disabled={helped}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
              helped
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-soft hover:shadow-lift hover:scale-[1.02]'
            }`}
          >
            <HeartHandshake size={16} />
            {helped ? 'You offered to help! 🙌' : 'I CAN HELP 🙌'}
          </button>
        ) : (
          <button
            onClick={() => setShowComments((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            <MessageSquare size={15} />
            {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}
          </button>
        )}
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-600 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
        >
          <Share2 size={15} /> {copied ? 'Copied!' : 'Share'}
        </button>
        {isUrgent && (
          <button
            onClick={() => setShowComments((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-600 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
          >
            <MessageSquare size={15} /> {post.comments.length}
          </button>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3 border-t border-brand-50 pt-4 animate-slide-up">
          {post.comments.length === 0 && (
            <p className="text-sm text-ink-400">No comments yet. Start the conversation!</p>
          )}
          {post.comments.map((c) => {
            const cAuthor = USER_MAP[c.authorId];
            return (
              <div key={c.id} className="flex items-start gap-2.5">
                <Avatar user={cAuthor} size="xs" />
                <div className="flex-1 rounded-2xl rounded-tl-sm bg-brand-50/70 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-ink-900">
                      {cAuthor.name.split(' ')[0]}
                      {c.authorId === CURRENT_USER_ID && <span className="text-brand-600"> (you)</span>}
                    </span>
                    <span className="text-[11px] text-ink-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-ink-700 mt-0.5">{c.text}</p>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-0 bg-brand-50/60 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 ring-1 ring-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:bg-brand-600 disabled:opacity-40 active:scale-90"
              aria-label="Send comment"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
