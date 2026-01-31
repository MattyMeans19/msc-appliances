// app/sitemap.ts
import { MetadataRoute } from 'next';
import { GetAllProducts } from "@/actions/business/inventory";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://msc-appliances.com";

  // 1. Fetch your dynamic appliance slugs/IDs from your database
  // Only include items that are still 'available'
  const appliances = await GetAllProducts() as any[]; 

  const applianceUrls = appliances.map((item) => ({
    url: `${baseUrl}/Products/${item.sku}`,
    lastModified: item.updated_at || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // 2. Define your static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/About`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
        {
      url: `${baseUrl}/Products`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
        {
      url: `${baseUrl}/Contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ];

  // 3. Combine them (Notice we leave out the (admin) route group!)
  return [...staticRoutes, ...applianceUrls];
}