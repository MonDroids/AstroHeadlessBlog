// src/lib/graphql.ts

import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://centuryhousegardens.com/graphql'; // энд өөрийн site link -ээ оруулна
const client = new GraphQLClient(endpoint);

// POSTS-г авах GraphQL query
export const GET_POSTS = gql`
  query GetPosts($first: Int = 1000) {
    posts(first: $first) {
      nodes {
        slug
        title
        excerpt
        content
        date
      }
    }
  }
`;

// SLUG-аар нэг POST авах query
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      excerpt
      date
    }
  }
`;

export async function fetchGraphQLPosts(limit = 1000) {
    const data: { posts: { nodes: any[] } } = await client.request(GET_POSTS, { first: limit });
    return data.posts.nodes;
}

export async function fetchGraphQLPostBySlug(slug: string) {
    const data: { post: { title: string; content: string; excerpt: string; date: string } } = await client.request(GET_POST_BY_SLUG, { slug });
    return data.post;
}
