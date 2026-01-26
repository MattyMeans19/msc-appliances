import fs from 'fs';
import { parse } from 'csv-parse';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

async function migrate() {
  const filePath = './final_database_import.csv';
  const records: any[] = [];

  // 2. Read and Parse CSV
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  console.log("🚀 Starting Migration...");

  for await (const row of parser) {
    console.log(`📦 Processing: ${row.name}`);

    // 3. Handle Photos
    // Split the photo URLs (they are separated by newlines in our CSV)
    const urlList = row.photos.split('\n').filter((url: string) => url.trim() !== '');
    const publicIds: string[] = [];

    for (const url of urlList) {
      try {
        // Upload to Cloudinary
        // folder: 'inventory' keeps your Cloudinary dashboard organized
        const uploadRes = await cloudinary.uploader.upload(url.trim(), {
          folder: 'inventory',
        });
        publicIds.push(uploadRes.public_id);
      } catch (err) {
        console.error(`❌ Failed to upload image for ${row.name}:`, err);
      }
    }

    // 4. Insert into Database using Prisma
  try {
        await prisma.inventory.create({
          data: {
            name: row.name,
            info: row.info,
            sku: row.sku ? String(row.sku) : null, // Ensures SKU is a string or null
            price: parseInt(row.price) || 0,
            manual_sale: parseInt(row.manual_sale) || 0,
            on_sale: row.on_sale === 'True',
            cost: parseInt(row.cost) || 0,
            deliverable: row.deliverable === 'True',
            count: parseInt(row.count) || 0, // Updated to parse as Integer
            type: row.type,
            subtype: row.subtype,
            in_store_warranty: parseInt(row.in_store_warranty) || 0,
            parts_labor_warranty: parseInt(row.parts_labor_warranty) || 0,
            photos: publicIds, 
          },
        });
        console.log(`✅ Imported ${row.name}`);
      } catch (dbErr) {
        console.error(`🚨 Database error for ${row.name}:`, dbErr);
      }
  }

  console.log("🏁 Migration Complete!");
}

migrate()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

  //to run: npx ts-node migrate-inventory.ts