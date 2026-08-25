import type { User } from '@/types';

interface AvatarProps {
  user?: User;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'h-7 w-7 text-[11px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  if (!user) {
    return (
      <div
        className={`${sizes[size]} ${className} flex items-center justify-center rounded-full bg-brand-100 text-brand-400 font-semibold`}
      >
        ?
      </div>
    );
  }
  return (
    <div
      className={`${sizes[size]} ${className} ${user.color} flex items-center justify-center rounded-full text-white font-bold shadow-soft ring-2 ring-white`}
    >
      {user.initials}
    </div>
  );
}

export function AvatarWithEmoji({ user, size = 'md' }: AvatarProps) {
  if (!user) return <Avatar user={user} size={size} />;
  return (
    <div className="flex items-center gap-2.5">
      <Avatar user={user} size={size} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate flex items-center gap-1">
          {user.name} <span>{user.emoji}</span>
        </p>
        <p className="text-xs text-ink-500 truncate">{user.department}</p>
      </div>
    </div>
  );
}
