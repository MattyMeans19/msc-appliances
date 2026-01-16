
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import SpecialsSelector from "@/components/special-selector";

export default async function UserConsole(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username;

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    return(
        <div className="grow flex flex-col gap-25">
            <PortalHeader
            general="bg-gray-400"
            inventory="bg-gray-200"
            tools="bg-gray-200"
            />

            <div className="grow flex flex-col gap-20 md:grid grid-cols-6">
                <SpecialsSelector />
                <div className="border text-5xl mx-10 p-20 col-start-4 col-span-3 row-span-2">
                    <span>Customer look up box</span>
                </div>
                <div className="border col-span-full p-20 mx-10 mb-5 row-start-3 text-7xl">
                    <span>Sales by date</span>
                </div>
            </div>
        </div>
    )
}