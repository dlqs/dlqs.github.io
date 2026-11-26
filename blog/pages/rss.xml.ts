import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Donald Lee’s Blog',
    description: 'Posts by Donald Lee.',
    site: site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || undefined,
      pubDate: post.data.pubDate,
      link: `/${post.id}/`,
    })),
    customData: '<language>en</language>',
  });
};
