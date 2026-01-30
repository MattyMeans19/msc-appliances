import { GetProduct } from "@/actions/business/inventory";
import { GetSpecial } from "@/actions/business/specials";
import ProductPage from "@/components/inventory/product-page";
import ProductLoading from "@/components/Loading/product-loading";
import { Product, Specials } from "@/lib/definitions";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";

type Props = {
  params: { productSlug: string };
};

// 1. Optimized Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const product = (await GetProduct(productSlug)) as Product;

  if (!product) {
    return { title: "Product Not Found" };
  }

  // Formatting for a clean meta description
  const cleanPrice = (product.price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return {
    title: `${product.name} | MSC Appliances`,
    description: `Buy ${product.name} for ${cleanPrice}. ${product.info.substring(0, 150)}...`,
    openGraph: {
      title: product.name,
      description: product.info,
      images: [
        {
          url: product.photos[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.info,
      images: [product.photos[0]],
    },
  };
}

// 2. Main Page Component
export default async function ProductDetails({ params }: Props) {
  const { productSlug } = await params;

  // Next.js automatically deduplicates these calls so GetProduct only hits the DB once
  const currentProduct = (await GetProduct(productSlug)) as Product;
  const sale = (await GetSpecial()) as Specials;

  if (!currentProduct) {
    notFound();
  }

  // JSON-LD Schema for Rich Google Search Results
    const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: currentProduct.name,
    image: currentProduct.photos[0],
    description: currentProduct.info,
    sku: currentProduct.sku?.toString(),
    itemCondition: "https://schema.org/UsedCondition", // Explicitly marks as used
    offers: {
        "@type": "Offer",
        price: (currentProduct.price / 100).toFixed(2),
        priceCurrency: "USD",
        availability: currentProduct.count > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
        url: `https://yourdomain.com/product/${productSlug}`,
        itemCondition: "https://schema.org/UsedCondition" // Also inside the offer
    },
    };

  return (
    <>
      {/* Injecting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ProductLoading />}>
        <ProductPage item={currentProduct} sale={sale.sales_price} />
      </Suspense>
    </>
  );
}