'use client'
import {useState } from "react"
import SpecialsCreator from "./specials-creator"
import { Specials } from "@/lib/definitions"


export default function SpecialsEditor({specials}: {specials: Specials[]}, current: string){
    const [isCreating, changeStatus] = useState(false)
    const [selectedSpecial, updateSelected] = useState("");


    function CreateSpecial(){
        changeStatus(!isCreating)
    }

    return(
        <div className="border-5 border-double  md:text-3xl p-10 md:p-5 mx-10 col-span-3 row-span-2 relative">
            <h1 className="text-center text-2xl md:text-5xl underline mb-2">Specials Editor</h1>
            <h2>Current sale: {current}</h2>
            <div className="p-5 h-full flex flex-col justify-around md:gap-2">
                {isCreating ? 
                <div className="fixed top-0 right-0 z-20">
                    <button type="button" className="p-2 text-3xl md:text-5xl border bg-red-500 rounded-full absolute top-0 right-0"
                        onClick={() =>(CreateSpecial())}>
                        X
                    </button>
                </div> 
                : null}
                <select className="border p-2" onChange={(e) => {
                    const special = specials.find(s => s.name === e.target.value);
                    updateSelected(special!.name)
                }}>
                    {specials.map((s, index) =>(
                        <option key={index} value={s.name}>{s.name}</option>
                    ))}
                </select>
                <span className="text-center">OR</span>
                <button type="button" className="w-fit px-10 self-center border rounded-full bg-red-500 cursor-pointer"
                    onClick={() =>(CreateSpecial())}>
                    Create New
                </button>
                {isCreating ? <SpecialsCreator /> : null}
            </div>
        </div>
    )
}