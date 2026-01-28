'use server';

import pool from "@/lib/db";
import { NewProduct, Product } from "@/lib/definitions";

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
        parts_labor_warranty, photos, manual_sale
    } = product;

    try {
        const queryText = `
            INSERT INTO inventory(
                name, info, sku, cost, price, deliverable, 
                on_sale, count, in_store_warranty, 
                parts_labor_warranty, photos, manual_sale
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        const values = [
            name, info, sku, 
            cost * 100, 
            price * 100, 
            deliverable, on_sale, count, 
            in_store_warranty, parts_labor_warranty, photos, 
            manual_sale * 100
        ];

        await pool.query(queryText, values);
        return "New Product Added To Inventory!";
        
    } catch (error) {
        console.error("Database Error:", error);
        return "Error Adding Product!";
    }
}

export async function GetProducts(
    page: number = 1, 
    limit: number = 12, 
    productType?: string | null, 
    subtypes?: string | null,
    onSaleOnly?: boolean,
    sortOrder: string = 'newest' // <--- Add this 6th argument
) {
    try {
        const offset = (page - 1) * limit;
        const queryParams: any[] = [limit, offset];
        let queryValuesIndex = 3; 
        
        const conditions = [];

        if (productType) {
            conditions.push(`type = $${queryValuesIndex++}`);
            queryParams.push(productType);
        }

        if (subtypes) {
            const subtypeArray = subtypes.split(',');
            conditions.push(`subtype = ANY($${queryValuesIndex++})`);
            queryParams.push(subtypeArray);
        }

        if (onSaleOnly) {
            conditions.push(`on_sale = true`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : "";

        // --- DYNAMIC SORTING LOGIC ---
        let orderBy = "id DESC"; // Default (Newest)
        if (sortOrder === 'price-low') orderBy = "price ASC";
        if (sortOrder === 'price-high') orderBy = "price DESC";
        if (sortOrder === 'alpha') orderBy = "name ASC";

        const sql = `
            SELECT *, count(*) OVER() AS total_count 
            FROM inventory 
            ${whereClause} 
            ORDER BY ${orderBy} 
            LIMIT $1 OFFSET $2
        `;

        const productRequest = await pool.query(sql, queryParams);
        const productResults = productRequest.rows;
        const totalCount = productResults.length > 0 ? parseInt(productResults[0].total_count) : 0;

        return {
            products: productResults,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Couldn't fetch products." };
    }
}

export async function GetAllProducts(){
    try{
        const productRequest = await pool.query('Select * FROM inventory');
        let productResults = productRequest.rows;
        return productResults
    } catch(error){
        console.log(error);
        return "Could't fetch products. Contact the WebMaster!"
    }
}

export async function DeleteProduct(product: string){
    try{
        await pool.query('DELETE from inventory WHERE sku = $1', [product]);
        return "Item Deleted From Inventory";
    } catch(error){
        console.log(error);
        return "Error deleteing item from inventory!"
    }
}

export async function ProductUpdate(product: Product){
    let current;
    try{
        const check = await pool.query('SELECT * FROM inventory WHERE id = $1', [product.id])
        current = check.rowCount;
    }catch(error){
        console.log(error)
        return("ID doesn't exist!")
    }
    if(current === 1){
        console.log(product.cost, product.price, product.manual_sale)
        try {
            await pool.query(`UPDATE inventory
                SET name = $1, info = $2, sku = $3, cost = $4, price = $5,
                deliverable = $6, on_sale = $7, count = $8,
                in_store_warranty = $9, parts_labor_warranty = $10, photos = $11, manual_sale = $12
                WHERE id = $13`,
            [product.name, product.info, product.sku, product.cost , product.price,
                product.deliverable, product.on_sale, product.count, product.in_store_warranty, 
                product.parts_labor_warranty, product.photos, product.manual_sale, product.id
            ])
            return "Product Updated!";
            
        } catch (error) {
            console.error("Database Error:", error);
            return "Error Adding Product!";
        }        
    }

}

export async function GetProduct(sku: string){
    try{
        const product = await pool.query('SELECT * FROM inventory WHERE sku = $1', [sku]);
        let productResult = product.rows[0];
        return productResult as Product;
    } catch(error){
        console.log(error);
        let message = error;
        return message as string;
    }
}