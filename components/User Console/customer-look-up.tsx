'use client';
import { Customer } from "@/lib/definitions";
import { useState } from "react";
import CustomerCard from "./customer-card";

interface CustomerList{
    customers: Customer[] | string
}

export default function CustomerLookUp(list: CustomerList){
    const customers = list.customers;
    const [currentList, updateList] = useState<Customer[] | string>("")
    const [searchParam, changeSearchParam] = useState("");

    function Search(query: string){
        if(query != "" && (typeof customers != "string")){
            let searchResults = customers.filter(customer => 
                customer.first_name.toLowerCase().includes(query.toLowerCase()) ||
                customer.last_name.toLowerCase().includes(query.toLowerCase()) ||
                customer.email.toLowerCase().includes(query.toLowerCase()) ||
                customer.phone.includes(query));

            if(searchResults.length > 0){
                updateList(searchResults)
            } else {
                updateList("No Matching Customers Found!")
            }
        } else{
            alert("Check your search parameters and try again!")
        }
    }


    return(
        <div className="border mx-10 lg:p-5 col-span-3 flex flex-col max-h-[55vh] gap-10">
            <h1 className="text-3xl text-center underline font-bold">Customer Look-Up</h1>
            <label htmlFor="search" className="text-lg font-bold text-center"> Search by Name, Email, or Phone(xxx-xxx-xxxx)</label>
            <div className="self-center w-full text-3xl flex flex-col justify-center gap-5 border-b-5 pb-5">
                <input id="search" className="border w-fit self-center text-lg lg:text-2xl" autoComplete="off" onChange={(e) => changeSearchParam(e.target.value)}/>
                <button className="bg-red-500 px-10 rounded-full"
                    onClick={() => (Search(searchParam))}>
                    Search
                </button> 
            </div>
            {typeof currentList != "string" ?
            <div className="flex flex-col gap-5 overflow-y-scroll">
                {currentList.map((customer, index) => (
                    <CustomerCard 
                        key={index}
                        customer={customer}
                    />
                ))}
            </div> :
            <span>{currentList}</span>}
        </div>
    )
}