const fs = require('fs');
const path = require('path');

// Paths
const songsFilePath = path.join(__dirname, '../src/app/core/data/cantoral.ts');
const categoriesFilePath = path.join(__dirname, '../src/app/core/data/songs.ts');
const routesDistPath = path.join(__dirname, '../src/routes.txt');
const sitemapDistPath = path.join(__dirname, '../src/public/sitemap.xml'); // Angular copies public to dist
const robotsDistPath = path.join(__dirname, '../src/public/robots.txt');

// Helper to extract slugs using Regex since we can't easily import TS files in plain Node
function extractSlugs(content) {
    const slugRegex = /"slug":\s*"([^"]+)"/g;
    const slugs = [];
    let match;
    while ((match = slugRegex.exec(content)) !== null) {
        slugs.push(match[1]);
    }
    return slugs;
}

// Helper to extract Category slugs
function extractCategorySlugs(content) {
    // Looks for: { letter: 'A', description: 'Entrada', slug: slugifyText('Entrada') }
    // This is harder because slug is computed. 
    // We'll rely on the description to re-slugify or just hardcode/regex what we can.
    // Actually, looking at songs.ts, it uses `slugifyText`.
    // Let's simplified: We know the categories are static.
    // We can extract descriptions and slugify them simply here.
    const descRegex = /description:\s*'([^']+)'/g;
    const descriptions = [];
    let match;
    while ((match = descRegex.exec(content)) !== null) {
        descriptions.push(match[1]);
    }

    // Simple slugify matching the one in utils.ts
    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");
    };

    return descriptions.map(d => slugify(d));
}

function generate() {
    console.log('Generating SEO files...');

    const songsContent = fs.readFileSync(songsFilePath, 'utf8');
    const categoriesContent = fs.readFileSync(categoriesFilePath, 'utf8');

    const songSlugs = extractSlugs(songsContent);
    const categorySlugs = extractCategorySlugs(categoriesContent);

    console.log(`Found ${songSlugs.length} songs and ${categorySlugs.length} categories.`);

    // 1. Generate routes.txt
    const routes = [
        '/',
        '/home',
        '/categorias',
        '/favoritos',
        '/hoja-favoritos',
        '/acerca-de',
        '/descargas',
        ...categorySlugs.map(s => `/categorias/${s}`),
        ...songSlugs.map(s => `/cancion/${s}`)
    ];

    fs.writeFileSync(routesDistPath, routes.join('\n'));
    console.log(`routes.txt written with ${routes.length} paths.`);

    // 2. Generate sitemap.xml
    const baseUrl = 'https://www.cantoraleltocho.com'; // Replace with actual domain if known, or user configuration
    const today = new Date().toISOString().split('T')[0];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Ensure public dir exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log('sitemap.xml written.');

    // 3. Generate robots.txt
    const robotsContent = `# robots.txt
User-agent: *
Allow: /

# Disallow indexing of search results within category pages
Disallow: /categorias/*?search=*
Disallow: /canciones?search=*

Sitemap: ${baseUrl}/sitemap.xml`

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
    console.log('robots.txt written.');
}

generate();
