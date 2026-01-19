'use client';
import { useState } from "react";

interface Employee {
    id: number,
    username: string,
    fname: string,
    lname: string,
    privilege: string
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
    function SaveEdit(){

    }
    function Delete(){

    }


    return(
        <tr>
            <td className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="username" placeholder={employee.username} 
                onChange={(e) => changeUserInfo(prev =>({...prev, username: e.target.value}))}></input> 
                :employee.username}
            </td>
            <td className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="fname" placeholder={employee.fname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, fname: e.target.value }))}></input> 
                :employee.fname}
            </td>
            <td className="Table-item">
                {editActive ? 
                <input className="w-full" type="text" id="lname" placeholder={employee.lname} 
                onChange={(e) => changeUserInfo(prev =>({...prev, lname: e.target.value }))}></input> 
                :employee.lname}
            </td>
            <td className="Table-item">
                {editActive ? 
                <select id="privileges" onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                    <option value="Employee">Employee</option>
                    <option value="Manger">Manger</option>
                    <option value="Admin">Admin</option>
                </select> 
                :employee.privilege}
            </td>
            <td className="Table-item">
                {editActive ?
                <div className="flex flex-nowrap justify-between">
                    <input className="w-full" type="text" id="password" placeholder="password" 
                    onChange={(e) => changeUserInfo(prev =>({...prev, password: e.target.value }))}>
                    </input>
                    <button onClick={() =>(toggleEdit())}>💾</button>
                    <button onClick={() =>(toggleEdit())}>❌</button>    
                </div>
                :
                <div>
                    <button onClick={() =>(toggleEdit())}>📝</button>
                    <button>🗑️</button>   
                </div>
                }
            </td>                           
        </tr>
    )
}