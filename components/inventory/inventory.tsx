'use client'
import { useState } from "react"
import { Product } from "@/lib/definitions";
import InventoryItem from "./inventory-item";
import { DeleteProduct, GetProducts } from "@/actions/business/inventory";
import ProductAdder from "./product-adder";
import ProductEditor from "./product-editor";

interface List {
    products: Product[]
}

export default function InventoryDisplay(products: List){
    const [newItem, ToggleNew] = useState(false);
    const [list, updateList] = useState(products.products)
    const [editActive, ToggleEdit] = useState(false)
    

async function Delete(product: Product){
    const deleteRequest = await DeleteProduct(product.sku);
    product.photos.forEach(async(photo) =>{
            try {
                await fetch("/api/delete-photo", {
                method: "POST",
                body: JSON.stringify({ publicId: photo }),
            });
            console.log("Deleted:", photo);
            const newList = await GetProducts() as Product[];
            updateList(newList)
            } catch (err) {
                console.error("Could not delete old photo", err);
            }
    })
    alert(deleteRequest)
}

    return(
        <div className="grow h-full w-[80vw] self-center border mx-10 mb-5 flex flex-col gap-10 lg:p-10">
            <div className="grid grid-cols-3 justify-around border-5 border-slate-500/15 rounded-2xl shadow-2xl shadow-slate-500/25 p-5">
                <label htmlFor="search" className="md:text-3xl w-full">Search by Name or SKU: </label>
                <input type="text" id="search" placeholder="Search" className="col-span-2 border-2 border-slate-400 rounded-2xl w-full place-self-center p-2"></input>
            </div>
            <button className="border-5 border-double border-slate-400 rounded-full w-50 place-self-center bg-red-500 text-3xl active:bg-red-700"
                    onClick={(() => ToggleNew(true))}>
                Add Item
            </button>
            <div className="grow border-5 border-double flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 p-5 gap-5">
                {list.map((product) => (
                    <div key={product.id} className="col-span-1 border-5 border-double border-slate-400 p-2 rounded-2xl flex flex-col">
                        <div className="place-self-end">
                            <button className="cursor-pointer" onClick={() => (Delete(product))}>🗑️</button>
                            <button className="cursor-pointer" onClick={() => (ToggleEdit(true))}>📝</button>
                        </div>
                       <InventoryItem 
                        name={product.name}
                        sku={product.sku}
                        photo={product.photos[product.photos.length - 1]}
                        count={product.count}
                        price={product.price}
                        on_sale={product.on_sale}
                        manual_sale={product.manual_sale}
                    />
                    {editActive ? 
                    <ProductEditor 
                        item = {product}
                        toggle={() =>(ToggleEdit(false))}
                    /> :
                    null}
                    </div>
                    
                ))}
            </div>
            <div className={`fixed w-full h-full place-self-center top-0 mx-50
                border-5 border-double border-slate-600 bg-slate-200 ${newItem ? 'visible' : 'hidden'} flex flex-col`}>
                    <button className="text-3xl w-fit place-self-end cursor-pointer"
                        onClick={() => (ToggleNew(false))}>
                        ❌
                    </button>
                    <ProductAdder
                    />
            </div>
        </div>
    )
}