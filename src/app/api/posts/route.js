// src/app/api/posts/route.js
import db from "@/lib/db";

export async function GET(req) {

    const result = await db.query(
        "SELECT * FROM blogposts ORDER BY date DESC"
    );

    if (result.rowCount === 0) {
        return new Response("Not Found", { status: 404 });
    }

    const posts = result.rows;

    try {
        return Response.json({
            posts
        });
    } catch (err) {
        return new Response("Posts not found", { status: 500 });
    }
}
