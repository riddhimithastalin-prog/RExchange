import { useCallback, useEffect, useState } from 'react';
import type { Comment, CommunityPost, ContactMethodId, ContactPreferences, HelpOffer, Resource } from '@/types';
import { CURRENT_USER_ID, DEFAULT_CONTACT_PREFERENCES, SEED_POSTS, SEED_RESOURCES } from '@/lib/seed';
import { uid } from '@/lib/utils';

const KEY = 'rexchange_state_v2';

interface PersistState {
  resources: Resource[];
  posts: CommunityPost[];
  contactedResourceIds: string[];
  helpedPostIds: string[];
  contactPreferences: Record<string, ContactPreferences>;
}

const EMPTY_STATE: PersistState = {
  resources: SEED_RESOURCES,
  posts: SEED_POSTS,
  contactedResourceIds: [],
  helpedPostIds: [],
  contactPreferences: {},
};

function load(): PersistState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistState;
      if (parsed.resources && parsed.posts) {
        return {
          ...EMPTY_STATE,
          ...parsed,
          contactPreferences: parsed.contactPreferences ?? {},
        };
      }
    }
  } catch {
    // ignore
  }
  return EMPTY_STATE;
}

export function prefsForUser(
  map: Record<string, ContactPreferences>,
  userId: string,
): ContactPreferences {
  return { ...DEFAULT_CONTACT_PREFERENCES, ...map[userId] };
}

export function useStore() {
  const [state, setState] = useState<PersistState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const addResource = useCallback(
    (r: Omit<Resource, 'id' | 'createdAt' | 'contributorId'>) => {
      const resource: Resource = {
        ...r,
        id: uid('r'),
        contributorId: CURRENT_USER_ID,
        createdAt: Date.now(),
      };
      setState((s) => {
        let posts = s.posts;
        if (r.sharedToCommunity) {
          const post: CommunityPost = {
            id: uid('p'),
            type: 'discussion',
            text: `Shared a new resource: ${r.title}`,
            resourceLink: resource.id,
            authorId: CURRENT_USER_ID,
            comments: [],
            helpOffers: [],
            createdAt: Date.now(),
          };
          posts = [post, ...posts];
        }
        return { ...s, resources: [resource, ...s.resources], posts };
      });
      return resource;
    },
    [],
  );

  const addPost = useCallback((p: Omit<CommunityPost, 'id' | 'createdAt' | 'authorId' | 'comments' | 'helpOffers'>) => {
    const post: CommunityPost = {
      ...p,
      id: uid('p'),
      authorId: CURRENT_USER_ID,
      comments: [],
      helpOffers: [],
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, posts: [post, ...s.posts] }));
    return post;
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    const comment: Comment = {
      id: uid('c'),
      authorId: CURRENT_USER_ID,
      text,
      createdAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
      ),
    }));
  }, []);

  const addHelpOffer = useCallback((postId: string, message: string) => {
    const offer: HelpOffer = {
      id: uid('h'),
      authorId: CURRENT_USER_ID,
      message,
      createdAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, helpOffers: [...p.helpOffers, offer] } : p,
      ),
      helpedPostIds: s.helpedPostIds.includes(postId)
        ? s.helpedPostIds
        : [...s.helpedPostIds, postId],
    }));
  }, []);

  const contactContributor = useCallback((resourceId: string) => {
    setState((s) => ({
      ...s,
      contactedResourceIds: s.contactedResourceIds.includes(resourceId)
        ? s.contactedResourceIds
        : [...s.contactedResourceIds, resourceId],
    }));
  }, []);

  const setContactPreference = useCallback((method: ContactMethodId, enabled: boolean) => {
    setState((s) => ({
      ...s,
      contactPreferences: {
        ...s.contactPreferences,
        [CURRENT_USER_ID]: {
          ...prefsForUser(s.contactPreferences, CURRENT_USER_ID),
          [method]: enabled,
        },
      },
    }));
  }, []);

  return {
    resources: state.resources,
    posts: state.posts,
    contactedResourceIds: state.contactedResourceIds,
    helpedPostIds: state.helpedPostIds,
    contactPreferences: state.contactPreferences,
    addResource,
    addPost,
    addComment,
    addHelpOffer,
    contactContributor,
    setContactPreference,
  };
}

export type Store = ReturnType<typeof useStore>;
