import { Pool } from "pg";
import { config } from "dotenv";
import blogs from "../blogInfo.js"; // updated path

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function insertPost(post) {
  await pool.query(
    `INSERT INTO blogposts (
      id, slug, title, description, date,
      primary_category, domains, filename
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      post.id,
      post.slug,
      post.title,
      post.description,
      post.date,
      post.primary,
      post.domains, // safer conversion
      post.filename,
    ]
  );
  console.log(`Inserted: ${post.slug}`);
}

async function migrateAll() {
  try {
    await Promise.all(blogs.map(insertPost)); // blogs is under `.default`
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrateAll();
