import type { Availability, Category, Urgency } from '@/types';
import { AVAILABILITY_MAP, CATEGORY_MAP, URGENCY_MAP } from '@/lib/utils';

export function AvailabilityBadge({ availability, size = 'md' }: { availability: Availability; size?: 'sm' | 'md' }) {
  const meta = AVAILABILITY_MAP[availability];
  const sz = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ring-1 ${meta.classes} ${sz}`}>
      {meta.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  const meta = CATEGORY_MAP[category];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 text-xs font-medium text-ink-600 px-2.5 py-1 ring-1 ring-brand-100">
      <span>{meta.emoji}</span> {meta.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const meta = URGENCY_MAP[urgency];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ring-1 ${meta.classes} text-[11px] px-2.5 py-1`}>
      {meta.label}
    </span>
  );
}
