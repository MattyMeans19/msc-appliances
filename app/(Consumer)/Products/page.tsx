import { Metadata } from "next";
import ProductList from "@/components/inventory/consumer-product-list";
import InventoryFilters from "@/components/inventory/consumer-products-filter";
import pool from "@/lib/db";

type Props = {
    searchParams: Promise<{ 
        page?: string; 
        type?: string; 
        subtypes?: string; 
        sale?: string;
        sort?: string;
    }>;
};

// --- 1. DYNAMIC METADATA GENERATOR ---
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    
    // Logic to build a descriptive title
    const type = params.type ? params.type.charAt(0).toUpperCase() + params.type.slice(1) : "Appliances";
    const sub = params.subtypes ? ` - ${params.subtypes}` : "";
    const sale = params.sale === 'true' ? " | On Sale" : "";
    const page = params.page && params.page !== '1' ? ` (Page ${params.page})` : "";

    const title = `Used ${type}${sub}${sale}${page} | Your Store Name`;
    const description = `High-quality used ${type.toLowerCase()} in [Your City]. Inspected and warrantied one-of-one appliances updated daily.`;

    return {
        title,
        description,
        alternates: {
            // Canonical tells Google that ?page=1 and the base URL are the same page
            canonical: "/inventory", 
        },
        openGraph: {
            title,
            description,
            type: "website",
        }
    };
}

// --- 2. THE PAGE COMPONENT ---
export default async function Products({ searchParams }: Props){
    const categoryRequest = await pool.query('SELECT * FROM subtypes ORDER BY product_type ASC');
    const categories = categoryRequest.rows.map(row => {
        let parsedSubtypes: string[] = [];

        if (typeof row.subtype === 'string') {
            parsedSubtypes = row.subtype
            .replace(/^\{|\}$/g, '')         // Remove outer { and }
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // Split by comma only if outside quotes
            .map((s: string) => s.trim().replace(/^"|"$/g, '')); // Remove outer quotes from items
        } else if (Array.isArray(row.subtype)) {
            parsedSubtypes = row.subtype;
        }

        return {
            ...row,
            subtype: parsedSubtypes
        };
        });

    return (
        <div className="grow w-full border-y-2 border-red-500 rounded-2xl place-self-center mb-10 flex flex-col pt-5">
            <div className="flex flex-col md:flex-row grow gap-5 p-5">
                <aside className="w-full md:w-64 shrink-0">
                    <InventoryFilters categories={categories} />
                </aside>

                <div className="border-2 border-gray-400 grow mb-5 inset-ring-12 
                    inset-ring-slate-600/15 p-10">
                    <ProductList searchParams={searchParams} />
                </div>
            </div>
        </div>
    );
}