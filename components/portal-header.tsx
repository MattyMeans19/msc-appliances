'use client'

import Link from "next/link";
import LogoutButton from "./logout-button";
import { GetPending } from "@/actions/business/actions";
import { useState, useEffect } from "react";

interface Tabs {
    general: string,
    inventory: string,
    tools: string,
    currentUser: string,
    currentPending: number,
}

export default function PortalHeader(props: Tabs){
    const [pendingOrders, UpdatePendingOrders] = useState(props.currentPending);
    const [timeDelay, UpdateTimeDelay] = useState(100)
    const [pulse, TogglePulse] = useState(false)

    useEffect(() => {
        const check = setInterval(CheckPending, timeDelay);

        return () => clearTimeout(check);
    }, [timeDelay])

    async function CheckPending(){
        let pending = await GetPending() as any[];
        if(pending.length >= pendingOrders && pending.length != 0){
            TogglePulse(true);
        } else{
            TogglePulse(false)
        }
        if(timeDelay === 100){
            UpdateTimeDelay(60000);
        }
        UpdatePendingOrders(pending.length);
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