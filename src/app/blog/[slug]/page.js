import Head from "next/head";
import fs from "fs/promises";
import matter from "gray-matter";
import readingTime from "reading-time";
import BlogPost from "@/components/BlogPost";
import Footer from "@/components/Footer";
import path from "path";

async function getPost(slug) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${slug}`);
        
        if (!response.ok) {
            return null
        }

        const json = await response.json();

        if (json && json.posts) {
            return json.posts[0];
        }
        return null;
    } catch(err) {
        console.log(err)
        return null;
    }
}

async function updateReadTime(slug, readtime) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/readtime/${slug}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                readtime,
            })
        })

        if (!response.ok) {
            return
        }

        await response.json();
    } catch(err) {
        console.log(err)
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

    const stats = readingTime(content);

    updateReadTime(slug, stats.minutes);

    return (
        <>
            <BlogPost content={content} meta={meta} slug={slug} post={post} primary={post['primary_category']} domains={post['domains']}/>
            <Footer/>
        </>
    );
}
