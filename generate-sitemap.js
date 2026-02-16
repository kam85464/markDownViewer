const fs = require('fs');
const path = require('path');

// The domain of your website
const DOMAIN = 'https://mark-down-viewer.vercel.app';

async function generateSitemap() {
  // 1. Define static routes
  const routes = [
    {
      url: '/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0',
      images: [
        {
          url: `${DOMAIN}/logo.png`,
          title: 'Markdown Viewer Pro Logo',
          caption: 'The official logo',
        },
      ],
    },
    // Add other static routes here
  ];

  // 2. Fetch dynamic routes from an API
  try {
    // Example: Fetching posts. Replace with your actual API call.
    // const response = await fetch('https://api.example.com/posts');
    // const posts = await response.json();
    
    // Mock data
    const posts = []; 

    const dynamicRoutes = posts.map((post) => ({
      url: `/posts/${post.slug}`,
      lastmod: post.updatedAt ? post.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
      images: post.image ? [{ url: post.image, title: post.title }] : [],
    }));

    routes.push(...dynamicRoutes);
  } catch (error) {
    console.error('Error fetching dynamic routes:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes
  .map((route) => {
    let urlEntry = `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>`;

    if (route.images) {
      route.images.forEach((image) => {
        urlEntry += `
    <image:image>
      <image:loc>${image.url}</image:loc>
      ${image.caption ? `<image:caption>${image.caption}</image:caption>` : ''}
      ${image.title ? `<image:title>${image.title}</image:title>` : ''}
    </image:image>`;
      });
    }

    urlEntry += `
  </url>`;
    return urlEntry;
  })
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();