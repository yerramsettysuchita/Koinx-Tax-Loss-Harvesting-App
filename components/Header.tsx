import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

function KoinXLogo() {
  return (
    <a href="/" className="flex items-center gap-0.5 select-none" aria-label="KoinX home">
      <span className="text-2xl font-bold tracking-tight" style={{ color: '#0052FE' }}>
        Koin<span className="italic" style={{ color: '#F7931A' }}>X</span>
      </span>
      <sup className="text-[10px] font-normal text-text-mute leading-none mt-1">®</sup>
    </a>
  );
}

export function Header() {
  return (
    <header className="bg-card border-b border-border transition-colors">
      <div className="max-w-300 mx-auto px-4 sm:px-8 h-14 sm:h-18 flex items-center justify-between gap-6">
        <KoinXLogo />
        {/* Desktop: theme toggle */}
        <div className="hidden sm:flex">
          <ThemeToggle />
        </div>
        {/* Mobile: hamburger menu */}
        <button
          type="button"
          aria-label="Open menu"
          className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-mute hover:text-text hover:bg-row-hover transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
