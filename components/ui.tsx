import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Loader2 } from 'lucide-react';

// ============ Button ============
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'coral' | 'lavender' | 'yellow' | 'dark' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-soft active:scale-[0.98]',
  secondary: 'bg-lavender-light text-navy hover:bg-lavender/30',
  outline: 'border-2 border-navy/15 text-navy bg-transparent hover:bg-navy/5',
  ghost: 'text-navy hover:bg-navy/5',
  coral: 'bg-coral text-white hover:bg-coral-soft coral-glow active:scale-[0.98]',
  lavender: 'bg-lavender-deep text-white hover:bg-lavender lavender-glow active:scale-[0.98]',
  yellow: 'bg-yellow text-navy hover:brightness-95 active:scale-[0.98]',
  dark: 'bg-navy text-white hover:bg-navy-soft active:scale-[0.98]',
  white: 'bg-white text-navy hover:bg-cream-dark card-shadow active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2 rounded-xl',
  md: 'text-sm px-5 py-2.5 rounded-2xl',
  lg: 'text-base px-7 py-3.5 rounded-2xl',
  xl: 'text-lg px-8 py-4 rounded-3xl font-bold',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon: Icon, iconRight: IconRight, fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className={cn('w-4 h-4', size === 'lg' && 'w-5 h-5', size === 'xl' && 'w-5 h-5')} />}
        <span>{children}</span>
        {!loading && IconRight && <IconRight className={cn('w-4 h-4', size === 'lg' && 'w-5 h-5')} />}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ============ Card ============
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  tone?: 'white' | 'cream' | 'lavender' | 'coral' | 'yellow' | 'mint' | 'navy';
}

const cardTones: Record<string, string> = {
  white: 'bg-white border border-line',
  cream: 'bg-cream border border-line',
  lavender: 'bg-lavender-light border border-lavender/30',
  coral: 'bg-coral/10 border border-coral/30',
  yellow: 'bg-yellow/20 border border-yellow/50',
  mint: 'bg-mint/15 border border-mint/40',
  navy: 'bg-navy text-white border border-navy',
};
const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export function Card({ children, padding = 'md', hoverable, tone = 'white', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl transition-all duration-300',
        cardTones[tone],
        paddingStyles[padding],
        hoverable && 'hover:card-shadow-lg hover:-translate-y-0.5 cursor-pointer',
        'card-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============ Badge ============
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  tone?: 'coral' | 'lavender' | 'yellow' | 'mint' | 'navy' | 'red' | 'green' | 'gray' | 'ink';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const badgeTones: Record<string, string> = {
  coral: 'bg-coral/15 text-coral',
  lavender: 'bg-lavender-light text-lavender-deep',
  yellow: 'bg-yellow/30 text-yellow-700',
  mint: 'bg-mint-soft text-teal-700',
  navy: 'bg-navy text-white',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-cream-dark text-ink-soft',
  ink: 'bg-ink/10 text-ink',
};

export function Badge({ children, tone = 'gray', size = 'sm', dot, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
        badgeTones[tone],
        className
      )}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

// ============ Progress Bar ============
interface ProgressProps {
  value: number;
  max?: number;
  tone?: 'coral' | 'lavender' | 'yellow' | 'mint' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const progressTones: Record<string, string> = {
  coral: 'bg-coral',
  lavender: 'bg-lavender-deep',
  yellow: 'bg-yellow',
  mint: 'bg-mint',
  navy: 'bg-navy',
};

export function Progress({ value, max = 100, tone = 'coral', size = 'md', showLabel, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-cream-dark rounded-full overflow-hidden',
        size === 'sm' && 'h-1.5', size === 'md' && 'h-2.5', size === 'lg' && 'h-4'
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            progressTones[tone]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <div className="mt-1 text-xs text-ink-soft font-medium">{Math.round(pct)}%</div>}
    </div>
  );
}

// ============ Stat card ============
interface StatCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  tone?: 'white' | 'lavender' | 'coral' | 'yellow' | 'mint' | 'navy';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ value, label, sublabel, tone = 'white', icon: Icon, className }: StatCardProps) {
  const tones: Record<string, string> = {
    white: 'bg-white',
    lavender: 'bg-lavender-light',
    coral: 'bg-coral text-white',
    yellow: 'bg-yellow',
    mint: 'bg-mint-soft',
    navy: 'bg-navy text-white',
  };
  return (
    <div className={cn('rounded-3xl p-5 card-shadow', tones[tone], className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className={cn('text-3xl font-black tracking-tight', tone === 'navy' || tone === 'coral' ? 'text-white' : 'text-navy')}>
            {value}
          </div>
          <div className={cn('text-sm font-medium mt-1', tone === 'navy' || tone === 'coral' ? 'text-white/80' : 'text-ink-soft')}>
            {label}
          </div>
          {sublabel && (
            <div className={cn('text-xs mt-0.5', tone === 'navy' || tone === 'coral' ? 'text-white/60' : 'text-ink-mute')}>
              {sublabel}
            </div>
          )}
        </div>
        {Icon && <Icon className={cn('w-6 h-6', tone === 'navy' || tone === 'coral' ? 'text-white/70' : 'text-ink-mute')} />}
      </div>
    </div>
  );
}

// ============ Avatar ============
interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['bg-coral', 'bg-lavender-deep', 'bg-mint', 'bg-yellow', 'bg-coral-soft'];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover border-2 border-white', sizes[size], className)}
      />
    );
  }
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold text-white', color, sizes[size], className)}>
      {initials}
    </div>
  );
}

// ============ Input ============
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon: Icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold text-navy mb-1.5">{label}</label>}
        <div className="relative">
          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-mute" />}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white rounded-2xl border-2 transition-colors',
              'text-navy placeholder:text-ink-mute font-medium',
              'focus:outline-none focus:border-coral',
              Icon ? 'pl-11 pr-4' : 'pl-4 pr-4',
              error ? 'border-red-400' : 'border-line',
              'py-3 text-base',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-ink-mute">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ============ Textarea ============
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold text-navy mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-white rounded-2xl border-2 transition-colors px-4 py-3',
            'text-navy placeholder:text-ink-mute font-medium resize-none',
            'focus:outline-none focus:border-coral',
            error ? 'border-red-400' : 'border-line',
            className
          )}
          rows={4}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ============ Empty State ============
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-lavender-light flex items-center justify-center mb-6 animate-float-slow">
          <Icon className="w-10 h-10 text-lavender-deep" />
        </div>
      )}
      <h3 className="text-xl font-black text-navy mb-2">{title}</h3>
      <p className="text-ink-soft max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

// ============ Skeleton ============
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-2xl', className)} />;
}

// ============ Tabs ============
interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}
interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}
export function Tabs({ tabs, activeId, onChange, size = 'md', className }: TabsProps) {
  return (
    <div className={cn('inline-flex gap-1 bg-cream-dark p-1.5 rounded-2xl flex-wrap', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'inline-flex items-center gap-2 font-semibold rounded-xl transition-all',
            size === 'sm' ? 'text-sm px-3 py-1.5' : 'text-sm px-4 py-2',
            activeId === tab.id
              ? 'bg-white text-navy card-shadow'
              : 'text-ink-soft hover:text-navy hover:bg-white/60'
          )}
        >
          {tab.icon && <tab.icon className="w-4 h-4" />}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-xs rounded-full px-1.5 py-0.5 font-bold',
              activeId === tab.id ? 'bg-coral/15 text-coral' : 'bg-line text-ink-mute'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============ Section Header ============
interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}
export function SectionHeader({ eyebrow, title, description, align = 'left', className }: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <div className="inline-block text-xs font-black tracking-widest uppercase text-coral mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy tracking-tight text-balance leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
