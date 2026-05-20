import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, List, Flame, Mic2, Music, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { voteRequest } from '@/features/queue/queueSlice';
import { toggleVote } from '@/features/user/userSlice';
import { incrementVotes } from '@/features/room/roomSlice';

export function UserPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const approved = useAppSelector((s) => s.queue.approved);
  const player = useAppSelector((s) => s.player);
  const { nickname, votedRequests } = useAppSelector((s) => s.user);
  const room = useAppSelector((s) => s.room);

  const handleVote = (uid: string) => {
    const hasVoted = !!votedRequests[uid];
    dispatch(voteRequest({ uid, delta: hasVoted ? -1 : 1 }));
    dispatch(toggleVote(uid));
    dispatch(incrementVotes(hasVoted ? -1 : 1));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight text-center mb-5">
        Vista del usuario
      </h1>

      <div className="bg-bg-2 border border-white/10 rounded-3xl overflow-hidden">
        {/* Header */}
        <div
          className="p-5 border-b border-white/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
          }}
        >
          <div className="font-display font-extrabold text-lg">🎤 Sala #{room.roomId} · Karaoke</div>
          <div className="text-xs text-mute mt-1">
            Hola, <span className="font-medium text-white">{nickname}</span> 👋
          </div>
          <div className="flex items-center gap-2.5 mt-3 text-[11px]">
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-full text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-blink" />
              EN VIVO
            </span>
            <span className="text-mute flex items-center gap-1.5">
              <Users size={12} /> {room.usersOnline} personas
            </span>
          </div>
        </div>

        {/* Now playing */}
        <div className="p-5 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-[2px] text-mute mb-2.5">
            Sonando ahora
          </div>
          <div className="bg-brand-purple/[0.08] border border-brand-purple/25 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <div className="w-full h-full rounded-full bg-grad animate-spin-medium" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-bg-2" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium ellipsis">
                {player.currentRequest?.title ?? 'Esperando primera canción...'}
              </div>
              <div className="text-xs text-mute mt-0.5">
                {player.currentRequest
                  ? `🎤 ${player.currentRequest.singer}`
                  : 'Pide una para empezar'}
              </div>
              <div className="h-0.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-grad rounded-full transition-all duration-500"
                  style={{ width: `${player.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 flex gap-2 border-b border-white/10">
          <button
            onClick={() => navigate('/search')}
            className="flex-1 bg-grad-soft border border-brand-purple/35 rounded-2xl py-3 flex flex-col items-center gap-1.5 hover:bg-brand-purple/20 transition-colors"
          >
            <Search size={22} className="text-purple-300" />
            <span className="text-[11px] text-purple-300">Pedir canción</span>
          </button>
          <button className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-3 flex flex-col items-center gap-1.5 hover:bg-white/[0.06] transition-colors">
            <List size={22} className="text-white/60" />
            <span className="text-[11px] text-soft">Ver cola</span>
          </button>
          <button className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-3 flex flex-col items-center gap-1.5 hover:bg-white/[0.06] transition-colors">
            <Flame size={22} className="text-orange-400" />
            <span className="text-[11px] text-soft">Populares</span>
          </button>
        </div>

        {/* Queue */}
        <div className="p-5">
          <div className="text-[11px] uppercase tracking-[2px] text-mute flex items-center gap-2 mb-3">
            <List size={13} /> Próximas canciones
          </div>

          <AnimatePresence>
            {approved.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-mute text-xs flex flex-col items-center gap-2"
              >
                <Music size={32} className="opacity-40" />
                <span>La cola está vacía. ¡Pide la primera canción! 🎤</span>
              </motion.div>
            ) : (
              <div>
                {approved.map((r, i) => (
                  <motion.div
                    key={r.uid}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2.5 py-3 border-b border-white/[0.05] last:border-0"
                  >
                    <span className="text-sm text-mute font-medium w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium ellipsis">{r.title}</div>
                      <div className="text-[11px] text-mute flex items-center gap-1 mt-0.5">
                        <Mic2 size={11} />
                        {r.singer}
                      </div>
                    </div>
                    <button
                      onClick={() => handleVote(r.uid)}
                      className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition-all',
                        votedRequests[r.uid]
                          ? 'bg-orange-500/15 border-orange-500/35 text-orange-400'
                          : 'bg-white/[0.04] border-white/15 text-soft hover:bg-white/[0.08]'
                      )}
                    >
                      <motion.span
                        animate={votedRequests[r.uid] ? { rotate: [0, 15, 0], scale: [1, 1.25, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <Flame size={12} />
                      </motion.span>
                      {r.votes}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
