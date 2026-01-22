'use server';

import pool from "@/lib/db";
import { NewProduct } from "@/lib/definitions";

export const inventory = async () =>{
    
}

export async function GetTypes(){
    try{
        const typesRequest = await pool.query("SELECT * FROM product_types");
        let typesResponse = typesRequest.rows;
        return typesResponse
    } catch(error){
        console.log(error);
    }
}

export async function GetSubtypes(type: string){
    try{
        const typesRequest = await pool.query("SELECT * FROM subtypes WHERE product_type = $1", [type]);
        let typesResponse = typesRequest.rows;
        return typesResponse[0].subtype as any[]
    } catch(error){
        console.log(error);
    }
}

export async function NewType(type: string){
    try{
        await pool.query("INSERT INTO product_types(name) VALUES($1)", [type]);
        await pool.query("INSERT INTO subtypes(product_type, subtype) VALUES($1, $2)", [type, {}])
        return "New Type Added!"
    } catch(error){
        console.log(error);
        return "Failed to add new type!"
    }
}

export async function NewSubtype(type: string, subtype: string){
    if(type === "*"){
        try{
            await pool.query("SET subtypes = subtypes || $1", [subtype])
            return "New Type Added!"
        } catch(error){
            console.log(error);
            return "Failed to add new type!"
        }      
    } else{
        try{
            await pool.query("UPDATE subtypes SET subtype = array_append(subtype, $1) WHERE type = $2", [subtype, type])
            return "New Type Added!"
        } catch(error){
            console.log(error);
            return "Failed to add new type!"
        }        
    }

}

export async function AddProduct(product: NewProduct){
    const { 
        name, info, sku, cost, price, deliverable, 
        on_sale, count, in_store_warranty, 
        parts_labor_warranty, photos 
    } = product;

    try {
        const queryText = `
            INSERT INTO inventory(
                name, info, sku, cost, price, deliverable, 
                on_sale, count, in_store_warranty, 
                parts_labor_warranty, photos
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        const values = [
            name, info, sku, 
            cost * 100, 
            price * 100, 
            deliverable, on_sale, count, 
            in_store_warranty, parts_labor_warranty, photos
        ];

        await pool.query(queryText, values);
        return "New Product Added To Inventory!";
        
    } catch (error) {
        console.error("Database Error:", error);
        return "Error Adding Product!";
    }
}

export async function GetProducts(){
    try{
        const productRequest = await pool.query('Select * FROM inventory');
        let productResults = productRequest.rows;
        return productResults
    } catch(error){
        console.log(error);
        return "Could't fetch products. Contact the WebMaster!"
    }
}