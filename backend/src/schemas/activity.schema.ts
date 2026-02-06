import { z } from 'zod';

export const getActivitySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),
});

export type GetActivityInput = z.infer<typeof getActivitySchema>['query'];
