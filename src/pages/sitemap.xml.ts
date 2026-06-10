import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://taymoorfouladi.pages.dev';

const staticPaths = ['/', '/about', '/contact', '/portfolio', '/career', '/blog'];

export const GET: APIRoute = async () => {
  const [portfolio, career, blog] = await Promise.all([
    getCollection('portfolio'),
    getCollection('career'),
    getCollection('blog'),
  ]);

  const urls: { loc: string; priority: number }[] = [
    ...staticPaths.map((p) => ({
      loc: SITE + p,
      priority: p === '/' ? 1.0 : 0.8,
    })),
    ...portfolio.map((p) => ({ loc: `${SITE}/portfolio/${p.slug}`, priority: 0.7 })),
    ...career.map((p) => ({ loc: `${SITE}/career/${p.slug}`, priority: 0.6 })),
    ...blog.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, priority: 0.5 })),
  ];

  const today = new Date().toISOString().split('T')[0];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
