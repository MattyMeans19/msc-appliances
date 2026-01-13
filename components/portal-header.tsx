import Link from "next/link";
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import LogoutButton from "./logout-button";

interface Tabs {
    general: string,
    inventory: string,
    tools: string
}

export default async function PortalHeader(props: Tabs){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;

    return(
        <div className="mt-10 w-full flex flex-nowrap justify-around border-b border-red-500/40 rounded-4xl">
            <span className="place-content-end mb-2 md:text-3xl text-center w-50">Hello, {currentUser}!</span>
            <Link href="/BusinessPortal/User-Console" className={`Portal-Btn ${props.general}`}>General</Link>
            <Link href="/BusinessPortal/Inventory" className={`Portal-Btn ${props.inventory}`}>Inventory</Link>
            <Link href="/BusinessPortal/Admin-Tools" className={`Portal-Btn ${props.tools}`}>Admin Tools</Link>
            <LogoutButton />
        </div>
    )
}