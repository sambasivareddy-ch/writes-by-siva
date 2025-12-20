"use client";
import { TagsProvider } from "@/store/tagsContext";
import { BlogsProvider } from "@/store/blogsContext";
import { AuthProvider } from "@/store/authContext";
import { PageProvider } from "@/store/pageContext";
import { CursorProvider } from "@/store/cursorContext";
import { Analytics } from "@vercel/analytics/next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-montserrat",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${montserrat.variable}`}>
            <head>
                {/* Railway API preconnect */}
                <link
                    rel="preconnect"
                    href="https://writes-by-siva-server-production.up.railway.app"
                    crossOrigin="true"
                />
                <link rel="dns-prefetch" href="//railway.app" />

                {/* Google Fonts preconnect */}
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link rel="dns-prefetch" href="//fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            </head>
            <body>
                <AuthProvider>
                    <TagsProvider>
                        <PageProvider>
                            <BlogsProvider>
                                <CursorProvider>
                                    {children}
                                </CursorProvider>
                            </BlogsProvider>
                        </PageProvider>
                    </TagsProvider>
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    );
}
