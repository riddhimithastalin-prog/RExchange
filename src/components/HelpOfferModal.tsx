import { useState } from 'react';
import { HeartHandshake, Send } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/store';

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
  store: Store;
}

export function HelpOfferModal({ open, onClose, postId, store }: Props) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const send = () => {
    store.addHelpOffer(postId, message.trim());
    setSent(true);
    toast({ title: 'You offered to help! 🙌', message: 'The student will see your offer.' });
    setTimeout(() => {
      setSent(false);
      setMessage('');
      onClose();
    }, 1600);
  };

  return (
    <Modal
      open={open}
      onClose={() => { if (!sent) { setSent(false); setMessage(''); onClose(); } }}
      title={sent ? undefined : 'Offer to help'}
      subtitle={sent ? undefined : 'A small gesture goes a long way on campus.'}
      icon={!sent && <HeartHandshake size={20} />}
      maxWidth="max-w-md"
    >
      {sent ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <HeartHandshake size={32} />
          </div>
          <h3 className="text-xl font-bold text-ink-900">You offered to help! 🙌</h3>
          <p className="text-sm text-ink-500 max-w-xs">The student will see your offer. That's the RExchange spirit.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-ink-600">
            Let them know you can help. You can add a short message — no contact info is shared.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. I have one you can borrow. I'm at the Innovation Lab."
            rows={4}
            className="w-full resize-none rounded-xl border-0 bg-brand-50/50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 ring-1 ring-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            onClick={send}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.01] active:scale-[0.99]"
          >
            <Send size={16} /> Send Offer
          </button>
        </div>
      )}
    </Modal>
  );
}
