import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, placeholder, autoFocus, onClear }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search
        size={18}
        className="absolute left-4 text-ink-400 pointer-events-none shrink-0"
      />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search resources...'}
        className="w-full rounded-full border-0 bg-white py-3.5 pl-11 pr-10 text-sm text-ink-900 placeholder:text-ink-400 shadow-soft ring-1 ring-brand-100 transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-card"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:bg-brand-50 hover:text-ink-700 transition-colors"
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
