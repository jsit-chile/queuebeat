import type { Song } from '@/types';

/**
 * Catálogo karaoke con videos verificados para embed.
 * En producción esto se reemplaza por YouTube Data API v3
 * filtrando por status.embeddable === true.
 */
export const KARAOKE_CATALOG: Song[] = [
  { id: 'aZJ7Aa4PiPM', title: 'Despacito (Karaoke)', channel: 'Sing King', artist: 'Luis Fonsi ft. Daddy Yankee', tags: ['karaoke', 'lyrics', 'reggaeton'] },
  { id: 'pKlfdHLnVoY', title: 'Shape of You — Karaoke', channel: 'Sing King', artist: 'Ed Sheeran', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'sNPnbI1arSE', title: 'Bohemian Rhapsody — Karaoke', channel: 'Sing King', artist: 'Queen', tags: ['karaoke', 'lyrics', 'rock'] },
  { id: 'iuJDhFRDx9M', title: 'Uptown Funk — Karaoke', channel: 'Sing King', artist: 'Bruno Mars', tags: ['karaoke', 'lyrics', 'funk'] },
  { id: 'd9aYWAUZQNw', title: 'Waka Waka — Karaoke', channel: 'Sing King', artist: 'Shakira', tags: ['karaoke', 'lyrics', 'latin'] },
  { id: 'mzB1VGEGcSU', title: 'See You Again — Karaoke', channel: 'Sing King', artist: 'Wiz Khalifa', tags: ['karaoke', 'lyrics', 'hip-hop'] },
  { id: 'be1ld6lqxsk', title: 'Hello — Karaoke', channel: 'Sing King', artist: 'Adele', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'NjxNnqTcHhg', title: 'Counting Stars — Karaoke', channel: 'Sing King', artist: 'OneRepublic', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'Be67W8OmtSg', title: 'Thinking Out Loud — Karaoke', channel: 'Sing King', artist: 'Ed Sheeran', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'h9zPaPJ5wWo', title: 'Roar — Karaoke', channel: 'Sing King', artist: 'Katy Perry', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'PpcsuS1nWPo', title: 'Sugar — Karaoke', channel: 'Sing King', artist: 'Maroon 5', tags: ['karaoke', 'lyrics', 'pop'] },
  { id: 'qzVcMrLnW9o', title: 'Closer — Karaoke', channel: 'Sing King', artist: 'The Chainsmokers', tags: ['karaoke', 'lyrics', 'edm'] },
  { id: '5Yp2yJ7gQec', title: 'All of Me — Karaoke', channel: 'Sing King', artist: 'John Legend', tags: ['karaoke', 'lyrics', 'ballad'] },
  { id: 'g4Hbf2jhxCM', title: 'Faded — Karaoke', channel: 'Sing King', artist: 'Alan Walker', tags: ['karaoke', 'lyrics', 'edm'] },
  { id: 'M7lc1UVf-VE', title: 'YouTube Developer Demo', channel: 'YouTube', artist: 'Demo confiable', tags: ['karaoke', 'demo'] },
];

export function searchSongs(query: string): Song[] {
  if (!query.trim()) return KARAOKE_CATALOG.slice(0, 8);
  const q = query.toLowerCase();
  return KARAOKE_CATALOG.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.channel.toLowerCase().includes(q)
  );
}

export function findSongById(id: string): Song | undefined {
  return KARAOKE_CATALOG.find((s) => s.id === id);
}
