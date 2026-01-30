'use client';
import { DeleteUser } from "@/actions/business/actions";
import { useState } from "react";

interface Employee {
    id: number,
    username: string,
    fname: string,
    lname: string,
    privilege: string,
    currentUser: string,
}

export default function EmployeeRow(employee: Employee){
    const [editActive, changeActive] = useState(false);
        const [userInfo, changeUserInfo] = useState({
            id: employee.id,
            username: employee.username,
            fname: employee.fname,
            lname: employee.lname,
            privilege: employee.privilege,
        });

    function toggleEdit(){
       changeActive(!editActive)
    }
    function CancelEdit(){
        changeUserInfo({
            id: employee.id,
            username: employee.username,
            fname: employee.fname,
            lname: employee.lname,
            privilege: employee.privilege, 
        })
        toggleEdit();
    }
    function SaveEdit(){

    }

    async function Delete(){
        if(userInfo.username != employee.currentUser){
            const deleteRequest = await DeleteUser(userInfo.id);
            alert(deleteRequest);
            window.location.reload();           
        } else {
            alert("Cannot Delete Self!")
        }

    }


    return(
        <div className="flex flex-col">
            {editActive ?
                    <div className="grow inset-0 w-full h-full border-5 bg-slate-300 p-10 flex flex-wrap gap-10 justify-evenly`">
                        <input autoComplete="off" type="text" id="username" className="h-[10%] basis-2/3 border bg-white" placeholder="User Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, username: e.target.value}))}></input>
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
                            <button onClick={() =>(toggleEdit)} className="active:border-2 border-red-500 basis-full" onClickCapture={() => (SaveEdit())}>💾 Save</button>
                    </div> : 
            <div className="w-full grid grid-cols-5">
                <p className="border">{employee.username}</p>
                <p className="border">{employee.fname}</p>
                <p className="border">{employee.lname}</p>
                <p className="border">{employee.privilege}</p>
                <div className="border">
                    <button onClick={() =>(toggleEdit())}>📝</button>
                    <button onClick={() => (Delete())}>🗑️</button>   
                </div>
            </div>}
            {/* <span className="Table-item">
                {employee.username}
            </span>
            <span className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="fName" placeholder={employee.fname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, fname: e.target.value }))}></input> 
                :employee.fname}
            </span>
            <span className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="lName" placeholder={employee.lname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, lname: e.target.value }))}></input> 
                :employee.lname}
            </span>
            <span className="Table-item">
                {editActive ? 
                <select id="privilege" defaultValue={editActive ? employee.privilege : "Employee"} onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                    <option value="Employee">Employee</option>
                    <option value="Manger">Manger</option>
                    <option value="Admin">Admin</option>
                </select> 
                :employee.privilege}
            </span>
            <span className="Table-item">
                {editActive ?
                <div className="flex flex-nowrap justify-between">
                    <input className="w-full" type="text" id="newPassword" placeholder="password" 
                    onChange={(e) => changeUserInfo(prev =>({...prev, password: e.target.value }))}>
                    </input>
                    <button onClick={() =>(SaveEdit())}>💾</button>
                    <button onClick={() =>(CancelEdit())}>❌</button>    
                </div>
                :
                <div>
                    <button onClick={() =>(toggleEdit())}>📝</button>
                    <button onClick={() => (Delete())}>🗑️</button>   
                </div>
                }
            </span>                         */}
        </div>
    )
}