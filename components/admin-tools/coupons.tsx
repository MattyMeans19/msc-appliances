'use client';
import { CreateCoupon } from "@/actions/business/coupons";
import { Coupon } from "@/lib/definitions";
import { useState } from "react";
import Locked from "./locked";

interface List{
    coupons: Coupon[] | string,
    user: string
}

export default function Coupons(coupons: List){
    const [newCoupon, updateNew] = useState({
        code: "",
        discount: 0,
        type: "$"
    })

    async function NewCoupon(){
        const infoComplete = Object.values(newCoupon).every(value => value !== "");
        if(infoComplete){
         const request = await CreateCoupon(newCoupon);
         alert(request);
         window.location.reload();
        } else{
            alert("Please fill out all coupon details!")
        }
        
    }

    return(
        <div className="col-span-2 border-5 border-double h-full flex flex-col gap-5 p-5 relative">
            {coupons.user !== "Employee" ? null : <Locked />}
            <h1 className="font-bold underline text-3xl text-center">Coupon Codes</h1>
            <div className="flex flex-col gap-5 border-b">
                <div className="flex flex-nowrap gap-2">
                    <label htmlFor="code" className="text-2xl basis-1/5">Code: </label>
                    <input type="text" id="code" autoComplete="off" className="uppercase text-2xl border" onChange={(e) => updateNew(prev => ({ ...prev, code: e.target.value.toUpperCase()}))}/>   
                </div>
                <div className="flex flex-nowrap lg:gap-2">
                    <label htmlFor="discount" className="text-2xl basis-1/5">Amount: </label>
                    <input type="number" id="discount" autoComplete="off" className="text-2xl border w-50 lg:w-fit" onChange={(e) => updateNew(prev => ({ ...prev, discount: e.target.valueAsNumber}))}/>
                    <select className="basis-1/5 border" id="sale_type" onChange={(e) => updateNew(prev => ({ ...prev, type: e.target.value}))}>
                    <option value="$" className="text-center text-2xl">$</option>
                    <option value="%" className="text-center text-2xl">%</option>
                    </select>    
                </div>
                <button className="border bg-red-500 px-5 text-2xl w-fit self-center rounded-full mb-5"
                    onClick={() => (NewCoupon())}>
                    Add Coupon
                </button>
            </div>
            <div className="flex flex-col gap-5 overflow-y-scroll">
                <h1 className="text-4xl bold underline text-center">Current Available Codes</h1>
                {typeof coupons.coupons === "string" ? 
                <p>{coupons.coupons}</p> :
                coupons.coupons.map((coupon, index) => (
                    <div key={index} className="flex flex-row flex-nowrap gap-5 justify-around text-4xl border">
                        <p>{coupon.code}</p>
                        {coupon.type === "$" ? <p>{coupon.type}{coupon.discount} off!</p> : <p>{coupon.discount}{coupon.type} off!</p>}
                    </div>
                )) }
            </div>
        </div>
    )
}