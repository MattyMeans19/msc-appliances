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
        <tr>
            <td className="Table-item">
                {employee.username}
            </td>
            <td className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="fName" placeholder={employee.fname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, fname: e.target.value }))}></input> 
                :employee.fname}
            </td>
            <td className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="lName" placeholder={employee.lname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, lname: e.target.value }))}></input> 
                :employee.lname}
            </td>
            <td className="Table-item">
                {editActive ? 
                <select id="privilege" defaultValue="Employee" onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                    <option value="Employee">Employee</option>
                    <option value="Manger">Manger</option>
                    <option value="Admin">Admin</option>
                </select> 
                :employee.privilege}
            </td>
            <td className="Table-item">
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
            </td>                           
        </tr>
    )
}