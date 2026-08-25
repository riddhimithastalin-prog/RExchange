import { ArrowLeft, MapPin, Package, Share2, MessageCircle, CheckCircle2, Tag } from 'lucide-react';
import type { Resource } from '@/types';
import { USER_MAP } from '@/lib/seed';
import { AVAILABILITY_MAP, CATEGORY_MAP } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';
import { AvailabilityBadge, CategoryBadge } from '@/components/Badges';
import { useToast } from '@/components/Toast';

interface Props {
  resource: Resource;
  contacted: boolean;
  onBack: () => void;
  onContact: () => void;
}

export function ResourceDetail({ resource, contacted, onBack, onContact }: Props) {
  const contributor = USER_MAP[resource.contributorId];
  const avail = AVAILABILITY_MAP[resource.availability];
  const { toast } = useToast();

  const share = () => {
    const url = `${window.location.origin}/?resource=${resource.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      toast({ kind: 'info', title: 'Link copied!', message: 'Share it with a friend.' });
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-3xl bg-brand-50 shadow-card ring-1 ring-brand-100">
            <img src={resource.image} alt={resource.title} className="aspect-[16/10] w-full object-cover" />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className={`inline-flex items-center rounded-full font-semibold ring-1 ${avail.classes} text-sm px-3 py-1.5 backdrop-blur`}>
                {avail.label}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <CategoryBadge category={resource.category} />
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
              {resource.title}
            </h1>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
            <p className="text-sm text-ink-600 leading-relaxed">{resource.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon={<Package size={15} />} label="Condition" value={resource.condition} />
            <InfoTile icon={<MapPin size={15} />} label="Location" value={resource.location} />
            <InfoTile
              icon={<Tag size={15} />}
              label="Availability"
              value={<AvailabilityBadge availability={resource.availability} />}
            />
            {resource.price != null && (
              <InfoTile
                icon={<span className="text-xs font-bold">₹</span>}
                label="Price"
                value={<span className="text-lg font-bold text-brand-600">₹{resource.price}</span>}
              />
            )}
          </div>

          {/* Contributor */}
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100">
            <Avatar user={contributor} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-900">{contributor.name} {contributor.emoji}</p>
              <p className="text-xs text-ink-500">{contributor.department}</p>
              <p className="text-xs text-ink-400 mt-1 truncate">{contributor.bio}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onContact}
              disabled={contacted}
              className={`w-full rounded-full py-3.5 text-sm font-bold transition-all active:scale-[0.99] ${
                contacted
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'bg-gradient-to-r from-brand-500 to-violet-500 text-white shadow-soft hover:shadow-lift hover:scale-[1.01]'
              }`}
            >
              {contacted ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <CheckCircle2 size={17} /> Request sent to {contributor.name.split(' ')[0]}
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <MessageCircle size={17} /> Contact Contributor
                </span>
              )}
            </button>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-ink-600 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
            >
              <Share2 size={15} /> Share
            </button>
            <p className="text-center text-xs text-ink-400">
              No phone numbers or IDs are shared. Connect safely on campus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-brand-100">
      <p className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
        <span className="text-brand-400">{icon}</span> {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-ink-900">{value}</div>
    </div>
  );
}
