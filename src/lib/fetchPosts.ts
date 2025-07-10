import type { WPPost } from "../types/wp";

export async function fetchPosts(): Promise<WPPost[]> {
  const res = await fetch("https://yourwordpress.com/wp-json/wp/v2/posts?_embed");
  return await res.json();
}

export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(`https://yourwordpress.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
  const data: WPPost[] = await res.json();
  return data.length > 0 ? data[0] : null;
}
