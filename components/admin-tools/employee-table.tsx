'use client';
import { useEffect, useState } from "react";
import EmployeeRow from "./employee-row";
import { CheckAccess, CreateNewUser } from "@/actions/business/actions";

interface Employees {
    array: any[],
    curentUser: string

}
export default function EmployeeTable(props: Employees){
    const [newActive, changeActive] = useState(false);
    const [newUser, changeUserInfo] = useState({
        username: "",
        fname: "",
        lname: "",
        privilege:"Employee",
        password:""
    });
    const [currentAccess, changeAccess] = useState("");

    useEffect(() => {
        if(currentAccess === ""){
            GetAccess();
        } else{
            return
        }
    }, [currentAccess])

    async function GetAccess(){
        let access = await CheckAccess(props.curentUser);
        changeAccess(access);
        console.log(currentAccess)
    }

    function toggleNew(){
         changeActive(!newActive);
    }

    async function SaveNew(){
        const infoComplete = Object.values(newUser).every(value => value !== "");
        if(infoComplete){
            const newResult = await CreateNewUser(newUser);
            alert(newResult);
            window.location.reload();
        } else {
            alert("Please fill out all fields for new user!")
        }

    } 

    return(
        <div className="border-t grow h-full">
            <div className="w-full grow h-full flex flex-col overflow-y-scroll">
                <div className="w-full grid grid-cols-5">
                    <h2 className="Table-header">User Name</h2>
                    <h2 className="Table-header">First Name</h2>
                    <h2 className="Table-header">Last Name</h2>
                    <h2 className="Table-header">User Role</h2>
                    <h2 className="Table-header">Edit / Delete</h2>
                </div>
                <div className="grow h-full md:relative">
                {props.array.map((employee) =>(
                    <EmployeeRow
                        key={employee.id}
                        user = {employee}
                        currentUser = {props.curentUser}
                    />
                ))}
                    <div className={`${newActive ? 'visible' : 'hidden'} grow absolute inset-0 w-full h-full border-5 bg-slate-300 p-10 flex flex-wrap gap-10 justify-evenly`}>
                        <input autoComplete="off" type="text" id="username" className="h-[10%] basis-2/3 border bg-white uppercase" placeholder="User Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, username: e.target.value}))}></input>
                        <input autoComplete="off" type="text" id="fname" className="h-[10%] basis-1/3 border bg-white" placeholder="First Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, fname: e.target.value}))}></input>
                        <input autoComplete="off" type="text" id="lname" className="h-[10%] basis-1/3 border bg-white" placeholder="Last Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, lname: e.target.value}))}></input>
                        <div className="basis-full flex justify-center place-items-center gap-10">
                            <label htmlFor="privileges" className="">User Access:</label>
                            <select id="privileges" className="border bg-white" defaultValue="Employee" onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>                            
                        </div>

                        
                            <input autoComplete="off" className="border bg-white" type="text" id="password"  placeholder="Password"
                            onChange={(e) => changeUserInfo(prev => ({ ...prev, password: e.target.value}))}>
                            </input>
                            <button onClick={() =>(toggleNew())} className="active:border-2 border-red-500 basis-full" onClickCapture={() => (SaveNew())}>💾 Save</button>
                            <button onClick={() =>(toggleNew())} className="active:border-2 border-red-500 basis-full">❌ Cancel</button>
                    </div>
                </div>
                <div className={`${currentAccess != "Employee" ? 'visible' : 'hidden'}`}>
                    <button className="px-10 text-2xl border-3 border-slate-400 active:bg-slate-400" onClick={() => (toggleNew())}>
                        {newActive ? "Cancel ❌" : "➕Add User"} 
                    </button>    
                </div>
            </div>
        </div>
    )
}