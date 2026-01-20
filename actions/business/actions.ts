'use server'

import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { FormState, NewUser } from "@/lib/definitions";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";

export async function Login(formState: FormState, formData: FormData){
    let userName = formData.get("username") as string;
    let password = formData.get("password") as string;

    try{
        const loginRequest = await pool.query('SELECT password FROM employees WHERE username = $1', [userName]);
        let loginResponse = loginRequest.rows

        const passwordCheck = await bcrypt.compare(password, loginResponse[0].password)

        if(passwordCheck){
            await createSession(userName);
            redirect("/BusinessPortal/User-Console")
        } else{
            return {message: "Login Failed"}
        }
    } catch(error){
        if (isRedirectError(error)) {
            throw error; // Re-throw the redirect error for Next.js to handle
        }
        console.log(error)
        return {message: "There was an error validating login, please try again!"};
    }

}

export async function Logout(){
    await deleteSession();
    redirect("/BusinessPortal")
}

export async function CheckAccess(uName: string){
    try{
        const accessRequest = await pool.query("SELECT privilege FROM employees WHERE username = $1", [uName])
        let accessResults = accessRequest.rows;
        return accessResults[0].privilege;
    } catch(error){
        console.log(error + "Couldn't fetch user access");
    }
}

export async function GetEmployees(user: string){
    let currentUser = user;
    let access;
    try{
        const userRequest = await pool.query('SELECT privilege FROM employees WHERE username = $1', [currentUser]);
        let userResponse = userRequest.rows;
        access = userResponse[0].privilege;
        if(access === "Admin" || access === "Manager"){
            try{
                const listRequest = await pool.query('SELECT * FROM employees');
                let listResults = listRequest.rows;
                return listResults;
                
            } catch(error){
                alert(error)
            }
        } else {
            try{
                const listRequest = await pool.query('SELECT * FROM employees WHERE username = $1', [currentUser]);
                let listResults = listRequest.rows;
                return listResults;
                
            } catch(error){
                alert(error)
            }
        }
        } catch(error){
            console.log(error)
            alert(error)
        }
}

export async function CreateNewUser(newUser: NewUser){
    const userName = newUser.username;
    const fName = newUser.fname;
    const lName = newUser.lname;
    const privilege = newUser.privilege;
    const password = newUser.password;

    let saltRounds = 12;
    let hashedPw = await bcrypt.hash(password, saltRounds);

    try{
        await pool.query("INSERT INTO employees(username, password, fname, lname, privilege) VALUES($1, $2, $3, $4, $5)", [userName, hashedPw, fName, lName, privilege]);
        return "New user created!"
    } catch(error){
        console.log(error);
        return "Failed to create user!"
    }
}

export async function DeleteUser(id: number){
    try{
        await pool.query("DELETE FROM employees WHERE id = $1", [id])
        return "User Deleted!"
    } catch(error){
        console.log(error);
        return "Failed to delete user!"
    }
} 
