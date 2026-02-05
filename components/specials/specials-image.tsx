'use client'
import { CldImage } from "next-cloudinary";

interface Image {
    image: string
}

export default function SpecialsImage(props: Image){
    return(
        <CldImage 
              alt="Specials Background"
              fill
              sizes="full"
              src={props.image}
              className="absolute z-10"
        />
    )
}