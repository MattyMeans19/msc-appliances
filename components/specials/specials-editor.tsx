'use client'
import {useState } from "react"
import SpecialsCreator from "./specials-creator"
import { Specials } from "@/lib/definitions"
import { DeleteSpecial, UpdateSpecial } from "@/actions/business/specials"

export default function SpecialsEditor({specials}: {specials: Specials[]}){
    const [isCreating, changeStatus] = useState(false);
    const currentSpecial = specials.filter(special => special.current === true);
    const [selectedSpecial, updateSelected] = useState(currentSpecial[0])

    function CreateSpecial(){
        changeStatus(!isCreating)
    }

    async function Delete(){
        if(selectedSpecial.name != currentSpecial[0].name){
            const deleteRequest = await DeleteSpecial(selectedSpecial);
            alert(deleteRequest);
            window.location.reload()   
        } else {
            alert("Please select a new Special before deleting!")
        }
        
    }

    async function SpecialSelected(){
        let newSpecial = specials.filter(special => special.name === selectedSpecial.name)
        const updateRequest = await UpdateSpecial(newSpecial[0]);
        alert(updateRequest);
        window.location.reload()
    }

    return(
        <div className="border-5 border-double  md:text-3xl p-10 md:p-5 mx-10 col-span-3 row-span-2 relative">
            <h1 className="text-center text-2xl md:text-5xl underline mb-2">Specials Editor</h1>
            <div className="p-5 h-full flex flex-col">

                <div className="flex flex-nowrap justify-around w-full">
                    <label htmlFor="specials" className="text-lg">Select Special:</label>
                    <select className="border p-2 basis-1/2" id="specials" defaultValue={currentSpecial[0].name} onChange={(e) => {
                        const special = specials.find(s => s.name === e.target.value);
                        updateSelected(special!);
                    }}>
                    {specials.map((s, index) =>(
                            <option  key={index} value={s.name}>
                                {s.name}
                            </option>  
                    ))} 
                    </select>
                    <button className="cursor-pointer" onClick={() => (SpecialSelected())}>✔️</button> 
                    <button className="cursor-pointer" onClick={() => (Delete())}>🗑️</button>
                </div>
                <span className="text-center my-25">OR</span>
                <button type="button" className="w-fit px-10 self-center border rounded-full bg-red-500 cursor-pointer"
                    onClick={() =>(CreateSpecial())}>
                    Create New
                </button>
                {isCreating ?
                 <SpecialsCreator
                    active={isCreating}
                    toggleActive={CreateSpecial}
                 /> : null}
            </div>
        </div>
    )
}