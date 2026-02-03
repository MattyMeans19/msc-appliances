// app/sitemap.ts
import { MetadataRoute } from 'next';
import { GetAllProducts } from "@/actions/business/inventory";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://msc-appliances.com";


  const appliances = await GetAllProducts() as any[]; 

  const applianceUrls = appliances.map((item) => ({
    url: `${baseUrl}/Products/${item.sku}`,
    lastModified: item.updated_at || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));


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

  return [...staticRoutes, ...applianceUrls];
}