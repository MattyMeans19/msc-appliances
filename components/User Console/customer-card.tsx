'use client'
import { GetReceipt, GetSales } from "@/actions/business/actions";
import { Customer, Receipt, Sale } from "@/lib/definitions";
import { useState } from "react";
import ReceiptPopUp from "./receipt";

interface Info {
    customer : Customer
}

export default function CustomerCard(customer: Info){
    let currentCustomer = customer.customer
    const [fullView, ToggleView] = useState(false);
    const [receipt, ToggleReceipt] = useState(false);
    const [receiptData, updateReceiptData] = useState<Receipt>();
    const [sales, updateSales] = useState<Sale[] | string>([])

    async function CustomerSales(customer: Customer){
        const saleFetch = await GetSales(customer);
        updateSales(saleFetch)
    }

    async function GetReceieptData(id: string){
        const orderData = await GetReceipt(id);
        updateReceiptData(orderData!);
        ToggleReceipt(true);
    }

    return(
        <div>
            <div className="flex flex-col border bg-blue-100 lg:text-2xl cursor-pointer" onClick={() => {
                ToggleView(true);
                CustomerSales(currentCustomer)
            }}>
                <p className="bg-slate-400/35 flex flex-row justify-between px-2">
                    <span className="font-bold underline">Customer Name:</span> 
                    {currentCustomer.first_name} {currentCustomer.last_name}
                </p>
                <p className=" flex flex-row justify-between px-2">
                    <span className="font-bold underline">Email:</span> 
                    {currentCustomer.email}
                </p>
                <p className="bg-slate-400/35 flex flex-row justify-between px-2">
                    <span className="font-bold underline">Phone#: </span>
                    {currentCustomer.phone}
                </p>
            </div>
            {fullView ? 
            <div className="absolute h-full inset-0 border bg-slate-200">
                <div className="flex flex-col h-full">
                    <div className="lg:grid grid-cols-3">
                        <button className="col-start-3 place-self-end cursor-pointer w-fit lg:text-4xl" onClick={() => (ToggleView(false))}>
                            ❌
                        </button>
                        <p className="lg:border-b-5 row-start-2 text-center text-3xl">{currentCustomer.first_name} {currentCustomer.last_name}</p>
                        <p className="lg:border-b-5 row-start-2 text-center text-3xl">{currentCustomer.email}</p>
                        <p className="border-b-5 row-start-2 text-center text-3xl">{currentCustomer.phone}</p>
                    </div>

                    <div className="grow w-fit place-self-center mt-10 mx-10 overflow-y-scroll">
                        {typeof sales === "string" ? 
                        <p className="text-5xl">{sales}</p> :
                        <div className="w-full flex flex-col gap-5 px-10 min-h-full">
                            {sales.map((sale, index) => (
                                <div key={index} className="flex flex-col gap-2 lg:gap-0 lg:grid grid-cols-4 p-10 lg:text-2xl border-5 border-double bg-white relative">
                                    <button onClick={() => (GetReceieptData(sale.transactionId))} className="absolute top-2.5 right-5 cursor-pointer">🧾Receipt</button>
                                    <span className="col-span-1">Transaction #: {sale.transactionId}</span>
                                    <span className={`col-span-1 lg:text-center ${sale.status === 'Pending' ? 'text-red-500' : 'text-green-600'}`}>
                                        Status: {sale.status}
                                    </span>
                                    <span className="col-span-1">Total: ${sale.totalAmount}</span>
                                    <span>Date: {sale.createdAt.toLocaleString('en-US', {dateStyle: 'medium'})}</span>
                                    <span>Fulfillment: {sale.fulfillmentType}</span>
                                    {sale.items.map((item, index) => (
                                        <div key={index} className="col-span-full grid grid-cols-3 gap-10 mt-10 pt-5 border-t-2">
                                            <span className="text-end">SKU: {item.sku.split('.')[0]}</span>
                                            <span>NAME: {item.name}</span>
                                            <span>PRICE: {(item.price / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {receipt ? 
                                    <div className="bg-slate-400/85 fixed inset-0 z-80 w-screen h-full">
                                        <button className="fixed w-full bg-white z-100 text-3xl cursor-pointer"
                                            onClick={() =>(ToggleReceipt(false))}>
                                            ❌
                                        </button>
                                        <ReceiptPopUp order={receiptData!}/>
                                    </div> 
                                    : null}
                                </div>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>:
            null}          
        </div>

    )
}