import ProductList from "@/components/inventory/consumer-product-list";
import ProductLoading from "@/components/Loading/product-loading";
import { Suspense} from "react";

// Add searchParams to the page props
export default async function Products({ searchParams }: { searchParams: Promise<{ page?: string }> }){

    return(
        <div className="grow w-full border-y-2 border-red-500 rounded-2xl place-self-center mb-10 gap-5 flex flex-col pt-5">
            <div className="border-b-2 rounded-2xl h-[10vh] w-[90%] mx-[5%] border-gray-400/40 shadow-md shadow-slate-400">
                {/* Search/Filter bar goes here */}
            </div>
            
            {/* REMOVED overflow-y-scroll here to prevent click blocking */}
            <div className="border-2 border-gray-400 grow mb-5 mx-5 inset-ring-12 
                inset-ring-slate-600/15 p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 auto-rows-fr gap-5">
                
                <Suspense fallback={<ProductLoading />}>
                    {/* Pass searchParams here! */}
                    <ProductList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    )
}