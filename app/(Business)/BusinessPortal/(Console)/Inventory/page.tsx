import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import InventoryTable from "@/components/inventory-table";
import MobileTable from "@/components/inventory-table-mobile";

export default async function Inventory(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username;

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
                <span>Inventory options and filters</span>
            </div>
            <div className="col-span-full row-span-4 md:mx-10 hidden md:block  overflow-y-scroll">
                <InventoryTable />
            </div>
            <div className="h-[50vh] mx-5 visible md:hidden overflow-y-scroll">
                <MobileTable />
            </div>
        </div>
     </div>  
    )
    
}