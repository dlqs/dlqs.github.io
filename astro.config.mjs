import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dlqs.xyz',
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
