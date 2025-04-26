// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  redirects: {
    "/signup": "https://forms.hackclub.com/apex",
    "/submit-proposal": "https://forms.hackclub.com/submit-apex-proposal",
    "/slack-apex": "https://hackclub.slack.com/archives/C08EFAYBZ38",
    "/slack-apex-bulletin": "https://hackclub.slack.com/archives/C08FQM8RG5U",
  },
  adapter: vercel(),
  output: "static",
});
