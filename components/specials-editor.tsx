'use client'
import { useState } from "react"

export default function SpecialsEditor(){
    const [isCreating, changeStatus] = useState(false)
    const [descriptionLength, updateLength] = useState(0)

    function CreateSpecial(){
        changeStatus(!isCreating)
    }
    function ChangeLength(){
        const description = document.getElementById("Info") as HTMLTextAreaElement;
        updateLength(description.value.length)
    }
    return(
        <div className="border-5 border-double  md:text-3xl p-20 md:p-10 mx-10 col-span-3 row-span-2">
            <h1 className="text-center text-2xl md:text-5xl underline mb-10">Specials Editor</h1>
            {isCreating ? 
            <div>
                <form className="flex flex-col gap-2">
                    <label htmlFor="Name">Title:</label>
                    <input id="Name" type="text" name="Title" className="border" placeholder="Enter a title for this special!">
                
                    </input>
                    <label htmlFor="Info">Description:</label>
                    <textarea id="Info" name="info" maxLength={60} className="border resize-none" onChange={ChangeLength} placeholder="Enter a description for your special here!">
                
                    </textarea>
                    <span className="text-end text-sm">{descriptionLength}/60</span>
                    <span>Cloudinary Image Upload Widget will go here!</span>
                    <button type="submit" className="border rounded-full bg-red-500 self-center p-5 w-fit">Save</button>
                </form>
            </div> :
            <div className="p-5 h-full flex flex-col justify-around md:gap-2">
                <select className="border p-2">

                </select>
                <span className="text-center">OR</span>
                <button className="w-fit px-10 self-center border rounded-full bg-red-500 cursor-pointer"
                    onClick={() =>(CreateSpecial())}>
                    Create New
                </button>
            </div>}
        </div>
    )
}