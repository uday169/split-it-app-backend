import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const createExpenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  amount: z.string().min(1, 'Amount is required'),
  paidBy: z.string().min(1, 'Please select who paid'),
  date: z.date(),
  splitType: z.enum(['equal', 'manual']),
});

export const settlementSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  notes: z.string().max(200, 'Notes are too long').optional(),
});
