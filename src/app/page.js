import Head from "next/head";
import BlogList from "@/components/BlogsList";


export async function generateMetadata() {
  return {
    title: 'My Blogs',
    description: 'A collection of my blog posts',
    author: 'Samba Siva Reddy',
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
    other: {
      'google-site-verification': 'fiu0kiIZiSNGFJkZtBwGLb7Y-R4M4urEVJDFlUA3rxA',
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