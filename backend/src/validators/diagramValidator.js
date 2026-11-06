import { z } from "zod";

export const createDiagramSchema = z.object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    nodes: z.array(z.record(z.string(), z.unknown())).default([]),
    edges: z.array(z.record(z.string(), z.unknown())).default([]),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE")
}).strict();

export const updateDiagramSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  nodes: z.array(z.record(z.string(), z.unknown())).optional(),
  edges: z.array(z.record(z.string(), z.unknown())).optional(),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).optional()
}).strict();

export const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["VIEWER", "EDITOR"])
}).strict();