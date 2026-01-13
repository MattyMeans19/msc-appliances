'use server'

import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { FormState } from "@/lib/definitions";
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
                return error
            }
        }
        } catch(error){
            console.log(error)
            alert(error)
        }
}