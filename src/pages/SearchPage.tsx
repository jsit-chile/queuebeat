import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Plus, CircleCheck, Play, Mic2, FileText, Music } from 'lucide-react';
import { clsx } from 'clsx';
import { searchSongs, KARAOKE_CATALOG } from '@/services/catalog';
import { SongRequestModal } from '@/components/SongRequestModal';
import type { Song } from '@/types';

const FILTERS = [
  { id: 'karaoke', label: 'Karaoke', icon: Mic2 },
  { id: 'lyrics', label: 'Lyrics', icon: FileText },
  { id: 'instrumental', label: 'Instrumental', icon: Music },
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('karaoke');
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  useEffect(() => {
    setIsSearching(true);
    const t = window.setTimeout(() => {
      setDebounced(query);
      setIsSearching(false);
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const results: Song[] = useMemo(() => {
    if (!debounced.trim()) return KARAOKE_CATALOG.slice(0, 8);
    return searchSongs(debounced);
  }, [debounced]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Buscar canción</h1>
      <p className="text-soft text-sm mb-6">
        Encontramos automáticamente la versión karaoke con lyrics.
      </p>

      <div className="relative mb-4">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bad Bunny, Despacito, Hawái..."
          className="input-base pl-12 pr-12 text-base"
        />
        {isSearching && (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-purple animate-spin"
          />
        )}
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs border transition-all flex items-center gap-1.5',
              activeFilter === id
                ? 'bg-brand-purple/15 border-brand-purple/40 text-purple-300'
                : 'bg-white/[0.03] border-white/10 text-soft hover:bg-white/[0.06]'
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState query={debounced} />
      ) : (
        <div className="flex flex-col gap-1">
          {results.map((s, i) => (
            <SongResultRow
              key={s.id}
              song={s}
              index={i}
              onAdd={() => setSelectedSongId(s.id)}
            />
          ))}
        </div>
      )}

      <SongRequestModal
        open={selectedSongId !== null}
        songId={selectedSongId}
        onClose={() => setSelectedSongId(null)}
      />
    </div>
  );
}

function SongResultRow({
  song,
  index,
  onAdd,
}: {
  song: Song;
  index: number;
  onAdd: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={onAdd}
      className="text-left flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-white/[0.04] hover:border-white/10 transition-all group"
    >
      <div
        className="relative w-14 h-14 rounded-lg bg-cover bg-center bg-white/5 shrink-0 overflow-hidden"
        style={{ backgroundImage: `url('https://i.ytimg.com/vi/${song.id}/mqdefault.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Play size={20} className="text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium ellipsis mb-0.5">{song.title}</div>
        <div className="text-xs text-mute ellipsis">
          {song.artist} · {song.channel}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
          <CircleCheck size={10} />
          Embed OK
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="w-9 h-9 rounded-full bg-brand-purple/15 border border-brand-purple/35 text-purple-300 flex items-center justify-center transition-all group-hover:bg-grad group-hover:border-transparent group-hover:text-white"
        >
          <Plus size={18} />
        </span>
      </div>
    </motion.button>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16 text-mute">
      <Search size={48} className="mx-auto mb-3 opacity-60" />
      <div className="text-sm text-white mb-1">Sin resultados</div>
      <div className="text-xs">No encontramos "{query}". Prueba otro término.</div>
    </div>
  );
}
