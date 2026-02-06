import { z } from 'zod';

export const getGroupBalancesSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
  }),
});

export type GetGroupBalancesInput = z.infer<typeof getGroupBalancesSchema>['params'];
