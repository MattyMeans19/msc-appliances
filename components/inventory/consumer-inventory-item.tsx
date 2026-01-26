'use client'
import { GetSpecial } from "@/actions/business/specials";
import { Specials } from "@/lib/definitions";
import { CldImage } from "next-cloudinary";
import { Suspense, useEffect, useState } from "react";
import CardLoading from "../Loading/card-image-loading";




interface SelectedProduct{
        name: string,
        sku: string,
        photo: string,
        count: number,
        price: number,
        on_sale: boolean,
        manual_sale: number
}
export default function ConsumerInventoryItem(props: SelectedProduct){
    const product = props;
    const [currentSale, updateCurrentSale] = useState(0)
    const uniqueSale = (product.manual_sale / 100);
    const [currentPrice, updatePrice] = useState(product.price/100);
    const salePrice = (((product.price / 100) - (product.price / 100) * (currentSale / 100)));

    async function GetSale(){
        let sale = await GetSpecial() as Specials
        updateCurrentSale(sale.sales_price)
    }

    useEffect(() => {
        if(product.on_sale){
            if(product.manual_sale > 0 && currentPrice === (product.price/100)){
                updatePrice(uniqueSale);
            } else if(product.manual_sale === 0 && currentPrice === (product.price/100)){
                GetSale();
                updatePrice(salePrice)
            }
        }
    }, [currentSale, product, currentPrice])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });


    return(
       <div className="col-span-1 h-full relative flex flex-col">
    {/* Sale Badge - Adjusted positioning to not break layout */}
    {product.on_sale && (
        <p className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1 text-sm font-bold text-white bg-red-500 rounded-full animate-bounce">
            On Sale!
        </p>
    )}

    {/* 1. Fixed Title Slot */}
    <div className="h-15 mb-2 flex items-center justify-center"> 
        <h1 className="font-bold lg:text-lg text-center line-clamp-2 leading-tight">
            {product.name}
        </h1>
    </div>

    {/* Sku Section */}
    <h2 className="text-center text-sm text-gray-500 mb-3">Sku: {product.sku?.toString().replace(/\.0$/, '')}</h2>

    {/* 2. Aspect-Ratio Locked Image */}
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
        <CardLoading />
            <CldImage 
                alt={product.name}
                fill // Use fill with relative parent for better responsiveness
                src={product.photo}
                crop="fit"
                className="object-cover"
            />            

    </div>

    {/* 3. Bottom Alignment */}
    <div className="mt-auto pt-2">
        <h3 className="text-sm font-medium text-center">{product.count} in stock</h3>
        
        <div className="flex flex-row justify-center items-center mt-2 border-t pt-2">
            <h3 className={`${product.on_sale ? 'line-through text-gray-400 text-xs' : 'font-bold'} decoration-red-500`}>
                ${formatter.format(product.price/100)}
            </h3>
            {product.on_sale && (
                <p className="text-red-600 font-bold text-lg">
                    ${formatter.format(currentPrice)}
                </p>
            )}
        </div>
    </div>
</div>
    )
}