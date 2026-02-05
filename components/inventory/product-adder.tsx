'use client'
import { useState } from "react";
import { CldImage } from "next-cloudinary"
import InventoryPhotoUpload from "./inventory-image-upload"
import { NewProduct } from "@/lib/definitions";
import NewImagePreview from "./image-preview";
import { AddProduct, GetSubtypes } from "@/actions/business/inventory";

interface ProductTypes{
    types: any[]
}

export default function ProductAdder(types: ProductTypes){
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
        manual_sale: 0,
        type: "",
        subtype: ""
    })
    const [typeList] = useState(types.types)

    const [subtypes, changeSubTypes]: any = useState ([]);
    async function updateSubtypes(type: string){
        if(type != "*"){
            const subs = await GetSubtypes(type);
            changeSubTypes(subs);
        }  else {
            changeSubTypes([]);
        }
    }


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
        <div className="h-full grow basis-full py-5 flex flex-wrap gap-5 lg:grid grid-cols-5 lg:gap-10 overflow-y-scroll">
            <div className="col-span-full w-full flex justify-between border-b-5 h-fit">
                <label htmlFor="product_name" className="col-start-1 text-center place-content-end">Product Name(text limit: 60):</label>
                <textarea id="product_name" maxLength={60} className="border p-5 bg-white w-full text-2xl"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, name: e.target.value})))}>
                </textarea>
                <label htmlFor="product_sku" className="text-center place-self-end text-2xl">Product Sku:</label>
                <input type="text" id="product_sku" className="border place-self-end bg-white text-center"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, sku: e.target.value})))}>
                </input>   
            </div>

            <div className="row-start-2 col-start-1 col-span-3 w-full h-fit flex flex-wrap rounded-3xl shadow-2xl border p-5 lg:ml-5">
                <h1 className="basis-full w-full text-3xl text-center underline">Photos:</h1>
                <div className="basis-1/3 h-[60vh] flex flex-col gap-5 place-items-center overflow-y-scroll">
                    {product.photos.map((photo, index) =>(
                        <NewImagePreview 
                            key={index}
                            source={photo}
                            remove_photo={RemovePhotos}
                        />
                    ))}                    
                </div>
                {product.photos.length > 0 ?
                <div className="basis-2/3 h-full">
                    <p>Thumbnail/Main Photo</p>
                  <CldImage 
                    alt="product image"
                    src={product.photos[0]}
                    width={1920}
                    height={1080}
                    className="h-[60vh] w-[90%] mx-5 border-5 border-red-500"
                />    
                </div> : null}
               <div className="basis-full place-items-center">
                    <InventoryPhotoUpload 
                        addPhotos={AddedPhotos}
                    />
               </div>
                
            </div>

            <div className="col-start-4 row-start-2 col-span-2 w-full flex flex-col gap-5 p-5 lg:pr-15 h-fit rounded-3xl shadow-2xl">
                <label htmlFor="product_info" className="text-center place-content-end">Product Description(text limit: 500):</label>
                <textarea id="product_info" maxLength={500} className="grow border-2 bg-white col-start-2 row-start-2 h-full text-2xl"
                    onChange={(e) => (UpdateProduct(prev => ({...prev, info: e.target.value})))}>
                </textarea>
                <div className="flex flex-col">
                    <label htmlFor="deliverable" className="basis-1/2 h-full self-center">Deliverable:</label>
                    <input type="checkbox" id="deliverable" className="basis-1/2 h-full self-center"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, deliverable: e.target.checked})))}>
                    </input>
                    <label htmlFor="on_sale" className="basis-1/2 mt-5 h-full self-center">On Sale:</label>
                    <input type="checkbox" id="on_sale" className="basis-1/2 h-full self-center"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, on_sale: e.target.checked})))}>
                    </input>
                    <label htmlFor="product_types" className="w-full text-center">Types</label>
                    <select className="border w-full bg-white" id="product_types"
                    onChange={(e) => {
                        UpdateProduct(prev => ({...prev, type: e.target.value}));
                        updateSubtypes(e.target.value);
                    }}>
                        <option value="*">All</option>
                        {typeList.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    {subtypes ?
                        <div className="flex flex-col w-full gap-5">
                            <label htmlFor="product_subtypes" className="w-full text-center">Subtypes</label>
                            <select className="border w-full bg-white" id="product_subtypes" defaultValue="All"
                            onChange={(e) => {
                                UpdateProduct(prev => ({...prev, subtype: e.target.value}));
                            }}>
                                <option value="*">All</option>
                                {subtypes.map((type: any, index: number) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        : null
                    }
                </div>
                <div className="flex flex-col md:grid grid-cols-2 gap-2">
                    <label htmlFor="manual_sale" className="mt-10">Unique Sale Price (Will override current Specials % sale):</label>
                    <input type="number" id="manual_sale" className="w-fit border h-fit self-center bg-white text-center"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, manual_sale: (e.target.valueAsNumber * 100)})))}>
                    </input>
                    <label htmlFor="product_cost" className="text-2xl basis-1/4">Product Cost:</label>
                    <input type="number" id="product_cost" min={0} className="border-2 w-50 text-center h-fit bg-white"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, cost: (e.target.valueAsNumber * 100)})))}>
                    </input>
                    <label htmlFor="product_price" className="text-2xl basis-1/4">Product Price:</label>
                    <input type="number" id="product_price" min={0} className="border-2 w-50 text-center h-fit bg-white"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, price: (e.target.valueAsNumber * 100)})))}>
                    </input>
                    <label htmlFor="in_store_warranty" className="text-2xl basis-1/4">In Store Warranty(days)</label>
                    <input type="number" id="in_store_warranty" min={0} className="border-2 w-50 text-center h-fit bg-white col-start-2 self-end"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, in_store_warranty: e.target.valueAsNumber})))}>
                    </input>
                    <label htmlFor="parts_labor_warranty" className="text-2xl basis-1/4">Parts and Labor Warranty(days)</label>
                    <input type="number" id="parts_labor_warranty" min={0} className="border-2 w-50 text-center h-fit bg-white col-start-2 self-end"
                        onChange={(e) => (UpdateProduct(prev => ({...prev, parts_labor_warranty: e.target.valueAsNumber})))}>
                    </input>    
                </div>
                
            </div>
            <button className="absolute top-0 right-15 text-3xl cursor-pointer"
                onClick={() =>(SaveItem())}>
                💾
                </button>
        </div>
    )
}