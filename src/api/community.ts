import { supabase } from "@/lib/supabase";
import { Post, Comment, PostCategory } from "@/types/community";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 전체 게시글 조회
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, comments(*)`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category as PostCategory,
    authorId: row.author_id,
    authorName: row.author_name,
    views: row.views,
    likes: row.likes,
    createdAt: formatDate(row.created_at),
    updatedAt: formatDate(row.updated_at),
    comments: (row.comments ?? []).map((c: Record<string, string>) => ({
      id: c.id,
      postId: c.post_id,
      authorId: c.author_id,
      authorName: c.author_name,
      content: c.content,
      createdAt: formatDate(c.created_at),
    })),
  }));
}

// 단일 게시글 조회 + 조회수 증가
export async function getPostById(id: string): Promise<Post | null> {
  // 조회수 증가
  await supabase.rpc("increment_views", { post_id: id });

  const { data, error } = await supabase
    .from("posts")
    .select(`*, comments(*)`)
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category as PostCategory,
    authorId: data.author_id,
    authorName: data.author_name,
    views: data.views,
    likes: data.likes,
    createdAt: formatDate(data.created_at),
    updatedAt: formatDate(data.updated_at),
    comments: (data.comments ?? []).map((c: Record<string, string>) => ({
      id: c.id,
      postId: c.post_id,
      authorId: c.author_id,
      authorName: c.author_name,
      content: c.content,
      createdAt: formatDate(c.created_at),
    })),
  };
}

// 게시글 작성
export async function createPost(
  title: string,
  content: string,
  category: PostCategory,
  authorId: string,
  authorName: string,
): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, category, author_id: authorId, author_name: authorName })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    authorId: data.author_id,
    authorName: data.author_name,
    views: data.views,
    likes: data.likes,
    createdAt: formatDate(data.created_at),
    updatedAt: formatDate(data.updated_at),
    comments: [],
  };
}

// 게시글 수정
export async function updatePost(
  id: string,
  title: string,
  content: string,
  category: PostCategory,
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ title, content, category, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// 게시글 삭제
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// 댓글 작성
export async function createComment(
  postId: string,
  content: string,
  authorId: string,
  authorName: string,
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, content, author_id: authorId, author_name: authorName })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    postId: data.post_id,
    authorId: data.author_id,
    authorName: data.author_name,
    content: data.content,
    createdAt: formatDate(data.created_at),
  };
}

// 좋아요 토글
export async function toggleLike(postId: string, userId: string): Promise<number> {
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    await supabase.rpc("decrement_likes", { post_id: postId });
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
    await supabase.rpc("increment_likes", { post_id: postId });
  }

  const { data } = await supabase.from("posts").select("likes").eq("id", postId).single();
  return data?.likes ?? 0;
}

// 내가 좋아요 눌렀는지 확인
export async function checkLiked(postId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();
  return !!data;
}
