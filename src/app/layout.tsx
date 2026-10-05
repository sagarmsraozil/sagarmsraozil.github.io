import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { ConstellationBackground } from "@/components/ambient/ConstellationBackground";
import "./globals.scss";

const SITE_URL = "https://sagarmsraozil.github.io";

// Open-source stand-in for Starbucks' proprietary SoDoSans (see DESIGN.md).
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_TITLE = "Sagar Mishra | Full-Stack Engineer";

const SITE_DESCRIPTION =
  "Full-stack engineer in Melbourne. Two years of production work at Programiz (100,000+ paid learners), recent technical lead at Jobss.ai. React, Next.js, Node.js, TypeScript, PostgreSQL, Laravel. Full working rights in Australia.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Sagar Mishra",
    "full-stack engineer Melbourne",
    "software engineer Melbourne",
    "React developer Melbourne",
    "Next.js developer",
    "Node.js engineer",
    "Laravel developer",
    "Django developer",
    "hire software engineer Melbourne",
    "Programiz Pro engineer",
  ],
  authors: [{ name: "Sagar Mishra", url: SITE_URL }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Sagar Mishra",
    locale: "en_AU",
    images: [
      {
        url: `${SITE_URL}/sagar.jpeg`,
        alt: "Sagar Mishra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@SagarMi31569172",
    images: [`${SITE_URL}/sagar.jpeg`],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2f0eb",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sagar Mishra",
  jobTitle: "Full-Stack Engineer",
  email: "sagarcrcoc@gmail.com",
  telephone: "+61424308228",
  url: SITE_URL,
  image: `${SITE_URL}/sagar.jpeg`,
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
    "Laravel",
    "Django",
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
      className={manrope.variable}
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
      <body suppressHydrationWarning>
        <ConstellationBackground />
        {children}
      </body>
    </html>
  );
}
