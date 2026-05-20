import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import {
  MapPin,
  Armchair,
  Users,
  Music,
  Mic2,
  User as UserIcon,
  CircleCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { join } from '@/features/user/userSlice';
import { useToastContext } from '@/components/ToastProvider';

const cellVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function LandingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { show } = useToastContext();
  const room = useAppSelector((s) => s.room);
  const approvedQueue = useAppSelector((s) => s.queue.approved);
  const currentReq = useAppSelector((s) => s.player.currentRequest);
  const [nickname, setNickname] = useState('');

  const handleJoin = () => {
    dispatch(join(nickname.trim()));
    show(`🎤 ¡Bienvenido a ${room.venueName.replace('🍻', '').trim()}!`, 'success');
    setTimeout(() => navigate('/user'), 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Venue card */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 border border-brand-purple/25"
          style={{
            background:
              'linear-gradient(180deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 100%)',
          }}
        >
          <div className="absolute -top-1/2 -right-1/3 w-[280px] h-[280px] rounded-full bg-brand-pink/20 blur-3xl animate-pulse-glow pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 text-[11px] text-green-400 mb-4"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 400, damping: 15 }}
              >
                <CircleCheck size={13} />
              </motion.span>
              QR escaneado correctamente !
            </motion.div>

            <h1 className="font-display font-extrabold text-2xl sm:text-[26px] leading-tight tracking-tight mb-1">
              {room.venueName}
            </h1>
            <div className="text-[13px] text-soft flex items-center gap-1.5">
              <MapPin size={14} className="text-mute" />
              {room.venueAddress}
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="grid grid-cols-3 gap-2.5">
              <VenueInfoCell
                icon={<Armchair size={18} className="text-purple-300" />}
                bg="bg-brand-purple/20"
                glowColor="rgba(139,92,246,0.35)"
                value={`Mesa ${room.table}`}
                label="Tu mesa"
                index={0}
                numeric={false}
              />
              <VenueInfoCell
                icon={<Users size={18} className="text-pink-300" />}
                bg="bg-brand-pink/20"
                glowColor="rgba(236,72,153,0.35)"
                value={String(room.usersOnline)}
                label="En sala"
                index={1}
                numeric
              />
              <VenueInfoCell
                icon={<Music size={18} className="text-cyan-300" />}
                bg="bg-brand-cyan/20"
                glowColor="rgba(34,211,238,0.35)"
                value={String(approvedQueue.length)}
                label="En cola"
                index={2}
                numeric
              />
            </div>

            {/* Now strip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-4 bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 flex items-center gap-3"
            >
              <div className="relative w-11 h-11 shrink-0">
                <div className="w-full h-full rounded-full bg-grad animate-spin-medium" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-mute uppercase tracking-[2px] mb-0.5">
                  Sonando ahora
                </div>
                <div className="text-[13px] font-medium ellipsis">
                  {currentReq?.title ?? 'Aún no hay canción sonando'}
                </div>
                <div className="text-[11px] text-purple-300 mt-0.5">
                  {currentReq ? `🎤 ${currentReq.singer}` : '¡Sé el primero en pedir una!'}
                </div>
              </div>
              <Equalizer />
            </motion.div>
          </div>
        </div>

        {/* Join CTA */}
        <motion.div
          className="mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="relative">
            <UserIcon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none"
            />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Tu nombre o el de la mesa"
              maxLength={24}
              className="input-base pl-11"
            />
          </div>

          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ y: 0, scale: 0.98 }}
            onClick={handleJoin}
            className="mt-3 w-full bg-grad rounded-2xl py-4 px-6 text-base font-medium flex items-center justify-center gap-2.5 text-white relative overflow-hidden shadow-lg hover:shadow-brand-purple/40 transition-shadow group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
            <motion.span
              animate={{ rotate: [0, -12, 12, -6, 0] }}
              transition={{ delay: 1.2, duration: 0.6, ease: 'easeInOut' }}
            >
              <Mic2 size={20} />
            </motion.span>
            Entrar a la sala
          </motion.button>
        </motion.div>

        {/* Mini steps */}
        <div className="mt-7 grid grid-cols-3 gap-2.5">
          {[
            { n: '1', emoji: '🔍', text: 'Busca tu canción' },
            { n: '2', emoji: '🎤', text: 'El DJ la aprueba' },
            { n: '3', emoji: '🔥', text: '¡A cantar!' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              custom={i}
              variants={stepVariants}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 px-2 cursor-default"
            >
              <motion.div
                className="font-display font-extrabold text-xl text-grad leading-none"
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              >
                {s.n}
              </motion.div>
              <motion.div
                className="text-2xl my-1.5"
                whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.35 }}
              >
                {s.emoji}
              </motion.div>
              <div className="text-[10px] text-soft leading-snug">{s.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-white/10 text-center">
          <div className="text-[11px] text-mute">
            Powered by{' '}
            <span className="font-display font-bold text-white/60 tracking-wider">
              QUEUEBEAT
            </span>{' '}
            · by JSIT
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, target, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [target]);

  return <span ref={ref}>{target}</span>;
}

function VenueInfoCell({
  icon,
  bg,
  glowColor,
  value,
  label,
  index,
  numeric,
}: {
  icon: React.ReactNode;
  bg: string;
  glowColor: string;
  value: string;
  label: string;
  index: number;
  numeric: boolean;
}) {
  return (
    <motion.div
      className="text-center"
      custom={index}
      variants={cellVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className={`w-9 h-9 mx-auto mb-2 rounded-xl ${bg} flex items-center justify-center`}
        whileHover={{ scale: 1.2, boxShadow: `0 0 16px 4px ${glowColor}` }}
        transition={{ type: 'spring', stiffness: 350, damping: 16 }}
      >
        <motion.span whileHover={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.4 }}>
          {icon}
        </motion.span>
      </motion.div>
      <div className="font-display font-bold text-base text-white leading-none mb-1">
        {numeric ? <AnimatedNumber target={Number(value)} /> : value}
      </div>
      <div className="text-[10px] text-mute uppercase tracking-[1.5px]">{label}</div>
    </motion.div>
  );
}

function Equalizer() {
  return (
    <div className="flex gap-0.5 items-end h-4 shrink-0">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm bg-gradient-to-t from-brand-purple to-brand-pink animate-eq-dance"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${0.4 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
