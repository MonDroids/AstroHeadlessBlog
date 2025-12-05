const WP_GRAPHQL_URL =
  import.meta.env.WP_GRAPHQL_URL ||
  import.meta.env.VITE_WP_API_URL ||
  'https://cms.centuryhousegardens.com/graphql';
// GraphQL query-г WP GraphQL endpoint руу илгээх

export async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL query failed');
    }
    return json.data;
  } catch (err) {
    console.error('Non-JSON response:', text.slice(0, 200));
    throw err;
  }
}

// Бүх постуудыг pagination-аар авах
export async function fetchGraphQLPosts() {
  let posts = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const query = `
      query GetPosts($after: String) {
        posts(first: 50, after: $after) {
          nodes {
            slug
            title
            excerpt
            date
            modified
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const data = await fetchGraphQL(query, { after: endCursor });

    posts = [...posts, ...data.posts.nodes];
    hasNextPage = data.posts.pageInfo.hasNextPage;
    endCursor = data.posts.pageInfo.endCursor;
  }

  return posts;
}

// Нэг постыг slug-аар авах (ЭНЭ Л ЗӨВ ГАНЦ ХУВИЛБАР)
export async function fetchGraphQLPostBySlug(slug) {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { slug });
  return data.post;
}
