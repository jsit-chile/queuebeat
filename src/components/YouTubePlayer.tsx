import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic2, AlertTriangle, QrCode } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setPlaying, setProgress, setError, clearPlayer, setCurrent } from '@/features/player/playerSlice';
import { consumeNext } from '@/features/queue/queueSlice';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useToastContext } from './ToastProvider';

const EMBED_ERRORS: Record<number, string> = {
  2: 'El ID del video es inválido',
  5: 'Error del reproductor HTML5',
  100: 'Video no disponible o privado',
  101: 'El dueño del video bloqueó la reproducción fuera de YouTube',
  150: 'El dueño del video bloqueó la reproducción fuera de YouTube',
  153: 'Configuración bloqueada por el dueño del video',
};

const CONTAINER_ID = 'qb-yt-player';

export function YouTubePlayer() {
  const dispatch = useAppDispatch();
  const { show } = useToastContext();
  const player = useAppSelector((s) => s.player);
  const approved = useAppSelector((s) => s.queue.approved);
  const room = useAppSelector((s) => s.room);
  const skipTimerRef = useRef<number | null>(null);

  const { apiReady, load, setVolume } = useYouTubePlayer({
    containerId: CONTAINER_ID,
    onPlay: () => dispatch(setPlaying(true)),
    onPause: () => dispatch(setPlaying(false)),
    onEnded: () => handlePlayNext(),
    onError: (code) => handleEmbedError(code),
    onTimeUpdate: (current, duration) => {
      dispatch(setProgress(duration > 0 ? (current / duration) * 100 : 0));
    },
  });

  // Cargar video cuando cambia currentSongId y el API está listo
  useEffect(() => {
    if (player.currentSongId && apiReady) {
      load(player.currentSongId);
    }
  }, [player.currentSongId, apiReady, load]);

  // Sincronizar volumen
  useEffect(() => {
    setVolume(player.volume);
  }, [player.volume, setVolume]);

  // Limpiar timer
  useEffect(() => {
    return () => {
      if (skipTimerRef.current !== null) window.clearTimeout(skipTimerRef.current);
    };
  }, []);

  function handlePlayNext() {
    if (skipTimerRef.current !== null) {
      window.clearTimeout(skipTimerRef.current);
      skipTimerRef.current = null;
    }
    if (approved.length > 0) {
      const next = approved[0];
      dispatch(consumeNext(next.uid));
      dispatch(setCurrent(next));
    } else {
      dispatch(clearPlayer());
    }
  }

  function handleEmbedError(code: number) {
    const msg = EMBED_ERRORS[code] ?? 'Error desconocido del reproductor';
    console.warn(`[QueueBeat] Embed error ${code}: ${msg}`);
    dispatch(setError(code));

    if ([100, 101, 150, 153].includes(code)) {
      show('⚠️ Video bloqueado — saltando a la siguiente en 3s', 'warning');
      skipTimerRef.current = window.setTimeout(() => handlePlayNext(), 3000);
    }
  }

  const isEmpty = !player.currentRequest;
  const hasError = player.errorCode !== null;
  const nextUp = approved[0];

  return (
    <div className="relative bg-black rounded-2xl aspect-video overflow-hidden border border-white/10">
      {/* YT container */}
      <div
        id={CONTAINER_ID}
        className="absolute inset-0 w-full h-full"
        style={{ display: isEmpty || hasError ? 'none' : 'block' }}
      />

      {/* Empty state */}
      {isEmpty && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-mute bg-bg-2">
          <Mic2 size={56} className="opacity-40" />
          <div className="text-white text-sm font-medium">Esperando primera canción...</div>
          <div className="text-xs">Aprueba una solicitud para empezar</div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-mute bg-bg-2">
          <AlertTriangle size={56} className="text-orange-400" />
          <div className="text-white text-sm font-medium">Error {player.errorCode}</div>
          <div className="text-xs text-center max-w-xs leading-relaxed">
            {EMBED_ERRORS[player.errorCode ?? 0] ?? 'Error de configuración del video'}
          </div>
          <div className="text-[11px] text-mute mt-2">Saltando a la siguiente automáticamente...</div>
        </div>
      )}

      {/* Top overlay */}
      {!isEmpty && !hasError && (
        <>
          <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-full px-3.5 py-1.5 backdrop-blur-md text-xs">
              <Mic2 size={13} />
              <span>QueueBeat · Sala #{room.roomId}</span>
            </div>
            <div className="bg-white/95 rounded-lg p-1.5">
              <div className="w-[60px] h-[50px] rounded bg-[length:6px_6px]" style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #000 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, #000 0 3px, transparent 3px 6px)',
                backgroundColor: '#fff',
              }} />
              <div className="text-[7px] text-black font-bold text-center mt-0.5 tracking-wider flex items-center justify-center gap-0.5">
                <QrCode size={7} /> UNIRSE
              </div>
            </div>
          </div>

          {/* Bottom overlay */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 pointer-events-none flex justify-between items-end bg-gradient-to-t from-black/85 to-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center animate-mic-pulse">
                <Mic2 size={18} className="text-white" />
              </div>
              <div>
                <div className="text-[10px] text-white/60 uppercase tracking-[2px]">
                  Cantando ahora
                </div>
                <div className="font-display font-bold text-sm sm:text-base">
                  {player.currentRequest?.singer}
                </div>
              </div>
            </div>
            {nextUp && (
              <div className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-md max-w-[40%]">
                <div className="text-[9px] text-white/50 uppercase tracking-[2px]">
                  A continuación
                </div>
                <div className="text-xs font-medium ellipsis">{nextUp.title}</div>
                <div className="text-[10px] text-purple-300 ellipsis">→ {nextUp.singer}</div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
