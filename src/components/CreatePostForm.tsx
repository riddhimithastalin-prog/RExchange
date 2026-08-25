import { useState } from 'react';
import { Image as ImageIcon, MessageSquare, Siren, Check, X } from 'lucide-react';
import type { Category, Urgency } from '@/types';
import { CATEGORIES, URGENCY } from '@/lib/utils';
import { POST_SAMPLE_IMAGES } from '@/lib/seed';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/store';

interface Props {
  store: Store;
  onDone: () => void;
  defaultUrgent?: boolean;
}

export function CreatePostForm({ store, onDone, defaultUrgent = false }: Props) {
  const [isUrgent, setIsUrgent] = useState(defaultUrgent);
  const [text, setText] = useState('');
  const [need, setNeed] = useState('');
  const [why, setWhy] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [urgency, setUrgency] = useState<Urgency | ''>('');
  const [location, setLocation] = useState('SRM Campus');
  const [image, setImage] = useState<string>('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fieldClass = (k: string) =>
    `w-full rounded-xl border-0 bg-brand-50/50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 ring-1 transition-all focus:outline-none focus:ring-2 ${
      errors[k] ? 'ring-rose-300 focus:ring-rose-400' : 'ring-brand-100 focus:ring-brand-300'
    }`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (isUrgent) {
      if (!need.trim()) e.need = 'What do you need?';
      if (!why.trim()) e.why = 'Tell the community why you need it';
      if (!urgency) e.urgency = 'How urgent is this?';
    } else {
      if (!text.trim()) e.text = 'Write something to post';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    store.addPost(
      isUrgent
        ? {
            type: 'urgent',
            text: `${why.trim()}`,
            need: need.trim(),
            why: why.trim(),
            category: (category || undefined) as Category | undefined,
            urgency: (urgency || 'today') as Urgency,
            location: location.trim() || 'SRM Campus',
            image: image || undefined,
          }
        : {
            type: 'discussion',
            text: text.trim(),
            image: image || undefined,
          },
    );
    toast({
      title: isUrgent ? 'Urgent request posted! 🚨' : 'Post shared!',
      message: isUrgent ? 'The community can see your request now.' : 'Your post is live in the feed.',
    });
    onDone();
  };

  return (
    <div className="space-y-5">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-50/60 p-1.5">
        <button
          type="button"
          onClick={() => { setIsUrgent(false); setErrors({}); }}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            !isUrgent ? 'bg-white text-violet-700 shadow-soft' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <MessageSquare size={16} /> Discussion
        </button>
        <button
          type="button"
          onClick={() => { setIsUrgent(true); setErrors({}); }}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            isUrgent ? 'bg-white text-rose-600 shadow-soft' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Siren size={16} /> Urgent Help
        </button>
      </div>

      {isUrgent ? (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">What do you need? <span className="text-rose-500">*</span></label>
            <input value={need} onChange={(e) => setNeed(e.target.value)} placeholder="e.g. USB-C data-transfer cable" className={fieldClass('need')} />
            {errors.need && <p className="mt-1 text-xs text-rose-500">{errors.need}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">Why do you need it? <span className="text-rose-500">*</span></label>
            <textarea value={why} onChange={(e) => setWhy(e.target.value)} placeholder="e.g. My cable stopped working before my hackathon." rows={3} className={`${fieldClass('why')} resize-none`} />
            {errors.why && <p className="mt-1 text-xs text-rose-500">{errors.why}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={fieldClass('category')}>
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800">How urgent? <span className="text-rose-500">*</span></label>
              <div className="flex gap-2">
                {URGENCY.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setUrgency(u.id); setErrors((e) => ({ ...e, urgency: '' })); }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold ring-1 transition-all ${
                      urgency === u.id ? u.classes : 'bg-white text-ink-500 ring-brand-100 hover:ring-brand-200'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
              {errors.urgency && <p className="mt-1 text-xs text-rose-500">{errors.urgency}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-800">Location / context</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. SRM Campus, Innovation Lab" className={fieldClass('location')} />
          </div>
        </>
      ) : (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Post text <span className="text-rose-500">*</span></label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share something with the community..." rows={5} className={`${fieldClass('text')} resize-none`} />
          {errors.text && <p className="mt-1 text-xs text-rose-500">{errors.text}</p>}
        </div>
      )}

      {/* Image picker */}
      <div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImagePicker((s) => !s)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-all ${
              image
                ? 'bg-brand-100 text-brand-700 ring-brand-200'
                : 'bg-white text-ink-500 ring-brand-100 hover:bg-brand-50'
            }`}
          >
            <ImageIcon size={15} /> {image ? 'Image selected' : 'Add Image'}
          </button>
          {image && (
            <button
              type="button"
              onClick={() => { setImage(''); setShowImagePicker(false); }}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-ink-500 ring-1 ring-brand-100 hover:bg-brand-50"
            >
              <X size={14} /> Remove
            </button>
          )}
        </div>
        {showImagePicker && (
          <div className="mt-3 grid grid-cols-5 gap-2 animate-fade-in">
            {POST_SAMPLE_IMAGES.map((img) => (
              <button
                key={img.url}
                type="button"
                onClick={() => { setImage(img.url); setShowImagePicker(false); }}
                className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                  image === img.url ? 'ring-brand-500 shadow-soft' : 'ring-transparent hover:ring-brand-200'
                }`}
              >
                <img src={img.url} alt={img.label} className="h-full w-full object-cover" loading="lazy" />
                {image === img.url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-500/30">
                    <Check size={16} className="text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        {image && !showImagePicker && (
          <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-brand-100 animate-fade-in">
            <img src={image} alt="Post attachment" className="aspect-[16/9] w-full object-cover" />
          </div>
        )}
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-400">
          <ImageIcon size={12} /> Optional — pick a sample image. No file uploads in this demo.
        </p>
      </div>

      <button
        onClick={submit}
        className={`w-full rounded-full py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.01] active:scale-[0.99] ${
          isUrgent ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-brand-500 to-violet-500'
        }`}
      >
        {isUrgent ? 'Post Urgent Request' : 'Share Post'}
      </button>
    </div>
  );
}
