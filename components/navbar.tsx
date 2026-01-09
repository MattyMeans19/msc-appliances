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
                className="lg:mx-15 place-self-center col-span-1"
            />
            <div className="md:flex flex-row lg:w-full lg:h-50 hidden justify-around col-span-2 place-items-end
                 border-b-2 border-red-500/30 pb-2 rounded-2xl">
                <Link href="/" aria-description="Return to home page" className="Nav-Item">Home</Link>
                <Link href="/Products" aria-description="Products page link" className="Nav-Item">Products</Link>
                <Link href="/Contact" aria-description="Contact information link" className="Nav-Item">Contact Us</Link>
                <Link href="/About" aria-description="About Metro Service Company LLC link" className="Nav-Item">About Us</Link>
                <Link href="/Cart" aria-description="Link to current cart" className="Nav-Item"><h2 className="bg-red-500 text-center rounded-2xl">0</h2>🛒</Link>
            </div>

            <div className="md:hidden w-full flex flex-row justify-around border-b-2 border-red-500/50 pb-5">
                <button onClick={() => DrawerView()} aria-description="Menu Drawer Button">
                    <img src={Menu.src}></img>
                </button>
                <Link href="/Cart" className="Nav-Item"><h2 className="bg-red-500 text-center rounded-2xl" aria-description="Link to current cart">0</h2>🛒</Link>
            </div>

            <Drawer 
                visible = {drawer}
                clicked={DrawerView}
            />

        </div>

    )
}