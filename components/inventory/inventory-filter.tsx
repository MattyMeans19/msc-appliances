'use client'
import { GetSubtypes } from "@/actions/business/inventory";
import { useState } from "react"

interface ProcductType{
    item: any[]
    
}

export default function InventoryFilter(array: ProcductType){
    const [type, changeType] = useState("All");
    const [subtypes, changeSubTypes] = useState();
    const [selectedSub, changeSelectedSub] = useState();

    async function updateSubtypes(){
        await GetSubtypes(type)
    }

    return(
        <div>
            <select className="text-3xl border" 
            onChange={(e) => {
                changeType(e.target.value);
                updateSubtypes();
            }}>
                <option value="All">All</option>
                {array.item.map((type) => (
                    <option key={type.id} value={type.name}>
                        {type.name}
                    </option>
                ))}
            </select>
        </div>
    )
}