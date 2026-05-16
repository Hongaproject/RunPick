export type PostCategory = "자유" | "후기" | "질문" | "정보";

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  authorName: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likedByMe?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
