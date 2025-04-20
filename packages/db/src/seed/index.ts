// the seed script for templates and other things
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../client';
import { users, projects } from '../schema';
import { eq } from 'drizzle-orm';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, 'templates');

async function seedTemplates() {
    console.log("🧪 Seeding templates...");


    let [designr] = await db.select().from(users).where(eq(users.name, 'designr'));

    if (!designr) {
        const [value] = await db.insert(users).values({
            name: 'designr',
            email: 'designr@domain.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();
        designr = value;
        console.log('👤 Created "designr" user.');
    }
    console.log("designr: ", designr);
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(templatesDir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');

        const cleaned = raw.replace(/\t/g, '');
        const data = JSON.parse(cleaned);

        const width = data?.clipPath?.width;
        const height = data?.clipPath?.height;
        const thumbnailUrl = data?.thumbnailUrl;

        if (!width || !height) {
            console.warn(`⚠️ Skipping ${file} - missing clipPath dimensions.`);
            continue;
        }

        const name = path.basename(file, '.json').replace(/-/g, ' ');

        await db.insert(projects).values({
            name,
            userId: designr.id,
            organizationId: null,
            isTemplate: true,
            isProTemplate: false,
            category: null,
            width,
            height,
            data,
            showUserIdentity: true,
            canView: 'SELF',
            canEdit: 'SELF',
            thumbnailUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`✅ Seeded: ${name}`);
    }

    console.log("🎉 All templates seeded successfully.");
}

seedTemplates().catch(err => {
    console.error("❌ Seed script failed:", err);
    process.exit(1);
});
