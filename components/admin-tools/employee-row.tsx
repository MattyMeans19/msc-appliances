'use client';
import { DeleteUser, EditUser } from "@/actions/business/actions";
import { useState } from "react";

interface Employee {
    user: {
        id: number,
        username: string, 
        fname: string,
        lname: string,
        privilege: string,
        password: string
    }
    currentUser: string
}

export default function EmployeeRow(employee: Employee){
    const user = employee.user
    const [editActive, changeActive] = useState(false);
        const [userInfo, changeUserInfo] = useState({
            id: user.id,
            username: user.username,
            fname: user.fname,
            lname: user.lname,
            privilege: user.privilege,
            password: user.password
        });

    function toggleEdit(){
       changeActive(!editActive)
    }
    function CancelEdit(){
        changeUserInfo({
            id: user.id,
            username: user.username,
            fname: user.fname,
            lname: user.lname,
            privilege: user.privilege, 
            password: user.password
        })
        toggleEdit();
    }

    async function SaveEdit(){
        const editData = await EditUser(userInfo)
    }

    async function Delete(){
        if(user.username != employee.currentUser){
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
                <div className="absolute grow inset-0 w-full h-fit md:h-full border-5 bg-slate-300 p-10 flex flex-wrap gap-10 justify-evenly place-content-center`">
                    <input autoComplete="off" type="text" id="username" className="h-[10%] basis-2/3 border bg-white uppercase" 
                        placeholder={userInfo.username}onChange={(e) => changeUserInfo(prev => ({ ...prev, username: e.target.value}))}></input>
                    <input autoComplete="off" type="text" id="fname" className="h-[10%] basis-1/3 border bg-white" 
                        placeholder={userInfo.fname} onChange={(e) => changeUserInfo(prev => ({ ...prev, fname: e.target.value}))}></input>
                    <input autoComplete="off" type="text" id="lname" className="h-[10%] basis-1/3 border bg-white" 
                        placeholder={userInfo.lname} onChange={(e) => changeUserInfo(prev => ({ ...prev, lname: e.target.value}))}></input>
                    <div className="basis-full flex justify-center place-items-center gap-10">
                        <label htmlFor="privileges" className="">User Access:</label>
                        <select id="privileges" className="border bg-white overflow-x-clip" defaultValue={userInfo.privilege} 
                            onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>                            
                    </div>
                        <input autoComplete="off" className="border bg-white basis-1/2" type="text" id="password"  placeholder="Password"
                        onChange={(e) => changeUserInfo(prev => ({ ...prev, password: e.target.value}))}>
                        </input>
                        <button onClick={() =>(toggleEdit)} className="active:border-2 border-red-500 basis-1/2" 
                            onClickCapture={() => (SaveEdit())}>💾 Save</button>
                        <button onClick={() =>(CancelEdit())} className="active:border-2 border-red-500 basis-1/2">
                            ❌ Cancel
                        </button>
                </div> : 
                <div className="w-full grid grid-cols-5">
                    <p className="border">{user.username}</p>
                    <p className="border">{user.fname}</p>
                    <p className="border">{user.lname}</p>
                    <p className="border overflow-x-clip">{user.privilege}</p>
                    <div className="border">
                        <button onClick={() =>(toggleEdit())}>📝</button>
                        <button onClick={() => (Delete())}>🗑️</button>   
                    </div>
                </div>}
        </div>
    )
}