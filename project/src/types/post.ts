export interface Post {
  post_id: number;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  hashtags: string[];
  comments: Comment[];
  sentimentScore: number;
  timestamp: string;
}

export interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
}