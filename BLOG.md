# Blog

Add Markdown posts to `src/content/blog/`. Copy `_template.md` to a new file,
choose a filename such as `first-post.md`, and update the frontmatter:

```markdown
---
title: 'First post'
pubDate: 2026-10-07
description: 'A short description.'
draft: false
---

Write the post here using Markdown.
```

`title` and `pubDate` are required. `description` and `updatedDate` are optional.
Omit `draft` or set it to `false` to publish. Draft posts are excluded from both
the blog index and generated article pages.

The filename sets the URL: `first-post.md` appears at
`https://blog.dlqs.xyz/first-post/`. Posts appear newest first. Blog posts are
separate from the homepage's Writing collection; the homepage has no blog link.

Commit and push posts to `master` to publish through GitHub Actions. Local files
alone do not update the live site.

```sh
npm run dev:blog      # Preview blog while editing
npm run build:blog    # Build into dist-blog/
npm run preview:blog  # Preview the blog build
```

Both sites share `src/styles/global.css`, layouts, the theme toggle, and footer.

## Deployment setup

The blog deployment publishes the generated site to the `main` branch of
`dlqs/blog`. That repository needs GitHub Pages configured to deploy from the
`main` branch's root, with custom domain `blog.dlqs.xyz` and HTTPS enabled.

Add an SSH deploy key with write access to `dlqs/blog`, and save its private key
as the `BLOG_DEPLOY_KEY` Actions secret in `dlqs/dlqs.github.io`. The existing
homepage deployment stays in its own GitHub Pages repository.

At Porkbun, add a CNAME record named `blog` pointing to `dlqs.github.io`.
