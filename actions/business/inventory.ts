import pool from "@/lib/db";

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
    const productType = type;
    try{
        const typesRequest = await pool.query("SELECT * FROM product_subtypes WHERE type = $1", [type]);
        let typesResponse = typesRequest.rows;
        return {item: typesResponse}
    } catch(error){
        console.log(error);
    }
}