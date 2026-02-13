'use client'
import { GetReceipt, GetSales } from "@/actions/business/actions";
import { Customer, Receipt, Sale } from "@/lib/definitions";
import { useState } from "react";
import ReceiptPopUp from "./receipt";
import WarrantyWindow from "./warranty-window";

interface Info {
    customer : Customer
}

export default function CustomerCard(customer: Info){
    let currentCustomer = customer.customer
    const [fullView, ToggleView] = useState(false);
    const [receipt, ToggleReceipt] = useState(false);
    const [warranty, ToggleWarranty] = useState(false);
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

    async function GetWarrantyData(id:string){
        const warrantyData = await GetReceipt(id);
        updateReceiptData(warrantyData!);
        ToggleWarranty(true);
    }

    const handlePrintAll = () => {
        const printContent = document.getElementById('all-warranties-print');
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        
        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>All Warranties - Order ${receiptData}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { font-family: sans-serif; padding: 20px; }
                            /* This forces each warranty onto a new physical page when printing */
                            .page-break { page-break-after: always; }
                            h1, h2 { color: #dc2626; }
                            .sig-box { border: 2px dashed #ccc; padding: 20px; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };


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
                                <div key={index} className="flex flex-col gap-2 lg:gap-5 md:grid grid-cols-3 p-10 lg:text-2xl border-5 border-double bg-white relative">
                                    <span className="col-span-1">Transaction #: {sale.transactionId}</span>
                                    <span className={`col-span-1 lg:text-center ${sale.status === 'Pending' ? 'text-red-500' : 'text-green-600'}`}>
                                        Status: {sale.status}
                                    </span>
                                    <span className="col-span-1">Total: ${sale.totalAmount}</span>
                                    <span className="col-span-1 w-full lg:text-center">Date: {sale.createdAt.toLocaleString('en-US', {dateStyle: 'medium'})}</span>
                                    <span className="col-span-1 w-full lg:text-center">Fulfillment: {sale.fulfillmentType}</span>
                                    <div className="lg:absolute top-2.5 right-5 flex flex-col gap-5">
                                        <button onClick={() => (GetReceieptData(sale.transactionId))} className="cursor-pointer border-b w-fit self-center border-red-500">🧾Receipt</button>
                                        <button onClick={() => (GetWarrantyData(sale.transactionId))} className="cursor-pointer border-b w-fit self-center border-red-500">📜 Warranty</button>
                                    </div>
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
                                    {warranty && (
                                        <div className="bg-slate-400/85 fixed inset-0 z-80 w-screen h-full overflow-y-auto">
                                            {/* Unified Control Bar */}
                                            <div className="sticky top-0 z-100 bg-white p-4 flex justify-between items-center shadow-md">
                                                <h2 className="font-bold ml-4">Warranty Documents</h2>
                                                <div className="flex gap-4">
                                                    <button onClick={handlePrintAll} className="bg-blue-600 text-white px-4 py-2 rounded">
                                                        🖨️ Print All Warranties
                                                    </button>
                                                    <button onClick={() => ToggleWarranty(false)} className="text-2xl">❌</button>
                                                </div>
                                            </div>

                                            <div id="all-warranties-print" className="flex flex-col gap-8 p-10">
                                                {receiptData?.items?.map((item, index) => (
                                                    <div key={index} className="page-break bg-white rounded-3xl overflow-hidden shadow-lg">
                                                        <WarrantyWindow 
                                                            sku={item.sku}
                                                            signature={item.signature}
                                                            hideControls={true} // Add this prop to hide the individual print buttons
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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