// types/wp.ts

export async function fetchPosts(): Promise<WPPost[]> {
  const res = await fetch("https://centuryhousegardens.com/wp-json/wp/v2/posts?_embed");

  if (!res.ok) {
    console.error("Failed to fetch posts", res.status);
    return [];
  }

  const posts = await res.json();
  return posts;
}



export interface WPPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  // нэмэлт шаардлагатай _embedded
}

