'use client'

import Image from "next/image"
import Link from "next/link";
import logo from "@/public/MSC-logo.png";
import Menu from "@/public/menu-48.png";
import Drawer from "./mobile-drawer";
import { useEffect, useState } from "react";
import LoadingPage from "./Loading/page-loading";
import { usePathname } from "next/navigation";
import { useCart } from '@/context/CartContext';
import { useLoading } from "@/context/LoadingContext";

export default function Navbar(){
    const [drawer, toggleDrawer] = useState(false);
    const [loading, ToggleLoading] = useState(false);
    const [page, updatePage] = useState("");
    const pathname = usePathname();

    const { cart } = useCart();
    const { isLoading, loadingMessage, startLoading } = useLoading();
    const [mounted, setMounted] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
                <Link href="/" aria-description="Return to home page" className="Nav-Item" 
                onClick={() => startLoading("Home")}>
                    Home
                </Link>
                <Link href="/Products" aria-description="Products page link" className="Nav-Item" 
                onClick={() => startLoading("Products")}>
                    Products
                </Link>
                <Link href="/Contact" aria-description="Contact information link" className="Nav-Item" 
                 onClick={() => startLoading("Contact")}>
                    Contact Us
                </Link>
                <Link href="/About" aria-description="About Metro Service Company LLC link" className="Nav-Item" 
                 onClick={() => startLoading("About")}>
                    About Us
                </Link>
                <Link href="/Cart" aria-description="Link to current cart" className="Nav-Item flex" 
                 onClick={() => startLoading("Cart")}>
                   <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
                        {totalItems}
                    </span>
                    🛒
                </Link>
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
            {isLoading && <LoadingPage current={loadingMessage} />}
        </div>

    )
}