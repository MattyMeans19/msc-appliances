'use server'

import pool from "@/lib/db";
import { Specials } from "@/lib/definitions";

export async function NewSpecial(special: Specials){

    try{
        const currentRequest = await pool.query('SELECT * FROM specials WHERE current = true');
        let currentResponse = currentRequest.rows[0]

        if(currentResponse.current){
            try{
                await pool.query("UPDATE specials SET current = false WHERE current = true");

            }  catch(error){
            console.log(error)
            alert(error)
            }
        } 
    } catch(error){
            console.log(error)
            alert(error)
        }

    let newSpecial = special;
    let name = newSpecial.name;
    let description = newSpecial.info;
    let color = newSpecial.textColor;
    let bg = newSpecial.bgImage;
    let current = newSpecial.current
    try{
        await pool.query('INSERT INTO specials(name, info, textcolor, bgimage, current) VALUES($1, $2, $3, $4, $5)', [name, description, color, bg, current]);
        return
    } catch(error){
            console.log(error)
            alert(error)
        }
}

export async function GetSpecial(){
    let currentSpecial;

    try{
        const currentRequest = await pool.query('SELECT * FROM specials WHERE current = true');
        currentSpecial = currentRequest.rows[0]
        return currentSpecial
    } catch(error){
            console.log(error)
            alert(error)
        } 
    
    if(currentSpecial != undefined){
        try{
            const specialsRequest =  await pool.query('SELECT * FROM specials WHERE name = $1', [currentSpecial]);
            let specialsResult = specialsRequest.rows;
            return {special: specialsResult[0]}
            ;
        } catch(error){
                console.log(error)
                alert(error)
            }         
    } else{
        alert("Couldn't retrieve specials");
    }
   
}

export async function GetAllSpecials(){
    try{
        const specialsRequest = await pool.query('SELECT * FROM specials');
        let specialsResult = specialsRequest.rows;
        return {specialsResult}
    } catch(error){
            console.log(error)
            alert(error)
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
            alert(error)
            }
        } 
    } catch(error){
            console.log(error)
            alert(error)
        }
    try{
        await pool.query('UPDATE specials SET current = true WHERE name = $1', [newSpecial.name]) 
    } catch(error){
            console.log(error)
            alert(error)
        }   
}