'use client'

import Link from "next/link";
import LogoutButton from "./logout-button";
import { GetPending } from "@/actions/business/actions";
import { useState, useEffect } from "react";
import { Sale } from "@/lib/definitions";

interface Tabs {
    general: string,
    inventory: string,
    tools: string,
    currentUser: string
}

export default function PortalHeader(props: Tabs){
    const [pulse, TogglePulse] = useState(false)

    useEffect(() => {
        setTimeout(CheckPending, 1000);
    }, [])

    async function CheckPending(){
        let pending = await GetPending() as any[];
        if(pending.length === 0){
            TogglePulse(false);
        } else{
            TogglePulse(true)
        }
    }

    return(
        <div className="mt-5 gap-2 w-full flex flex-nowrap border-b justify-around border-red-500/40">
            <span className="md:text-3xl text-center md:w-50">Hello, {props.currentUser}!</span>
            <div className="flex flex-row gap-2">
                <Link href="/BusinessPortal/User-Console" className={`Portal-Btn ${props.general} relative`}>
                General
                {pulse ?
                <span className="absolute top-[-10] left-[-10] size-5 bg-red-600 rounded-full animate-pulse"></span>:
                null}
                </Link>
                <Link href="/BusinessPortal/Inventory" className={`Portal-Btn ${props.inventory}`}>Inventory</Link>
                <Link href="/BusinessPortal/Admin-Tools" className={`Portal-Btn ${props.tools}`}>Admin Tools</Link>               
            </div>
            <LogoutButton /> 
        </div>
    )
}