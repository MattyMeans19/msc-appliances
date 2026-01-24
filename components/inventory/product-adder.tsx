'use client'
import { useState } from "react";

import InventoryPhotoUpload from "./inventory-image-upload"
import { NewProduct } from "@/lib/definitions";
import NewImagePreview from "./image-preview";
import { AddProduct } from "@/actions/business/inventory";


export default function ProductAdder(){
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
        photos: [],
        manual_sale: 0
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
        <div className="h-full flex flex-col md:grid grid-cols-4 gap-5 bg-slate-200 lg:px-15">
            <div className="lg:col-span-1 row-span-3 flex flex-col gap-5">
                <label htmlFor="product_name" className="">Product Name(text limit: 60):</label>
                <textarea id="product_name" maxLength={60} className="border-2 bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, name: e.target.value})))}>
                </textarea>
                <label htmlFor="product_sku" className="">Product Sku:</label>
                <input type="text" id="product_sku" className="border-2 bg-white text-center"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, sku: e.target.value})))}>
                </input>
                <label htmlFor="product_info" className="">Product Description(text limit: 500):</label>
                <textarea id="product_info" maxLength={500} className="border-2 bg-white h-80 text-2xl"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, info: e.target.value})))}>
                </textarea>
            </div>
            <div className="col-start-1 col-span-1 row-start-4 flex flex-wrap justify-center ">
                <label htmlFor="deliverable" className="basis-1/2 lg: text-end text-2xl">Deliverable:</label>
                <input type="checkbox" id="deliverable" className="basis-1/2 lg:size-5"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, deliverable: e.target.checked})))}>
                </input>
                <label htmlFor="on_sale" className="basis-1/2 lg: text-end text-2xl mt-5">On Sale:</label>
                <input type="checkbox" id="on_sale" className="basis-1/2 lg:size-5 mt-5"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, on_sale: e.target.checked})))}>
                </input>
                <label htmlFor="manual_sale" className="mt-10 lg:text-2xl">Unique Sale Price (Will override current Specials % sale):</label>
                <input type="number" id="manual_sale" className="w-fit border bg-white"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, manual_sale: e.target.valueAsNumber})))}>
                </input>   
            </div>
            <div className="col-start-2 col-span-full h-fit place-content-center text-center lg:text-end flex flex-col lg:flex-row lg:flex-nowrap lg:mt-15">
                <label htmlFor="in_store_warranty" className="mr-5">In Store Warranty:</label>
                <input type="number" id="in_store_warranty" min={0} className="border-2 w-15 text-center bg-white self-center"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, in_store_warranty: e.target.valueAsNumber})))}>
                </input>
                <span className="font-bold">Days</span>
                <label htmlFor="parts_labor_warranty" className="lg:mx-5">Parts and Labor Warranty:</label>
                <input type="number" id="parts_labor_warranty" min={0} className="border-2 w-15 text-center bg-white self-center"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, parts_labor_warranty: e.target.valueAsNumber})))}>
                </input>
                <span className="font-bold">Days</span>
            </div>
            <div className="row-start-2 col-start-3 span-full gap-10 w-full flex flex-col lg:flex-row justify-center place-items-center">
                <label htmlFor="count" className="">Stock Amount:</label>
                <input type="number" id="count" min={0} className="border-2 w-50 text-center  bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, count: e.target.valueAsNumber})))}>
                </input>
                <label htmlFor="product_cost" className=" self-center">Product Cost:</label>
                <input type="number" id="product_cost" min={0} className="border-2 w-50 text-center self-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, cost: e.target.valueAsNumber})))}>
                </input>
                <label htmlFor="product_price" className=" self-center">Product Price:</label>
                <input type="number" id="product_price" min={0} className="border-2 w-50 text-center self-center bg-white"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, price: e.target.valueAsNumber})))}>
                </input>
            </div>
            <div className="grow col-start-2 col-span-full row-span-2 border-5 border-double flex flex-col lg:grid grid-cols-4 gap-5 p-2 overflow-y-scroll">
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
            <button className="col-start-2 row-start-5 col-span-full w-fit place-self-center 
            border-2 rounded-full px-5 text-3xl bg-red-500 active:bg-red-700 cursor-pointer"
                onClick={() =>(SaveItem())}>
                Save
                </button>
        </div>
    )
}