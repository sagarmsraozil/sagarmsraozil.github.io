import type { Metadata, Viewport } from "next";
import { Lato, Cinzel, JetBrains_Mono } from "next/font/google";
import { LakeBackground } from "@/components/ambient/LakeBackground";
import "./globals.scss";

const SITE_URL = "https://sagarmsraozil.github.io";

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Full-stack engineer in Melbourne. Two years shipping production code at Programiz Pro (100,000+ paid learners), recent team lead at Jobs.ai. React, Next.js, Node.js, TypeScript, Django, PostgreSQL. Full working rights in Australia.";

export const metadata: Metadata = {
  title: "Sagar Mishra — Full-Stack Engineer",
  description: SITE_DESCRIPTION,
  keywords: [
    "Sagar Mishra",
    "full-stack engineer Melbourne",
    "software engineer Melbourne",
    "React developer Melbourne",
    "Next.js developer",
    "Node.js engineer",
    "Django developer",
    "hire software engineer Melbourne",
    "Programiz Pro engineer",
  ],
  authors: [{ name: "Sagar Mishra", url: SITE_URL }],
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Sagar Mishra — Full-Stack Engineer",
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
    title: "Sagar Mishra — Full-Stack Engineer",
    description: SITE_DESCRIPTION,
    creator: "@SagarMi31569172",
    images: [`${SITE_URL}/sagar.jpeg`],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0f1624",
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
    "Django",
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
      className={`${lato.variable} ${cinzel.variable} ${jetbrainsMono.variable}`}
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
        <LakeBackground />
        {children}
      </body>
    </html>
  );
}
