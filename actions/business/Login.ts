'use server'

import bcrypt from "bcrypt";
import pg from "pg";
import { FormState } from "@/lib/definitions";

export async function Login(formState: FormState, formData: FormData){
    let userName = formData.get("username") as string;
    let password = formData.get("password") as string;

    const saltRounds = 12;
    let hashedPW = await bcrypt.hash(password, saltRounds);

    console.log(hashedPW)
    return {message: "Testing"}
}