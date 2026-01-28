'use server';

import pool from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { sendOrderReceipt } from '@/lib/email';

export async function ProcessPayment(paymentData: {
  opaqueDataValue: string;
  opaqueDataDescriptor: string;
  amount: string;
  taxAmount: string;
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
  deliveryFee: number;
  couponCode: string | null;
}) {
  const skus = paymentData.skuList.split(',').filter(Boolean);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. IDEMPOTENCY CHECK
    const alreadySold = await client.query(
      "SELECT id FROM \"Sale\" WHERE items @> $1::jsonb",
      [JSON.stringify([{ sku: skus[0] }])]
    );

    if (alreadySold.rowCount! > 0) {
      await client.query('ROLLBACK');
      return { success: true, transId: alreadySold.rows[0].id.replace('sale_', '') };
    }

    // 2. ATOMIC INVENTORY LOCK
    const invResult = await client.query(
      "UPDATE inventory SET count = count - 1 WHERE sku = ANY($1) AND count > 0 RETURNING sku",
      [skus]
    );

    if (invResult.rowCount !== skus.length) {
      await client.query('ROLLBACK');
      return { success: false, error: "Item sold out just now!" };
    }

    // 3. PRE-SAVE/UPDATE CUSTOMER
    const couponToRecord = paymentData.couponCode ? paymentData.couponCode.toUpperCase() : null;
    await client.query(
      `INSERT INTO customers (first_name, last_name, email, phone, coupons)
       VALUES ($1, $2, $3, $4, $5::text[]) 
       ON CONFLICT (email) DO UPDATE 
       SET first_name = EXCLUDED.first_name, 
           last_name = EXCLUDED.last_name, 
           phone = EXCLUDED.phone,
           coupons = CASE 
             WHEN $6::text IS NOT NULL THEN 
               array_append(COALESCE(customers.coupons, ARRAY[]::text[]), $6::text)
             ELSE 
               COALESCE(customers.coupons, ARRAY[]::text[])
           END`,
      [
        paymentData.customer.firstName,
        paymentData.customer.lastName,
        paymentData.customer.email,
        paymentData.customer.phone,
        couponToRecord ? [couponToRecord] : [],
        couponToRecord
      ]
    );

    // 4. AUTHORIZE.NET PAYMENT CAPTURE
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
              customer: { email: paymentData.customer.email },
              billTo: {
                firstName: paymentData.customer.firstName,
                lastName: paymentData.customer.lastName,
                phoneNumber: paymentData.customer.phone,
              }
            },
          },
        })
      }
    );

    const authResult = await authResponse.json();

    if (authResult.messages.resultCode !== "Ok") {
      await client.query('ROLLBACK');
      const msgError = authResult.messages.message?.[0]?.text;
      const txError = authResult.transactionResponse?.errors?.[0]?.errorText;

      let userError = txError || msgError || "Transaction Declined";
      if (userError.includes("duplicate")) userError = "Order already placed. Check your email.";

      return { success: false, error: userError };
    }

    const transId = authResult.transactionResponse.transId;

    // 5. RECORD FINAL SALE record
    await client.query(
      `INSERT INTO "Sale" (
        id, "firstName", "lastName", "phoneNumber", "fulfillmentType", 
        "totalAmount", tax_amount, "transactionId", items, status, delivery_fee, coupon_code
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Paid', $10, $11)`,
      [
        `sale_${transId}`,
        paymentData.customer.firstName,
        paymentData.customer.lastName,
        paymentData.customer.phone,
        paymentData.deliveryMethod,
        paymentData.amount,
        paymentData.taxAmount,
        transId,
        JSON.stringify(paymentData.items),
        paymentData.deliveryFee,
        couponToRecord
      ]
    );

    // 6. COMMIT AND RETURN SUCCESS
    await client.query('COMMIT');
    try {
      await sendOrderReceipt({
        id: `sale_${transId}`,
        firstName: paymentData.customer.firstName,
        lastName: paymentData.customer.lastName,
        email: paymentData.customer.email,
        items: paymentData.items,
        amount: paymentData.amount,      // The Grand Total
        taxAmount: paymentData.taxAmount, // The saved Tax
        deliveryFee: paymentData.deliveryFee,
        fulfillmentType: paymentData.deliveryMethod
      });
    } catch (emailErr) {
      // We log the error but DON'T stop the process. 
      // The customer has already paid, so we want them to see the Success Page.
      console.error("Email notification failed:", emailErr);
    }
    return { success: true, transId };

  } catch (error: any) {
    // 7. HANDLE CRITICAL ERRORS
    if (client) await client.query('ROLLBACK');
    console.error("Critical Checkout Error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected database error occurred." 
    };
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

export async function FinalCheck(skus: string[]) {
  try {
    // 1. Query all SKUs in the array at once
    // Using = ANY($1) is the standard Postgres way to handle arrays in queries
    const check = await pool.query(
        'SELECT sku FROM inventory WHERE sku = ANY($1)', 
        [skus]
    );
    
    const foundSkus = check.rows.map(row => row.sku);
    
    // 2. Identify which SKUs from the cart are missing from the DB
    const missingSkus = skus.filter(sku => !foundSkus.includes(sku));

    if (missingSkus.length === 0) {
      return { available: true };
    } else {
      // Return the missing SKUs so the UI can tell the user exactly what sold out
      return { 
        available: false, 
        missing: missingSkus 
      };
    }
  } catch (error) {
    console.error("Database Error in FinalCheck:", error);
    return { error: "Could not verify inventory availability." };
  }
}

export async function CheckCoupon(code: string, email: string) {
  try {
    // 1. Fetch the coupon details
    const couponCheck = await pool.query('SELECT * FROM coupons WHERE code = $1', [code.toUpperCase()]);
    
    if (couponCheck.rows.length === 0) {
      return { success: false, coupon: null, message: "No Matching Coupon Code!" };
    }
    
    const coupon = couponCheck.rows[0];

    // 2. Check if customer exists and has used this coupon
    const customerCheck = await pool.query(
      'SELECT coupons FROM customers WHERE email = $1', 
      [email]
    );

    // Get the array safely (default to empty array if customer or field is missing)
    const usedCoupons = customerCheck.rows[0]?.coupons || [];

    if (usedCoupons.includes(code.toUpperCase())) {
      return { success: false, coupon: null, message: "You have already used this coupon code!" };
    }

    // 3. Success branch - always return the same object structure
    return { 
      success: true, 
      coupon: coupon, // This is the object { code, discount, type }
      message: "Coupon applied successfully!" 
    };
    
  } catch (error) {
    console.error("Coupon Check Error:", error);
    return { success: false, coupon: null, message: "Error verifying coupon." };
  }
}