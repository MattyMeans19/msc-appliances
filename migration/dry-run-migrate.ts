import fs from 'fs';
import { parse } from 'csv-parse';
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary (Keep your real keys here)
cloudinary.config({
  cloud_name: 'dwqwfwa34',
  api_key: '498859225242772',
  api_secret: '0srfUIaYeUywytxPuBEarxuazVs',
});

async function dryRun() {
  const filePath = './final_database_import.csv';
  let processedCount = 0;
  const LIMIT = 2; // Only test 2 records

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  console.log("🔍 Starting Dry Run (Testing first 2 records)...");

  for await (const row of parser) {
    if (processedCount >= LIMIT) break;
    
    console.log(`\n--- Testing Record: ${row.name} ---`);

    // 2. Test Image Upload (Only for the very first image to save credits)
    const urlList = row.photos.split('\n').filter((url: string) => url.trim() !== '');
    const publicIds: string[] = [];

    if (urlList.length > 0) {
      try {
        console.log(`📸 Attempting test upload for: ${urlList[0].substring(0, 50)}...`);
        const uploadRes = await cloudinary.uploader.upload(urlList[0].trim(), {
          folder: 'inventory_test',
        });
        publicIds.push(uploadRes.public_id);
        console.log(`✅ Cloudinary Success! ID: ${uploadRes.public_id}`);
      } catch (err) {
        console.error(`❌ Cloudinary Error:`, err);
      }
    }

    // 3. Prepare Data Object (matching your Prisma Schema)
    const prismaData = {
      name: row.name,
      info: row.info || null,
      sku: row.sku ? String(row.sku) : null,
      price: parseInt(row.price) || 0,
      manual_sale: parseInt(row.manual_sale) || 0,
      on_sale: row.on_sale === 'True',
      cost: parseInt(row.cost) || 0,
      deliverable: row.deliverable === 'True',
      // Handles both "1" and "1 in stock"
      count: parseInt(row.count) || 0, 
      type: row.type,
      subtype: row.subtype,
      in_store_warranty: parseInt(row.in_store_warranty) || 0,
      parts_labor_warranty: parseInt(row.parts_labor_warranty) || 0,
      photos: publicIds,
    };

    console.log("📝 Data Object that would be created in Prisma:");
    console.dir(prismaData, { depth: null });

    processedCount++;
  }

  console.log("\n🏁 Dry Run Complete! Check the output above for any errors.");
}

dryRun().catch(console.error);