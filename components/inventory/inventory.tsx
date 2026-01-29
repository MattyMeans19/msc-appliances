'use client'
import { useState } from "react"
import { Product } from "@/lib/definitions";
import InventoryItem from "./inventory-item";
import { DeleteProduct, GetAllProducts } from "@/actions/business/inventory";
import ProductAdder from "./product-adder";
import ProductEditor from "./product-editor";
import InventoryFilter from "@/components/inventory/inventory-filter";

interface List {
    products: Product[],
    types: any[]
}

interface Filter{
            type: string,
            subtype: string,
            delivery: boolean,
            sale: boolean
}

export default function InventoryDisplay(products: List){
    const [newItem, ToggleNew] = useState(false);
    const [list, updateList] = useState(products.products)
    const [editingSku, setEditingSku] = useState<string | null>(null);    

    async function Delete(product: Product){
        const deleteRequest = await DeleteProduct(product.sku);
        for (const photo of product.photos) {
            try {
                const cleanId = photo.includes('/') ? photo.split('/').pop() : photo;
                    const res = await fetch("/api/delete-photo", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ publicId: cleanId }),
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error(`Failed to delete ${cleanId}:`, errorData);
                    } else {
                        console.log("Deleted photo:", cleanId);
                    }
                    } catch (err) {
                        console.error("Network error deleting photo:", err);
                    }
                }

                // 3. Update the UI ONCE after all deletions are attempted
                const newList = await GetAllProducts() as Product[];
                updateList(newList);
                
                alert(deleteRequest);
        }

    function filterProducts(params: Filter) {
        const filteredList = products.products.filter((item) => {
            // If type is "*", this variable is always true (skipping the filter)
            const matchType = params.type === "*" || item.type === params.type;

            // If subtype is "*" or empty, this variable is always true
            const matchSubtype = params.subtype === "*" || params.subtype === "" || item.subtype === params.subtype;

            // For checkboxes: Only filter if the user has actually checked them.
            // If they are unchecked (false), we show everything.
            const matchDelivery = !params.delivery || Boolean(item.deliverable) === params.delivery;
            const matchSale = !params.sale || Boolean(item.on_sale) === params.sale;

            return matchType && matchSubtype && matchDelivery && matchSale;
        });

        updateList(filteredList);
    }

    function Search(query: string){
        if(query === ""){
            updateList(products.products)
        } else{
            let search = products.products.filter(item => item.name.includes(query)  || item.sku.includes(query));
            updateList(search);
        }
    }

    return(
        <div className="grow h-full w-[80vw] self-center mx-10 mb-5 flex flex-col gap-10 lg:p-10">
                <InventoryFilter 
                item={products.types!}
                filter={filterProducts}
            />
            <div className="grid grid-cols-3 justify-around border-5 border-slate-500/15 rounded-2xl shadow-2xl shadow-slate-500/25 p-5">
                <label htmlFor="search" className="md:text-3xl w-full">Search by Name or SKU: </label>
                <input type="text" id="search" placeholder="Search" className="col-span-2 border-2 border-slate-400 rounded-2xl w-full place-self-center p-2"
                    onChange={(e) => Search(e.target.value)}>
                </input>
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
                            {/* Set the SKU of the specific product to be edited */}
                            <button className="cursor-pointer" onClick={() => (setEditingSku(product.sku))}>📝</button>
                        </div>
                        
                        <InventoryItem 
                            name={product.name}
                            sku={product.sku}
                            photo={product.photos[0]}
                            count={product.count}
                            price={product.price}
                            on_sale={product.on_sale}
                            manual_sale={product.manual_sale}
                        />

                        {/* Check if THIS specific product is the one we are editing */}
                        {editingSku === product.sku && (
                            <ProductEditor 
                                item={product}
                                toggle={() => setEditingSku(null)} // Close by setting back to null
                                types={products.types}
                            />
                        )}
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
                    types={products.types}
                    />
            </div>
        </div>
    )
}