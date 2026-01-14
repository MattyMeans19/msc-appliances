'use client'
import { useState } from "react"

import Link from "next/link"

export default function SpecialsPopup(){
    const [visible, toggleVisible] = useState(true);

    function XClicked(){
        toggleVisible(false);
    }

    return(
        <div className={`fixed md:absolute top-0 md:top-[-350] left-0 w-full h-screen bg-gray-800/50 place-content-center ${visible ? 'visible': 'hidden'}`}>
            <div className="border-5 w-[90vw] h-[80vh] bg-white place-self-center flex flex-col p-5">
              <button className="text-4xl text-center bg-red-500 rounded-2xl border w-10 place-self-end cursor-pointer"
              onClick={() => (XClicked())}>
                X
              </button>
              <p className="w-full text-center grow place-content-center text-4xl">This is where your Special's message will be displayed</p>
              <Link href="/" className="border-3 border-black rounded-full p-5 bg-red-500 text-white text-3xl place-self-center">View Specials Now!</Link>
            </div>
        </div>
    )
}