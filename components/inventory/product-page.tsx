'use client'
import { CldImage } from "next-cloudinary";
import { Product } from "@/lib/definitions"
import { useState } from "react";
import WarrantyInfo from "./warranty-english";
interface Item{
    item: Product,
    sale: number
}

export default function ProductPage(product: Item){
    const item = product.item;
    const [currentImage, changeCurrentImage] = useState(item.photos[0]);
    const salePrice = (((item.price / 100) - (item.price / 100) * (product.sale / 100)));

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return(
        <div className="grow py-5 flex flex-wrap gap-5 lg:grid grid-cols-5 relative">
            <div className="col-span-full w-full flex justify-between border-b-5 border-slate-400/25 shadow-lg p-2">
                <h1 className="lg:text-5xl">{item.name}</h1>
                <h2 className="lg:h-fit lg:text-3xl">SKU: {item.sku}</h2>  
            </div>
            
            <div className="row-start-2 col-start-1 col-span-3 flex rounded-3xl shadow-2xl border p-5 lg:ml-5">
                <div className="basis-1/3 flex flex-col gap-5 place-items-center">
                    {item.photos.map((photo, index) =>(
                        <CldImage 
                            alt="product image"
                            src={photo}
                            width={1920}
                            height={1080}
                            crop="fit"
                            key={index}
                            className="size-15 lg:size-25 cursor-pointer"
                            onClick={() => (changeCurrentImage(photo))}
                        />
                    ))}
                </div>
                <div className="basis-1/2">
                    <CldImage 
                        alt="product image"
                        src={currentImage}
                        width={1920}
                        height={1080}
                        className="size-100 lg:size-200"
                    />
                </div>                
            </div>

            <div className="col-start-4 row-start-2 col-span-2 w-full flex flex-col gap-5 p-5 lg:pr-15 h-fit">
                <p className="text-2xl">{item.info}</p>
                <span className="w-full text-end">Stock: {item.count}</span>
                <span className="w-full place-items-end text-3xl">
                    <p className={`${item.on_sale ? 'line-through' : null} decoration-red-500`}>${formatter.format(item.price / 100)}</p>
                    {item.on_sale ? <p className="text-red-500">${formatter.format(salePrice)}</p> : null}
                </span>
                <p>
                    {item.parts_labor_warranty} day Parts and Labor Warranty<br/>
                    {item.in_store_warranty} day IN STORE warranty
                </p>
                <button className="text-red-500 w-fit cursor-pointer">Warranty and Return Policy</button>
            </div>
            <div className="absolute h-[70vh] bg-white mx-10 overflow-y-scroll p-10 border-10 top-[-300]">
                <WarrantyInfo 
                    parts_labor={item.parts_labor_warranty}
                    in_store={item.in_store_warranty}
                />                
            </div>

        </div>
    )
}