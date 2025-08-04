"use client"
import { TagsProvider } from "@/store/tagsContext";
import { BlogsProvider } from "@/store/blogsContext";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
