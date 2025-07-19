"use client"
import { TagsProvider } from "@/store/tagsContext";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TagsProvider>
          {children}
          <Footer/>
        </TagsProvider>
        <Analytics/>
      </body>
    </html>
  );
}
