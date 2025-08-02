import Head from "next/head";
import fs from "fs/promises";
import matter from "gray-matter";
import BlogPost from "@/components/BlogPost";
import path from "path";

async function getPost(slug) {
    try {
        const response = await fetch(`https://writes-by-siva-server-production.up.railway.app/blog/${slug}`);
        
        if (!response.ok) {
            return null
        }

        const json = await response.json();

        return json.posts[0];
    } catch(err) {
        console.log(err)
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    let post;
    try {
        post = await getPost(slug);
    } catch(err) {
        console.log(err)
    }

    if (!post) {
        return {
            title: "Post Not Found",
            description: "This blog post could not be found.",
        };
    }

    const file = await fs.readFile(path.join(process.cwd(), 'public', 'posts', post.filename), 'utf-8');

    const { data: meta } = matter(file);

    const imageUrl = meta.image
        ? meta.image.startsWith("http")
            ? meta.image
            : `https://bysiva.blog${meta.image}`
        : null;

    return {
        title: meta.title || "My Blog",
        description: meta.description || "Default description",
        keywords: meta.tags,
        openGraph: {
            title: meta.title || "My Blog",
            description: meta.description || "Default description",
            url: `https://bysiva.blog/blog/${slug}`,
            type: "article",
            images: imageUrl ? [{ url: imageUrl }] : undefined,
            article: {
                publishedTime: meta.date,
            },
        },
        twitter: {
            card: "summary_large_image",
            title: meta.title || "My Blog",
            description: meta.description || "Default description",
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function BlogPage({ params }) {
    const { slug } = await params;
    
    let post;
    try {
        post = await getPost(slug);
    } catch(err) {
        console.log(err)
    }

    if (!post) return <div>Post not found</div>;

    const file = await fs.readFile(path.join(process.cwd(), 'public', 'posts', post.filename), 'utf-8');
    const { content, data: meta } = matter(file);

    return (
        <>
            <BlogPost content={content} meta={meta} slug={slug} post={post}/>
        </>
    );
}
