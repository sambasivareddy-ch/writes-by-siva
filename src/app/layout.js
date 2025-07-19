"use client"
import { TagsProvider } from "@/store/tagsContext";
import { Analytics } from "@vercel/analytics/next"
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TagsProvider>
          {children}
        </TagsProvider>
        <Analytics/>
      </body>
    </html>
  );
}
