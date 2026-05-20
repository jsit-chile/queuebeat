import { useEffect, useRef, useCallback, useState } from 'react';
import type { YTPlayer } from '@/types';

interface UseYouTubePlayerOptions {
  containerId: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (code: number) => void;
  onTimeUpdate?: (current: number, duration: number) => void;
}

/**
 * Encapsula la creación y control del YouTube IFrame Player.
 * Detecta cuándo el API está listo y expone métodos de control.
 */
export function useYouTubePlayer({
  containerId,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
}: UseYouTubePlayerOptions) {
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [apiReady, setApiReady] = useState<boolean>(
    typeof window !== 'undefined' && !!window.YT && !!window.YT.Player
  );

  // Esperar al global onYouTubeIframeAPIReady
  useEffect(() => {
    if (apiReady) return;
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
      prevCallback?.();
    };
    // Polling defensivo por si el API ya cargó
    const t = window.setInterval(() => {
      if (window.YT && window.YT.Player) {
        setApiReady(true);
        window.clearInterval(t);
      }
    }, 200);
    return () => window.clearInterval(t);
  }, [apiReady]);

  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    intervalRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const current = p.getCurrentTime?.() ?? 0;
        const duration = p.getDuration?.() ?? 0;
        if (duration > 0) onTimeUpdate?.(current, duration);
      } catch {
        // ignore
      }
    }, 500);
  }, [onTimeUpdate, stopProgressTracking]);

  const load = useCallback(
    (videoId: string) => {
      if (!apiReady) return;
      const container = document.getElementById(containerId);
      if (!container) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
        return;
      }

      playerRef.current = new window.YT.Player(container, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            try {
              e.target.playVideo();
            } catch {
              // ignore
            }
            startProgressTracking();
            onReady?.();
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) onPlay?.();
            else if (e.data === S.PAUSED) onPause?.();
            else if (e.data === S.ENDED) onEnded?.();
          },
          onError: (e) => {
            onError?.(e.data);
          },
        },
      });
    },
    [apiReady, containerId, onReady, onPlay, onPause, onEnded, onError, startProgressTracking]
  );

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const stop = useCallback(() => {
    try {
      playerRef.current?.stopVideo();
    } catch {
      // ignore
    }
  }, []);
  const seek = useCallback((s: number) => playerRef.current?.seekTo(s), []);
  const setVolume = useCallback((v: number) => playerRef.current?.setVolume(v), []);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [stopProgressTracking]);

  return { apiReady, load, play, pause, stop, seek, setVolume };
}
