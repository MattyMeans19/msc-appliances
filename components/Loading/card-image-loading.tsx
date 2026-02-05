import Image from "next/image"
import LoadingCircle from "../icons8-loading-50.png"

export default function CardLoading(){
    return(
        <div className="bg-slate-500 self-center z-10 w-full h-full place-content-center place-items-center" >
            <Image 
                alt="loading"
                width={50}
                height={50}
                src={LoadingCircle}
                className="mr-3 size-5 animate-spin w-fit h-fit"
            />
        </div>
    )
}