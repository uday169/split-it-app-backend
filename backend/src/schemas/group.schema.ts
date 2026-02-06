import { z } from 'zod';

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
  }),
});

export const updateGroupSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long').optional(),
    description: z.string().max(500, 'Description is too long').optional(),
  }),
});

export const getGroupSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
  }),
});

export const addMemberSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
  }),
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const removeMemberSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required'),
    memberId: z.string().min(1, 'Member ID is required'),
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>['body'];
export type UpdateGroupInput = {
  params: z.infer<typeof updateGroupSchema>['params'];
  body: z.infer<typeof updateGroupSchema>['body'];
};
export type GetGroupInput = z.infer<typeof getGroupSchema>['params'];
export type AddMemberInput = {
  params: z.infer<typeof addMemberSchema>['params'];
  body: z.infer<typeof addMemberSchema>['body'];
};
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>['params'];
