import { GetProducts } from "@/actions/business/inventory";
import { Product } from "@/lib/definitions";
import Link from "next/link";
import ConsumerInventoryItem from "./consumer-inventory-item";

export default async function ProductList({ 
    searchParams 
}: { 
    searchParams: Promise<{ 
        page?: string; 
        type?: string; 
        subtypes?: string; 
        sale?: string
    }> 
}) {
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    
    const productType = resolvedParams?.type || null;
    const subtypes = resolvedParams?.subtypes || null;
    const isOnSale = String(resolvedParams?.sale).toLowerCase() === 'true';

    const itemsPerPage = 12;
    const data = await GetProducts(currentPage, itemsPerPage, productType, subtypes, isOnSale);
    
    if (typeof data === 'string' || !data || 'error' in data) {
        return (
            <div className="col-span-full text-center p-10 font-bold text-red-500">
                {typeof data === 'string' ? data : (data?.error || "Error loading products.")}
            </div>
        );
    }

    const { products, totalPages } = data;

    // --- HELPER FUNCTION TO PERSIST PARAMS ---
    const getPageLink = (pageNumber: number) => {
        const params = new URLSearchParams();
        params.set('page', pageNumber.toString());
        if (productType) params.set('type', productType);
        if (subtypes) params.set('subtypes', subtypes);
        if (isOnSale) params.set('sale', 'true');
        return `?${params.toString()}`;
    };

    // --- Pagination Window Logic ---
    const maxVisible = 3; 
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    const pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

    return (
        <>
            {products && products.map((product: any) => (
                <Link 
                    href={`/Products/${product.sku}`} 
                    key={product.id} 
                    className="col-span-1 h-full p-5 rounded-3xl shadow-2xl shadow-slate-500/30 border bg-white"
                >
                    <ConsumerInventoryItem 
                        name={product.name}
                        sku={product.sku}
                        photo={product.photos[0]}
                        count={product.count}
                        price={product.price}
                        on_sale={product.on_sale}
                        manual_sale={product.manual_sale}
                    />  
                </Link>
            ))}

            {/* Pagination Container */}
            <div className="col-span-full flex flex-col items-center justify-center w-full mt-16 mb-10 gap-4 px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    
                    {/* Previous Button */}
                    <Link
                        href={getPageLink(currentPage - 1)}
                        className={`px-3 py-2 border rounded-lg ${currentPage <= 1 ? 'pointer-events-none opacity-30 bg-gray-100' : 'bg-white shadow-sm hover:bg-slate-50'}`}
                    >
                        <span className="hidden sm:inline">← Previous</span>
                        <span className="sm:hidden">←</span>
                    </Link>

                    <div className="flex gap-1">
                        {startPage > 1 && <span className="p-2 hidden sm:block text-slate-400">...</span>}
                        
                        {pageNumbers.map((page) => (
                            <Link
                                key={page}
                                href={getPageLink(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm transition-all ${
                                    currentPage === page
                                    ? 'bg-red-500 text-white border-red-500 font-bold'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}

                        {endPage < totalPages && <span className="p-2 hidden sm:block text-slate-400">...</span>}
                    </div>

                    {/* Next Button */}
                    <Link
                        href={getPageLink(currentPage + 1)}
                        className={`px-3 py-2 border rounded-lg ${currentPage >= totalPages ? 'pointer-events-none opacity-30 bg-gray-100' : 'bg-white shadow-sm hover:bg-slate-50'}`}
                    >
                        <span className="hidden sm:inline">Next →</span>
                        <span className="sm:hidden">→</span>
                    </Link>
                </div>
                
                <p className="text-xs text-slate-400 font-medium">
                    Page {currentPage} of {totalPages}
                </p>
            </div>
        </>
    );
}