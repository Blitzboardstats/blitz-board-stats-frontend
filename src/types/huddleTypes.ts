export type MessageRecipientRole = 'coach' | 'parent' | 'player';

export interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  role: MessageRecipientRole;
  team_id: string;
  is_selected: boolean;
}

export interface HuddleComment {
  id: string;
  announcement_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface HuddlePost {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  allow_comments: boolean;
  team_id?: string;
  likes: number;
  liked_by: string[];
  created_at: string;
  updated_at: string;
  comments: HuddleComment[];
  // New fields for enhanced messaging
  media_urls?: string[];
  media_type?: 'photo' | 'video' | 'highlight';
  is_urgent?: boolean;
  tagged_users?: string[];
  visibility: 'all' | 'coaches' | 'players' | 'parents' | 'selected';
  selected_recipients?: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'highlight';
  thumbnail?: string;
  caption?: string;
}
