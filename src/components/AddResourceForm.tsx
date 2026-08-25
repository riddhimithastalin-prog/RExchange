import { useState } from 'react';
import { Image as ImageIcon, Check } from 'lucide-react';
import type { Availability, Category } from '@/types';
import { SAMPLE_IMAGES } from '@/lib/seed';
import { AVAILABILITY, CATEGORIES } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import type { Store } from '@/lib/store';

interface Props {
  store: Store;
  onDone: (resourceId: string) => void;
}

interface FormState {
  title: string;
  description: string;
  category: Category | '';
  availability: Availability | '';
  price: string;
  condition: string;
  image: string;
  location: string;
  sharedToCommunity: boolean;
}

const initial: FormState = {
  title: '',
  description: '',
  category: '',
  availability: '',
  price: '',
  condition: '',
  image: SAMPLE_IMAGES[0].url,
  location: 'SRM Campus',
  sharedToCommunity: true,
};

export function AddResourceForm({ store, onDone }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const needsPrice = form.availability === 'sale' || form.availability === 'rent';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Please give your resource a title';
    if (!form.category) e.category = 'Pick a category';
    if (!form.availability) e.availability = 'Choose an availability type';
    if (needsPrice && (!form.price || Number(form.price) <= 0)) e.price = 'Enter a price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const r = store.addResource({
      title: form.title.trim(),
      description: form.description.trim() || 'No description provided.',
      category: form.category as Category,
      availability: form.availability as Availability,
      price: needsPrice ? Number(form.price) : undefined,
      condition: form.condition.trim() || 'Not specified',
      image: form.image,
      location: form.location.trim() || 'SRM Campus',
      sharedToCommunity: form.sharedToCommunity,
    });
    toast({
      title: 'Resource listed!',
      message: form.sharedToCommunity ? 'It\'s live in the marketplace and community feed.' : 'It\'s live in the marketplace.',
    });
    setForm(initial);
    onDone(r.id);
  };

  const fieldClass = (k: string) =>
    `w-full rounded-xl border-0 bg-brand-50/50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 ring-1 transition-all focus:outline-none focus:ring-2 ${
      errors[k] ? 'ring-rose-300 focus:ring-rose-400' : 'ring-brand-100 focus:ring-brand-300'
    }`;

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-800">Title <span className="text-rose-500">*</span></label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. USB-C Cable"
          className={fieldClass('title')}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-800">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="A short description of what you're offering..."
          rows={3}
          className={`${fieldClass('description')} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Category <span className="text-rose-500">*</span></label>
          <select value={form.category} onChange={(e) => set('category', e.target.value as Category)} className={fieldClass('category')}>
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">Availability <span className="text-rose-500">*</span></label>
          <select value={form.availability} onChange={(e) => set('availability', e.target.value as Availability)} className={fieldClass('availability')}>
            <option value="" disabled>Select type</option>
            {AVAILABILITY.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          {errors.availability && <p className="mt-1 text-xs text-rose-500">{errors.availability}</p>}
        </div>
      </div>

      {needsPrice && (
        <div className="animate-fade-in">
          <label className="mb-1.5 block text-sm font-semibold text-ink-800">
            Price (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="e.g. 250"
            className={fieldClass('price')}
          />
          {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-800">Condition / Specifications</label>
        <input
          type="text"
          value={form.condition}
          onChange={(e) => set('condition', e.target.value)}
          placeholder="e.g. Good condition, barely used"
          className={fieldClass('condition')}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-800">Image</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.url}
              type="button"
              onClick={() => set('image', img.url)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                form.image === img.url ? 'ring-brand-500 shadow-soft' : 'ring-transparent hover:ring-brand-200'
              }`}
            >
              <img src={img.url} alt={img.label} className="h-full w-full object-cover" loading="lazy" />
              {form.image === img.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-500/30">
                  <Check size={18} className="text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-400">
          <ImageIcon size={12} /> Pick a sample image — file uploads aren't in this demo.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink-800">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="e.g. SRM Campus, Tech Park"
          className={fieldClass('location')}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-violet-50/70 p-4 ring-1 ring-violet-100 transition-colors hover:bg-violet-50">
        <input
          type="checkbox"
          checked={form.sharedToCommunity}
          onChange={(e) => set('sharedToCommunity', e.target.checked)}
          className="h-5 w-5 rounded accent-violet-600"
        />
        <div>
          <p className="text-sm font-semibold text-ink-900">Also share in the Community feed</p>
          <p className="text-xs text-ink-500">More students will see your resource.</p>
        </div>
      </label>

      <button
        onClick={submit}
        className="w-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:shadow-lift hover:scale-[1.01] active:scale-[0.99]"
      >
        Publish Resource
      </button>
    </div>
  );
}
