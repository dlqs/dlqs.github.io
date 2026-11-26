import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

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
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        transformTags: {
          a: (tagName, attribs) => ({
            tagName,
            attribs: {
              ...attribs,
              ...(attribs.href && { href: new URL(attribs.href, new URL(`/${post.id}/`, site)).href }),
            },
          }),
          img: (tagName, attribs) => ({
            tagName,
            attribs: {
              ...attribs,
              ...(attribs.src && { src: new URL(attribs.src, new URL(`/${post.id}/`, site)).href }),
            },
          }),
        },
      }),
    })),
    customData: '<language>en</language>',
  });
};
