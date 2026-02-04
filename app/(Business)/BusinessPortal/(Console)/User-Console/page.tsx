
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetCustomers, GetPending } from "@/actions/business/actions";
import CustomerLookUp from "@/components/User Console/customer-look-up";
import PendingOrders from "@/components/User Console/pending-orders";

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

export default async function UserConsole(){
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;
    let pendingOrders = await GetPending() as PendingSale[];

    if(currentUser === undefined){
        redirect("/BusinessPortal")
    }

    const customers = await GetCustomers() as any[] | string;

    return(
        <div className="grow flex flex-col gap-25 h-full">
            <PortalHeader
            general="bg-gray-400"
            inventory="bg-gray-200"
            tools="bg-gray-200"
            currentUser={currentUser.toUpperCase()}
            currentPending={pendingOrders.length}
            />

            <div className="grow flex flex-col gap-15 md:grid grid-cols-6 relative">
                <CustomerLookUp 
                    customers={customers}
                />
                <div className="border col-start-4 col-span-3 p-20 mx-10 text-7xl">
                    <span>Sales by date</span>
                </div>
                <div className="border col-span-full mx-10 mb-5 flex flex-col">
                    <h1 className="text-center text-4xl font-bold underline mb-5">Pending Orders</h1>
                    <div className="w-full flex flex-col lg:grid grid-cols-2 lg:p-10 gap-5">
                        {pendingOrders.map((order, index) =>(
                            <PendingOrders 
                                key={index}
                                transactionId= {order.transactionId}
                                items= {order.items}
                                status= {order.status}
                                totalAmount= {order.totalAmount}
                                createdAt= {order.createdAt}
                                fulfillmentType={order.fulfillmentType}
                                firstName= {order.firstName}
                                lastName= {order.lastName}
                            />
                        ))}    
                    </div>
                    
                </div>
            </div>
        </div>
    )
}