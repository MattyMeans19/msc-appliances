'use client';
import { useState } from "react";
import EmployeeRow from "./employee-row";
import { CreateNewUser } from "@/actions/business/actions";

interface Employees {
    array: any[]

}
export default function EmployeeTable(props: Employees){
    const [newActive, changeActive] = useState(false);
    const [newUser, changeUserInfo] = useState({
        username: "",
        fname: "",
        lname: "",
        privilege:"",
        password:""
    });

    function toggleNew(){
         changeActive(!newActive);
    }

    async function SaveNew(){
        const infoComplete = Object.values(newUser).every(value => value !== "");
        if(infoComplete){
            const newResult = await CreateNewUser(newUser);
            alert(newResult); 
        } else {
            alert("Please fill out all fields for new user!")
        }

    } 

    return(
        <div className="border-t grow">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="Table-header">Username</th>
                        <th className="Table-header">First Name</th>
                        <th className="Table-header">Last Name</th>
                        <th className="Table-header">Privileges</th>
                        <th className="Table-header">Edit/Delete</th>
                    </tr>
                </thead>
                <tbody>
                {props.array.map((employee) =>(
                    <EmployeeRow
                        key={employee.id}
                        id={employee.id}
                        username={employee.username}
                        fname={employee.fname}
                        lname={employee.lname}
                        privilege={employee.privilege}
                    />
                ))}
                    <tr className={`${newActive ? 'visible' : 'hidden'}`}>
                        <td className="Table-item"><input type="text" id="username" placeholder="User Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, username: e.target.value}))}></input></td>
                        <td className="Table-item"><input type="text" id="fname" placeholder="First Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, fname: e.target.value}))}></input></td>
                        <td className="Table-item"><input type="text" id="lname" placeholder="Last Name" onChange={(e) => changeUserInfo(prev => ({ ...prev, lname: e.target.value}))}></input></td>
                        <td className="Table-item">
                            <select id="privileges" onChange={(e) => changeUserInfo(prev => ({ ...prev, privilege: e.target.value}))}>
                                <option value="Employee">Employee</option>
                                <option value="Manger">Manger</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </td>
                        <td className="Table-item flex justify-between">
                            <input className="w-full" type="text" id="password"  placeholder="Password"
                            onChange={(e) => changeUserInfo(prev => ({ ...prev, password: e.target.value}))}>
                            </input>
                            <button onClick={() =>(toggleNew)} className="active:border-2 border-red-500" onClickCapture={() => (SaveNew())}>💾</button>
                            <button onClick={() =>(toggleNew())} className="text-red-500 active:border-2">X</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button className="w-full text-2xl border-3 border-slate-400 mt-5 active:bg-slate-400" onClick={() => (toggleNew())}>
                {newActive ? "Cancel ❌" : "➕Add User"} 
            </button>
        </div>
    )
}