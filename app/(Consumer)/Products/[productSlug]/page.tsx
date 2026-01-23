import { GetProduct } from "@/actions/business/inventory";
import { GetSpecial } from "@/actions/business/specials";
import ProductPage from "@/components/inventory/product-page";
import ProductLoading from "@/components/Loading/product-loading";
import { Product, Specials } from "@/lib/definitions";
import { notFound } from "next/navigation";
import { Suspense } from "react";


export default async function ProductDetails({params}: {params: {productSlug: string}}){
    const {productSlug} = await params;

    const currentProduct = await GetProduct(productSlug) as Product;
    console.log(currentProduct)
    const sale = await GetSpecial() as Specials;

    if(currentProduct === undefined){
        notFound();
    } else if(typeof currentProduct.sku === "string") {
        return(
            <Suspense fallback={<ProductLoading/>}>
                <ProductPage 
                    item={currentProduct}
                    sale={sale.sales_price}
                />
            </Suspense>
        )
    }
}