import { z, defineCollection } from "astro:content";

const resourcesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  resources: resourcesCollection,
};
