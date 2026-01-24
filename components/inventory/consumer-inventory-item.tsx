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
            console.log(currentPrice)
        }
    }, [currentSale, product, currentPrice])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });


    return(
        <div className="col-span-1 h-full relative">
            <p className={`${product.on_sale ? 'visible' : 'hidden'} text-2xl absolute top-[-40] 
            w-full h-full px-10 text-white bg-red-500 rounded-full animate-bounce animate-infinite`}>On Sale!</p>
            <h1 className="font-bold lg:text-xl">{product.name}</h1>
            <h2 className="text-center">Sku: {product.sku}</h2>
            <CldImage 
                alt="product image"
                width={500}
                height={500}
                src={product.photo}
                crop="fill"
            />
            <h3>stock: {product.count}</h3>
            <div className="flex flex-col justify-between w-full text-end mt-auto">
                <h3 className={`${product.on_sale ? 'line-through' : null} decoration-red-500`}>${formatter.format(product.price/100)}</h3>
                {product.on_sale ? <p className="text-red-500">${formatter.format(currentPrice)}</p> : null}
            </div>
                  
        </div>
    )
}