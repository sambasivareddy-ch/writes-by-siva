import db from '@/lib/db';

export async function POST(req) {
    const data = await req.json();
    const { id, slug, title, description, date, primary, domains, filename } = data;

    const result = await db.query(
        `
            INSERT INTO blogposts (id, slug, title, description, date, primary_category, domains, filename) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, 
        [
            id, slug, title, description, date,
            primary, domains.toString(), filename
        ]
    );

    return Response.json(result.rows[0]);
}
