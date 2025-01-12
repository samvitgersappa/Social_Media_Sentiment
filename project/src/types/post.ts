export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: Comment[];
  timestamp: string;
  sentimentScore: number;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}