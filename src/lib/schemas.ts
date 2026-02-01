import { z } from 'zod';

export const LinkKindSchema = z.enum(['figma', 'doc', 'slack', 'prototype', 'misc']);
export type LinkKind = z.infer<typeof LinkKindSchema>;

export const LinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  kind: LinkKindSchema,
});
export type Link = z.infer<typeof LinkSchema>;

export const ArtifactSchema = z.object({
  src: z.string(),
  alt: z.string(),
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const MusicSchema = z.object({
  track: z.string(),
  src: z.string(),
}).optional();
export type Music = z.infer<typeof MusicSchema>;

export const WeekStatusSchema = z.enum(['reviewed', 'in-progress', 'archived']);
export type WeekStatus = z.infer<typeof WeekStatusSchema>;

export const WeekFrontmatterSchema = z.object({
  year: z.number(),
  week: z.number().min(1).max(53),
  date_start: z.string(),
  date_end: z.string(),
  status: WeekStatusSchema,
  title: z.string(),
  tags: z.array(z.string()).default([]),
  links: z.array(LinkSchema).default([]),
  artifacts: z.array(ArtifactSchema).default([]),
  music: MusicSchema,
});
export type WeekFrontmatter = z.infer<typeof WeekFrontmatterSchema>;

export interface WeekMeta {
  year: number;
  week: number;
  dateStart: string;
  dateEnd: string;
  status: WeekStatus;
  title: string;
  tags: string[];
  slug: string;
}

export interface WeekEntry extends WeekMeta {
  frontmatter: WeekFrontmatter;
  content: string;
}

export interface TagMeta {
  name: string;
  count: number;
}

export const GuestbookEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  url: z.string().url().optional().or(z.literal('')),
  timestamp: z.string(),
});
export type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>;

export const GuestbookInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  url: z.string().url().optional().or(z.literal('')),
  honeypot: z.string().max(0).optional(), // Should be empty
});
export type GuestbookInput = z.infer<typeof GuestbookInputSchema>;
