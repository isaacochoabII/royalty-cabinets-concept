import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The GitHub Pages preview lives under a sub-path; production is royaltycabinets.ca at the root.
const pagesPreview = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://royaltycabinets.ca',
  base: pagesPreview ? '/royalty-cabinets-concept' : '/',
  // Matches the existing WordPress URLs (/installation/, /estimates/) so links and rankings carry over.
  trailingSlash: 'always',
  integrations: [sitemap()],
});
