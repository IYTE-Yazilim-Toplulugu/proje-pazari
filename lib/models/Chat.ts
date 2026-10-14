import { z } from 'zod';

import { DataResponseSchema } from './Api';

export const MApplicationMessage = z.object({
  id: z.string().min(1),
  applicationId: z.string().min(1),
  senderId: z.string().min(1),
  body: z.string().min(1).max(2000),
  createdAt: z.string().min(1),
});

export const MApplicationMessagePage = z.object({
  content: z.array(MApplicationMessage),
  page: z.number().int().min(0),
  size: z.number().int().min(1).max(100),
  totalElements: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const MSendApplicationMessageRequest = z.object({
  body: z.string().trim().min(1).max(2000),
});

export const MApplicationMessageResponse = DataResponseSchema(MApplicationMessage);

export type ApplicationMessage = z.infer<typeof MApplicationMessage>;
export type ApplicationMessagePage = z.infer<typeof MApplicationMessagePage>;
export type SendApplicationMessageRequest = z.infer<typeof MSendApplicationMessageRequest>;
