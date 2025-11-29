"use client";
import { TagsProvider } from "@/store/tagsContext";
import { BlogsProvider } from "@/store/blogsContext";
import { AuthProvider } from "@/store/authContext";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import { Poppins, Raleway, Inter } from "next/font/google";
import "@/styles/globals.css";

// Load Poppins with multiple weights & italic support
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-poppins", // Optional: if using CSS variables
});

// Load Raleway with full weight range
const raleway = Raleway({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-raleway",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-inter",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${poppins.variable} ${raleway.variable} ${inter.variable}`}>
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
                        <BlogsProvider>
                            {children}
                            <Footer />
                        </BlogsProvider>
                    </TagsProvider>
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    );
}
