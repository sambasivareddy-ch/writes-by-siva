import Head from "next/head";
import BlogList from "@/components/BlogsList";


export async function generateMetadata() {
  return {
    title: 'My Blogs',
    description: 'A collection of my blog posts',
    openGraph: {
      title: 'My Blogs',
      description: 'A collection of my blog posts',
      url: 'https://bysiva.blog/',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My Blogs',
      description: 'A collection of my blog posts',
    },
  };
}

export default function Blog() {
    return (
        <>
            <BlogList/>
        </>
    );
};