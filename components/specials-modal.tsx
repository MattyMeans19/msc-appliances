import { GetSpecial } from "@/actions/business/actions"
import Link from "next/link"
import SpecialsImage from "./specials-image";

export default async function Specials(){

  const special = await GetSpecial();

    return(
          <div className="p-15 col-span-full lg:col-span-2 row-start-1 row-span-2 rounded-2xl shadow-2xl shadow-black flex flex-col gap-15 justify-around relative"
            style={{color: special?.special.textcolor}}>
            <p className="w-full text-center place-content-center text-2xl md:text-6xl z-20">{special?.special.info}</p>
            <Link href="/" className="border-3 border-black rounded-3xl p-5 bg-red-500 text-white md:text-3xl place-self-center z-20">View Sales Now!</Link>
            <SpecialsImage 
              image={special?.special.bgimage}
            />
          </div> 
    )
}