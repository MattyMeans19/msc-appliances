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
        <div className="border-t grow">
            <div className="w-full flex flex-col">
                <div className="w-full grid grid-cols-5">
                    <h2 className="Table-header">User Name</h2>
                    <h2 className="Table-header">First Name</h2>
                    <h2 className="Table-header">Last Name</h2>
                    <h2 className="Table-header">Uesr Role</h2>
                    <h2 className="Table-header">Edit / Delete</h2>
                </div>
                <div className="flex flex-col">
                {props.array.map((employee) =>(
                    <EmployeeRow
                        key={employee.id}
                        id={employee.id}
                        username={employee.username}
                        fname={employee.fname}
                        lname={employee.lname}
                        privilege={employee.privilege}
                        currentUser={props.curentUser}
                    />
                ))}
                    <div className={`${newActive ? 'visible' : 'hidden'} grid grid-cols-5`}>
                        <input autoComplete="off" type="text" id="username" placeholder="User Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, username: e.target.value}))}></input>
                        <input autoComplete="off" type="text" id="fname" placeholder="First Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, fname: e.target.value}))}></input>
                        <input autoComplete="off" type="text" id="lname" placeholder="Last Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, lname: e.target.value}))}></input>
                        
                            <select id="privileges" defaultValue="Employee" onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                                <option value="Employee">Employee</option>
                                <option value="Manger">Manger</option>
                                <option value="Admin">Admin</option>
                            </select>
                        
                        <div className="Table-item flex justify-between">
                            <input autoComplete="off" className="w-full" type="text" id="password"  placeholder="Password"
                            onChange={(e) => changeUserInfo(prev => ({ ...prev, password: e.target.value}))}>
                            </input>
                            <button onClick={() =>(toggleNew)} className="active:border-2 border-red-500" onClickCapture={() => (SaveNew())}>💾</button>
                            <button onClick={() =>(toggleNew())} className="text-red-500 active:border-2">X</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${currentAccess != "Employee" ? 'visible' : 'hidden'}`}>
                <button className="w-full text-2xl border-3 border-slate-400 mt-5 active:bg-slate-400" onClick={() => (toggleNew())}>
                    {newActive ? "Cancel ❌" : "➕Add User"} 
                </button>    
            </div>

        </div>
    )
}