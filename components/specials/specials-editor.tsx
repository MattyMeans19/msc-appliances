'use client'
import {useState } from "react"
import SpecialsCreator from "./specials-creator"
import { Specials } from "@/lib/definitions"
import { UpdateSpecial } from "@/actions/business/specials"

export default function SpecialsEditor({specials}: {specials: Specials[]}){
    const [isCreating, changeStatus] = useState(false);
    const currentSpecial = specials.filter(special => special.current === true);


    function CreateSpecial(){
        changeStatus(!isCreating)
    }

    return(
        <div className="border-5 border-double  md:text-3xl p-10 md:p-5 mx-10 col-span-3 row-span-2 relative">
            <h1 className="text-center text-2xl md:text-5xl underline mb-2">Specials Editor</h1>
            <div className="p-5 h-full flex flex-col">
                {isCreating ? 
                <div className="fixed top-0 right-0 z-20">
                    <button type="button" className="p-2 text-3xl md:text-5xl border bg-red-500 rounded-full absolute top-0 right-0"
                        onClick={() =>(CreateSpecial())}>
                        X
                    </button>
                </div> 
                : null}
                <label htmlFor="specials" className="text-lg">Select Special:</label>
                <select className="border p-2" id="specials" defaultValue={currentSpecial[0].name} onChange={(e) => {
                    const special = specials.find(s => s.name === e.target.value);
                    UpdateSpecial(special!);
                    alert("Special Updated to: "  + e.target.value)
                }}>
                    {specials.map((s, index) =>(
                        <option key={index} value={s.name}>{s.name}</option>
                    ))}
                </select>
                <span className="text-center my-25">OR</span>
                <button type="button" className="w-fit px-10 self-center border rounded-full bg-red-500 cursor-pointer"
                    onClick={() =>(CreateSpecial())}>
                    Create New
                </button>
                {isCreating ? <SpecialsCreator /> : null}
            </div>
        </div>
    )
}