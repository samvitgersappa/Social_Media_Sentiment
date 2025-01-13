export interface Post {
  post_id: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: Comment[];
  timestamp: string;
  sentimentScore?: number; // Make this optional to handle cases where it might be undefined
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}