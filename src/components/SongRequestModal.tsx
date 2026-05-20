import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Modal } from './Modal';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { submitRequest } from '@/features/queue/queueSlice';
import { useToastContext } from './ToastProvider';
import { findSongById } from '@/services/catalog';

interface Props {
  open: boolean;
  songId: string | null;
  onClose: () => void;
}

export function SongRequestModal({ open, songId, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { nickname } = useAppSelector((s) => s.user);
  const { show } = useToastContext();
  const [singer, setSinger] = useState('');
  const song = songId ? findSongById(songId) : undefined;

  useEffect(() => {
    if (open) setSinger('');
  }, [open]);

  const handleSubmit = () => {
    if (!song) return;
    dispatch(
      submitRequest({
        song,
        singer: singer.trim() || nickname,
        requestedBy: nickname,
      })
    );
    show(`🎤 "${song.title}" enviada al DJ`, 'success');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="🎤 Pedir esta canción">
      {song && (
        <>
          <div className="bg-brand-purple/10 border border-brand-purple/25 rounded-xl p-3.5 mb-4 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url('https://i.ytimg.com/vi/${song.id}/mqdefault.jpg')` }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium ellipsis">{song.title}</div>
              <div className="text-xs text-soft mt-0.5">{song.artist}</div>
            </div>
          </div>

          <label className="text-xs text-soft block mb-2">¿Quién va a cantar?</label>
          <input
            type="text"
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            placeholder="Tu nombre o el del grupo (ej: Florencia & Javier)"
            className="input-base mb-4"
            maxLength={32}
            autoFocus
          />
          <button onClick={handleSubmit} className="btn-primary w-full justify-center">
            <Send size={16} />
            Enviar al DJ para aprobación
          </button>
        </>
      )}
    </Modal>
  );
}
