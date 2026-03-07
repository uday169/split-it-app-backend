import { OpenAPIV3 } from '../types/swagger';

/**
 * Reusable OpenAPI component schemas, responses, and security schemes.
 * To add a new schema, simply add a new key to the `schemas` object.
 */

export const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter JWT token obtained from /api/auth/verify-otp',
  },
};

export const schemas: Record<string, OpenAPIV3.SchemaObject> = {
  ApiResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Whether the request was successful' },
      data: { type: 'object', description: 'Response payload' },
      error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'string' },
        },
      },
    },
  },
  Error: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'string' },
        },
      },
    },
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'user_abc123' },
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  Group: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'group_abc123' },
      name: { type: 'string', example: 'Apartment Roommates' },
      description: { type: 'string', example: 'Shared household expenses' },
      createdBy: { type: 'string', example: 'user_abc123' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  GroupMember: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      groupId: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'member'] },
      joinedAt: { type: 'string', format: 'date-time' },
    },
  },
  Expense: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'expense_abc123' },
      groupId: { type: 'string' },
      description: { type: 'string', example: 'Dinner at restaurant' },
      amount: { type: 'number', example: 120.5 },
      currency: { type: 'string', example: 'USD' },
      paidBy: { type: 'string' },
      splitType: { type: 'string', enum: ['equal', 'manual'] },
      date: { type: 'string', format: 'date-time' },
      createdBy: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  ExpenseSplit: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      amount: { type: 'number', example: 40.17 },
    },
  },
  Balance: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      userName: { type: 'string' },
      balance: { type: 'number', description: 'Positive = owed money, Negative = owes money' },
    },
  },
  Settlement: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'settlement_abc123' },
      groupId: { type: 'string' },
      fromUserId: { type: 'string' },
      toUserId: { type: 'string' },
      amount: { type: 'number', example: 50.0 },
      currency: { type: 'string', example: 'USD' },
      status: { type: 'string', enum: ['pending', 'confirmed'] },
      date: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  Activity: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: {
        type: 'string',
        enum: [
          'expense_created',
          'expense_updated',
          'expense_deleted',
          'settlement_created',
          'settlement_confirmed',
          'member_added',
          'member_removed',
          'group_created',
        ],
      },
      groupId: { type: 'string' },
      groupName: { type: 'string' },
      actorId: { type: 'string' },
      actorName: { type: 'string' },
      description: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
};

export const responses: Record<string, OpenAPIV3.ResponseObject> = {
  Unauthorized: {
    description: 'Authentication required or token invalid/expired',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
        example: {
          success: false,
          error: { message: 'No token provided', code: 'UNAUTHORIZED' },
        },
      },
    },
  },
  Forbidden: {
    description: 'Insufficient permissions',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
        example: {
          success: false,
          error: { message: 'Access denied', code: 'FORBIDDEN' },
        },
      },
    },
  },
  NotFound: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
        example: {
          success: false,
          error: { message: 'Resource not found', code: 'NOT_FOUND' },
        },
      },
    },
  },
  ValidationError: {
    description: 'Request validation failed',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' },
        example: {
          success: false,
          error: { message: 'body.email: Invalid email address', code: 'VALIDATION_ERROR' },
        },
      },
    },
  },
  TooManyRequests: {
    description: 'Rate limit exceeded',
    content: {
      'application/json': {
        schema: {
          type: 'object' as const,
          properties: { message: { type: 'string' as const } },
        },
        example: {
          message: 'Too many requests from this IP, please try again later',
        },
      },
    },
  },
};
