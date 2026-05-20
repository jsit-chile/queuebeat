/**
 * Tipos globales de la aplicación QueueBeat
 */

export interface Song {
  id: string;            // YouTube video ID
  title: string;
  channel: string;
  artist: string;
  tags: string[];
}

export interface QueueRequest {
  uid: string;
  songId: string;
  title: string;
  artist: string;
  singer: string;
  requestedBy: string;
  votes: number;
  ts: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RoomState {
  venueId: string;
  venueName: string;
  venueAddress: string;
  roomId: string;
  table: string;
  usersOnline: number;
  totalVotes: number;
  approvedCount: number;
}

export interface UserState {
  nickname: string;
  isJoined: boolean;
  votedRequests: Record<string, boolean>;
}

export interface PlayerState {
  currentSongId: string | null;
  currentRequest: QueueRequest | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  errorCode: number | null;
}

export type ViewMode = 'landing' | 'search' | 'dj' | 'user';

export type Platform = 'youtube' | 'spotify' | 'vimeo';

// YouTube IFrame API types (minimal stubs)
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement | string, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YTPlayer {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (s: number) => void;
  setVolume: (v: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

export interface YTPlayerOptions {
  videoId?: string;
  playerVars?: Record<string, unknown>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number; target: YTPlayer }) => void;
    onError?: (e: { data: number }) => void;
  };
}
