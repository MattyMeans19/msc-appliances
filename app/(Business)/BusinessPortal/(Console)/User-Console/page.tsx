
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import { redirect } from "next/navigation";
import PortalHeader from "@/components/portal-header";
import { GetCustomers, GetSalesDates, GetPending } from "@/actions/business/actions";
import CustomerLookUp from "@/components/User Console/customer-look-up";
import PendingOrders from "@/components/User Console/pending-orders";
import DailySales from "@/components/User Console/daily-sales";

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
    const sales = await GetSalesDates();

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
                <div className="border col-start-4 col-span-3 p-5 mx-10">
                    <DailySales 
                        dates = {sales}
                    />
                </div>
                <div className="border col-span-full mx-10 mb-5 flex flex-col">
                    <h1 className="text-center text-4xl font-bold underline mb-5">Pending Orders</h1>
                    {pendingOrders.length > 0 ?
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
                    </div> :
                    <p className="text-5xl text-center h-full place-content-center text-red-500">No Pending Orders</p>}
                </div>
            </div>
        </div>
    )
}