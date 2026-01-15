import Link from "next/link"

export default function Specials(){

    return(
          <div className="p-15 col-span-full lg:col-span-2 row-start-1 row-span-2 rounded-2xl shadow-2xl shadow-black flex flex-col gap-15 justify-around">
            <p className="w-full text-center place-content-center text-2xl md:text-4xl">This is where your Special's message will be displayed</p>
              <Link href="/" className="border-3 border-black rounded-3xl p-5 bg-red-500 text-white md:text-3xl place-self-center">View Specials Now!</Link>
          </div> 
    )
}