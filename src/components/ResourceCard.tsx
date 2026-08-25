import { MapPin } from 'lucide-react';
import type { Resource } from '@/types';
import { USER_MAP } from '@/lib/seed';
import { AVAILABILITY_MAP, CATEGORY_MAP } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { AvailabilityBadge } from '@/components/Badges';

interface Props {
  resource: Resource;
  contacted?: boolean;
  onClick: () => void;
}

export function ResourceCard({ resource, contacted, onClick }: Props) {
  const contributor = USER_MAP[resource.contributorId];
  const avail = AVAILABILITY_MAP[resource.availability];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-soft ring-1 ring-brand-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:ring-brand-200"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
        <img
          src={resource.image}
          alt={resource.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`inline-flex items-center rounded-full font-semibold ring-1 ${avail.classes} text-xs px-2.5 py-1 backdrop-blur`}>
            {avail.label}
          </span>
        </div>
        {contacted && (
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
            Request sent
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <p className="text-[11px] font-medium text-ink-400">{CATEGORY_MAP[resource.category].emoji} {CATEGORY_MAP[resource.category].label}</p>
          <h3 className="mt-0.5 text-base font-bold leading-snug text-ink-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {resource.title}
          </h3>
        </div>
        <p className="text-sm text-ink-500 line-clamp-2">{resource.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar user={contributor} size="xs" />
            <span className="text-xs font-medium text-ink-600">{contributor?.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {resource.price != null ? (
              <span className="text-sm font-bold text-brand-600">₹{resource.price}</span>
            ) : resource.availability === 'free' ? (
              <span className="text-sm font-bold text-emerald-600">Free</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={12} /> {resource.location.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
