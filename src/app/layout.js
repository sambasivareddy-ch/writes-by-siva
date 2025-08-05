"use client"
import { TagsProvider } from "@/store/tagsContext";
import { BlogsProvider } from "@/store/blogsContext";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Railway API preconnect */}
        <link rel="preconnect" href="https://writes-by-siva-server-production.up.railway.app" crossOrigin="true" />
        <link rel="dns-prefetch" href="//railway.app" />

        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Load the font itself if you’re using Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <TagsProvider>
          <BlogsProvider>
            {children}
            <Footer/>
          </BlogsProvider>
        </TagsProvider>
        <Analytics/>
      </body>
    </html>
  );
}
