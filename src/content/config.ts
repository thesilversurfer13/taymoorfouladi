import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    hero: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(99),
    tags: z.array(z.string()).default([]),
  }),
});

const career = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    hero: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(99),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    hero: z.string().optional(),
    date: z.string().optional(),
    order: z.number().default(99),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string().optional(),
    hero: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { portfolio, career, blog, pages };
