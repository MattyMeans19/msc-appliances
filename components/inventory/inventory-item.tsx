'use client'
import { GetSpecial } from "@/actions/business/specials";
import { Specials } from "@/lib/definitions";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";


interface SelectedProduct{
        name: string,
        sku: string,
        photo: string,
        count: number,
        price: number,
        on_sale: boolean,
        manual_sale: number
}
export default function InventoryItem(props: SelectedProduct){
    const product = props;
    const [currentSale, updateCurrentSale] = useState(0);
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
<div className="h-full w-full flex flex-col relative border p-4 bg-white shadow-sm rounded-lg">
    {/* On Sale Badge - Pinned to Top Left */}
    {product.on_sale && (
        <span className="absolute -top-3 -left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs lg:text-sm font-bold shadow-md">
            On Sale!
        </span>
    )}

    {/* Header Info */}
    <div className="mb-2">
        <h1 className="font-bold text-sm lg:text-lg leading-tight line-clamp-1">{product.name}</h1>
        <p className="text-gray-500 text-center text-xs">Sku: {product.sku}</p>
    </div>

    {/* Image Container with Fixed Ratio */}
    <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 mb-2">
        <CldImage 
            alt={product.name}
            width={500}
            height={500}
            src={product.photo}
            crop="fill"
            className="hover:scale-105 transition-transform duration-200"
        />
    </div>

    {/* Footer Data */}
    <div className="flex flex-col grow justify-between">
        <h3 className="text-xs font-medium text-gray-700">Stock: {product.count}</h3>
        
        <div className="text-end mt-2">
            {product.on_sale ? (
                <>
                    <p className="text-xs text-gray-400 line-through decoration-red-500 leading-none">
                        ${formatter.format(product.price / 100)}
                    </p>
                    <p className="text-lg font-bold text-red-600 leading-tight">
                        ${formatter.format(currentPrice)}
                    </p>
                </>
            ) : (
                <p className="text-lg font-bold text-gray-900 leading-tight">
                    ${formatter.format(product.price / 100)}
                </p>
            )}
        </div>
    </div>
</div>
    )
}