import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Volume2,
  Clock,
  List,
  Mic2,
  Flame,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  approveRequest,
  rejectRequest,
  removeFromApproved,
  consumeNext,
  addRandomVote,
} from '@/features/queue/queueSlice';
import {
  setCurrent,
  setVolume,
  setPlaying,
  clearPlayer,
} from '@/features/player/playerSlice';
import { incrementApproved } from '@/features/room/roomSlice';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { useToastContext } from '@/components/ToastProvider';

export function DJPage() {
  const dispatch = useAppDispatch();
  const { show } = useToastContext();
  const { pending, approved } = useAppSelector((s) => s.queue);
  const player = useAppSelector((s) => s.player);
  const room = useAppSelector((s) => s.room);

  // Simulación de votos en vivo
  useEffect(() => {
    const t = window.setInterval(() => dispatch(addRandomVote()), 6000);
    return () => window.clearInterval(t);
  }, [dispatch]);

  const handleApprove = (uid: string) => {
    const req = pending.find((r) => r.uid === uid);
    if (!req) return;
    dispatch(approveRequest(uid));
    dispatch(incrementApproved());
    show(`✅ "${req.title}" aprobada`, 'success');
    // Si no hay canción reproduciéndose, arrancar
    if (!player.currentRequest) {
      // Tomar la primera de aprobadas (que acabamos de meter)
      setTimeout(() => {
        const head = approved[0] ?? req;
        dispatch(consumeNext(head.uid));
        dispatch(setCurrent(head));
      }, 100);
    }
  };

  const handleReject = (uid: string) => {
    dispatch(rejectRequest(uid));
    show('❌ Solicitud rechazada', 'error');
  };

  const handlePlayFromQueue = (uid: string) => {
    const req = approved.find((r) => r.uid === uid);
    if (!req) return;
    dispatch(consumeNext(uid));
    dispatch(setCurrent(req));
  };

  const handleRemove = (uid: string) => {
    dispatch(removeFromApproved(uid));
    show('🗑️ Removida de la cola', 'info');
  };

  const handlePlayPause = () => {
    // Toggle visual; el control real lo hace el iframe escuchando isPlaying
    dispatch(setPlaying(!player.isPlaying));
  };

  const handleNext = () => {
    if (approved.length === 0) {
      dispatch(clearPlayer());
      return;
    }
    const next = approved[0];
    dispatch(consumeNext(next.uid));
    dispatch(setCurrent(next));
  };

  const handleStop = () => {
    dispatch(clearPlayer());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-1">
        Panel del DJ{' '}
        <span className="text-sm text-mute font-light ml-2">— Sala #{room.roomId}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mt-4">
        {/* Main */}
        <div className="flex flex-col gap-3.5">
          <YouTubePlayer />

          {/* Controls */}
          <div className="bg-brand-purple/[0.06] border border-brand-purple/20 rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <span className="bg-grad text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Headphones size={12} /> DJ
            </span>
            <div className="flex gap-1.5 flex-1 justify-center">
              <CtrlBtn onClick={() => {}} disabled={!player.currentRequest}>
                <SkipBack size={16} />
              </CtrlBtn>
              <CtrlBtn primary onClick={handlePlayPause} disabled={!player.currentRequest}>
                {player.isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </CtrlBtn>
              <CtrlBtn onClick={handleNext}>
                <SkipForward size={16} />
              </CtrlBtn>
              <CtrlBtn danger onClick={handleStop} disabled={!player.currentRequest}>
                <Square size={14} />
              </CtrlBtn>
            </div>
            <div className="flex items-center gap-2 min-w-[140px]">
              <Volume2 size={14} className="text-mute" />
              <input
                type="range"
                min={0}
                max={100}
                value={player.volume}
                onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
                className="flex-1 accent-brand-pink"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatCard color="purple" value={room.usersOnline} label="En sala" />
            <StatCard color="pink" value={room.totalVotes} label="Votos totales" />
            <StatCard color="green" value={room.approvedCount} label="Aprobadas" />
            <StatCard color="orange" value={pending.length} label="Pendientes" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-4 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
          <section>
            <SidebarTitle icon={<Clock size={13} className="text-orange-400" />} count={pending.length}>
              Pendientes
            </SidebarTitle>
            <div className="flex flex-col gap-1.5">
              <AnimatePresence>
                {pending.length === 0 ? (
                  <EmptyMsg>Sin solicitudes pendientes</EmptyMsg>
                ) : (
                  pending.map((r) => (
                    <motion.div
                      key={r.uid}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-500/[0.06] border border-orange-500/25"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium ellipsis">{r.title}</div>
                        <div className="text-[10px] text-mute mt-0.5 flex items-center gap-1.5">
                          <Mic2 size={11} className="text-orange-400" />
                          {r.singer}
                          <span className="ml-auto text-orange-400 flex items-center gap-0.5">
                            <Flame size={10} />
                            {r.votes}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <QBtn variant="approve" onClick={() => handleApprove(r.uid)} title="Aprobar">
                          <Check size={13} />
                        </QBtn>
                        <QBtn variant="reject" onClick={() => handleReject(r.uid)} title="Rechazar">
                          <X size={13} />
                        </QBtn>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          <section>
            <SidebarTitle icon={<List size={13} />} count={approved.length}>
              Cola aprobada
            </SidebarTitle>
            <div className="flex flex-col gap-1.5">
              <AnimatePresence>
                {approved.length === 0 ? (
                  <EmptyMsg>La cola está vacía</EmptyMsg>
                ) : (
                  approved.map((r, i) => (
                    <motion.div
                      key={r.uid}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/10"
                    >
                      <span className="text-[11px] text-mute font-medium w-4 text-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium ellipsis">{r.title}</div>
                        <div className="text-[10px] text-mute mt-0.5 flex items-center gap-1.5">
                          <Mic2 size={11} className="text-purple-400" />
                          {r.singer}
                          <span className="ml-auto text-orange-400 flex items-center gap-0.5">
                            <Flame size={10} />
                            {r.votes}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <QBtn variant="play" onClick={() => handlePlayFromQueue(r.uid)} title="Reproducir ahora">
                          <Play size={12} />
                        </QBtn>
                        <QBtn variant="reject" onClick={() => handleRemove(r.uid)} title="Quitar">
                          <Trash2 size={12} />
                        </QBtn>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function CtrlBtn({
  children,
  onClick,
  primary,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'rounded-full flex items-center justify-center transition-all',
        primary
          ? 'w-11 h-11 bg-grad text-white shadow-md hover:scale-105'
          : danger
          ? 'w-9 h-9 bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25'
          : 'w-9 h-9 bg-white/[0.06] border border-white/15 text-soft hover:bg-white/[0.12] hover:text-white',
        disabled ? 'opacity-40 cursor-not-allowed hover:scale-100' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function StatCard({
  color,
  value,
  label,
}: {
  color: 'purple' | 'pink' | 'green' | 'orange';
  value: number | string;
  label: string;
}) {
  const colorMap = {
    purple: 'text-purple-300',
    pink: 'text-pink-300',
    green: 'text-green-400',
    orange: 'text-orange-400',
  };
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
      <div className={`font-display font-extrabold text-2xl ${colorMap[color]}`}>{value}</div>
      <div className="text-[10px] text-mute uppercase tracking-[1.5px] mt-0.5">{label}</div>
    </div>
  );
}

function SidebarTitle({
  icon,
  count,
  children,
}: {
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="text-[11px] uppercase tracking-[2px] text-mute flex items-center gap-1.5 mb-2.5">
      {icon}
      {children}
      <span className="bg-grad text-white px-1.5 py-px rounded-full text-[10px]">{count}</span>
    </div>
  );
}

function QBtn({
  children,
  onClick,
  variant,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'approve' | 'reject' | 'play';
  title?: string;
}) {
  const cls = {
    approve: 'bg-green-500/15 hover:bg-green-500/30 text-green-400',
    reject: 'bg-red-500/15 hover:bg-red-500/30 text-red-400',
    play: 'bg-brand-purple/20 hover:bg-brand-purple/40 text-purple-300',
  }[variant];
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${cls}`}
    >
      {children}
    </button>
  );
}

function EmptyMsg({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-6 text-mute text-xs">{children}</div>;
}
