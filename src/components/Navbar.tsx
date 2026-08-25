import { LayoutDashboard, Users, User, Search, ArrowLeft } from 'lucide-react';
import { AddMenu } from '@/components/AddMenu';

export type View = 'dashboard' | 'browse' | 'detail' | 'community' | 'profile';

interface Props {
  view: View;
  onNav: (v: View) => void;
  onAddResource: () => void;
  onCreatePost: () => void;
  onUrgentHelp: () => void;
  onSearchFocus: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export function Navbar({
  view,
  onNav,
  onAddResource,
  onCreatePost,
  onUrgentHelp,
  onSearchFocus,
  showBack,
  onBack,
}: Props) {
  const links: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => onNav('dashboard')}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-soft">
            <span className="text-base font-extrabold">R</span>
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-sm font-extrabold text-ink-900">RExchange</p>
            <p className="text-[10px] font-semibold text-brand-500 tracking-wide">SRM CAMPUS</p>
          </div>
        </button>

        {/* Back button (detail) */}
        {showBack && (
          <button
            onClick={onBack}
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-brand-100"
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNav(l.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
                view === l.id
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-ink-500 hover:bg-brand-50 hover:text-ink-800'
              }`}
            >
              <l.icon size={16} /> {l.label}
            </button>
          ))}
        </nav>

        {/* Search icon (mobile) */}
        <button
          onClick={onSearchFocus}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-brand-50 md:hidden"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Add */}
        <div className="ml-1 md:ml-2">
          <AddMenu
            onAddResource={onAddResource}
            onCreatePost={onCreatePost}
            onUrgentHelp={onUrgentHelp}
          />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-brand-100 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => onNav(l.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition-colors ${
              view === l.id ? 'text-brand-600' : 'text-ink-400'
            }`}
          >
            <l.icon size={19} /> {l.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
