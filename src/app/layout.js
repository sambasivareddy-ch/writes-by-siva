"use client"
import { TagsProvider } from "@/store/tagsContext";

import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TagsProvider>
          {children}
        </TagsProvider>
      </body>
    </html>
  );
}
