'use client'
import { useState } from "react";

import InventoryPhotoUpload from "./inventory-image-upload"
import { NewProduct } from "@/lib/definitions";
import NewImagePreview from "./image-preview";
import { AddProduct } from "@/actions/business/inventory";

export default function ProductEditor(){
    const [product, UpdateProduct] = useState<NewProduct>({
        name: "",
        info: "",
        sku: "",
        cost: 0,
        price: 0,
        deliverable: false,
        on_sale: false,
        count: 0,
        in_store_warranty: 0,
        parts_labor_warranty: 0,
        photos: []
    })

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
            const result = await AddProduct(product);
            alert(result);
            window.location.reload()
        } else {
            alert("Please fill out every field!")
        }
    }


    return(
        <div className="grow basis-full flex flex-col lg:grid grid-cols-4 grid-rows-8 gap-5 bg-slate-200 px-15">
            <div className="lg:col-span-1 row-span-8 flex flex-col gap-5">
                <label htmlFor="product_name" className="">Product Name(text limit: 60):</label>
                <input type="text" id="product_name" maxLength={60} className="border-2 bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, name: e.target.value})))}>
                </input>
                <label htmlFor="product_sku" className="">Product Sku:</label>
                <input type="text" id="product_sku" className="border-2 bg-white text-center"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, sku: e.target.value})))}>
                </input>
                <label htmlFor="product_info" className="">Product Description(text limit: 500):</label>
                <textarea id="product_info" maxLength={500} className="border-2 bg-white h-80"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, info: e.target.value})))}>
                </textarea>
                <div className="flex flex-wrap">
                    <label htmlFor="deliverable" className="basis-1/2">Deliverable:</label>
                    <input type="checkbox" id="deliverable" className="basis-1/2"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, deliverable: e.target.checked})))}>
                    </input>
                    <label htmlFor="on_sale" className="basis-1/2 mt-5">On Sale:</label>
                    <input type="checkbox" id="on_sale" className="basis-1/2 mt-5"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, on_sale: e.target.checked})))}>
                    </input>    
                </div>
                <label htmlFor="product_cost" className=" self-center">Product Cost:</label>
                <input type="number" id="product_cost" min={0} className="border-2 w-50 text-center self-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, cost: e.target.valueAsNumber})))}>
                </input>
                <label htmlFor="product_price" className=" self-center">Product Price:</label>
                <input type="number" id="product_price" min={0} className="border-2 w-50 text-center self-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, price: e.target.valueAsNumber})))}>
                </input>
            </div>
            <div className="col-start-2 col-span-full h-fit place-content-center flex flex-col lg:flex-row lg:flex-nowrap">
                <label htmlFor="in_store_warranty" className="mr-5">In Store Warranty:</label>
                <input type="number" id="in_store_warranty" min={0} className="border-2 w-15 text-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, in_store_warranty: e.target.valueAsNumber})))}>
                </input>
                <span className="font-bold">Days</span>
                <label htmlFor="parts_labor_warranty" className="mx-5">Parts and Labor Warranty:</label>
                <input type="number" id="parts_labor_warranty" min={0} className="border-2 w-15 text-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, parts_labor_warranty: e.target.valueAsNumber})))}>
                </input>
                <span className="font-bold">Days</span>
            </div>
            <div className="row-start-2 col-start-3 w-ful">
                <label htmlFor="count" className="">Stock Amount:</label>
                <input type="number" id="count" min={0} className="border-2 w-50 text-center  bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, count: e.target.valueAsNumber})))}>
                </input>
            </div>
            <div className="grow col-start-2 col-span-full row-start-3 row-span-5 border-5 border-double grid grid-cols-4 gap-5">
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
            <button className="col-start-2 row-start-8 col-span-full w-fit place-self-center 
            border-2 rounded-full px-5 text-3xl bg-red-500 active:bg-red-700 cursor-pointer"
                onClick={() =>(SaveItem())}>
                Save
                </button>
        </div>
    )
}