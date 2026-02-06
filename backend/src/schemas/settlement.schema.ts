import { z } from 'zod';

export const createSettlementSchema = z.object({
  body: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
    fromUserId: z.string().min(1, 'From user ID is required'),
    toUserId: z.string().min(1, 'To user ID is required'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
    date: z.string().datetime().optional(),
  }).refine((data) => data.fromUserId !== data.toUserId, {
    message: 'From and to users must be different',
    path: ['toUserId'],
  }),
});

export const confirmSettlementSchema = z.object({
  params: z.object({
    settlementId: z.string().min(1, 'Settlement ID is required'),
  }),
});

export const getGroupSettlementsSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
  }),
});

export type CreateSettlementInput = z.infer<typeof createSettlementSchema>['body'];
export type ConfirmSettlementInput = z.infer<typeof confirmSettlementSchema>['params'];
export type GetGroupSettlementsInput = z.infer<typeof getGroupSettlementsSchema>['params'];
