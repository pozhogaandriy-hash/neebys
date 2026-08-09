import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/site-url';
import { products } from '../data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/catalog`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/shipping`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/cart`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    // Auth routes (noindex in production, but listed for completeness)
    { url: `${baseUrl}/auth/sign-in`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/auth/sign-up`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/auth/forgot-password`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
    // Account routes (noindex — authenticated only)
    { url: `${baseUrl}/account/profile`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${baseUrl}/account/settings`, lastModified, changeFrequency: 'yearly', priority: 0.1 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/catalog/${product.id}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
