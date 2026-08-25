import { useEffect, useRef, useState } from 'react';
import { Plus, Package, MessageSquarePlus, Siren, X } from 'lucide-react';

interface Props {
  onAddResource: () => void;
  onCreatePost: () => void;
  onUrgentHelp: () => void;
}

export function AddMenu({ onAddResource, onCreatePost, onUrgentHelp }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const items = [
    {
      label: 'Add Resource',
      desc: 'List something to sell, lend, or give away',
      icon: Package,
      color: 'bg-brand-100 text-brand-600',
      onClick: onAddResource,
    },
    {
      label: 'Create Community Post',
      desc: 'Start a discussion in the feed',
      icon: MessageSquarePlus,
      color: 'bg-violet-100 text-violet-600',
      onClick: onCreatePost,
    },
    {
      label: 'Urgent Quick Help',
      desc: 'Ask the community for help, fast',
      icon: Siren,
      color: 'bg-rose-100 text-rose-600',
      onClick: onUrgentHelp,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.02] active:scale-95"
      >
        <Plus size={18} className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
        <span className="hidden sm:inline">Add</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30 sm:hidden" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-2 w-72 origin-top-right rounded-2xl bg-white p-2 shadow-lift ring-1 ring-brand-100 animate-scale-in">
            <div className="flex items-center justify-between px-3 py-2 sm:hidden">
              <span className="text-sm font-bold text-ink-900">Create</span>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-700">
                <X size={16} />
              </button>
            </div>
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-50"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{item.label}</p>
                  <p className="text-xs text-ink-500 truncate">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
