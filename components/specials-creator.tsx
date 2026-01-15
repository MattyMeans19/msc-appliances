'use client'
import { useCallback, useState } from "react"
import BGPhotoUpload from "./specials-photo-upload"
import { CldImage } from "next-cloudinary"

export default function SpecialsCreator(){
    const [descriptionLength, updateLength] = useState(0)
    const [special, updateSpecial] = useState(
        {
            name: "Title",
            info: "Description",
            textColor: "",
            bgImage: ""
        }
    )
    const [currentImage, updateCurrent] = useState("")

    function NameChanged(){
        const input = document.getElementById("Name") as HTMLInputElement;
        let info = input.value
        updateSpecial(prev => ({
          ...prev,
          name: info
        }))  
    }
    function InfoChanged(info: string){
        updateSpecial(prev => ({
          ...prev,
          info: info
        }))  
    }
        function ColorChanged(info: string){
        updateSpecial(prev => ({
          ...prev,
          textColor: info
        }))  
    }

    async function BGChanged(imageId: string){
        if (special.bgImage) {
        try {
            await fetch("/api/delete-photo", {
                method: "POST",
                body: JSON.stringify({ publicId: special.bgImage }),
            });
            console.log("Deleted")
        } catch (err) {
            console.error("Could not delete old photo", err);
        }
    }
        updateSpecial(prev => ({
          ...prev,
          bgImage: imageId
        })) 
    }


    function ChangeLength(){
        const description = document.getElementById("Info") as HTMLTextAreaElement;
        updateLength(description.value.length);
        InfoChanged(description.value);
    }

    function GetColor(){
        const color = document.getElementById("TextColor") as HTMLInputElement;
        let newColor = color.value
        ColorChanged(newColor)
        console.log(special.textColor)
    }

    return(
        <div className="overflow-y-scroll md:overflow-y-clip fixed top-0 left-0 h-screen w-screen bg-gray-800/20 flex flex-col md:flex-row z-10">
            <div className="flex flex-col justify-around gap-2 md:w-[40vw] md:min-h-[70vh] mx-[5vw] my-15 md:my-[20vh] bg-white p-15 border-5 border-double rounded-3xl">
                <form className="flex flex-col justify-around gap-5 md:gap-12">
                    <BGPhotoUpload 
                        newName={BGChanged}
                    /> 
                    <label htmlFor="Name">Title:</label>
                    <input id="Name" type="text" name="Title" className="border" placeholder="Enter a title for this special!" onChange={() =>{NameChanged()}}/>
                    <label htmlFor="Info">Description:</label>
                    <textarea id="Info" name="info" maxLength={100} className="border resize-none" onChange={ChangeLength} placeholder="Enter a description for your special here!"/>
                    <span className="text-end text-sm">{descriptionLength}/100</span>
                    <label htmlFor="TextColor">Text Color:</label>
                    <input type="color" id="TextColor" name="textColor" className="w-full" onChange={() =>(GetColor())}/>
                    <button type="submit" className="border-2 border-black rounded-2xl text-white bg-red-500 self-end md:self-center p-2 md:p-5 w-fit">Save</button>
                    </form>  
            </div>

            <div className="flex flex-col text-center justify-around gap-2 md:w-[40vw] md:min-h-[60vh] mx-[5vw] md:my-[20vh] bg-white p-15 border-5 border-double rounded-3xl relative">
                <p className="w-[80%] self-center text-2xl md:text-5xl z-20 grow" style={{color: special.textColor}}>{special.info}</p>
                <button type="button" className="z-20 border-3 border-black rounded-3xl p-5 bg-red-500 text-white md:text-3xl place-self-center">View Specials Now!</button>
                    {special.bgImage != "" ? 
                    <CldImage 
                        width="1000"
                        height="1000"
                        alt="BG sample"
                        src={special.bgImage}
                        sizes="100%"
                        className="absolute left-0 top-0 h-full w-full rounded-3xl z-10"
                    />
                    : null
                }
            </div>
        </div>
    )
}