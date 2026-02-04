'use client'

import { FulfillOrder } from "@/actions/business/actions"

interface PendingSale{
    transactionId: string,
    items: [{
      sku: string,
      name: string,
      price: number
    }]
    status: string,
    totalAmount: number
    createdAt: Date,
    fulfillmentType: string
    firstName: string,
    lastName: string,
}


export default function PendingOrders(order: PendingSale){

    async function MarkComplete(id: string){
        const fulfilled = await FulfillOrder(id);
        alert(fulfilled);
        window.location.reload()
    }

    return(
        <div className="grid grid-cols-3 gap-5 border text-lg text-center place-items-center bg-slate-300 rounded-3xl p-2">
            <p className="font-bold">{order.firstName} {order.lastName}</p> 
            <p>Order#: {order.transactionId}</p>
            <p>{order.createdAt.toLocaleString('en-US', {dateStyle: 'medium'})}</p>
            <p className="text-red-500">{order.status}</p>
            <p>{order.fulfillmentType}</p>
            <p>Total: ${order.totalAmount}</p>
            <div className="border-2 p-5 flex flex-col text-lg col-span-full w-full overflow-y-scroll">
                {order.items.map((item, index) => (
                    <div key={index}>
                        <p>Sku: {item.sku.split(".")[0]}</p>
                        <p>Name: {item.name}</p>
                        <p>Price: ${(item.price/100).toFixed(2)}</p>
                    </div>
                ))}    
            </div>
            <button className="col-span-full border px-10 rounded-full bg-red-500 active:bg-red-700"
                    onClick={() => (MarkComplete(order.transactionId))}>
                Mark Fulfilled
            </button>
        </div>
    )
}