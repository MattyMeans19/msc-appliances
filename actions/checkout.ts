'use server';

import pool from "@/lib/db";
import { revalidatePath } from 'next/cache';


export async function ProcessPayment(paymentData: {
  opaqueDataValue: string;
  opaqueDataDescriptor: string;
  amount: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  deliveryMethod: 'pickup' | 'delivery';
  skuList: string;
  items: any[];
}) {
  const skus = paymentData.skuList.split(',').filter(Boolean);
  
  // 1. RADIUS CHECK (Same logic as before, but outside of any DB transaction)
  if (paymentData.deliveryMethod === 'delivery') {
    const storeAddress = "5815 Lomas Blvd NE, Albuquerque, NM 87110";
    try {
      const distanceResponse = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(storeAddress)}&destinations=${encodeURIComponent(paymentData.customer.address)}&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const distanceData = await distanceResponse.json();
      const element = distanceData.rows[0]?.elements[0];

      if (!element || element.status !== "OK") {
        return { success: false, error: "Address not found. Please check your delivery address." };
      }

      const distanceInMiles = element.distance.value / 1609.34;
      if (distanceInMiles > 30) {
        return { success: false, error: `Delivery is ${distanceInMiles.toFixed(1)} miles away. We only deliver within 30 miles.` };
      }
    } catch (err) {
      return { success: false, error: "Distance validation failed. Please try again." };
    }
  }

  const client = await pool.connect();

  try {
    // 2. AUTHORIZE.NET CALL (Fastest way to use the token)
    const authResponse = await fetch(
      process.env.NODE_ENV === 'production' 
        ? "https://api.authorize.net/xml/v1/request.api" 
        : "https://apitest.authorize.net/xml/v1/request.api",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createTransactionRequest: {
            merchantAuthentication: {
              name: process.env.AUTHNET_API_LOGIN_ID,
              transactionKey: process.env.AUTHNET_TRANSACTION_KEY,
            },
            transactionRequest: {
              transactionType: "authCaptureTransaction",
              amount: paymentData.amount,
              payment: {
                opaqueData: {
                  dataDescriptor: paymentData.opaqueDataDescriptor,
                  dataValue: paymentData.opaqueDataValue,
                },
              },
            },
          },
        })
      }
    );

    const authResult = await authResponse.json();

    if (authResult.messages.resultCode !== "Ok") {
      return { success: false, error: authResult.transactionResponse?.errors?.[0]?.errorText || "Payment Declined" };
    }

    const transId = authResult.transactionResponse.transId;

    // 3. BEGIN DATABASE UPDATES
    await client.query('BEGIN');

    // Update Customer
    await client.query(
      `INSERT INTO customers (first_name, last_name, email, phone)
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET first_name = $1, last_name = $2, phone = $4`,
      [paymentData.customer.firstName, paymentData.customer.lastName, paymentData.customer.email, paymentData.customer.phone]
    );

    // Lock Inventory
    const invResult = await client.query(
      "UPDATE inventory SET count = count - 1 WHERE sku = ANY($1) AND count > 0 RETURNING sku",
      [skus]
    );

    if (invResult.rowCount !== skus.length) {
      await client.query('ROLLBACK');
      return { success: false, error: "One of your items sold out during checkout." };
    }

    // Record the Sale with Fulfillment Type & Items
    await client.query(
      `INSERT INTO "Sale" (id, "firstName", "lastName", "phoneNumber", "fulfillmentType", "totalAmount", "transactionId", items, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')`,
      [
        `sale_${transId}`,
        paymentData.customer.firstName,
        paymentData.customer.lastName,
        paymentData.customer.phone,
        paymentData.deliveryMethod, // 'pickup' or 'delivery'
        paymentData.amount,
        transId,
        JSON.stringify(paymentData.items)
      ]
    );

    await client.query('COMMIT');
    revalidatePath('/admin/sales');
    return { success: true, transId };

  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error("Critical Checkout Error:", error);
    return { success: false, error: "Internal Server Error" };
  } finally {
    client.release();
  }
}

export async function createSale(
  customerData: any, 
  cartItems: any[], 
  total: number, 
  fulfillmentType: 'In-Store' | 'Delivery'
) {
  const client = await pool.connect();
  
  try {
    const saleId = `sale_${Date.now()}`;
    // Using the AuthNet ID as the transaction ID if available
    const transactionId = customerData.authNetId || `MSC-${Date.now()}`;
    const itemsJson = JSON.stringify(cartItems);

    await client.query(
      `INSERT INTO "Sale" (
        "id", 
        "firstName", 
        "lastName", 
        "phoneNumber", 
        "fulfillmentType", 
        "totalAmount", 
        "transactionId", 
        "items", 
        "status"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')`,
      [
        saleId,
        customerData.firstName,
        customerData.lastName,
        customerData.phoneNumber,
        fulfillmentType,
        total,
        transactionId,
        itemsJson, // The pg driver handles JSON string strings well, or use JSON.stringify
      ]
    );

    revalidatePath('/admin/sales'); 
    
    return { success: true, saleId };
  } catch (error) {
    console.error("Database Sale Error:", error);
    return { success: false, error: "Critical error saving sale to database." };
  } finally {
    client.release();
  }
}

export async function CheckMilage(address: string){

    const storeAddress = "5815 Lomas Blvd NE, Albuquerque, NM 87110";
    try {
      const distanceResponse = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(storeAddress)}&destinations=${encodeURIComponent(address)}&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const distanceData = await distanceResponse.json();
      const element = distanceData.rows[0]?.elements[0];

      if (!element || element.status !== "OK") {
        return { success: false, error: "Address not found. Please check your delivery address." };
      }

      const distanceInMiles = element.distance.value / 1609.34;
      if (distanceInMiles > 30) {
        return { success: false, error: `Delivery is ${distanceInMiles.toFixed(1)} miles away. We only deliver within 30 miles.` };
      }
    } catch (err) {
      return { success: false, error: "Distance validation failed. Please try again." };
    }
}