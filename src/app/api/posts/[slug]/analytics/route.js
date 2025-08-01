import db from '@/lib/db';

export async function PATCH(req, { params }) {
    const { type } = await req.json();
    const { slug } = await params;

    if (!['views', 'likes'].includes(type)) {
        return new Response('Invalid type', { status: 400 });
    }

    const result = await db.query(`
        UPDATE blogposts
        SET ${type} = ${type} + 1,
            updated_at = NOW()
        WHERE slug = $1
        RETURNING *
    `, [slug]);

    return Response.json(result.rows[0]);
}
