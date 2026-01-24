'use client'
import { GetSubtypes, GetTypes, NewSubtype, NewType } from "@/actions/business/inventory";
import { useState } from "react";

interface ProcductType{
    item: any[]
    
}

export default function InventoryFilter(array: ProcductType){
    const [type, changeType] = useState("*");
    const [typeList, updateList] = useState(array.item)
    const [subtypes, changeSubTypes]: any = useState ([]);
    const [selectedSub, changeSelectedSub] = useState("");
    const [deliverable, toggleDeliverable] = useState(Boolean);
    const [onSale, toggleOnSale] = useState(Boolean);
    const [newType, updateNewType] = useState("");
    const [newSubtype, updateNewSubtype] = useState("");
    const [forType, changeForType] = useState("");


    async function updateSubtypes(type: string){
        if(type != "*"){
            const subs = await GetSubtypes(type);
            changeSubTypes(subs);
        }  else {
            changeSubTypes([]);
        }
    }

    async function AddType(type: string){
        if(type != ""){
            const request = await NewType(type);
            alert(request)
            callTypes();
        } else{
            alert("New Type cannot be blank!")
            window.location.reload();
        }
    }

    async function AddSubType(){
        if(newSubtype != ""){
            const request = await NewSubtype(forType, newSubtype);
            alert(request);
        }else {
            alert("New Subtype cannot be blank!")
        }
    }

     async function callTypes(){
        const types = await GetTypes() as any[];
        if(types.length != typeList.length){
                updateList(types);
        } else{
            return
        }
    }


    return(
        <div className="flex flex-col md:flex-row lg:text-2xl gap-20">
            <div className="border-10 border-double border-slate-500 w-full md:basis-3/5 lg:basis-2/3 md:grid grid-cols-3 p-2">
                <span className="text-3xl underline col-span-full text-ceneter row-start-1">Inventory Filters</span>
                <div className="col-span-2 row-start-2 p-5 w-full flex flex-col gap-5">
                    <label htmlFor="types" className="w-full text-center">Types</label>
                    <select className="border w-full" id="types"
                    onChange={(e) => {
                        changeType(e.target.value);
                        updateSubtypes(e.target.value);
                    }}>
                        <option value="*">All</option>
                        {typeList.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    {subtypes ?
                        <div className="flex flex-col w-full gap-5">
                            <label htmlFor="subtypes" className="w-full text-center">Subtypes</label>
                            <select className="border w-full" id="subtypes" defaultValue="All"
                            onChange={(e) => {
                                changeSelectedSub(e.target.value);
                            }}>
                                <option value="*">All</option>
                                {subtypes.map((type: any, index: number) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        : null
                    }
                </div> 
                <div className="col-start-3 col-span-1 w-full h-full row-start-2 flex flex-col justify-around place-items-center">
                    <span className="w-full">Deliverable <input type="checkbox" onChange={(e) => {toggleDeliverable(e.target.checked)}}></input></span>
                    <span className="w-full">On Sale <input type="checkbox" onChange={(e) => {toggleOnSale(e.target.checked)}}></input></span>
                </div>
                <button className="bg-red-500 active:bg-red-700 lg:text-3xl lg:p-2 border-2 rounded-full
                col-span-1 col-start-2 row-start-3 w-full">
                    Filter
                </button>     
            </div>
            
            <div className="basis-1/5 lg:basis-1/3 w-full h-full place-items-center flex flex-col p-2 gap-2 border-10 border-double border-slate-500 mt-5 md:mt-0">
                <span className="text-center text-3xl underline">Tools</span>
                <input type="text" placeholder="New Type" className="border w-fit text-2xl lg::text-3xl"
                    onChange={(e) => {updateNewType(e.target.value)}}></input>
                <button className="border-2 bg-red-500 active:bg-red-700 w-50 rounded-full self-center" onClick={() => (AddType(newType))}>Add Type</button>
                <span className="w-full border-b"></span>
                <input type="text" placeholder="New Subtype" className="border w-fit text-2xl lg::text-3xl"
                    onChange={(e) => {updateNewSubtype(e.target.value)}}></input>
                <span>FOR</span>
                <select className="border lg:w-85" id="edit-types"
                onChange={(e) => {
                    changeForType(e.target.value);
                }}>
                    <option value="*">All</option>
                    {typeList.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>                
                <button className="border-2 bg-red-500 active:bg-red-700 w-50 rounded-full self-center" onClick={() => (AddSubType())}>Add Subtype</button>
            </div>
        </div>

    )
}