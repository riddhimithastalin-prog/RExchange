import { Instagram, Mail, MessageCircle } from 'lucide-react';
import type { DemoContactDetail } from '@/lib/seed';
import type { ContactMethodId } from '@/types';

const ICONS: Record<ContactMethodId, typeof Mail> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  email: Mail,
};

interface Props {
  methods: DemoContactDetail[];
  emptyHint: string;
}

export function ContactOptions({ methods, emptyHint }: Props) {
  if (methods.length === 0) {
    return (
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-400">
        <MessageCircle size={13} /> {emptyHint}
      </p>
    );
  }

  return (
    <div className="mt-3 w-full space-y-2 text-left">
      <p className="text-center text-[11px] font-bold uppercase tracking-wide text-ink-400">
        Available contact options
      </p>
      {methods.map((m) => {
        const Icon = ICONS[m.id];
        return (
          <a
            key={m.id}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-brand-50/70 px-4 py-3 ring-1 ring-brand-100 transition-colors hover:bg-brand-100/80"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-100">
              <Icon size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink-900">{m.label}</span>
              <span className="block truncate text-xs text-ink-500">{m.display}</span>
            </span>
          </a>
        );
      })}
      <p className="text-center text-[11px] text-ink-400">Demo values only. No real personal info is shared.</p>
    </div>
  );
}
