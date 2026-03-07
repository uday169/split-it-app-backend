import { OpenAPIV3 } from '../types/swagger';

const auth = [{ bearerAuth: [] }];

const expenseIdParam: OpenAPIV3.ParameterObject = {
  name: 'expenseId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'The expense ID',
};

const expensePaths: OpenAPIV3.PathsObject = {
  '/api/expenses': {
    post: {
      summary: 'Create a new expense',
      description:
        'Creates a new expense in a group. Supports equal and manual split types. For manual splits, the sum of split amounts must equal the total amount.',
      tags: ['Expenses'],
      security: auth,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['groupId', 'description', 'amount', 'paidBy', 'splitType', 'splits'],
              properties: {
                groupId: { type: 'string', example: 'group_abc123' },
                description: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 200,
                  example: 'Dinner at restaurant',
                },
                amount: { type: 'number', minimum: 0, exclusiveMinimum: true, example: 120.5 },
                currency: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 3,
                  default: 'USD',
                  example: 'USD',
                },
                paidBy: {
                  type: 'string',
                  description: 'User ID of the person who paid',
                  example: 'user_abc123',
                },
                splitType: { type: 'string', enum: ['equal', 'manual'], example: 'equal' },
                splits: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['userId'],
                    properties: {
                      userId: { type: 'string', example: 'user_abc123' },
                      amount: {
                        type: 'number',
                        description: 'Required for manual split type',
                        example: 40.17,
                      },
                    },
                  },
                },
                date: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Optional expense date (defaults to now)',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Expense created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Expense' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
    get: {
      summary: 'List expenses for a group',
      description:
        'Returns expenses for a specific group. Group ID must be provided as a query parameter.',
      tags: ['Expenses'],
      security: auth,
      parameters: [
        {
          name: 'groupId',
          in: 'query',
          required: true,
          schema: { type: 'string' },
          description: 'The group ID to list expenses for',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer' },
          description: 'Maximum number of expenses to return',
        },
      ],
      responses: {
        '200': {
          description: 'Expenses retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Expense' } },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/expenses/{expenseId}': {
    get: {
      summary: 'Get expense details',
      description: 'Returns detailed information about a specific expense including splits.',
      tags: ['Expenses'],
      security: auth,
      parameters: [expenseIdParam],
      responses: {
        '200': {
          description: 'Expense details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Expense' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
    put: {
      summary: 'Update expense',
      description: 'Updates an existing expense. Only the expense creator can update it.',
      tags: ['Expenses'],
      security: auth,
      parameters: [expenseIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 200,
                  example: 'Updated dinner description',
                },
                amount: { type: 'number', minimum: 0, exclusiveMinimum: true, example: 150.0 },
                date: { type: 'string', format: 'date-time' },
                splitType: { type: 'string', enum: ['equal', 'manual'] },
                splits: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['userId'],
                    properties: {
                      userId: { type: 'string' },
                      amount: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Expense updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Expense' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
    delete: {
      summary: 'Delete expense',
      description: 'Deletes an expense. Only the expense creator can delete it.',
      tags: ['Expenses'],
      security: auth,
      parameters: [expenseIdParam],
      responses: {
        '200': {
          description: 'Expense deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Expense deleted successfully' },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};

export default expensePaths;
