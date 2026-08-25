import { useCallback, useEffect, useMemo, useState } from 'react';
import { Package, MessageSquarePlus, Siren } from 'lucide-react';
import { ToastProvider } from '@/components/Toast';
import { Modal } from '@/components/Modal';
import { Navbar, type View } from '@/components/Navbar';
import { Dashboard } from '@/pages/Dashboard';
import { Browse } from '@/pages/Browse';
import { ResourceDetail } from '@/pages/ResourceDetail';
import { Community } from '@/pages/Community';
import { Profile } from '@/pages/Profile';
import { AddResourceForm } from '@/components/AddResourceForm';
import { CreatePostForm } from '@/components/CreatePostForm';
import { HelpOfferModal } from '@/components/HelpOfferModal';
import { ContactModal } from '@/components/ContactModal';
import { useStore } from '@/lib/store';
import type { Category } from '@/types';

type ModalKind = 'add-resource' | 'create-post' | 'urgent-help' | null;

function AppInner() {
  const store = useStore();
  const [view, setView] = useState<View>('dashboard');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [helpPostId, setHelpPostId] = useState<string | null>(null);
  const [contactResourceId, setContactResourceId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const selectedResource = useMemo(
    () => store.resources.find((r) => r.id === selectedResourceId) ?? null,
    [store.resources, selectedResourceId],
  );
  const contactResource = useMemo(
    () => store.resources.find((r) => r.id === contactResourceId) ?? null,
    [store.resources, contactResourceId],
  );

  const openResource = useCallback((id: string) => {
    setSelectedResourceId(id);
    setView('detail');
    window.scrollTo({ top: 0 });
  }, []);

  const openPost = useCallback((id: string) => {
    setSelectedPostId(id);
    setView('community');
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);

  const nav = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectCategory = useCallback((c: string) => {
    setCategoryFilter(c as Category | 'all');
    setSearch('');
    setView('browse');
    window.scrollTo({ top: 0 });
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategoryFilter('all');
  }, []);

  const handleSearchFocus = useCallback(() => {
    setView('browse');
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('input[placeholder^="Search resources"]');
      input?.focus();
    }, 80);
  }, []);

  // Sync search from dashboard → browse
  const handleDashboardSearch = useCallback((v: string) => {
    setSearch(v);
    if (v && view === 'dashboard') setView('browse');
  }, [view]);

  // Handle deep-link ?resource= / ?post=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('resource');
    const p = params.get('post');
    if (r) openResource(r);
    else if (p) openPost(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const offerHelp = (postId: string) => setHelpPostId(postId);
  const openContact = (resourceId: string) => {
    store.contactContributor(resourceId);
    setContactResourceId(resourceId);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            resources={store.resources}
            posts={store.posts}
            contactedResourceIds={store.contactedResourceIds}
            search={search}
            setSearch={handleDashboardSearch}
            onOpenResource={openResource}
            onOpenPost={openPost}
            onSelectCategory={selectCategory}
            onSeeAllUrgent={() => { setView('community'); window.scrollTo({ top: 0 }); }}
          />
        );
      case 'browse':
        return (
          <Browse
            resources={store.resources}
            contactedResourceIds={store.contactedResourceIds}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onOpenResource={openResource}
            onAddResource={() => setModal('add-resource')}
            onAskCommunity={() => setModal('create-post')}
            onClearFilters={clearFilters}
          />
        );
      case 'detail':
        if (!selectedResource) {
          return <BrowseFallback onBack={() => nav('dashboard')} />;
        }
        return (
          <ResourceDetail
            resource={selectedResource}
            contacted={store.contactedResourceIds.includes(selectedResource.id)}
            onBack={() => { setSelectedResourceId(null); nav('browse'); }}
            onContact={() => openContact(selectedResource.id)}
          />
        );
      case 'community':
        return (
          <Community
            posts={store.posts}
            store={store}
            helpedPostIds={store.helpedPostIds}
            onOpenResource={openResource}
            onOfferHelp={offerHelp}
            onCreatePost={() => setModal('create-post')}
            onUrgentHelp={() => setModal('urgent-help')}
          />
        );
      case 'profile':
        return (
          <Profile
            resources={store.resources}
            posts={store.posts}
            contactedResourceIds={store.contactedResourceIds}
            helpedPostIds={store.helpedPostIds}
            onOpenResource={openResource}
            onOpenPost={openPost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar
        view={view}
        onNav={nav}
        onAddResource={() => setModal('add-resource')}
        onCreatePost={() => setModal('create-post')}
        onUrgentHelp={() => setModal('urgent-help')}
        onSearchFocus={handleSearchFocus}
        showBack={view === 'detail'}
        onBack={() => { setSelectedResourceId(null); nav('browse'); }}
      />

      <main className="pb-20 md:pb-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-ink-400">
        <p>RExchange SRM · A campus mutual-aid & resource exchange community.</p>
        <p className="mt-1">Not a marketplace — a student community. Built for students, by students.</p>
      </footer>

      {/* Add Resource Modal */}
      <Modal
        open={modal === 'add-resource'}
        onClose={() => setModal(null)}
        title="Add a Resource"
        subtitle="Share something with your campus community."
        icon={<Package size={20} />}
        maxWidth="max-w-xl"
      >
        <AddResourceForm
          store={store}
          onDone={(id) => {
            setModal(null);
            openResource(id);
          }}
        />
      </Modal>

      {/* Create Post Modal */}
      <Modal
        open={modal === 'create-post'}
        onClose={() => setModal(null)}
        title="Create a Post"
        subtitle="Start a discussion or share an update."
        icon={<MessageSquarePlus size={20} />}
        maxWidth="max-w-lg"
      >
        <CreatePostForm store={store} onDone={() => { setModal(null); nav('community'); }} />
      </Modal>

      {/* Urgent Help Modal */}
      <Modal
        open={modal === 'urgent-help'}
        onClose={() => setModal(null)}
        title="Urgent Quick Help"
        subtitle="Need something urgently? The community is here."
        icon={<Siren size={20} />}
        maxWidth="max-w-lg"
      >
        <CreatePostForm store={store} defaultUrgent onDone={() => { setModal(null); nav('community'); }} />
      </Modal>

      {/* Help Offer Modal */}
      <HelpOfferModal
        open={!!helpPostId}
        onClose={() => setHelpPostId(null)}
        postId={helpPostId ?? ''}
        store={store}
      />

      {/* Contact Modal */}
      <ContactModal
        open={!!contactResourceId}
        onClose={() => setContactResourceId(null)}
        resource={contactResource}
      />
    </div>
  );
}

function BrowseFallback({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="text-lg font-bold text-ink-900">That resource isn't available anymore.</p>
      <button
        onClick={onBack}
        className="mt-4 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
