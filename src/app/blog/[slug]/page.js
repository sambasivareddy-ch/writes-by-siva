import Head from 'next/head';
import fs from 'fs/promises';
import matter from 'gray-matter';
import blogs from '@/blogInfo';
import BlogPost from '@/components/BlogPost';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogs.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    };
  }

  const file = await fs.readFile(`./src/posts/${post.filename}`, 'utf-8');
  const { data: meta } = matter(file);

  const imageUrl = meta.image
    ? meta.image.startsWith('http')
      ? meta.image
      : `https://bysiva.blog${meta.image}`
    : null;

  return {
    title: meta.title || 'My Blog',
    description: meta.description || 'Default description',
    openGraph: {
      title: meta.title || 'My Blog',
      description: meta.description || 'Default description',
      url: `https://bysiva.blog/blog/${slug}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      article: {
        publishedTime: meta.date,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title || 'My Blog',
      description: meta.description || 'Default description',
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPage({ params }) {
    const { slug } = await params;
    const post = blogs.find((p) => p.slug === slug);
    if (!post) return <div>Post not found</div>;

    const file = await fs.readFile(`./src/posts/${post.filename}`, 'utf-8');
    const { content, data: meta } = matter(file);

    const imageUrl = meta.image
        ? meta.image.startsWith('http')
            ? meta.image
            : `https://bysiva.blog${meta.image}`
        : null;

    return <>
        <BlogPost content={content} meta={meta} slug={slug} />
    </>;
}
