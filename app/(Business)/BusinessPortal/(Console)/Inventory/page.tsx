import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import InventoryFilter from "@/components/inventory/inventory-filter";
import { GetSubtypes, GetTypes } from "@/actions/business/inventory";

export default async function Inventory(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username;
    let productTypes = await GetTypes();

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }


    return(
     <div className="grow flex flex-col">
        <PortalHeader 
            general="bg-gray-200"
            inventory="bg-gray-400"
            tools="bg-gray-200"
        />
        <div className="grow my-5 flex flex-col gap-20 md:grid grid-cols-6 grid-rows-5">
            <div className="border col-span-full mx-5 md:mx-10 text-center place-content-center text-7xl">
                <InventoryFilter 
                    item={productTypes!}
                />
            </div>
            <div className="col-span-full row-span-4 md:mx-10 hidden md:block  overflow-y-scroll">
            </div>
        </div>
     </div>  
    )
    
}