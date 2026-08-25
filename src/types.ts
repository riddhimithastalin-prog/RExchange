export type ContactMethodId = 'whatsapp' | 'instagram' | 'email';

export interface ContactPreferences {
  whatsapp: boolean;
  instagram: boolean;
  email: boolean;
}

export type Category = 'books' | 'electronics' | 'events' | 'giveaway';

export type Availability = 'sale' | 'rent' | 'lending' | 'free' | 'online';

export type Urgency = 'asap' | 'today' | 'week';

export interface User {
  id: string;
  name: string;
  initials: string;
  emoji: string;
  bio: string;
  department: string;
  color: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: Category;
  availability: Availability;
  price?: number;
  condition: string;
  image: string;
  location: string;
  contributorId: string;
  sharedToCommunity: boolean;
  createdAt: number;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: number;
}

export interface HelpOffer {
  id: string;
  authorId: string;
  message: string;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  type: 'discussion' | 'urgent';
  text: string;
  resourceLink?: string;
  need?: string;
  why?: string;
  category?: Category;
  urgency?: Urgency;
  location?: string;
  image?: string;
  authorId: string;
  comments: Comment[];
  helpOffers: HelpOffer[];
  createdAt: number;
}

export interface CategoryMeta {
  id: Category;
  label: string;
  emoji: string;
  subtitle: string;
  gradient: string;
  accent: string;
}

export interface AvailabilityMeta {
  id: Availability;
  label: string;
  classes: string;
}

export interface UrgencyMeta {
  id: Urgency;
  label: string;
  classes: string;
}
