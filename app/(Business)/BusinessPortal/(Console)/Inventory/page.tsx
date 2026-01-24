import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import InventoryFilter from "@/components/inventory/inventory-filter";
import { GetProducts, GetTypes } from "@/actions/business/inventory";
import InventoryDisplay from "@/components/inventory/inventory";
import { Product } from "@/lib/definitions";

export default async function Inventory(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username;
    let productTypes = await GetTypes();

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    const products = await GetProducts() as Product[] | string

    if(typeof products === "string"){
        alert(products)
        return
    }

    return(
     <div className="grow flex flex-col gap-5 w-full relative">
        <PortalHeader 
            general="bg-gray-200"
            inventory="bg-gray-400"
            tools="bg-gray-200"
        />
        <div className="mx-5 md:mx-10 p-5 text-center place-content-center">
            <InventoryFilter 
                item={productTypes!}
            />
        </div>
        <InventoryDisplay 
            products={products}
        />
     </div>  
    )
    
}