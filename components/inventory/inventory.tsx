'use client'
import { useState } from "react"

export default function InventoryDisplay(){
    const [newItem, ToggleNew] = useState(false);

    return(
        <div className="grow max-h-screen w-[80vw] self-center border mx-10 mb-5 flex flex-col gap-10 p-10 relative">
            <div className="grid grid-cols-3 justify-around border-5 border-slate-500/15 rounded-2xl shadow-2xl shadow-slate-500/25 p-5">
                <label htmlFor="search" className="md:text-3xl w-full">Search by Name or SKU: </label>
                <input type="text" id="search" placeholder="Search" className="col-span-2 border-2 border-slate-400 rounded-2xl w-full place-self-center p-2"></input>
            </div>
            <button className="border-5 border-double border-slate-400 rounded-full w-50 place-self-center bg-red-500 text-3xl active:bg-red-700"
                    onClick={(() => ToggleNew(true))}>
                Add Item
            </button>
            <div className="grow border">

            </div>
            <div className={`not-first:absolute w-[90vw] h-[90vh] place-self-center top-0
                border-5 border-double border-slate-600 bg-white ${newItem ? 'visible' : 'hidden'}`}>

            </div>
        </div>
    )
}