
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";

export default async function UserConsole(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username;

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    return(
        <div>
            <PortalHeader
            general="bg-gray-400"
            inventory="bg-gray-200"
            tools="bg-gray-200"
            />

        </div>
    )
}