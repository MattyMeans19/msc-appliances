'use client'
import { Logout } from "@/actions/business/actions";


export default function LogoutButton(){
    return(
        <button className="border p-2 bg-gray-300 rounded-t-2xl" onClick={() => (Logout())}>Logout</button>
    )
}