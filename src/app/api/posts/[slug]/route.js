// src/app/api/posts/[slug]/route.js
import fs from "fs/promises";
import path from "path";
import db from "@/lib/db";
import matter from "gray-matter";

export async function GET(req, { params }) {
    const { slug } = await params;

    const result = await db.query(
        "SELECT * FROM blogposts WHERE slug = $1",
        [slug]
    );

    if (result.rowCount === 0) {
        return new Response("Not Found", { status: 404 });
    }

    const post = result.rows[0];

    try {
        const filePath = path.join(process.cwd(), "public", "posts", post.filename);
        const file = await fs.readFile(filePath, "utf-8");
        const { content, data: meta } = matter(file);

        return Response.json({
            post: post,
            content,
            meta
        });
    } catch (err) {
        return new Response("File not found", { status: 500 });
    }
}
