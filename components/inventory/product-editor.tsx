'use client'
import { useState } from "react";

import InventoryPhotoUpload from "./inventory-image-upload"
import { Product } from "@/lib/definitions";
import NewImagePreview from "./image-preview";
import { ProductUpdate } from "@/actions/business/inventory";

interface Item{
    item: Product,
    toggle: Function
}


export default function ProductEditor(item: Item){
    const [product, UpdateProduct] = useState<Product>(item.item)

    function AddedPhotos(newImage: string){
        UpdateProduct(prevState => ({
            ...prevState,
            photos: [...prevState.photos, newImage]
        }));
    }
    function RemovePhotos(id: string){
        const removed_photo = product.photos.filter(image => image !== id )
        if(removed_photo != null || undefined){
        UpdateProduct(prevState => ({
            ...prevState,
            photos: removed_photo
        }));            
        } else {
            alert("Sorry, something went wrong deleting the photo!")
        }
    }

    async function SaveItem(){
        const infoComplete = Object.values(product).every(value => value !== "");
        if(infoComplete){
            const result = await ProductUpdate(product);
            alert(result);
            window.location.reload()
        } else {
            alert("Please fill out every field!")
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return(
        <div className="fixed top-0 left-0 place-self-center w-full h-full p-5 grow basis-full flex flex-col
            gap-5 bg-slate-200 lg:px-15 border-5 border-double border-slate-600 overflow-y-scroll">
            <button className="text-3xl text-end w-fit absolute top-0 right-0 cursor-pointer"
                onClick={() => (item.toggle())}>
                ❌
            </button>
            <div className="h-full flex flex-col gap-5 md:grid grid-cols-3">
                <label htmlFor="product_name" className="col-start-1 text-center place-content-end">Product Name(text limit: 60):</label>
                <textarea id="product_name" maxLength={60} className="border p-5 bg-white row-start-2 text-2xl" defaultValue={product.name}
                    onChange={(e) => (UpdateProduct(prev => ({...prev, name: e.target.value})))}>
                </textarea>
                <label htmlFor="product_info" className="text-center place-content-end">Product Description(text limit: 500):</label>
                <textarea id="product_info" maxLength={500} className="border-2 bg-white col-start-2 row-start-2h-full" defaultValue={product.info}
                    onChange={(e) => (UpdateProduct(prev => ({...prev, info: e.target.value})))}>
                </textarea>
                <div className="w- h-full flex flex-nowrap">
                    <label htmlFor="product_sku" className="text-center text-2xl">Product Sku:</label>
                    <input type="text" id="product_sku" className="border place-self-start bg-white text-center" defaultValue={product.sku}
                            onChange={(e) => (UpdateProduct(prev => ({...prev, sku: e.target.value})))}>
                    </input>   
                </div>

            </div>
            <div className="">
                <div className="flex flex-col justify-center">
                    <label htmlFor="deliverable" className="basis-1/2">Deliverable:</label>
                    <input type="checkbox" id="deliverable" className="basis-1/2" defaultChecked={product.deliverable}
                        onChange={(e) => (UpdateProduct(prev => ({...prev, deliverable: e.target.checked})))}>
                    </input>
                    <label htmlFor="on_sale" className="basis-1/2 mt-5">On Sale:</label>
                    <input type="checkbox" id="on_sale" className="basis-1/2 mt-5" defaultChecked={product.on_sale}
                        onChange={(e) => (UpdateProduct(prev => ({...prev, on_sale: e.target.checked})))}>
                    </input>
                </div>
                <label htmlFor="manual_sale" className="mt-10">Unique Sale Price (Will override current Specials % sale):</label>
                <input type="number" id="manual_sale" className="w-fit border bg-white text-center"
                        defaultValue={(product.manual_sale/100)}
                    onChange={(e) => (UpdateProduct(prev => ({...prev, manual_sale: (e.target.valueAsNumber * 100)})))}>
                </input>
                <label htmlFor="product_cost" className="text-2xl basis-1/4">Product Cost:</label>
                <input type="number" id="product_cost" min={0} className="border-2 w-50 text-center h-fit bg-white"
                        defaultValue={(product.cost/100)}
                    onChange={(e) => (UpdateProduct(prev => ({...prev, cost: (e.target.valueAsNumber * 100)})))}>
                </input>
                <label htmlFor="product_price" className="text-2xl basis-1/4">Product Price:</label>
                <input type="number" id="product_price" min={0} className="border-2 w-50 text-center h-fit bg-white"
                        defaultValue={(product.price/100)}
                    onChange={(e) => (UpdateProduct(prev => ({...prev, price: (e.target.valueAsNumber * 100)})))}>
                </input>
            </div>
            <div className="border-5 border-double grid grid-cols-4 gap-5 lg:overflow-y-scroll p-5">
                <h1 className="col-span-full text-3xl text-center underline">Photos:</h1>
                {product.photos.map((photo, index) =>(
                    <NewImagePreview 
                        key={index}
                        source={photo}
                        remove_photo={RemovePhotos}
                    />
                ))}
                <InventoryPhotoUpload 
                    addPhotos={AddedPhotos}
                />
            </div>
            <button className="w-fit place-self-center 
            border-2 rounded-full px-5 mt-10 text-3xl bg-red-500 active:bg-red-700 cursor-pointer"
                onClick={() =>(SaveItem())}>
                Save
                </button>
        </div>
    )
}