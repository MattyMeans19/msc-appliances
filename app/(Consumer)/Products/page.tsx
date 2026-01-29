import ProductList from "@/components/inventory/consumer-product-list";
import InventoryFilters from "@/components/inventory/consumer-products-filter"; // You'll create this
import pool from "@/lib/db"; // Import your DB pool

export default async function Products({ 
    searchParams 
}: { 
    searchParams: Promise<{ page?: string; type?: string; subtypes?: string; sale?: string}> 
}){
    // Fetch categories for the filter sidebar from your mapping table
    const categoryRequest = await pool.query('SELECT * FROM subtypes ORDER BY product_type ASC');
    const categories = categoryRequest.rows;

    return (
        <div className="grow w-full border-y-2 border-red-500 rounded-2xl place-self-center mb-10 flex flex-col pt-5">
            <div className="flex flex-col md:flex-row grow gap-5 p-5">
                {/* SIDEBAR: Filters */}
                <aside className="w-full md:w-64 shrink-0">
                    <InventoryFilters categories={categories} />
                </aside>

                {/* MAIN GRID: Products */}
                <div className="border-2 border-gray-400 grow mb-5 inset-ring-12 
                    inset-ring-slate-600/15 p-10">
                    <ProductList searchParams={searchParams} />
                </div>
            </div>
        </div>
    );
}