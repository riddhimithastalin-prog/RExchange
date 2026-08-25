import type {
  Availability,
  AvailabilityMeta,
  Category,
  CategoryMeta,
  Urgency,
  UrgencyMeta,
} from '@/types';

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'books',
    label: 'Books & Study Material',
    emoji: '📚',
    subtitle: 'Textbooks, notes, PDFs, question papers',
    gradient: 'from-violet-100 to-brand-100',
    accent: 'text-violet-600',
  },
  {
    id: 'electronics',
    label: 'Electronics & Accessories',
    emoji: '💻',
    subtitle: 'Cables, chargers, adapters, hardware',
    gradient: 'from-sky-100 to-violet-100',
    accent: 'text-sky-600',
  },
  {
    id: 'events',
    label: 'Entertainment & Events',
    emoji: '🎟️',
    subtitle: 'Event tickets, campus fests, passes',
    gradient: 'from-amber-100 to-brand-100',
    accent: 'text-amber-600',
  },
  {
    id: 'giveaway',
    label: 'Give Away / Misc',
    emoji: '🎁',
    subtitle: 'Free items & miscellaneous goodies',
    gradient: 'from-emerald-100 to-brand-100',
    accent: 'text-emerald-600',
  },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<Category, CategoryMeta>,
);

export const AVAILABILITY: AvailabilityMeta[] = [
  { id: 'sale', label: 'For Sale', classes: 'bg-brand-100 text-brand-700 ring-brand-200' },
  { id: 'rent', label: 'For Rent', classes: 'bg-violet-100 text-violet-700 ring-violet-200' },
  { id: 'lending', label: 'Lending', classes: 'bg-sky-100 text-sky-700 ring-sky-200' },
  { id: 'free', label: 'Free', classes: 'bg-emerald-100 text-emerald-700 ring-emerald-200' },
  { id: 'online', label: 'Online', classes: 'bg-amber-100 text-amber-700 ring-amber-200' },
];

export const AVAILABILITY_MAP: Record<Availability, AvailabilityMeta> = AVAILABILITY.reduce(
  (acc, a) => ({ ...acc, [a.id]: a }),
  {} as Record<Availability, AvailabilityMeta>,
);

export const URGENCY: UrgencyMeta[] = [
  { id: 'asap', label: 'ASAP', classes: 'bg-rose-500 text-white ring-rose-300' },
  { id: 'today', label: 'Today', classes: 'bg-orange-500 text-white ring-orange-300' },
  { id: 'week', label: 'This week', classes: 'bg-amber-400 text-ink-900 ring-amber-200' },
];

export const URGENCY_MAP: Record<Urgency, UrgencyMeta> = URGENCY.reduce(
  (acc, u) => ({ ...acc, [u.id]: u }),
  {} as Record<Urgency, UrgencyMeta>,
);

export const URGENCY_DEADLINE: Record<Urgency, string> = {
  asap: 'Needed: Right now',
  today: 'Needed: Today',
  week: 'Needed: This week',
};
