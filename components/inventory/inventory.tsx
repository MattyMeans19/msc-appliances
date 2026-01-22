'use client'
import { useState } from "react"
import ProductEditor from "./product-editor";
import { Product } from "@/lib/definitions";

interface List {
    products: Product[]
}

export default function InventoryDisplay(products: List){
    const [newItem, ToggleNew] = useState(false);
    const [list, updateList] = useState(products.products)


    return(
        <div className="grow max-h-screen w-[80vw] self-center border mx-10 mb-5 flex flex-col gap-10 p-10">
            <div className="grid grid-cols-3 justify-around border-5 border-slate-500/15 rounded-2xl shadow-2xl shadow-slate-500/25 p-5">
                <label htmlFor="search" className="md:text-3xl w-full">Search by Name or SKU: </label>
                <input type="text" id="search" placeholder="Search" className="col-span-2 border-2 border-slate-400 rounded-2xl w-full place-self-center p-2"></input>
            </div>
            <button className="border-5 border-double border-slate-400 rounded-full w-50 place-self-center bg-red-500 text-3xl active:bg-red-700"
                    onClick={(() => ToggleNew(true))}>
                Add Item
            </button>
            <div className="grow border">
                {list.map((product) => (
                    <div key={product.id}>
                        <h1>{product.name}</h1>
                        <h2>Sku: {product.sku}</h2>
                        <h3>Description: {product.info}</h3>
                    </div>
                ))}
            </div>
            <div className={`absolute w-[90vw] h-fit place-self-center top-30 mx-50
                border-5 border-double border-slate-600 bg-white ${newItem ? 'visible' : 'hidden'} flex flex-col`}>
                    <button className="text-3xl w-fit place-self-end cursor-pointer"
                        onClick={() => (ToggleNew(false))}>
                        ❌
                    </button>
                    <ProductEditor />
            </div>
        </div>
    )
}