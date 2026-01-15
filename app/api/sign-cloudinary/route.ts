import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    // The secret MUST be the private API Secret (not the public one)
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
    }

    // This utility signs the entire object sent by the widget
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return NextResponse.json({ signature });
  } catch (error) {
    return NextResponse.json({ error: "Signing failed" }, { status: 500 });
  }
}