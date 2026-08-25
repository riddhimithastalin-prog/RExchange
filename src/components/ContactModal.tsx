import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Avatar } from '@/components/Avatar';
import { USER_MAP } from '@/lib/seed';
import type { Resource } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export function ContactModal({ open, onClose, resource }: Props) {
  const contributor = resource ? USER_MAP[resource.contributorId] : null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center animate-scale-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-ink-900">Request sent!</h3>
        {contributor && resource && (
          <p className="text-sm text-ink-600 max-w-xs">
            <span className="font-semibold">{contributor.name}</span> will see your request for{" "}
            <span className="font-semibold">"{resource.title}"</span>. They'll get back to you on campus.
          </p>
        )}
        {contributor && (
          <div className="mt-2 flex items-center gap-2.5 rounded-2xl bg-brand-50/70 px-4 py-3 ring-1 ring-brand-100">
            <Avatar user={contributor} size="sm" />
            <div className="text-left">
              <p className="text-sm font-semibold text-ink-900">{contributor.name} {contributor.emoji}</p>
              <p className="text-xs text-ink-500">{contributor.department}</p>
            </div>
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
          <MessageCircle size={13} /> No phone numbers or IDs are ever shared.
        </div>
        <button
          onClick={onClose}
          className="mt-3 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-50"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
