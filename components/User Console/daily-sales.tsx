'use client';
import { GetSalesByDate } from "@/actions/business/actions";
import { useEffect, useState } from "react";

interface Props{
    dates: any[] | string;
}

export default function DailySales(props: Props){
    const todaysDate = () => {
        const date = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        } as const;
        const formattedDate = new Intl.DateTimeFormat('en-us', options).format(date)

        return formattedDate;
    }

    const [sales, updateSales] = useState<any[]>([]);
    const [data, updateData] = useState<number | string>()
    const [salesChecked, ToggleCheck] = useState(false);

    useEffect(() =>{
        if(sales?.length === 0 && salesChecked === false){
            GetSales(todaysDate())
            ToggleCheck(true);
        }
    }, [])

    async function GetSales(date: string){
        const salesList = await GetSalesByDate(date);
        if(typeof salesList != "string"){
            updateSales(salesList!.sales)
            updateData(salesList!.net)
        } else{
            updateData(salesList)
        }
    }

    return(
        <div className="w-full h-full flex flex-col gap-15">
            <span className="text-center text-4xl font-bold underline">Sales by date</span>
            <input type="date" id="date" className="border text-center w-fit text-3xl self-center lg:px-10" 
            defaultValue={new Date().toISOString().split('T')[0]}
            onChange={(e) => (GetSales(e.target.value))}/>
            {typeof data === "string" ? <span className="grow self-center text-4xl mt-20">{data}</span>
             : 
             <div className="flex flex-col gap-10">
                <span className="grow self-center text-4xl text-green-500">Gross Sales: ${data?.toFixed(2)}</span>
                <span className="text-2xl font-bold ">Total Sales: {sales.length}</span>
                {sales.map((sale, index) =>(
                    <div key={index} className="flex flex-nowrap justify-around bg-slate-300 text-2xl">
                        <p>Order #: {sale.transactionId}</p>
                        <p>Net sale: ${(sale.totalAmount - sale.tax_amount).toFixed(2)}</p>
                    </div>
                ))}  
             </div>
             }
        </div>
    )
}