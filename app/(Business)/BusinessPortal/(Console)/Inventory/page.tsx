import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetAllProducts, GetTypes } from "@/actions/business/inventory";
import InventoryDisplay from "@/components/inventory/inventory";
import { Product } from "@/lib/definitions";
import { GetPending } from "@/actions/business/actions";

interface PendingSale{
    transactionId: string,
    items: [{
      sku: string,
      name: string,
      price: number
    }]
    status: string,
    totalAmount: number
    createdAt: Date,
    fulfillmentType: string
    firstName: string,
    lastName: string,
}

export default async function Inventory(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;
    let productTypes = await GetTypes();
    let pendingOrders = await GetPending() as PendingSale[];
    

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    const products = await GetAllProducts() as Product[] | string

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
            currentUser={currentUser.toUpperCase()}
            currentPending={pendingOrders.length}
        />
        <InventoryDisplay 
            products={products}
            types={productTypes!}
        />
     </div>  
    )
    
}