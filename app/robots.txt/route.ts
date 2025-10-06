import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thebenchmarktrader.com';
  
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas (if any in future)
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /pricing
Allow: /about
Allow: /blog
Allow: /blog/*`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}


