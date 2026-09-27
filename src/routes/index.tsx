import { createFileRoute } from "@tanstack/react-router";

import RotoSite from "@/components/roto-site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RotoIntellecta AI — Industrial Reliability Intelligence" },
      { name: "description", content: "Condition monitoring, reliability engineering training, and predictive AI for mission-critical rotating machinery." },
      { property: "og:title", content: "RotoIntellecta AI — Industrial Reliability Intelligence" },
      { property: "og:description", content: "Monitor, predict, maintain, and optimize mission-critical rotating machinery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RotoSite,
});