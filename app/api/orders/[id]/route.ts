import { NextResponse } from 'next/server';
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;
  const client = await pool.connect();

  try {
    // We try to match:
    // 1. The exact ID passed (sale_1200...)
    // 2. The ID without 'sale_' (1200...) if it was stored in transactionId
    const cleanId = id.replace('sale_', '');

    const result = await client.query(
      `SELECT * FROM "Sale" 
       WHERE "id" = $1 
       OR "transactionId" = $2 
       LIMIT 1`,
      [id, cleanId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = result.rows[0];

    // Safety check: Parse items if they came back as a string
    if (typeof order.items === 'string') {
      order.items = JSON.parse(order.items);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release();
  }
}