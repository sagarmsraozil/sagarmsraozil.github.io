import type { Metadata } from "next";
import { Lato, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.scss";

const SITE_URL = "https://sagarmsraozil.github.io";

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sagar Mishra — Full-stack Engineer",
  description:
    "Full-stack engineer based in Melbourne. Two years of product experience at Programiz Pro (100,000+ learners). React, Next.js, Node.js. Open to engineering roles and serious collaboration.",
  keywords: [
    "Sagar Mishra",
    "full-stack engineer Melbourne",
    "software engineer Melbourne",
    "React developer Melbourne",
    "Next.js developer",
    "Node.js engineer",
    "hire software engineer Melbourne",
    "Programiz Pro engineer",
  ],
  authors: [{ name: "Sagar Mishra", url: SITE_URL }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Sagar Mishra — Full-stack Engineer",
    description:
      "Full-stack engineer based in Melbourne. Two years of product experience at Programiz Pro (100,000+ learners). React, Next.js, Node.js. Open to engineering roles and serious collaboration.",
    type: "website",
    url: SITE_URL,
    siteName: "Sagar Mishra",
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
    title: "Sagar Mishra — Full-stack Engineer",
    description:
      "Full-stack engineer based in Melbourne. React, Next.js, Node.js. Open to engineering roles and serious collaboration.",
    creator: "@SagarMi31569172",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sagar Mishra",
  jobTitle: "Full-stack Engineer",
  email: "sagarcrcoc@gmail.com",
  url: SITE_URL,
  image: `${SITE_URL}/photo.jpg`,
  sameAs: [
    "https://www.linkedin.com/in/sagar-mishra-a3455121b/",
    "https://github.com/sagarmsraozil",
    "https://x.com/SagarMi31569172",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Full-stack Engineering",
    "Software Architecture",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Victorian Institute of Technology",
      url: "https://vit.edu.au",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Softwarica College of IT and E-commerce",
      url: "https://softwarica.edu.np",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressCountry: "AU",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sagar Mishra",
  url: SITE_URL,
  description:
    "Personal website of Sagar Mishra, full-stack engineer based in Melbourne.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
