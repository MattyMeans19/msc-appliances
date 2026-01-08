'use client'

import Image from "next/image"
import Link from "next/link";
import logo from "@/public/MSC-logo.png";
import Menu from "@/public/menu-48.png";
import Drawer from "./mobile-drawer";
import { useState } from "react";

export default function Navbar(){
    const [drawer, toggleDrawer] = useState(false);

    function DrawerView(){
        toggleDrawer(!drawer)
    }

    return(
        <div className="flex flex-col md:grid grid-cols-3 w-full relative">
            <Image 
                src={logo}
                width={350}
                height={350}
                alt="Metro Service Company LLC logo"
                loading="eager"
                className="lg:mx-15 place-self-center"
            />
            <div className="md:flex flex-row md:w-full md:h-50 hidden justify-around col-span-2 place-items-end
                 border-b-2 border-red-500/30 pb-2 rounded-2xl">
                <Link href="/" aria-description="Return to home page" className="Nav-Item">Home</Link>
                <Link href="/" aria-description="Products page link" className="Nav-Item">Products</Link>
                <Link href="/" aria-description="Delivery and Refunds information page" className="Nav-Item">Delivery and Refunds</Link>
                <Link href="/UsedParts" aria-description="Link to used parts ebay page" className="Nav-Item">Used Parts</Link>
                <Link href="/" aria-description="Link to current cart" className="Nav-Item"><h2 className="bg-red-500 text-center rounded-2xl">0</h2>🛒</Link>
            </div>

            <div className="md:hidden w-full flex flex-row justify-around border-b-2 border-red-500/50 pb-5">
                <button onClick={() => DrawerView()} aria-description="Menu Drawer Button">
                    <img src={Menu.src}></img>
                </button>
                <Link href="/" className="Nav-Item"><h2 className="bg-red-500 text-center rounded-2xl" aria-description="Link to current cart">0</h2>🛒</Link>
            </div>

            <Drawer 
                visible = {drawer}
            />

        </div>

    )
}