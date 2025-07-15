// src/lib/graphql.ts

import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://centuryhousegardens.com/graphql';
const client = new GraphQLClient(endpoint);

//Query, бүх постуудыг авах
export const GET_POSTS = gql`
  query GetPosts($first: Int = 1000) {
    posts(first: $first) {
      nodes {
        slug
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

//Query, постыг slug-аар авах
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

//Төрөл тодорхойлсон интерфэйсүүд
export interface FeaturedImageNode {
  node: {
    sourceUrl: string;
  };
}

export interface GraphQLPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: FeaturedImageNode | null;
}

export interface GraphQLSinglePost {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: FeaturedImageNode | null;
}

//Бүх постыг авах функц
export async function fetchGraphQLPosts(limit = 1000): Promise<GraphQLPost[]> {
  const data = await client.request<{ posts: { nodes: GraphQLPost[] } }>(GET_POSTS, { first: limit });
  return data.posts.nodes;
}

//Нэг постыг slug-аар авах функц
export async function fetchGraphQLPostBySlug(slug: string): Promise<GraphQLSinglePost> {
  const data = await client.request<{ post: GraphQLSinglePost }>(GET_POST_BY_SLUG, { slug });
  return data.post;
}
