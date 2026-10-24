import { createFileRoute } from "@tanstack/react-router";

import RotoSite from "@/components/roto-site";

const siteUrl = "https://www.rotointellecta.com";
const pageTitle = "RotoIntellecta | Turbomachinery Reliability, Vibration Analysis & System1 Solutions";
const pageDescription =
  "Specialized rotating machinery diagnostics, 24/7 remote Bently Nevada System1 surveillance, root cause analysis (RCA), and accredited Mobius Institute Cat I–III certification training.";
const ogImage = `${siteUrl}/og-image.png`;

// Comprehensive Schema.org JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "RotoIntellecta",
      alternateName: ["RotoIntellecta AI", "Roto Intellecta"],
      url: siteUrl,
      logo: `${siteUrl}/roto-logo-dark.png`,
      image: ogImage,
      description: pageDescription,
      email: "contact@rotointellecta.com",
      telephone: "+918891144334",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+918891144334",
          contactType: "technical engineering dispatch",
          email: "contact@rotointellecta.com",
          availableLanguage: ["English", "Hindi", "Malayalam"],
        },
      ],
      knowsAbout: [
        "Turbomachinery Diagnostics",
        "Vibration Analysis ISO 18436-2",
        "Bently Nevada System1 Remote Surveillance",
        "Root Cause Failure Analysis (RCA)",
        "Mobius Institute Category I, II & III Training",
        "SMRP CMRP Coaching",
        "Dynamic Single & Two-Plane Field Balancing",
        "Reliability Centered Maintenance (RCM)",
        "Predictive Maintenance (PdM)",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "RotoIntellecta",
      description: pageDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: pageTitle,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
      description: pageDescription,
      inLanguage: "en-US",
    },
    {
      "@type": "ItemList",
      name: "RotoIntellecta Core Industrial Capabilities",
      itemListElement: [
        {
          "@type": "Service",
          position: 1,
          name: "Remote Engineering & 24/7 System1 Surveillance",
          description:
            "Instant remote diagnostic support for critical mechanical anomalies, FFT spectral demodulation, orbit analysis, and Bently Nevada System1 database surveillance.",
        },
        {
          "@type": "Service",
          position: 2,
          name: "Strategic Asset Management & PM Optimization",
          description:
            "Equipment strategy development, PM rationalization, bad-actor elimination, and dynamic spares lifecycle policy.",
        },
        {
          "@type": "Service",
          position: 3,
          name: "Turbomachinery Field Balancing & RCA",
          description:
            "Single and 2-plane dynamic field balancing, cross-channel phase analysis, and physics-driven root cause failure analysis.",
        },
        {
          "@type": "Service",
          position: 4,
          name: "Industrial AI Operational Solutions",
          description:
            "Next-generation algorithmic inventory optimization and automated mechanical troubleshooting assistants for field crews.",
        },
        {
          "@type": "EducationalOccupationalProgram",
          position: 5,
          name: "Reliability Academy & Certification Coaching",
          description:
            "Accredited Mobius Institute Category I, II, and III Vibration Analyst training, and SMRP CMRP certification coaching.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What rotating equipment services does RotoIntellecta provide?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RotoIntellecta provides 24/7 remote Bently Nevada System1 surveillance, high-vibration root cause analysis (RCA), dynamic field trim balancing, PM strategy optimization, and Mobius Institute ISO 18436-2 vibration certification training.",
          },
        },
        {
          "@type": "Question",
          name: "Does RotoIntellecta support remote vibration diagnostics without site visits?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Our remote engineering center connects directly to plant data collectors and Bently Nevada System1 databases to perform instant spectrum, waterfall, orbit, and trend analysis without logistical delays.",
          },
        },
        {
          "@type": "Question",
          name: "What professional certification courses does RotoIntellecta offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We deliver accredited coaching for Mobius Institute ISO 18436-2 Category I, II, and III Vibration Analysts, SMRP Certified Maintenance & Reliability Professional (CMRP), and ISA Certified Automation Professional (CAP).",
          },
        },
        {
          "@type": "Question",
          name: "How can I contact RotoIntellecta for emergency machine failure or diagnostic assistance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can email our specialist engineers at contact@rotointellecta.com or contact our 24/7 technical dispatch desk directly at +91 88911 44334.",
          },
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      {
        name: "keywords",
        content:
          "turbomachinery diagnostics, rotating machinery reliability, Bently Nevada System1, vibration analysis, root cause failure analysis, RCA, Mobius Institute Cat III, CMRP certification, dynamic balancing, condition monitoring, remote predictive maintenance, industrial AI, plant reliability engineering, FFT spectrum analysis",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "bingbot", content: "index, follow, max-snippet:-1, max-image-preview:large" },
      
      // Open Graph (LinkedIn, WhatsApp, Facebook)
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/` },
      { property: "og:site_name", content: "RotoIntellecta" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: "RotoIntellecta | Rotating Machinery Reliability & Industrial AI" },
      { property: "og:description", content: pageDescription },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "RotoIntellecta - Rotating Equipment Reliability & Industrial AI" },

      // Twitter Cards (X)
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: `${siteUrl}/` },
      { name: "twitter:title", content: "RotoIntellecta | Turbomachinery Reliability & System1 Solutions" },
      { name: "twitter:description", content: pageDescription },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: "RotoIntellecta - Rotating Equipment Reliability & Industrial AI" },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: RotoSite,
});