'use client'
import { Logout } from "@/actions/business/actions";


export default function LogoutButton(){
    return(
        <button className="border px-2 bg-gray-300 cursor-pointer" onClick={() => (Logout())}>Logout</button>
    )
}