'use server'

import pool from "@/lib/db";
import { Coupon } from "@/lib/definitions";

export async function CreateCoupon(coupon: Coupon){
    try{
        await pool.query('INSERT INTO coupons(code, discount, type) VALUES($1, $2, $3)', [coupon.code, coupon.discount, coupon.type]);
        return "Coupon Added!"
    } catch(error){
        console.log(error);
        return "Error Adding Coupon!"
    }
}

export async function GetCoupons(){
    try{
        const coupons = await pool.query('SELECT * FROM coupons');
        let results = coupons.rows;
        return results as Coupon[]
    } catch(error){
        console.log(error);
        return "Error Getting Coupons!"
    }
}