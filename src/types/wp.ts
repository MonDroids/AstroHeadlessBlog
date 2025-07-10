export type WPPost = {
    id: number;
    slug: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    content: { rendered: string };
    date: string;
    categories?: number[];
    _embedded?: {
      ["wp:featuredmedia"]?: [
        {
          id: number;
          source_url: string;
        }
      ];
    };
  };
  