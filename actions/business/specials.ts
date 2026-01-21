'use server'

import pool from "@/lib/db";
import { Specials } from "@/lib/definitions";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function NewSpecial(special: Specials){

    let newSpecial = special;
    let name = newSpecial.name;
    let description = newSpecial.info;
    let color = newSpecial.textcolor;
    let bg = newSpecial.bgimage;
    let sale = newSpecial.sales_price;
    let current = newSpecial.current;
    try{
        await pool.query('INSERT INTO specials(name, info, textcolor, bgimage, current, sales_price) VALUES($1, $2, $3, $4, $5, $6)', [name, description, color, bg, current, sale]);
        return name + " Created!"
    } catch(error){
            DeleteFromCloud(bg);
            console.log(error)
            return error
        }
}

export async function GetSpecial(){
    let currentSpecial;

    try{
        const currentRequest = await pool.query('SELECT * FROM specials WHERE current = true');
        currentSpecial = currentRequest.rows[0];
    } catch(error){
            console.log(error)
            return 
        } 
    
    if(currentSpecial != undefined){
        try{
            const specialsRequest =  await pool.query('SELECT * FROM specials WHERE name = $1', [currentSpecial.name]);
            let specialsResult = specialsRequest.rows;
            return specialsResult[0]
            ;
        } catch(error){
                console.log(error)
                return(error)
            }         
    } else{
        return("Couldn't retrieve specials");
    }
   
}

export async function GetAllSpecials(){
    try{
        const specialsRequest = await pool.query('SELECT * FROM specials');
        let specialsResult = specialsRequest.rows;
        return specialsResult as any
    } catch(error){
            console.log(error)
            return(error)
        }
}

export async function UpdateSpecial(special: Specials){
    let newSpecial = special;

    try{
        const currentRequest = await pool.query('SELECT * FROM specials WHERE current = true');
        let currentResponse = currentRequest.rows[0]

        if(currentResponse.current){
            try{
                await pool.query("UPDATE specials SET current = false WHERE current = true");
            }  catch(error){
            console.log(error)
            return(error)
            }
        } 
    } catch(error){
            console.log(error)
            return(error)
        }
    try{
        await pool.query('UPDATE specials SET current = true WHERE name = $1', [newSpecial.name]);
         return "Special Updated to " + newSpecial.name

    } catch(error){
            console.log(error)
            return(error)
        }   
}

export async function DeleteSpecial(special: Specials){
    try{
        await pool.query('DELETE FROM specials WHERE name = $1', [special.name]);
        const photoDelete = await DeleteFromCloud(special.bgimage);
        if(photoDelete.result === "ok"){
            return "Special Deleted!";
        } else{
            return "Special deleted, but an error occured removing Background photo from server. Please contact your Webmaster."
        }
    }  catch(error){
        console.log(error);
        return "Failed to delete special!"
    }

}

export async function DeleteFromCloud(id: string){
        try {
            const result = await cloudinary.uploader.destroy(id);
            return result;
        } catch (error) {
            console.error("Cloudinary delete error:", error);
            return  "Failed to delete image";
        }
}