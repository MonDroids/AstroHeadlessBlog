// types/wp.ts

export async function fetchPosts(): Promise<WPPost[]> {
  const res = await fetch("https://centuryhousegardens.com/wp-json/wp/v2/posts?_embed");

  const text = await res.text(); // эхлээд text болгож авна

  try {
    return JSON.parse(text); // JSON мөн бол parse хийнэ
  } catch (err) {
    console.error("❌ WP API JSON биш response ирлээ. Server HTML error өгч байна:");
    console.error(text.slice(0,200)); // эхний 200 тэмдэгт хэвлэж debug
    return [];
  }
}
export async function fetchPostsByAuthor(authorId: number): Promise<WPPost[]> {
  const res = await fetch(`https://centuryhousegardens.com/wp-json/wp/v2/posts?author=${authorId}&_embed`);

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
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  modified?: string;   // schema ашиглахад хэрэгтэй optional талбарууд
  date?: string;
  jetpack_featured_media_url?: string;
  author_name?: string;
  _embedded?: any;
}


