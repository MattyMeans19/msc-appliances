import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const storeAddress = "5815 Lomas Blvd NE, Albuquerque, NM 87110";

  if (!address) return NextResponse.json({ error: "No address provided" }, { status: 400 });

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(storeAddress)}&destinations=${encodeURIComponent(address)}&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();
    const element = data.rows[0]?.elements[0];

    if (!element || element.status !== "OK") {
      return NextResponse.json({ withinRange: false, message: "Address not found." });
    }

    const distanceInMiles = element.distance.value / 1609.34;
    
    // Check our 30-mile limit
    if (distanceInMiles > 30) {
      return NextResponse.json({ 
        withinRange: false, 
        message: `Distance is ${distanceInMiles.toFixed(1)} miles. We only deliver within 30 miles.` 
      });
    }

    // Calculate fee at $1.75 per mile
    const calculatedFee = Math.ceil(distanceInMiles * 1.75);

    return NextResponse.json({ 
      withinRange: true, 
      fee: calculatedFee, 
      distance: distanceInMiles.toFixed(1)
    });

  } catch (error) {
    console.error("Mileage API Error:", error);
    return NextResponse.json({ error: "Failed to calculate mileage" }, { status: 500 });
  }
}