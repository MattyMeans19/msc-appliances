'use client'
import { useEffect, useState } from "react"
import BGPhotoUpload from "./specials-photo-upload"
import { CldImage } from "next-cloudinary"
import { DeleteFromCloud, NewSpecial } from "@/actions/business/specials"

interface Active{
    active: boolean,
    toggleActive: Function
}

export default function SpecialsCreator(props: Active){
    const [descriptionLength, updateLength] = useState(0)
    const [special, updateSpecial] = useState(
        {
            name: "Title",
            info: "Description",
            textcolor: "#000000",
            bgimage: "",
            current: false,
            sales_price: 0
        }
    )
    const [currentImage, updateCurrent] = useState("")

    useEffect(() => {
        if(currentImage != special.bgimage){
           DeleteOldPhoto() 
        };     
    }, [currentImage, special.bgimage])

        function BGChanged(imageId: string){
        updateSpecial(prev => ({
          ...prev,
          bgimage: imageId
        })) 
    }

    async function DeleteOldPhoto() {
        if (currentImage === "") {
            updateCurrent(special.bgimage);
            return;
        }

        const idToDelete = currentImage;

        try {
            updateCurrent(special.bgimage);

            await fetch("/api/delete-photo", {
                method: "POST",
                body: JSON.stringify({ publicId: idToDelete }),
            });
            console.log("Deleted:", idToDelete);
        } catch (err) {
            console.error("Could not delete old photo", err);
        }
    }

    async function SaveSpecial(){
        if(special.bgimage != ""){
            const newRequest =  await NewSpecial(special);
            alert(newRequest);
            window.location.reload()
        }
    }

    async function Toggle(){
        await DeleteFromCloud(currentImage);
        props.toggleActive();
    }

    function UpdateSalePrice(value: number){
        let newValue;
        if(value > 100){
            newValue = 100;
        } else{
            newValue = value;
        }
        updateSpecial(prev =>({...prev, sales_price: newValue}))
    }

    return(
        <div className="overflow-y-scroll md:overflow-y-clip fixed top-0 left-0 h-screen w-screen bg-gray-800/20 flex flex-col md:flex-row z-10">
            <div className="flex flex-col justify-around gap-2 md:w-[40vw] md:min-h-[70vh] mx-[5vw] my-15 md:my-[20vh] bg-white p-15 border-5 border-double rounded-3xl">
                <div className="flex flex-col justify-around gap-5 md:gap-12">
                    <div className=" flex flex-nowrap justify-evenly">
                        <label htmlFor="sale_price">Sale(%):</label>
                        <input type="number" id="sale_price" className="border-2 w-20 text-3xl text-center" max={100}
                        onChange={(e) => UpdateSalePrice(e.target.valueAsNumber)}></input>
                        <BGPhotoUpload 
                        newName={BGChanged}
                        /> 
                    </div>
                    <label htmlFor="Name">Title:</label>
                    <input id="Name" type="text" name="Title" className="border" placeholder="Enter a title for this special!" required
                     onChange={(e) =>updateSpecial(prev => ({...prev, name: e.target.value}))}/>
                    <label htmlFor="Info">Description:</label>
                    <textarea id="Info" name="info" maxLength={100} className="border resize-none" required
                     onChange={(e) =>{
                        updateLength(e.target.value.length);
                        updateSpecial(prev =>({...prev, info: e.target.value}))
                     }} placeholder="Enter a description for your special here!"/>
                    <span className="text-end text-sm">{descriptionLength}/100</span>
                    <label htmlFor="TextColor">Text Color:</label>
                    <input type="color" id="TextColor" name="textColor" className="w-full" onChange={(e) =>updateSpecial(prev =>({...prev, textColor: e.target.value}))}/>
                    <button className="border-2 border-black rounded-2xl text-white bg-red-500 self-end md:self-center p-2 md:p-5 w-fit"
                            onClick={() =>(SaveSpecial())}>
                        Save
                    </button>
                </div>  
            </div>

            <div className="flex flex-col text-center place-content-center gap-20 md:w-[40vw] md:min-h-[60vh] mx-[5vw] md:my-[20vh] bg-white p-15 border-5 border-double rounded-3xl relative">
                <p className="w-[80%] self-center text-2xl md:text-5xl z-20" style={{color: special.textcolor}}>{special.info}</p>
                <button type="button" className="z-20 border-3 border-black rounded-3xl p-5 bg-red-500 text-white md:text-3xl place-self-center">View Specials Now!</button>
                    {special.bgimage != "" ? 
                    <CldImage 
                        width="1000"
                        height="1000"
                        alt="BG sample"
                        src={special.bgimage}
                        sizes="100%"
                        className="absolute left-0 top-0 h-full w-full rounded-3xl z-10"
                    />
                    : null
                }
            </div>
                {props.active ? 
                <div className="fixed top-0 right-0 z-20">
                    <button type="button" className="p-2 text-3xl md:text-5xl border bg-red-500 rounded-full absolute top-0 right-0"
                        onClick={() =>(Toggle())}>
                        X
                    </button>
                </div> 
                : null}
        </div>
    )
}