// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  redirects: {
    "/signup": "https://forms.hackclub.com/apex",
    "/submit-proposal": "https://forms.hackclub.com/submit-apex-proposal",
    "/slack-channel": "https://hackclub.slack.com/archives/C08EFAYBZ38",
  },
});
