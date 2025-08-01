import BlogPost from "@/components/BlogPost";

// Use fetch from Node runtime for server-side fetching
async function fetchPostData(slug) {
    const res = await fetch(`${process.env.URL}/api/posts/${slug}`, {
        cache: "no-store" // ensure fresh content during dev
    });

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const data = await fetchPostData(slug);
    if (!data) {
        return {
            title: "Post Not Found",
            description: "This blog post could not be found.",
        };
    }

    const { meta } = data;
    const imageUrl = meta.image?.startsWith("http")
        ? meta.image
        : `https://bysiva.blog${meta.image}`;

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
    const data = await fetchPostData(slug);

    if (!data) return <div>Post not found</div>;

    return (
        <>
            <BlogPost slug={slug} />
        </>
    );
}
