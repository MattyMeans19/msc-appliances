'use client'
import { useActionState, useEffect, useState } from "react";
import { Login } from "@/actions/business/actions";

export default function Portal(){
    const [formState, formAction] = useActionState(Login, undefined);
    const [loggingIn, messageVisiblity] = useState(false)

    useEffect(() =>{
        if(formState?.message && loggingIn){
            messageVisiblity(false);
        }
    }, [formState, loggingIn]);

    return(
        <div className="w-screen lg:w-[70vw] h-full place-content-center mx-0 lg:mx-[15vw]">
            <form action={formAction} className="border-5 border-gray-400 inset-ring-8 inset-ring-slate-400/20 w-full h-[40%] flex flex-col justify-around px-50">
                <input type="text" autoComplete="off" name="username" placeholder="Username" className="border-2 w-70 md:w-100 place-self-center p-2"/>
                <input type="password" autoComplete="off" name="password" placeholder="Password" className="border-2 w-70 md:w-100 place-self-center p-2"/>
                {formState?.message && <p className="text-red-500 text-center">{formState.message}</p>}
                <button type="submit" className="place-self-center border border-gray-600 px-10 rounded-full bg-red-500 md:text-3xl"
                    onClick={() => messageVisiblity(true)}>
                    {loggingIn ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    )
}