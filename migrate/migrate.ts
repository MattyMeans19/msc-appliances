import fs from 'fs';
import { parse } from 'csv-parse';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg'; // Import the pg library directly

// 1. Setup the Database Connection (Same as your server action)
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://postgres:Hyl!anWarri0r@localhost:5432/MSC-Appliances", // Use your .env DATABASE_URL
});

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwqwfwa34',
  api_key: '498859225242772',
  api_secret: '0srfUIaYeUywytxPuBEarxuazVs',
});

// 3. The logic from your Server Action (Local version)
async function AddProductLocal(product: any) {
    const { 
        name, info, sku, cost, price, deliverable, 
        on_sale, count, in_store_warranty, 
        parts_labor_warranty, photos, manual_sale,
        type, subtype 
    } = product;

    const queryText = `
        INSERT INTO inventory(
            name, info, sku, cost, price, deliverable, 
            on_sale, count, in_store_warranty, 
            parts_labor_warranty, photos, manual_sale,
            type, subtype
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;

    const values = [
        name, info, sku, 
        Math.round(cost * 100), 
        Math.round(price * 100), 
        deliverable, on_sale, count, 
        in_store_warranty, parts_labor_warranty, photos, 
        Math.round(manual_sale * 100),
        type, subtype
    ];

    await pool.query(queryText, values);
    return "New Product Added To Inventory!";
}

async function run() {
  const filePath = './final_database_import.csv'; // Relative to where you run the command
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skip_empty_lines: true }));

  let processedCount = 0;
  const LIMIT = 100; // <--- The "Brake"

  console.log("🚀 Starting limited test run...");

  for await (const row of parser) {
    if (processedCount >= LIMIT) break; // Stop after 2 records

    console.log(`📦 Processing: ${row.name}`);

    const urlList = row.photos.split('\n').filter((url: string) => url.trim() !== '');
    const publicIds: string[] = [];

    for (const url of urlList) {
      try {
        const uploadRes = await cloudinary.uploader.upload(url.trim(), {
          folder: 'inventory',
        });
        publicIds.push(uploadRes.public_id);
      } catch (err) {
        console.error(`❌ Cloudinary Error for ${row.name}:`, err);
      }
    }

    const productData = {
        name: row.name,
        info: row.info || "",
        sku: row.sku ? String(row.sku).split('.')[0] : "",
        cost: (parseFloat(row.cost) || 0) / 100, 
        price: (parseFloat(row.price) || 0) / 100,
        manual_sale: (parseFloat(row.manual_sale) || 0) / 100,
        deliverable: row.deliverable === 'True',
        on_sale: row.on_sale === 'True',
        count: parseInt(row.count) || 0,
        in_store_warranty: parseInt(row.in_store_warranty) || 0,
        parts_labor_warranty: parseInt(row.parts_labor_warranty) || 0,
        photos: publicIds, 
        type: row.type || "",
        subtype: row.subtype || ""
    };

    try {
        const res = await AddProductLocal(productData);
        console.log(`✅ Success: ${row.name}`);
    } catch (err) {
        console.error(`❌ Error inserting ${row.name}:`, err);
    }

    processedCount++;
  }
  
  console.log("\n🏁 Limited test run complete. Check your DB and Cloudinary!");
  process.exit(0); // Closes the script cleanly
}

run();