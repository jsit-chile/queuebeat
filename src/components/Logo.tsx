import { Mic2 } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const titleClass =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims} rounded-full bg-grad flex items-center justify-center animate-spin-slow shrink-0`}
      >
        <Mic2 size={iconSize} className="text-white" />
      </div>
      <div className="leading-tight">
        <div className={`font-display font-extrabold ${titleClass} tracking-tight`}>
          QUEUEBEAT
        </div>
        <div className="text-[9px] text-white/35 tracking-[3px] -mt-0.5">BY JSIT</div>
      </div>
    </div>
  );
}
