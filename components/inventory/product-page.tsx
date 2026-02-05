'use client'
import { CldImage } from "next-cloudinary";
import { Product } from "@/lib/definitions"
import { useState } from "react";
import { useCart } from '@/context/CartContext';
import WarrantyInfo from "./warranty-english";


interface Item{
    item: Product,
    sale: number
}

export default function ProductPage(product: Item){
    const { addToCart } = useCart();
    const item = product.item;
    const [currentImage, changeCurrentImage] = useState(item.photos[0]);
    const [warrantyVisible, toggleWarranty] = useState(false)
    const salePrice = (((item.price / 100) - (item.price / 100) * (product.sale / 100)));

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return(
        <div className="grow py-5 flex flex-wrap gap-5 lg:grid grid-cols-5 lg:gap-10 relative">
            <div className="col-span-full w-full flex justify-between border-b-5 border-slate-400/25 shadow-lg p-2">
                <h1 className="lg:text-5xl">{item.name}</h1>
                <h2 className="lg:h-fit lg:text-3xl">SKU: {item.sku?.toString().replace(/\.0$/, '')}</h2>  
            </div>
            
            <div className="row-start-2 col-start-1 col-span-3 w-full h-full md:h-[70vh] flex rounded-3xl shadow-2xl border p-5 lg:ml-5">
                <div className="basis-1/3 flex flex-col gap-5 place-items-center overflow-y-scroll relative bg-slate-200 animate-pulse rounded-2xl overflow-hidden">
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
                            onLoad={(e) => e.currentTarget.parentElement?.classList.remove('animate-pulse', 'bg-slate-200')}
                            
                        />
                    ))}
                </div>
                <div className="basis-2/3 relative bg-slate-200 animate-pulse rounded-2xl overflow-hidden">
                    <CldImage 
                        alt="product image"
                        src={currentImage}
                        width={1920}
                        height={1080}
                        crop="fit"
                        className="h-full"
                        onLoad={(e) => e.currentTarget.parentElement?.classList.remove('animate-pulse', 'bg-slate-200')}
                    />
                </div>                
            </div>
            <div className="col-start-4 row-start-2 place-self-center col-span-2 w-full flex flex-col gap-5 p-5 lg:pr-15 h-fit rounded-3xl shadow-2xl">
                <div className="flex flex-nowrap justify-around text-center">
                    <h2>Category: <p className="font-bold">{item.type}</p></h2>
                    <h2>SubCategory: <p className="font-bold">{item.subtype}</p></h2>    
                </div>
                
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
                <button className="text-red-500 w-fit cursor-pointer"
                    onClick={() => (toggleWarranty(true))}>
                    Warranty and Return Policy
                </button>
                <button className="bg-red-500 active:bg-red-700 border w-fit p-5 rounded-3xl text-3xl cursor-pointer self-end"
                            onClick={() => {
                            addToCart({
                            sku: item.sku,
                            name: item.name,
                            price: item.price,
                            photo: item.photos[0],
                            quantity: 1
                        });
                        alert("Added to cart!");
                        }
                            }>
                    Add to cart
                </button>
            </div>
            {/* MODAL OVERLAY - This centers everything perfectly */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 ${warrantyVisible ? 'flex' : 'hidden'}`}>
                {/* MODAL BOX - Controlled size and centered */}
                <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <WarrantyInfo 
                        parts_labor={item.parts_labor_warranty}
                        in_store={item.in_store_warranty}
                        close={() => toggleWarranty(false)}
                        showSignature={false}
                    />                
                </div>
            </div>
        </div>
    )
}