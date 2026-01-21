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
        <div className="lg:grid grid-cols-4 pb-5 lg:text-3xl ">
            <div className="col-span-1 p-5 w-full flex flex-col gap-5">
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
            <div className="col-span-1 col-start-2 flex flex-col justify-around place-items-center">
                <span>Deliverable <input type="checkbox" onChange={(e) => {toggleDeliverable(e.target.checked)}}></input></span>
                <span>On Sale <input type="checkbox" onChange={(e) => {toggleOnSale(e.target.checked)}}></input></span>
            </div>
            <div className="col-span-2 col-start-1 row-start-2 w-full place-content-center">
                <button className="bg-red-500 active:bg-red-700 lg:text-3xl lg:p-2 border-2 rounded-full w-50">Filter</button>    
            </div> 
            <div className="col-start-3 col-span-2 w-full place-items-center flex flex-col gap-2 border-t mt-5 lg:mt-0 lg:border-t-0">
                <span className="text-center text-2xl underline">Tools</span>
                <input type="text" placeholder="New Type" className="border w-fit text-2xl md:text-3xl"
                    onChange={(e) => {updateNewType(e.target.value)}}></input>
                <button className="border-2 bg-red-500 active:bg-red-700 w-50 rounded-full self-center" onClick={() => (AddType(newType))}>Add Type</button>
                <input type="text" placeholder="New Subtype" className="border w-fit text-2xl md:text-3xl"
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