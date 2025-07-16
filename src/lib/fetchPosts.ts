import sanitizeHtml from "sanitize-html";
import type { WPPost } from "../types/wp";

// HTML цэвэршүүлэх функц
function sanitizePost(post: WPPost): WPPost {
  return {
    ...post,
    title: {
      ...post.title,
      rendered: sanitizeHtml(post.title.rendered),
    },
    excerpt: {
      ...post.excerpt,
      rendered: sanitizeHtml(post.excerpt.rendered),
    },
    content: {
      ...post.content,
      rendered: sanitizeHtml(post.content.rendered, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "title"],
        },
      }),
    },
  };
}

// Бүх нийтлэлүүдийг авах функц
export async function fetchPosts(): Promise<WPPost[]> {
  const res = await fetch("http://centuryhousegardens.com/wp-json/wp/v2/posts?per_page=100&_embed");

  if (!res.ok) {
    console.error("❌ fetchPosts error:", res.statusText);
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }

  const posts: WPPost[] = await res.json();

  // Бүх постуудыг sanitize хийх
  return posts.map(sanitizePost);
}

// slug-аар пост авах функц
export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(`http://centuryhousegardens.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);

  if (!res.ok) {
    console.error("❌ fetchPostBySlug error:", res.statusText);
    return null;
  }

  const data: WPPost[] = await res.json();

  return data.length > 0 ? sanitizePost(data[0]) : null;
}
