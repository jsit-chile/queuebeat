import { NavLink } from 'react-router-dom';
import { QrCode, Search, Headphones, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { Logo } from './Logo';

const tabs = [
  { to: '/', label: 'Sala', icon: QrCode, end: true },
  { to: '/search', label: 'Buscar', icon: Search },
  { to: '/dj', label: 'DJ', icon: Headphones },
  { to: '/user', label: 'Usuario', icon: Smartphone },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <Logo />

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1 overflow-x-auto">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-grad text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                )
              }
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full text-[11px] text-green-400">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-blink" />
          EN VIVO
        </div>
      </div>
    </nav>
  );
}
