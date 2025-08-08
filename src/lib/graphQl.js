// src/lib/graphQl.js
const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL || 'https://centuryhousegardens.com/graphql';
const AUTH_TOKEN = process.env.WP_GRAPHQL_AUTH_TOKEN || '';

// Туслах: GraphQL POST хийх generic функц
async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {})
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error('WPGraphQL error:', json.errors ?? json);
    throw new Error('WPGraphQL fetch failed');
  }
  return json.data;
}

// Pagination-тай бүх постуудыг авах (slug-тай array буцаана)
let _cachedAllPosts = null;
export async function fetchGraphQLPosts({ perPage = 50 } = {}) {
  if (_cachedAllPosts) return _cachedAllPosts;

  const posts = [];
  let hasNextPage = true;
  let endCursor = null;

  const query = `
    query Posts($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        nodes {
          slug
          title
          date
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  while (hasNextPage) {
    const data = await fetchGraphQL(query, { first: perPage, after: endCursor });
    if (!data || !data.posts) break;
    posts.push(...(data.posts.nodes || []));
    hasNextPage = !!data.posts.pageInfo.hasNextPage;
    endCursor = data.posts.pageInfo.endCursor;
  }

  _cachedAllPosts = posts;
  return posts;
}

// Нэг постыг slug-аар авч ирэх
const _postCache = new Map();
export async function fetchGraphQLPostBySlug(slug) {
  if (!slug) return null;
  if (_postCache.has(slug)) return _postCache.get(slug);

  const query = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        slug
        title
        content
        excerpt
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { slug });
  const post = data?.post ?? null;
  if (post) _postCache.set(slug, post);
  return post;
}
