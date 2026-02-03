'use server'

import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { Customer, FormState, NewUser, Receipt, User } from "@/lib/definitions";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";


export async function Login(formState: FormState, formData: FormData){
    let userName = formData.get("username") as string;
    let password = formData.get("password") as string;

    try{
        const loginRequest = await pool.query('SELECT password FROM employees WHERE username = $1', [userName.toUpperCase()]);
        let loginResponse = loginRequest.rows

        const passwordCheck = await bcrypt.compare(password, loginResponse[0].password)

        if(passwordCheck){
            await createSession(userName.toUpperCase());
            redirect("/BusinessPortal/User-Console")
        } else{
            return {message: "Wrong Password"}
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
        const accessRequest = await pool.query("SELECT privilege FROM employees WHERE username = $1", [uName.toUpperCase()])
        let accessResults = accessRequest.rows;
        return accessResults[0].privilege;
    } catch(error){
        console.log(error + "Couldn't fetch user access");
    }
}

export async function GetEmployees(user: string){
    let currentUser = user.toUpperCase();
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
                console.log(error)
            }
        } else {
            try{
                const listRequest = await pool.query('SELECT * FROM employees WHERE username = $1', [currentUser]);
                let listResults = listRequest.rows;
                return listResults;
                
            } catch(error){
                console.log(error)
            }
        }
        } catch(error){
            console.log(error)
        }
}

export async function CreateNewUser(newUser: NewUser){
    const userName = newUser.username.toUpperCase();
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

export async function GetAccess(user: string){
    try{
        const userAccess = await pool.query(`SELECT privilege FROM employees WHERE username = $1`, [user.toUpperCase()]);
        let result = userAccess.rows
        return result[0].privilege
    } catch(error){
        console.log("Failed to get user access!")
    }
}

export async function EditUser(user: User){
    try{
        await pool.query(`UPDATE employees WHERE username id = $1 
            SET username = $2, password = $3, fname = $4, lname = $5, privilege = $6`, 
            [user.id, user.username.toUpperCase(), user.password, user.fname, user.lname, user.privilege])

    } catch(error){
        console.log(error);
        return "Error Editing User Data!"
    }
}

export async function GetCustomers(){
    try{
        const customerRequest = await pool.query(`SELECT * FROM customers`);
        let results = customerRequest.rows;
        return results as any[];
    } catch(error){
        console.log(error);
        return "Error Fetching Customers!"
    }
}

export async function GetSales(customer: Customer){
    const fname = customer.first_name;
    const lname = customer.last_name;
    const phone = customer.phone
    try{
        const salesRequest = await pool.query(`SELECT * FROM "Sale" WHERE "firstName" = $1 AND "lastName" = $2 AND "phoneNumber" = $3`, 
            [fname, lname, phone]
        )
        let salesResults = salesRequest.rows;
        return salesResults;
    } catch(error){
        console.log(error);
        return "Couldn't fetch Sale Data!"
    }
}

export async function GetReceipt(trans: string){
     try {
    
        const result = await pool.query(
          `SELECT * FROM "Sale" WHERE "transactionId" = $1 LIMIT 1`,
          [trans]
        );
    
        const order = result.rows[0];
        return order as Receipt;
      } catch (error: any) {
        console.error("Database Error:", error);
      }
    }