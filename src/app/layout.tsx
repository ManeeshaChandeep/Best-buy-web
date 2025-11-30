import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "react-quill-new/dist/quill.snow.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import React from "react"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    metadataBase: new URL("https://bestbuyelectronics.lk"),
    title: {
        default: "Best Buy Electronics Wanchawala Galle",
        template: "%s | Best Buy Electronics"
    },
    description:
        "Electronics store in Wanchawala Galle. Shop TVs, smartphones, refrigerators, washing machines and appliances with delivery across Sri Lanka.",
    keywords: [
        "electronics",
        "appliances",
        "gadgets",
        "tv",
        "smartphone",
        "refrigerator",
        "washing machine",
        "microwave",
        "air conditioner",
        "electronics store galle",
        "electronics shop wanchawala",
        "sri lanka electronics"
    ],
    authors: [{ name: "Best Buy Electronics" }],
    creator: "Best Buy Electronics",
    publisher: "Best Buy Electronics",
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://bestbuyelectronics.lk",
        siteName: "Best Buy Electronics",
        title: "Best Buy Electronics Wanchawala Galle",
        description:
            "Electronics store in Wanchawala Galle. Shop TVs, smartphones, refrigerators, washing machines and appliances.",
        images: [
            {
                url: "/images/logo.png",
                width: 1200,
                height: 630,
                alt: "Best Buy Electronics"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Best Buy Electronics Wanchawala Galle",
        description:
            "Electronics store in Wanchawala Galle. Shop TVs, smartphones, refrigerators, washing machines and appliances.",
        images: ["/images/logo.png"],
        creator: "@bestbuyelectronics"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico"
    },
    manifest: "/manifest.json",
    alternates: {
        canonical: "https://bestbuyelectronics.lk"
    },
    category: "electronics",
    classification: "Shopping",
    other: {
        "theme-color": "#dc2626",
        "color-scheme": "light"
    }
}

export default function RootLayout(props: { children: React.ReactNode }) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "ElectronicsStore",
        name: "Best Buy Electronics",
        description:
            "Electronics store in Wanchawala Galle. TVs, smartphones, appliances and gadgets.",
        url: "https://bestbuyelectronics.lk",
        logo: "https://bestbuyelectronics.lk/images/logo.png",
        image: "https://bestbuyelectronics.lk/images/logo.png",
        telephone: "+94XXXXXXXXX",
        priceRange: "$$",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Wanchawala",
            addressLocality: "Galle",
            addressRegion: "Southern Province",
            postalCode: "80000",
            addressCountry: "LK"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 6.0532,
            longitude: 80.2150
        },
        openingHours: "Mo Su 08:00 20:00",
        sameAs: [
            "https://www.facebook.com/bestbuyelectronics",
            "https://www.instagram.com/bestbuyelectronics"
        ],
        potentialAction: {
            "@type": "SearchAction",
            target: "https://bestbuyelectronics.lk/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Best Buy Electronics",
        url: "https://bestbuyelectronics.lk",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://bestbuyelectronics.lk/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema)
            }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema)
            }}
        />
        <Header />
        {props.children}
        <Footer />
        </body>
        </html>
    )
}
