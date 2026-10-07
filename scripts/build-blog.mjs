import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

execFileSync(process.execPath, ['node_modules/astro/astro.js', 'build'], {
  env: { ...process.env, SITE_TARGET: 'blog' },
  stdio: 'inherit',
});
writeFileSync('dist-blog/CNAME', 'blog.dlqs.xyz\n');
writeFileSync('dist-blog/.nojekyll', '');
