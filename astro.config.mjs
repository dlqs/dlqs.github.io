import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const isBlog = process.env.SITE_TARGET === 'blog';

// https://astro.build/config
export default defineConfig({
  site: isBlog ? 'https://blog.dlqs.xyz' : 'https://dlqs.xyz',
  srcDir: isBlog ? './blog' : './src',
  outDir: isBlog ? './dist-blog' : './dist',
  base: '/',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Light/dark aware code themes; picked to sit quietly in the design.
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
    },
  },
});
