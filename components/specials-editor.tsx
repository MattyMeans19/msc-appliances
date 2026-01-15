'use client'
import { useState } from "react"
import SpecialsCreator from "./specials-creator"

export default function SpecialsEditor(){
    const [isCreating, changeStatus] = useState(false)


    function CreateSpecial(){
        changeStatus(!isCreating)
    }

    return(
        <div className="border-5 border-double  md:text-3xl p-20 md:p-10 mx-10 col-span-3 row-span-2 relative">
            <h1 className="text-center text-2xl md:text-5xl underline mb-10">Specials Editor</h1>
            <div className="p-5 h-full flex flex-col justify-around md:gap-2">
                {isCreating ? 
                <div className="fixed top-0 right-0 z-20">
                    <button type="button" className="p-2 text-3xl md:text-5xl border bg-red-500 rounded-full absolute top-0 right-0"
                        onClick={() =>(CreateSpecial())}>
                        X
                    </button>
                </div> 
                : null}
                <select className="border p-2">

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